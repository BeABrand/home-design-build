import { describe, it, expect } from "vitest";
import {
  classifyZohoSmtpError,
  ZohoSmtpDiagnosis,
} from "../../../netlify/functions/zoho-error-classifier";

// ---------------------------------------------------------------------------
// Helper — build a synthetic SMTP error without using `any`
// ---------------------------------------------------------------------------

interface SyntheticSmtpError extends Error {
  code?: string;
  responseCode?: number;
  response?: string;
}

function makeSmtpError(
  message: string,
  fields: { code?: string; responseCode?: number; response?: string },
): SyntheticSmtpError {
  const err = new Error(message) as SyntheticSmtpError;
  if (fields.code !== undefined) err.code = fields.code;
  if (fields.responseCode !== undefined) err.responseCode = fields.responseCode;
  if (fields.response !== undefined) err.response = fields.response;
  return err;
}

// The single generic string the classifier must always return to the client.
const EXPECTED_CLIENT_MESSAGE =
  "Unable to send your enquiry at this time. Please try again later or email us directly at info@buildplanandrafting.com.au.";

// ---------------------------------------------------------------------------
// 1. wrong-region — AU email, US SMTP host
// ---------------------------------------------------------------------------

describe("classifyZohoSmtpError", () => {
  it("returns wrong-region when AU email is used with a US SMTP host", () => {
    const error = makeSmtpError("Authentication failed", {
      code: "EAUTH",
      responseCode: 535,
    });
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com",
      user: "info@buildplanandrafting.com.au",
    });

    expect(diagnosis.cause).toBe("wrong-region");
    expect(diagnosis.operatorMessage).toContain("smtppro.zoho.com.au");
    expect(diagnosis.operatorMessage).toContain("mail.zoho.com.au");
  });

  // -------------------------------------------------------------------------
  // 2. app-password-required — AU email, correct AU host
  // -------------------------------------------------------------------------

  it("returns app-password-required when AU email uses the correct AU host (responseCode 535)", () => {
    const error = makeSmtpError("Authentication failed", {
      code: "EAUTH",
      responseCode: 535,
    });
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com.au",
      user: "info@buildplanandrafting.com.au",
    });

    expect(diagnosis.cause).toBe("app-password-required");
    expect(diagnosis.operatorMessage).toContain("accounts.zoho.com.au");
  });

  // -------------------------------------------------------------------------
  // 3. app-password-required — US email, US host (no region mismatch)
  // -------------------------------------------------------------------------

  it("returns app-password-required when US email uses the US SMTP host (responseCode 535)", () => {
    const error = makeSmtpError("Authentication failed", {
      code: "EAUTH",
      responseCode: 535,
    });
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com",
      user: "team@example.com",
    });

    expect(diagnosis.cause).toBe("app-password-required");
    expect(diagnosis.operatorMessage).toContain("accounts.zoho.com");
  });

  // -------------------------------------------------------------------------
  // 4. smtp-disabled-or-from-mismatch — EAUTH but NOT 535
  // -------------------------------------------------------------------------

  it("returns smtp-disabled-or-from-mismatch for EAUTH with responseCode 553", () => {
    const error = makeSmtpError("Sender not permitted", {
      code: "EAUTH",
      responseCode: 553,
    });
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com",
      user: "sender@example.com",
    });

    expect(diagnosis.cause).toBe("smtp-disabled-or-from-mismatch");
  });

  it("returns smtp-disabled-or-from-mismatch for EAUTH with no responseCode", () => {
    const error = makeSmtpError("Auth error", { code: "EAUTH" });
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com",
      user: "sender@example.com",
    });

    expect(diagnosis.cause).toBe("smtp-disabled-or-from-mismatch");
  });

  // -------------------------------------------------------------------------
  // 5. network — ETIMEDOUT
  // -------------------------------------------------------------------------

  it("returns network cause for ETIMEDOUT and mentions firewall and the host", () => {
    const error = makeSmtpError("Connection timed out", { code: "ETIMEDOUT" });
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com.au",
      user: "info@buildplanandrafting.com.au",
    });

    expect(diagnosis.cause).toBe("network");
    expect(diagnosis.operatorMessage).toContain("firewall");
    expect(diagnosis.operatorMessage).toContain("smtppro.zoho.com.au");
  });

  // -------------------------------------------------------------------------
  // 6. network — ESOCKET
  // -------------------------------------------------------------------------

  it("returns network cause for ESOCKET", () => {
    const error = makeSmtpError("Socket error", { code: "ESOCKET" });
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.eu",
      user: "team@example.eu",
    });

    expect(diagnosis.cause).toBe("network");
    expect(diagnosis.operatorMessage).toContain("firewall");
    expect(diagnosis.operatorMessage).toContain("smtppro.zoho.eu");
  });

  // -------------------------------------------------------------------------
  // 7. network — ENOTFOUND
  // -------------------------------------------------------------------------

  it("returns network cause for ENOTFOUND", () => {
    const error = makeSmtpError("DNS resolution failed", { code: "ENOTFOUND" });
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.in",
      user: "ops@company.in",
    });

    expect(diagnosis.cause).toBe("network");
    expect(diagnosis.operatorMessage).toContain("firewall");
    expect(diagnosis.operatorMessage).toContain("smtppro.zoho.in");
  });

  // -------------------------------------------------------------------------
  // 8. unknown — non-Error input (plain string)
  // -------------------------------------------------------------------------

  it("returns unknown cause when a plain string is passed as error", () => {
    const diagnosis = classifyZohoSmtpError("oops", {
      host: "smtppro.zoho.com",
      user: "user@example.com",
    });

    expect(diagnosis.cause).toBe("unknown");
  });

  // -------------------------------------------------------------------------
  // 9. unknown — Error without recognised SMTP fields
  // -------------------------------------------------------------------------

  it("returns unknown cause for a generic Error and includes its message in operatorMessage", () => {
    const diagnosis = classifyZohoSmtpError(new Error("strange"), {
      host: "smtppro.zoho.com",
      user: "user@example.com",
    });

    expect(diagnosis.cause).toBe("unknown");
    expect(diagnosis.operatorMessage).toContain("strange");
  });

  // -------------------------------------------------------------------------
  // 10. clientMessage is always the same generic string across ALL branches
  // -------------------------------------------------------------------------

  it("always returns the same generic clientMessage regardless of error cause (security regression-lock)", () => {
    const cases: ZohoSmtpDiagnosis[] = [
      // wrong-region
      classifyZohoSmtpError(
        makeSmtpError("Auth failed", { code: "EAUTH", responseCode: 535 }),
        { host: "smtppro.zoho.com", user: "info@buildplanandrafting.com.au" },
      ),
      // app-password-required AU
      classifyZohoSmtpError(
        makeSmtpError("Auth failed", { code: "EAUTH", responseCode: 535 }),
        { host: "smtppro.zoho.com.au", user: "info@buildplanandrafting.com.au" },
      ),
      // app-password-required US
      classifyZohoSmtpError(
        makeSmtpError("Auth failed", { code: "EAUTH", responseCode: 535 }),
        { host: "smtppro.zoho.com", user: "team@example.com" },
      ),
      // smtp-disabled-or-from-mismatch
      classifyZohoSmtpError(
        makeSmtpError("Auth error", { code: "EAUTH", responseCode: 553 }),
        { host: "smtppro.zoho.com", user: "sender@example.com" },
      ),
      // network ETIMEDOUT
      classifyZohoSmtpError(
        makeSmtpError("Timeout", { code: "ETIMEDOUT" }),
        { host: "smtppro.zoho.com.au", user: "info@buildplanandrafting.com.au" },
      ),
      // network ESOCKET
      classifyZohoSmtpError(
        makeSmtpError("Socket", { code: "ESOCKET" }),
        { host: "smtppro.zoho.eu", user: "team@example.eu" },
      ),
      // network ENOTFOUND
      classifyZohoSmtpError(
        makeSmtpError("DNS", { code: "ENOTFOUND" }),
        { host: "smtppro.zoho.in", user: "ops@company.in" },
      ),
      // unknown string
      classifyZohoSmtpError("oops", {
        host: "smtppro.zoho.com",
        user: "user@example.com",
      }),
      // unknown generic Error
      classifyZohoSmtpError(new Error("strange"), {
        host: "smtppro.zoho.com",
        user: "user@example.com",
      }),
    ];

    for (const diagnosis of cases) {
      expect(diagnosis.clientMessage).toBe(EXPECTED_CLIENT_MESSAGE);
    }
  });

  // -------------------------------------------------------------------------
  // 11. operatorMessage masks the email local-part in wrong-region branch
  // -------------------------------------------------------------------------

  it("masks the email local-part to first 3 chars + *** in the wrong-region operatorMessage", () => {
    const error = makeSmtpError("Auth failed", {
      code: "EAUTH",
      responseCode: 535,
    });
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com",
      user: "info@buildplanandrafting.com.au",
    });

    expect(diagnosis.operatorMessage).toContain("inf***@buildplanandrafting.com.au");
    expect(diagnosis.operatorMessage).not.toContain("info@");
  });

  // -------------------------------------------------------------------------
  // 12. emailRegion detection for EU, IN and CN TLDs
  //     Each email uses a host from a different region → triggers wrong-region
  //     The suggested host in operatorMessage must match the email's TLD.
  // -------------------------------------------------------------------------

  it("detects EU region from .eu email and suggests the EU SMTP host", () => {
    const error = makeSmtpError("Auth failed", {
      code: "EAUTH",
      responseCode: 535,
    });
    // EU email but US host → wrong-region → suggested host must be smtppro.zoho.eu
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com",
      user: "user@company.eu",
    });

    expect(diagnosis.cause).toBe("wrong-region");
    expect(diagnosis.operatorMessage).toContain("smtppro.zoho.eu");
    expect(diagnosis.operatorMessage).toContain("mail.zoho.eu");
  });

  it("detects IN region from .in email and suggests the IN SMTP host", () => {
    const error = makeSmtpError("Auth failed", {
      code: "EAUTH",
      responseCode: 535,
    });
    // IN email but US host → wrong-region
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com",
      user: "admin@business.in",
    });

    expect(diagnosis.cause).toBe("wrong-region");
    expect(diagnosis.operatorMessage).toContain("smtppro.zoho.in");
    expect(diagnosis.operatorMessage).toContain("mail.zoho.in");
  });

  it("detects CN region from .com.cn email and suggests the CN SMTP host", () => {
    const error = makeSmtpError("Auth failed", {
      code: "EAUTH",
      responseCode: 535,
    });
    // CN email but US host → wrong-region
    const diagnosis = classifyZohoSmtpError(error, {
      host: "smtppro.zoho.com",
      user: "sales@enterprise.com.cn",
    });

    expect(diagnosis.cause).toBe("wrong-region");
    expect(diagnosis.operatorMessage).toContain("smtppro.zoho.com.cn");
    expect(diagnosis.operatorMessage).toContain("mail.zoho.com.cn");
  });
});
