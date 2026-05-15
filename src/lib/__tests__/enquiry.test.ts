import { describe, it, expect } from "vitest";
import {
  enquirySubmissionSchema,
  enquiryClientSchema,
  projectTypes,
  ACCEPTED_UPLOAD_TYPES,
  ACCEPTED_UPLOAD_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_FILE_COUNT,
} from "@/lib/enquiry";

// ---------------------------------------------------------------------------
// Constants — regression locks
// ---------------------------------------------------------------------------

describe("MAX_FILE_SIZE", () => {
  it("equals exactly 10 MB in bytes", () => {
    // Arrange / Act — the value is imported as a constant
    // Assert
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
  });
});

describe("MAX_FILE_COUNT", () => {
  it("equals 5", () => {
    expect(MAX_FILE_COUNT).toBe(5);
  });
});

describe("ACCEPTED_UPLOAD_TYPES", () => {
  it("is non-empty", () => {
    expect(ACCEPTED_UPLOAD_TYPES.length).toBeGreaterThan(0);
  });

  it("contains the four expected MIME types", () => {
    const types: ReadonlyArray<string> = ACCEPTED_UPLOAD_TYPES;
    expect(types).toContain("image/jpeg");
    expect(types).toContain("image/png");
    expect(types).toContain("image/webp");
    expect(types).toContain("application/pdf");
  });

  it("is a readonly tuple (as const) — type assertion verifies compile-time narrowing", () => {
    // The `as const` assertion means each element is a string literal type, not
    // the widened `string` type. We verify this at the value level by confirming
    // every element is one of the known literals.
    const knownTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    ACCEPTED_UPLOAD_TYPES.forEach((mimeType) => {
      expect(knownTypes).toContain(mimeType);
    });
  });
});

describe("ACCEPTED_UPLOAD_EXTENSIONS", () => {
  it("is non-empty", () => {
    expect(ACCEPTED_UPLOAD_EXTENSIONS.length).toBeGreaterThan(0);
  });

  it("contains the five expected extensions", () => {
    const exts: ReadonlyArray<string> = ACCEPTED_UPLOAD_EXTENSIONS;
    expect(exts).toContain(".jpg");
    expect(exts).toContain(".jpeg");
    expect(exts).toContain(".png");
    expect(exts).toContain(".webp");
    expect(exts).toContain(".pdf");
  });

  it("is a readonly tuple (as const) — every element is a known literal", () => {
    const knownExts = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
    ACCEPTED_UPLOAD_EXTENSIONS.forEach((ext) => {
      expect(knownExts).toContain(ext);
    });
  });
});

// ---------------------------------------------------------------------------
// enquirySubmissionSchema — required string fields
// ---------------------------------------------------------------------------

