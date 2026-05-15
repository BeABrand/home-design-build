import type { IncomingHttpHeaders } from "node:http";
import { Readable } from "node:stream";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import Busboy from "busboy";
import nodemailer from "nodemailer";
import {
  ACCEPTED_UPLOAD_TYPES,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
  enquirySubmissionSchema,
  type EnquirySubmission,
  type SubmissionSuccessPayload,
  type SubmissionErrorPayload,
} from "../../src/lib/enquiry";

interface NetlifyEvent {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
  isBase64Encoded: boolean;
}

interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

interface ParsedUploadFile {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
  extension: string;
}

interface StoredUploadFile {
  originalName: string;
  storedName: string | null;
  publicUrl: string | null;
  mimeType: string;
  buffer: Buffer;
}

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

const STORAGE_SUBDIRECTORY = path.resolve(process.cwd(), "public/storage");
const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const jsonResponse = (
  statusCode: number,
  payload: SubmissionSuccessPayload | SubmissionErrorPayload,
): NetlifyResponse => ({
  statusCode,
  headers: JSON_HEADERS,
  body: JSON.stringify(payload),
});

const getHeaderValue = (headers: Record<string, string | undefined>, name: string) =>
  headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];

const getRequestOrigin = (headers: Record<string, string | undefined>) => {
  const forwardedProto = getHeaderValue(headers, "x-forwarded-proto");
  const forwardedHost = getHeaderValue(headers, "x-forwarded-host");
  const host = forwardedHost ?? getHeaderValue(headers, "host");

  if (!host) {
    return undefined;
  }

  return `${forwardedProto ?? "https"}://${host}`;
};

const normalizeStorageDirectory = () => {
  const configuredPath = process.env.ENQUIRY_PUBLIC_STORAGE_DIR?.trim();
  if (!configuredPath) {
    return STORAGE_SUBDIRECTORY;
  }

  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(process.cwd(), configuredPath);
};

const buildPublicFileUrl = (storedName: string, origin: string | undefined, storageDirectory: string) => {
  const configuredBaseUrl = process.env.ENQUIRY_PUBLIC_STORAGE_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return `${configuredBaseUrl.replace(/\/+$/, "")}/${storedName}`;
  }

  if (origin && path.resolve(storageDirectory) === STORAGE_SUBDIRECTORY) {
    return `${origin}/storage/${storedName}`;
  }

  return null;
};

