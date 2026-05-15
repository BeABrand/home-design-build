/**
 * Tests for the pure helper functions exported from send-enquiry.ts.
 *
 * The full handler performs SMTP + disk I/O and is not tested here.
 * Only escapeHtml, buildTextBody, and buildHtmlBody are in scope.
 *
 * StoredUploadFile is a private interface in send-enquiry.ts; we replicate its
 * shape here to avoid importing an internal implementation detail.
 */
import { describe, it, expect } from "vitest";
import { escapeHtml, buildTextBody, buildHtmlBody } from "../../../netlify/functions/send-enquiry";
import type { EnquirySubmission } from "@/lib/enquiry";

// Replicate the private StoredUploadFile interface from send-enquiry.ts
// so test code has a typed representation without importing an internal type.
interface StoredUploadFile {
  originalName: string;
  storedName: string | null;
  publicUrl: string | null;
  mimeType: string;
  buffer: Buffer;
}

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

const makeSubmission = (overrides: Partial<EnquirySubmission> = {}): EnquirySubmission => ({
  name: "Alice Smith",
  email: "alice@example.com",
  phone: "0412345678",
  projectType: "DA / CDC Drawings",
  message: "Please help with my project.",
  siteVisitDate: undefined,
  ...overrides,
});

const makeStoredFile = (overrides: Partial<StoredUploadFile> = {}): StoredUploadFile => ({
  originalName: "floor-plan.pdf",
  storedName: "1716000000000-abc123.pdf",
  publicUrl: "https://example.com/storage/1716000000000-abc123.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from(""),
  ...overrides,
});

// ---------------------------------------------------------------------------
// escapeHtml
// ---------------------------------------------------------------------------

