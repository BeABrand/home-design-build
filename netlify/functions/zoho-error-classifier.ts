export interface ZohoSmtpErrorContext {
  host: string;
  user: string;
}

export interface ZohoSmtpDiagnosis {
  cause: "wrong-region" | "app-password-required" | "smtp-disabled-or-from-mismatch" | "network" | "unknown";
  operatorMessage: string;
  clientMessage: string;
}

interface SmtpError {
  code?: string;
  responseCode?: number;
  response?: string;
  message?: string;
}

const extractErrorDetails = (error: unknown): SmtpError => {
  if (error instanceof Error) {
    const err = error as SmtpError & Error;
    return {
      code: err.code,
      responseCode: err.responseCode,
      response: err.response,
      message: err.message,
    };
  }
  return {};
};

export const maskEmail = (email: string): string => {
  const parts = email.split("@");
  if (parts.length !== 2) return "***@***";
  const [localPart, domain] = parts;
  if (localPart.length <= 3) return `***@${domain}`;
  return `${localPart.slice(0, 3)}***@${domain}`;
};

const MAX_UNKNOWN_DETAIL_LENGTH = 120;

const sanitizeUnknownDetail = (raw: string | undefined): string => {
  if (!raw) return "unknown";
  const truncated = raw.length > MAX_UNKNOWN_DETAIL_LENGTH ? `${raw.slice(0, MAX_UNKNOWN_DETAIL_LENGTH)}…` : raw;
  // Strip potential base64 SASL credential blobs that some SMTP servers echo on AUTH failure.
  return truncated.replace(/[A-Za-z0-9+/]{20,}={0,2}/g, "[redacted]");
};

const inferRegionFromHost = (host: string): string | null => {
  if (host.includes(".com.au")) return "au";
  if (host.includes(".eu")) return "eu";
  if (host.includes(".in")) return "in";
  if (host.includes(".com.cn")) return "cn";
  if (host.includes(".com")) return "us";
  return null;
};

const inferRegionFromEmail = (email: string): string | null => {
  if (email.endsWith(".com.au")) return "au";
  if (email.endsWith(".eu")) return "eu";
  if (email.endsWith(".in")) return "in";
  if (email.endsWith(".com.cn")) return "cn";
  return "us";
};

export const classifyZohoSmtpError = (
  error: unknown,
  context: ZohoSmtpErrorContext,
): ZohoSmtpDiagnosis => {
  const details = extractErrorDetails(error);
  const maskedUser = maskEmail(context.user);
  const emailRegion = inferRegionFromEmail(context.user);
  const hostRegion = inferRegionFromHost(context.host);

  const clientMessage = "Unable to send your enquiry at this time. Please try again later or email us directly at info@buildplanandrafting.com.au.";

  // Cause 1: Wrong regional SMTP host
  if (
    details.responseCode === 535 &&
    emailRegion &&
    hostRegion &&
    emailRegion !== hostRegion
  ) {
    const regionMap: Record<string, { tld: string; host: string }> = {
      au: { tld: "com.au", host: "smtppro.zoho.com.au" },
      eu: { tld: "eu", host: "smtppro.zoho.eu" },
      in: { tld: "in", host: "smtppro.zoho.in" },
      cn: { tld: "com.cn", host: "smtppro.zoho.com.cn" },
      us: { tld: "com", host: "smtppro.zoho.com" },
    };

    const expectedRegion = regionMap[emailRegion];
    return {
      cause: "wrong-region",
      operatorMessage: `Cause 1: Wrong regional SMTP host. Your account user "${maskedUser}" looks like a ${emailRegion.toUpperCase()} domain but SMTP_HOST is "${context.host}". Try "${expectedRegion.host}" (port 465, SSL). Confirm region in Zoho web URL: "mail.zoho.${expectedRegion.tld}".`,
      clientMessage,
    };
  }

  // Cause 2: App-specific password required
  if (details.responseCode === 535) {
    const regionMap: Record<string, string> = {
      au: "com.au",
      eu: "eu",
      in: "in",
      cn: "com.cn",
      us: "com",
    };
    const tld = regionMap[emailRegion || "us"] || "com";
    return {
      cause: "app-password-required",
      operatorMessage: `Cause 2: App-specific password required. Generate one at "accounts.zoho.${tld}" → Security → App Passwords. Use the generated password as SMTP_PASS (not your login password). 2FA does not need to be enabled.`,
      clientMessage,
    };
  }

  // Cause 3 or 4: SMTP disabled or from-address mismatch
  if (details.code === "EAUTH" && details.responseCode !== 535) {
    return {
      cause: "smtp-disabled-or-from-mismatch",
      operatorMessage: `Cause 3 or 4: SMTP may be disabled on this mailbox (Zoho Admin Console → Mail Administration → Mailbox Configuration) OR the From address doesn't match SMTP_USER.`,
      clientMessage,
    };
  }

  // Network issues
  if (details.code === "ETIMEDOUT" || details.code === "ESOCKET" || details.code === "ENOTFOUND") {
    const port = context.host.includes("465") ? "465" : "587";
    return {
      cause: "network",
      operatorMessage: `Network / DNS issue. Check firewall on port "${port}" and confirm "${context.host}" resolves.`,
      clientMessage,
    };
  }

  // Unknown
  return {
    cause: "unknown",
    operatorMessage: `Unrecognised error. Full error: "${sanitizeUnknownDetail(details.message)}". Check Zoho status: https://status.zoho.com/`,
    clientMessage,
  };
};