const getTransporter = () => {
  const host = process.env.SMTP_HOST?.trim() || "smtp.zoho.com";
  const port = Number(process.env.SMTP_PORT?.trim() || "465");
  const secure = (process.env.SMTP_SECURE?.trim() || "true") === "true";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be configured.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

const parseMultipartForm = async (
  headers: IncomingHttpHeaders,
  bodyBuffer: Buffer,
): Promise<{ fields: Record<string, string>; files: ParsedUploadFile[] }> =>
  new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    const files: ParsedUploadFile[] = [];
    let fileCount = 0;
    let parseError: string | null = null;

    const busboy = Busboy({
      headers,
      limits: {
        files: MAX_FILE_COUNT,
        fileSize: MAX_FILE_SIZE,
      },
    });

    busboy.on("field", (fieldName, value) => {
      fields[fieldName] = value;
    });

    busboy.on("file", (fieldName, file, info) => {
      fileCount += 1;

      if (fieldName !== "files") {
        file.resume();
        return;
      }

      if (fileCount > MAX_FILE_COUNT) {
        parseError = `Maximum ${MAX_FILE_COUNT} files allowed.`;
        file.resume();
        return;
      }

      if (!ACCEPTED_UPLOAD_TYPES.includes(info.mimeType as (typeof ACCEPTED_UPLOAD_TYPES)[number])) {
        parseError = "Only JPG, PNG, WebP, and PDF files are accepted.";
        file.resume();
        return;
      }

      const chunks: Buffer[] = [];

      file.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      file.on("limit", () => {
        parseError = `Each file must be under ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
      });

      file.on("end", () => {
        if (parseError) {
          return;
        }

        const extension = MIME_EXTENSION_MAP[info.mimeType] ?? path.extname(info.filename).toLowerCase();
        files.push({
          originalName: info.filename || `upload-${fileCount}${extension}`,
          mimeType: info.mimeType,
          buffer: Buffer.concat(chunks),
          extension,
        });
      });
    });

    busboy.on("filesLimit", () => {
      parseError = `Maximum ${MAX_FILE_COUNT} files allowed.`;
    });

    busboy.on("error", (error) => {
      reject(error);
    });

    busboy.on("finish", () => {
      if (parseError) {
        reject(new Error(parseError));
        return;
      }

      resolve({ fields, files });
    });

    Readable.from(bodyBuffer).pipe(busboy);
  });

const persistFiles = async (
  files: ParsedUploadFile[],
  origin: string | undefined,
): Promise<{ storedFiles: StoredUploadFile[]; warning?: string }> => {
  if (files.length === 0) {
    return { storedFiles: [] };
  }

  const storageDirectory = normalizeStorageDirectory();

  try {
    await mkdir(storageDirectory, { recursive: true });

    const storedFiles = await Promise.all(
      files.map(async (file) => {
        const storedName = `${Date.now()}-${randomUUID().replaceAll("-", "")}${file.extension}`;
        const filePath = path.join(storageDirectory, storedName);
        await writeFile(filePath, file.buffer);

        return {
          originalName: file.originalName,
          storedName,
          publicUrl: buildPublicFileUrl(storedName, origin, storageDirectory),
          mimeType: file.mimeType,
          buffer: file.buffer,
        };
      }),
    );

    const hasMissingPublicLinks = storedFiles.some((file) => file.publicUrl === null);
    return {
      storedFiles,
      warning: hasMissingPublicLinks
        ? "Files were attached to the enquiry email, but this runtime could not generate public file URLs."
        : undefined,
    };
  } catch {
    return {
      storedFiles: files.map((file) => ({
        originalName: file.originalName,
        storedName: null,
        publicUrl: null,
        mimeType: file.mimeType,
        buffer: file.buffer,
      })),
      warning:
        "Files were attached to the enquiry email, but the configured public storage directory is not writable in this runtime.",
    };
  }
};

const buildTextBody = (submission: EnquirySubmission, storedFiles: StoredUploadFile[]) => {
  const lines = [
    "New website enquiry received.",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone}`,
    `Project type: ${submission.projectType}`,
    `Preferred site visit: ${submission.siteVisitDate ?? "Not requested"}`,
    "",
    "Project details:",
    submission.message,
  ];

  if (storedFiles.length > 0) {
    lines.push("", "Uploaded files:");
    storedFiles.forEach((file) => {
      lines.push(`- ${file.originalName}${file.publicUrl ? `: ${file.publicUrl}` : " (attached, no public URL available)"}`);
    });
  }

  return lines.join("\n");
};

const buildHtmlBody = (submission: EnquirySubmission, storedFiles: StoredUploadFile[]) => {
  const uploadedFilesMarkup =
    storedFiles.length > 0
      ? `<h3>Uploaded Files</h3><ul>${storedFiles
          .map((file) => {
            const fileLabel = escapeHtml(file.originalName);
            const fileLink = file.publicUrl
              ? `<a href="${escapeHtml(file.publicUrl)}">${escapeHtml(file.publicUrl)}</a>`
              : "Attached to email, no public URL available";
            return `<li><strong>${fileLabel}</strong>: ${fileLink}</li>`;
          })
          .join("")}</ul>`
      : "";

  return `
    <h2>New Website Enquiry</h2>
    <table cellpadding="6" cellspacing="0" border="0">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(submission.name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(submission.email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(submission.phone)}</td></tr>
      <tr><td><strong>Project Type</strong></td><td>${escapeHtml(submission.projectType)}</td></tr>
      <tr><td><strong>Preferred Site Visit</strong></td><td>${escapeHtml(submission.siteVisitDate ?? "Not requested")}</td></tr>
    </table>
    <h3>Project Details</h3>
    <p>${escapeHtml(submission.message).replaceAll("\n", "<br />")}</p>
    ${uploadedFilesMarkup}
  `;
};

export { escapeHtml, buildTextBody, buildHtmlBody };

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: JSON_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed." });
  }

  const contentType = getHeaderValue(event.headers, "content-type");
  if (!contentType?.includes("multipart/form-data")) {
    return jsonResponse(415, { ok: false, error: "Expected multipart form data." });
  }

  if (!event.body) {
    return jsonResponse(400, { ok: false, error: "Missing form submission body." });
  }

  try {
    const bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
    const { fields, files } = await parseMultipartForm({ "content-type": contentType }, bodyBuffer);
    const parsedSubmission = enquirySubmissionSchema.safeParse(fields);

    if (!parsedSubmission.success) {
      const firstIssue = parsedSubmission.error.issues[0];
      return jsonResponse(400, { ok: false, error: firstIssue?.message ?? "Invalid enquiry submission." });
    }

    const origin = getRequestOrigin(event.headers);
    const { storedFiles, warning } = await persistFiles(files, origin);
    const transporter = getTransporter();
    const recipient = process.env.ENQUIRY_TO_EMAIL?.trim() || "info@buildplanandrafting.com.au";
    const fromAddress = process.env.ENQUIRY_FROM_EMAIL?.trim() || process.env.SMTP_USER?.trim() || recipient;
    const fromName = process.env.ENQUIRY_FROM_NAME?.trim() || "Build Plan Drafting Website";

    await transporter.sendMail({
      to: recipient,
      from: `"${fromName}" <${fromAddress}>`,
      replyTo: parsedSubmission.data.email,
      subject: `Website enquiry from ${parsedSubmission.data.name}`,
      text: buildTextBody(parsedSubmission.data, storedFiles),
      html: buildHtmlBody(parsedSubmission.data, storedFiles),
      attachments: storedFiles.map((file) => ({
        filename: file.originalName,
        content: file.buffer,
        contentType: file.mimeType,
      })),
    });

    return jsonResponse(200, {
      ok: true,
      warning,
      uploadedFiles: storedFiles.map((file) => ({
        originalName: file.originalName,
        publicUrl: file.publicUrl,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send enquiry email.";
    return jsonResponse(500, { ok: false, error: message });
  }
};