describe("escapeHtml", () => {
  it("passes through safe plain text unchanged", () => {
    // Arrange
    const input = "Hello world";
    // Act
    const result = escapeHtml(input);
    // Assert
    expect(result).toBe("Hello world");
  });

  it("handles an empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("escapes ampersand & to &amp;", () => {
    expect(escapeHtml("A & B")).toBe("A &amp; B");
  });

  it("escapes less-than < to &lt;", () => {
    expect(escapeHtml("1 < 2")).toBe("1 &lt; 2");
  });

  it("escapes greater-than > to &gt;", () => {
    expect(escapeHtml("2 > 1")).toBe("2 &gt; 1");
  });

  it('escapes double-quote " to &quot;', () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("escapes single-quote ' to &#39;", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("escapes all five entities in a single string", () => {
    // Arrange
    const input = `<script>alert("XSS & it's bad");</script>`;
    // Act
    const result = escapeHtml(input);
    // Assert
    expect(result).toBe(
      "&lt;script&gt;alert(&quot;XSS &amp; it&#39;s bad&quot;);&lt;/script&gt;",
    );
  });

  it("escapes multiple occurrences of the same character", () => {
    expect(escapeHtml("&&&&")).toBe("&amp;&amp;&amp;&amp;");
  });
});

// ---------------------------------------------------------------------------
// buildTextBody
// ---------------------------------------------------------------------------

describe("buildTextBody", () => {
  it("includes every field of the submission in the output", () => {
    // Arrange
    const submission = makeSubmission({ siteVisitDate: "2025-08-15T09:00:00.000Z" });
    // Act
    const text = buildTextBody(submission, []);
    // Assert
    expect(text).toContain(submission.name);
    expect(text).toContain(submission.email);
    expect(text).toContain(submission.phone);
    expect(text).toContain(submission.projectType);
    expect(text).toContain(submission.message);
    expect(text).toContain("2025-08-15T09:00:00.000Z");
  });

  it('renders "Not requested" when siteVisitDate is undefined', () => {
    // Arrange
    const submission = makeSubmission({ siteVisitDate: undefined });
    // Act
    const text = buildTextBody(submission, []);
    // Assert
    expect(text).toContain("Not requested");
  });

  it("does not include an uploaded files section when storedFiles is empty", () => {
    const submission = makeSubmission();
    const text = buildTextBody(submission, []);
    expect(text).not.toContain("Uploaded files:");
  });

  it("includes the uploaded files section when files are provided", () => {
    // Arrange
    const submission = makeSubmission();
    const file = makeStoredFile();
    // Act
    const text = buildTextBody(submission, [file]);
    // Assert
    expect(text).toContain("Uploaded files:");
    expect(text).toContain(file.originalName);
  });

  it("renders the publicUrl for files that have one", () => {
    const submission = makeSubmission();
    const file = makeStoredFile({ publicUrl: "https://example.com/storage/plan.pdf" });
    const text = buildTextBody(submission, [file]);
    expect(text).toContain("https://example.com/storage/plan.pdf");
    expect(text).not.toContain("(attached, no public URL available)");
  });

  it('renders "(attached, no public URL available)" when publicUrl is null', () => {
    // Arrange
    const submission = makeSubmission();
    const file = makeStoredFile({ publicUrl: null });
    // Act
    const text = buildTextBody(submission, [file]);
    // Assert
    expect(text).toContain("(attached, no public URL available)");
    expect(text).toContain(file.originalName);
  });

  it("lists multiple uploaded files", () => {
    const submission = makeSubmission();
    const file1 = makeStoredFile({
      originalName: "plan-a.pdf",
      publicUrl: "https://example.com/storage/plan-a.pdf",
    });
    const file2 = makeStoredFile({
      originalName: "plan-b.png",
      publicUrl: null,
    });
    const text = buildTextBody(submission, [file1, file2]);
    expect(text).toContain("plan-a.pdf");
    expect(text).toContain("plan-b.png");
    expect(text).toContain("(attached, no public URL available)");
  });

  it("opens with the new enquiry header line", () => {
    const text = buildTextBody(makeSubmission(), []);
    expect(text).toContain("New website enquiry received.");
  });
});

// ---------------------------------------------------------------------------
// buildHtmlBody
// ---------------------------------------------------------------------------

describe("buildHtmlBody", () => {
  it("escapes HTML characters in user-supplied name field", () => {
    // Arrange — name contains HTML-special characters
    const submission = makeSubmission({ name: '<b>Bad "Actor"</b>' });
    // Act
    const html = buildHtmlBody(submission, []);
    // Assert — raw characters must not appear in output
    expect(html).not.toContain("<b>");
    expect(html).toContain("&lt;b&gt;");
    expect(html).toContain("&quot;");
  });

  it("escapes HTML characters in the email field", () => {
    const submission = makeSubmission({ email: "user+<tag>@example.com" });
    const html = buildHtmlBody(submission, []);
    expect(html).not.toContain("<tag>");
    expect(html).toContain("&lt;tag&gt;");
  });

  it("escapes HTML characters in the phone field", () => {
    const submission = makeSubmission({ phone: '+61 <script>alert(1)</script>' });
    const html = buildHtmlBody(submission, []);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes HTML characters in the projectType field", () => {
    // projectType must be a valid enum value — the schema validates this;
    // here we test a legitimate value that contains an ampersand-like string
    // to confirm escapeHtml is applied. Use "Revit & BIM".
    const submission = makeSubmission({ projectType: "Revit & BIM" });
    const html = buildHtmlBody(submission, []);
    expect(html).toContain("Revit &amp; BIM");
  });

  it("escapes HTML characters in the message field", () => {
    const submission = makeSubmission({ message: "<p>Hello & world</p>" });
    const html = buildHtmlBody(submission, []);
    expect(html).not.toContain("<p>Hello");
    expect(html).toContain("&lt;p&gt;Hello &amp; world&lt;/p&gt;");
  });

  it("converts newlines in message to <br />", () => {
    // Arrange
    const submission = makeSubmission({ message: "Line one\nLine two\nLine three" });
    // Act
    const html = buildHtmlBody(submission, []);
    // Assert
    expect(html).toContain("Line one<br />Line two<br />Line three");
  });

  it('renders "Not requested" when siteVisitDate is undefined', () => {
    const submission = makeSubmission({ siteVisitDate: undefined });
    const html = buildHtmlBody(submission, []);
    expect(html).toContain("Not requested");
  });

  it("renders an <a href> link for files that have a publicUrl", () => {
    // Arrange
    const submission = makeSubmission();
    const file = makeStoredFile({
      originalName: "plan.pdf",
      publicUrl: "https://example.com/storage/plan.pdf",
    });
    // Act
    const html = buildHtmlBody(submission, [file]);
    // Assert
    expect(html).toContain('<a href="https://example.com/storage/plan.pdf">');
    expect(html).toContain("plan.pdf");
  });

  it("falls back to plain text when publicUrl is null", () => {
    // Arrange
    const submission = makeSubmission();
    const file = makeStoredFile({ originalName: "blueprint.png", publicUrl: null });
    // Act
    const html = buildHtmlBody(submission, [file]);
    // Assert
    expect(html).toContain("blueprint.png");
    expect(html).toContain("Attached to email, no public URL available");
    expect(html).not.toContain('<a href="null">');
  });

  it("escapes the publicUrl itself to prevent attribute injection", () => {
    // Arrange
    const submission = makeSubmission();
    const file = makeStoredFile({
      originalName: "evil.pdf",
      publicUrl: 'https://example.com/"><script>alert(1)</script>',
    });
    // Act
    const html = buildHtmlBody(submission, [file]);
    // Assert
    expect(html).not.toContain('"><script>');
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes the file originalName in the HTML list", () => {
    const submission = makeSubmission();
    const file = makeStoredFile({
      originalName: "<malicious>.pdf",
      publicUrl: null,
    });
    const html = buildHtmlBody(submission, [file]);
    expect(html).not.toContain("<malicious>");
    expect(html).toContain("&lt;malicious&gt;");
  });

  it("does not include the uploaded files section when storedFiles is empty", () => {
    const html = buildHtmlBody(makeSubmission(), []);
    expect(html).not.toContain("<h3>Uploaded Files</h3>");
  });

  it("includes the uploaded files heading when files are provided", () => {
    const submission = makeSubmission();
    const file = makeStoredFile();
    const html = buildHtmlBody(submission, [file]);
    expect(html).toContain("<h3>Uploaded Files</h3>");
  });
});
