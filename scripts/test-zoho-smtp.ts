#!/usr/bin/env tsx

import { readFileSync } from "fs";
import { resolve } from "path";
import nodemailer from "nodemailer";
import { classifyZohoSmtpError, maskEmail } from "../netlify/functions/zoho-error-classifier";

interface SmtpEnv {
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_SECURE?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  ENQUIRY_TO_EMAIL?: string;
}

const parseEnvFile = (filePath: string): SmtpEnv => {
  try {
    const content = readFileSync(filePath, "utf-8");
    const env: SmtpEnv = {};

    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const [key, ...valueParts] = trimmed.split("=");
      if (!key) return;

      let value = valueParts.join("=").trim();
      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      const envKey = key.trim() as keyof SmtpEnv;
      if (["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASS", "ENQUIRY_TO_EMAIL"].includes(envKey)) {
        env[envKey] = value;
      }
    });

    return env;
  } catch {
    return {};
  }
};

const pick = (...candidates: Array<string | undefined>): string | undefined => {
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
};

const run = async (): Promise<void> => {
  const envPath = resolve(process.cwd(), ".env");
  const env = parseEnvFile(envPath);

  // process.env takes precedence over .env so the script is testable with one-off overrides
  // (e.g. `SMTP_HOST=smtppro.zoho.com.au npm run diagnose:smtp`)
  const smtpHost = pick(process.env.SMTP_HOST, env.SMTP_HOST);
  const smtpPort = pick(process.env.SMTP_PORT, env.SMTP_PORT);
  const smtpSecure = pick(process.env.SMTP_SECURE, env.SMTP_SECURE);
  const smtpUser = pick(process.env.SMTP_USER, env.SMTP_USER);
  const smtpPass = pick(process.env.SMTP_PASS, env.SMTP_PASS);

  const missing: string[] = [];
  if (!smtpHost) missing.push("SMTP_HOST");
  if (!smtpPort) missing.push("SMTP_PORT");
  if (!smtpSecure) missing.push("SMTP_SECURE");
  if (!smtpUser) missing.push("SMTP_USER");
  if (!smtpPass) missing.push("SMTP_PASS");

  if (missing.length > 0) {
    console.error(`✗ Missing required environment variables: ${missing.join(", ")}`);
    process.exit(2);
  }

  const maskedUser = maskEmail(smtpUser!);
  const secure = smtpSecure === "true";
  const port = Number(smtpPort);

  console.log(`Host: ${smtpHost}:${port} secure=${secure} user=${maskedUser}`);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure,
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await transporter.verify();
    console.log("✓ Authentication OK");

    const toEmail = env.ENQUIRY_TO_EMAIL?.trim() || smtpUser!;
    const timestamp = new Date().toISOString();

    const result = await transporter.sendMail({
      to: toEmail,
      from: `"Diagnostic Test" <${smtpUser}>`,
      subject: `[Diagnostic] Zoho SMTP test — ${timestamp}`,
      text: "Diagnostic test email from `scripts/test-zoho-smtp.ts`. If you received this, your Zoho SMTP credentials and configuration are working.",
    });

    console.log(`✓ Test email sent to ${toEmail}. Message ID: ${result.messageId}`);
  } catch (error) {
    const diagnosis = classifyZohoSmtpError(error, {
      host: smtpHost!,
      user: smtpUser!,
    });

    // Surface the raw Nodemailer error fields so the operator can see what Zoho actually returned
    const errorDetails =
      error instanceof Error
        ? {
            code: (error as Error & { code?: string }).code,
            responseCode: (error as Error & { responseCode?: number }).responseCode,
            response: (error as Error & { response?: string }).response,
            message: error.message,
          }
        : { message: String(error) };

    console.error(`Error code:   ${errorDetails.code ?? "(none)"}`);
    console.error(`Response code: ${errorDetails.responseCode ?? "(none)"}`);
    console.error(`Response:     ${errorDetails.response ?? "(none)"}`);
    console.error(`Message:      ${errorDetails.message}`);
    console.error(`✗ ${diagnosis.operatorMessage}`);
    process.exit(1);
  }
};

run().catch((error) => {
  console.error("Fatal error:", error instanceof Error ? error.message : error);
  process.exit(2);
});
