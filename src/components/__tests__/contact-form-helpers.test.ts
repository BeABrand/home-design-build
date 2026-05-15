/**
 * Tests for the isSubmissionPayload type-guard.
 *
 * We do NOT mount the full ContactForm component here. ContactForm has extensive
 * shadcn/Radix UI dependencies that would require deep mocking. Instead we test
 * the pure isSubmissionPayload helper in isolation.
 *
 * isSubmissionPayload lives in enquiry.ts (rather than ContactForm.tsx) because:
 * 1. It is a runtime type-guard for SubmissionPayload, which is defined in enquiry.ts.
 * 2. Exporting non-component symbols from a component file triggers the
 *    react-refresh/only-export-components ESLint warning and breaks fast-refresh.
 * 3. enquiry.ts is the natural home for all types and their guards.
 */
import { describe, it, expect } from "vitest";
import { isSubmissionPayload } from "@/lib/enquiry";
import type { SubmissionPayload, SubmissionSuccessPayload, SubmissionErrorPayload } from "@/lib/enquiry";

// ---------------------------------------------------------------------------
// isSubmissionPayload — type guard for server response shapes
// ---------------------------------------------------------------------------

describe("isSubmissionPayload", () => {
  // --- truthy cases ---------------------------------------------------------

  it("returns true for a valid success payload with ok: true and uploadedFiles", () => {
    // Arrange
    const payload: SubmissionSuccessPayload = {
      ok: true,
      uploadedFiles: [],
    };
    // Act
    const result = isSubmissionPayload(payload);
    // Assert
    expect(result).toBe(true);
  });

  it("returns true for a success payload that also carries a warning", () => {
    const payload: SubmissionSuccessPayload = {
      ok: true,
      warning: "Files were attached but no public URL could be generated.",
      uploadedFiles: [{ originalName: "plan.pdf", publicUrl: null }],
    };
    expect(isSubmissionPayload(payload)).toBe(true);
  });

  it("returns true for a valid error payload with ok: false and an error string", () => {
    // Arrange
    const payload: SubmissionErrorPayload = {
      ok: false,
      error: "Something went wrong.",
    };
    // Act / Assert
    expect(isSubmissionPayload(payload)).toBe(true);
  });

  it("returns true for a minimal object that has an ok boolean property", () => {
    // The guard only checks that `ok` is a boolean — additional shape details
    // are the responsibility of the consuming code.
    const minimal: SubmissionPayload = { ok: false, error: "err" };
    expect(isSubmissionPayload(minimal)).toBe(true);
  });

  // --- falsy cases ----------------------------------------------------------

  it("returns false for null", () => {
    expect(isSubmissionPayload(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isSubmissionPayload(undefined)).toBe(false);
  });

  it("returns false for a plain string", () => {
    expect(isSubmissionPayload("ok")).toBe(false);
  });

  it("returns false for a number", () => {
    expect(isSubmissionPayload(42)).toBe(false);
  });

  it("returns false for an array", () => {
    expect(isSubmissionPayload([])).toBe(false);
  });

  it("returns false for an object missing the ok property", () => {
    expect(isSubmissionPayload({ error: "oops" })).toBe(false);
  });

  it("returns false when ok is a string instead of a boolean", () => {
    expect(isSubmissionPayload({ ok: "true" })).toBe(false);
  });

  it("returns false when ok is a number", () => {
    expect(isSubmissionPayload({ ok: 1 })).toBe(false);
  });

  it("returns false for an empty object", () => {
    expect(isSubmissionPayload({})).toBe(false);
  });

  // --- response-shape contract regression -----------------------------------

  it("narrows value to SubmissionPayload so that ok can be read without type errors", () => {
    // Arrange — simulate an unknown JSON.parse result
    const raw: unknown = JSON.parse('{"ok":true,"uploadedFiles":[]}');

    // Act
    if (isSubmissionPayload(raw)) {
      // Assert — TypeScript should accept raw.ok without casting inside the guard
      expect(typeof raw.ok).toBe("boolean");
      expect(raw.ok).toBe(true);
    } else {
      // This branch should not be reached for the given input
      expect.fail("isSubmissionPayload returned false for a valid success payload");
    }
  });

  it("handles a parsed error payload from JSON correctly", () => {
    // Arrange
    const raw: unknown = JSON.parse('{"ok":false,"error":"SMTP connection failed"}');
    // Act / Assert
    expect(isSubmissionPayload(raw)).toBe(true);
    if (isSubmissionPayload(raw)) {
      expect(raw.ok).toBe(false);
    }
  });
});
