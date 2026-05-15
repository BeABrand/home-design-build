import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_FILE_COUNT = 5;
export const ACCEPTED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;
export const ACCEPTED_UPLOAD_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"] as const;
export const projectTypes = [
  "DA / CDC Drawings",
  "Architectural Drafting",
  "Construction Documentation",
  "Revit & BIM",
  "Shop Drawings",
  "Estimation & Planning",
  "Small Drafting",
  "Other",
] as const;

const optionalDateStringSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
    message: "Please provide a valid preferred site visit date",
  });

export const enquirySubmissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone must be under 20 characters"),
  projectType: z.enum(projectTypes, {
    errorMap: () => ({ message: "Please select a valid project type" }),
  }),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be under 2000 characters"),
  siteVisitDate: optionalDateStringSchema,
});

export const enquiryClientSchema = enquirySubmissionSchema.omit({ siteVisitDate: true });

export type EnquirySubmission = z.infer<typeof enquirySubmissionSchema>;
export type EnquiryFormValues = z.infer<typeof enquiryClientSchema>;
