import { test, expect, type Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helper: navigate to the enquiry section and wait for the form to be ready
// ---------------------------------------------------------------------------
async function gotoEnquiry(page: Page): Promise<void> {
  await page.goto("/#enquiry");
  // The form section is rendered on the Index page; wait for the submit button
  await page.waitForSelector('button[type="submit"]', { state: "visible" });
}

// ---------------------------------------------------------------------------
// Test 1 – Validation errors block submission
// ---------------------------------------------------------------------------
test("validation errors render for all required fields when submitting empty form", async ({
  page,
}) => {
  await gotoEnquiry(page);

  // Click submit without filling any field
  await page.getByRole("button", { name: /submit enquiry/i }).click();

  // Assert field-level error messages from Zod / react-hook-form FormMessage
  await expect(page.getByText("Name is required")).toBeVisible();
  await expect(page.getByText("Please enter a valid email")).toBeVisible();
  await expect(page.getByText("Phone number is required")).toBeVisible();
  await expect(page.getByText("Please select a valid project type")).toBeVisible();
  await expect(page.getByText("Message is required")).toBeVisible();

  // Confirm the success card did NOT appear
  await expect(page.getByText("Thank You!")).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 2 – Happy path submission with mocked backend
// ---------------------------------------------------------------------------
test("successful submission shows Thank You card when backend returns ok", async ({ page }) => {
  // Intercept the Netlify function endpoint and return a successful response
  await page.route("**/.netlify/functions/send-enquiry", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, uploadedFiles: [] }),
    });
  });

  await gotoEnquiry(page);

  // Fill in all required fields
  await page.getByLabel("Full Name").fill("Test User");
  await page.getByLabel("Email").fill("test@example.com.au");
  await page.getByLabel("Phone").fill("0400000000");

  // Project type is a native <select> — select by visible label value
  await page.locator('select').selectOption("DA / CDC Drawings");

  await page.getByLabel("Project Details").fill("This is a test enquiry.");

  // Submit the form
  await page.getByRole("button", { name: /submit enquiry/i }).click();

  // Assert the success card appears
  await expect(page.getByText("Thank You!")).toBeVisible({ timeout: 10000 });

  // The form fields should be gone (component renders success card instead of form)
  await expect(page.getByLabel("Full Name")).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 3 – File upload client-side validation (no submission)
// ---------------------------------------------------------------------------
test("file upload accepts valid image and rejects invalid file type", async ({ page }) => {
  await gotoEnquiry(page);

  const fileInput = page.locator('input[type="file"]');

  // --- Valid file: PNG ---
  // Attach an in-memory PNG buffer (1×1 white pixel, minimal valid PNG)
  const pngBuffer = Buffer.from(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6260000000000200e221bc330000000049454e44ae426082",
    "hex",
  );

  await fileInput.setInputFiles([
    {
      name: "blueprint.png",
      mimeType: "image/png",
      buffer: pngBuffer,
    },
  ]);

  // A preview thumbnail (img element) should be rendered for the image
  await expect(page.locator('img[alt="blueprint.png"]')).toBeVisible();

  // --- Invalid file: .txt plain text ---
  const txtBuffer = Buffer.from("this is a plain text file");

  await fileInput.setInputFiles([
    {
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: txtBuffer,
    },
  ]);

  // The component renders the file type error message
  await expect(
    page.getByText("Only JPG, PNG, WebP, and PDF files are accepted."),
  ).toBeVisible();

  // The valid PNG thumbnail should still be present (invalid file was rejected, not added)
  await expect(page.locator('img[alt="blueprint.png"]')).toBeVisible();
});