describe("enquirySubmissionSchema — name field", () => {
  const base = {
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "0412345678",
    projectType: "DA / CDC Drawings" as const,
    message: "Hello, please help.",
  };

  it("accepts a valid name", () => {
    // Arrange
    const input = { ...base };
    // Act
    const result = enquirySubmissionSchema.safeParse(input);
    // Assert
    expect(result.success).toBe(true);
  });

  it("trims leading and trailing whitespace from name", () => {
    const input = { ...base, name: "  Alice Smith  " };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Alice Smith");
    }
  });

  it("rejects an empty name with the required message", () => {
    const input = { ...base, name: "" };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required");
    }
  });

  it("rejects a whitespace-only name (trim semantics collapse it to empty)", () => {
    const input = { ...base, name: "   " };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects a name exceeding 100 characters", () => {
    const input = { ...base, name: "A".repeat(101) };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be under 100 characters");
    }
  });

  it("accepts a name of exactly 100 characters (boundary)", () => {
    const input = { ...base, name: "A".repeat(100) };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

describe("enquirySubmissionSchema — email field", () => {
  const base = {
    name: "Alice",
    email: "alice@example.com",
    phone: "0412345678",
    projectType: "DA / CDC Drawings" as const,
    message: "Test message.",
  };

  it("accepts a valid email address", () => {
    const result = enquirySubmissionSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("trims whitespace from email before validation", () => {
    const input = { ...base, email: "  alice@example.com  " };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("alice@example.com");
    }
  });

  it("rejects an invalid email format", () => {
    const input = { ...base, email: "not-an-email" };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Please enter a valid email");
    }
  });

  it("rejects an email exceeding 255 characters", () => {
    const localPart = "a".repeat(250);
    const input = { ...base, email: `${localPart}@example.com` };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe("enquirySubmissionSchema — phone field", () => {
  const base = {
    name: "Alice",
    email: "alice@example.com",
    phone: "0412345678",
    projectType: "DA / CDC Drawings" as const,
    message: "Test message.",
  };

  it("accepts a valid phone number", () => {
    const result = enquirySubmissionSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("trims whitespace from phone", () => {
    const input = { ...base, phone: "  0412345678  " };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("0412345678");
    }
  });

  it("rejects an empty phone with the required message", () => {
    const input = { ...base, phone: "" };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Phone number is required");
    }
  });

  it("rejects a phone exceeding 20 characters", () => {
    const input = { ...base, phone: "1".repeat(21) };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Phone must be under 20 characters");
    }
  });

  it("accepts a phone of exactly 20 characters (boundary)", () => {
    const input = { ...base, phone: "1".repeat(20) };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

describe("enquirySubmissionSchema — projectType field", () => {
  const base = {
    name: "Alice",
    email: "alice@example.com",
    phone: "0412345678",
    projectType: "DA / CDC Drawings" as const,
    message: "Test message.",
  };

  it("accepts every value from the projectTypes enum", () => {
    projectTypes.forEach((type) => {
      const result = enquirySubmissionSchema.safeParse({ ...base, projectType: type });
      expect(result.success).toBe(true);
    });
  });

  it("rejects a value outside the projectTypes enum with the custom error message", () => {
    const input = { ...base, projectType: "Interior Design" };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Please select a valid project type");
    }
  });

  it("rejects an empty string for projectType", () => {
    const input = { ...base, projectType: "" };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Please select a valid project type");
    }
  });
});

describe("enquirySubmissionSchema — message field", () => {
  const base = {
    name: "Alice",
    email: "alice@example.com",
    phone: "0412345678",
    projectType: "DA / CDC Drawings" as const,
    message: "Please help with my project.",
  };

  it("accepts a valid message", () => {
    const result = enquirySubmissionSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("trims whitespace from message", () => {
    const input = { ...base, message: "  Hello  " };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("Hello");
    }
  });

  it("rejects an empty message with the required message", () => {
    const input = { ...base, message: "" };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Message is required");
    }
  });

  it("rejects a message exceeding 2000 characters", () => {
    const input = { ...base, message: "x".repeat(2001) };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Message must be under 2000 characters");
    }
  });

  it("accepts a message of exactly 2000 characters (boundary)", () => {
    const input = { ...base, message: "x".repeat(2000) };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// enquirySubmissionSchema — siteVisitDate field
// ---------------------------------------------------------------------------

describe("enquirySubmissionSchema — siteVisitDate field", () => {
  const base = {
    name: "Alice",
    email: "alice@example.com",
    phone: "0412345678",
    projectType: "DA / CDC Drawings" as const,
    message: "Test message.",
  };

  it("accepts undefined (field omitted entirely)", () => {
    // Arrange — base object has no siteVisitDate key
    const result = enquirySubmissionSchema.safeParse(base);
    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.siteVisitDate).toBeUndefined();
    }
  });

  it("accepts a valid ISO date string", () => {
    const input = { ...base, siteVisitDate: "2025-08-15T09:00:00.000Z" };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.siteVisitDate).toBe("2025-08-15T09:00:00.000Z");
    }
  });

  it("accepts an empty string and transforms it to undefined", () => {
    // The schema trims then transforms empty-string to undefined
    const input = { ...base, siteVisitDate: "" };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.siteVisitDate).toBeUndefined();
    }
  });

  it("trims whitespace from siteVisitDate before transforming", () => {
    const input = { ...base, siteVisitDate: "  " };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.siteVisitDate).toBeUndefined();
    }
  });

  it("rejects a non-parseable date string with the custom error message", () => {
    const input = { ...base, siteVisitDate: "not-a-date" };
    const result = enquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Please provide a valid preferred site visit date",
      );
    }
  });

  it("rejects a partial date string that cannot be parsed", () => {
    const input = { ...base, siteVisitDate: "2025-13-99" };
    const result = enquirySubmissionSchema.safeParse(input);
    // Date.parse("2025-13-99") returns NaN — schema should reject
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// enquiryClientSchema — must NOT include siteVisitDate
// ---------------------------------------------------------------------------

describe("enquiryClientSchema", () => {
  it("does not include the siteVisitDate field", () => {
    // Arrange
    const shape = enquiryClientSchema.shape;
    // Assert — siteVisitDate must be absent from the client schema shape
    expect("siteVisitDate" in shape).toBe(false);
  });

  it("includes all five client-visible fields", () => {
    const shape = enquiryClientSchema.shape;
    expect("name" in shape).toBe(true);
    expect("email" in shape).toBe(true);
    expect("phone" in shape).toBe(true);
    expect("projectType" in shape).toBe(true);
    expect("message" in shape).toBe(true);
  });

  it("parses successfully when given all required fields", () => {
    const input = {
      name: "Bob",
      email: "bob@example.com",
      phone: "0400000000",
      projectType: "Other" as const,
      message: "Hello",
    };
    const result = enquiryClientSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
