# Resume Instructions — DraftWorks Australia Website

Use this document to orient a new Claude Code session on this project without re-reading the entire codebase.

---

## Step 1 — Identify the project

```sh
cd /var/www/html/contract/daniel_projects/home-design-build
git status
git log --oneline -10
```

This is the **DraftWorks Australia** marketing website — a single-page React/TypeScript app built with Vite + shadcn/ui + Tailwind CSS. It presents residential architectural and structural engineering drafting services.

---

## Step 2 — Understand the current branch state

Check which branch is active and its unmerged changes:

```sh
git branch --list
git log --oneline main..HEAD
git diff main
```

If the branch is `docs/update-readme-and-session-docs` or later, the README and these documents have already been updated.

---

## Step 3 — Read the key files for context

In order of importance:

| File | Why |
|------|-----|
| `src/pages/Index.tsx` | Full page composition — shows all sections in order |
| `src/index.css` | All CSS custom properties (brand colours, typography tokens) |
| `index.html` | SEO metadata, canonical URL, structured data |
| `src/components/Navbar.tsx` | Logo style, nav links, mobile menu |
| `src/components/ContactForm.tsx` | Enquiry form schema (Zod), field list, submit handler |

---

## Step 4 — Known open tasks

These items were **not completed** as of 2026-05-11 and are candidates for the next session:

### High priority
- [ ] **ContactForm backend**: Wire up `onSubmit` to a real email/API service. Current handler just `console.log`s the data. Options: Resend, EmailJS, Netlify Forms, or a custom serverless function. File: `src/components/ContactForm.tsx:49`
- [ ] **Real phone number**: Replace `+61 400 000 000` placeholder in `ContactCTA.tsx:44` with the actual business number.

### Medium priority
- [ ] **Portfolio images**: Replace stock images in `src/assets/portfolio-1.jpg` through `portfolio-6.jpg` with actual DraftWorks project drawings or approved imagery.
- [ ] **Deployment setup**: Add Vercel/Netlify config or CI/CD workflow. No hosting config exists yet.
- [ ] **lockfile cleanup**: Run `npm install` (or `bun install`) after the `lovable-tagger` removal to update `package-lock.json`.

### Low priority
- [ ] **FAQ section**: Several early commits added/removed an FAQ section (`df3925d`, `309f66f`, `f93d896`). Confirm with client whether FAQ should be reinstated.
- [ ] **OG image**: `index.html` has OG tags but no `og:image` is set. A proper social share image should be added.

---

## Step 5 — Dev environment

```sh
# Start development server (port 8080)
bun run dev
# or
npm run dev

# Run tests
bun run test

# Build for production
bun run build
```

---

## Step 6 — Git rules for this project

- **Never** branch from or touch `main`/`master`/`production` directly
- All work goes on a named feature/fix/chore/docs branch
- Branch naming: `<type>/<short-description>` (e.g. `feat/contact-form-backend`)
- Do **not** stash or checkout destructively — the working tree history is the source of truth
- Do **not** include Claude Code attribution in commit messages

---

## Component Quick-Reference

```
Navbar.tsx            Fixed nav, logo: text "DRAFT" + gold "WORKS"
HeroSection.tsx       hero-architecture.jpg bg, stats: 500+ projects / 100% AU / DA & CDC
ServicesOverview.tsx  2-card: Residential Architectural | Structural Engineering
ResidentialSection.tsx 4 category accordions (Concept / Council / Construction / As-Built) + image
StructuralSection.tsx  4 categories (Structural Docs / RC Detailing / Steel / Support) dark bg
ProjectTypes.tsx      Residential types (8) vs Structural types (6) side-by-side
DeliverablesSection.tsx 4-card: PDF Sets | DWG Files | Revision Updates | Title Blocks
PortfolioGallery.tsx  6 portfolio images, filter by category, click-to-lightbox
Testimonials.tsx      4 reviews (James, Sarah, Mark & Lisa, David) with star ratings
ContactForm.tsx       Fields: name / email / phone / projectType / message; Zod schema
ContactCTA.tsx        Email card / Phone card / Location card (dark bg)
Footer.tsx            Logo + links + copyright year
```

---

## Brand Quick-Reference

```
Gold accent:   hsl(36 80% 50%)  ≈ #E8941A
Dark bg:       hsl(220 15% 20%) ≈ #2B3248  (navbar, structural, contact dark sections)
Warm surface:  hsl(36 30% 92%)  ≈ #EDE6D8  (residential, deliverables, testimonials)
Display font:  Space Grotesk (headings, navbar logo, labels)
Body font:     Inter (paragraphs, descriptions)
```

---

## Session Log Summary

| Date | Branch | What Changed |
|------|--------|-------------|
| Pre-2026 | main | Multiple rebrand iterations (Axis → Build Plan → DraftWorks); all core sections built |
| 2026-05-11 | chore/remove-lovable-branding | Removed lovable-tagger dep + vite plugin; new DraftWorks favicon.svg/.ico; new blueprint placeholder.svg; updated favicon link in index.html |
| 2026-05-11 | docs/update-readme-and-session-docs | Rewrote README.md; created documents/SESSION_RECOVERY.md and documents/RESUME_INSTRUCTIONS.md (this file) |
| 2026-05-15 | fix/enquiry-email-upload-flow | Added enquiry email backend flow with Nodemailer, multipart upload parsing, frontend `FormData` submission, and runtime config for SMTP/public upload URLs |
| 2026-05-15 | fix/enquiry-smtp-env-loading | Unit tests added: `src/lib/__tests__/enquiry.test.ts` (40), `src/lib/__tests__/send-enquiry.test.ts` (30), `src/components/__tests__/contact-form-helpers.test.ts` (15); `isSubmissionPayload` moved to `enquiry.ts`; pure helpers exported from `send-enquiry.ts` |
| 2026-05-15 | fix/typescript-lint-errors-and-warnings | Playwright E2E installed; `playwright.config.ts` (chromium, port 8081); `tests/e2e/enquiry-form.spec.ts` (3 tests: validation, happy path mock, file upload rejection) |

---

## 2026-05-15 Resume Point

- Active branch for this work: `fix/enquiry-email-upload-flow`
- The `#enquiry` form no longer logs to console; it now posts to `/.netlify/functions/send-enquiry`
- Required runtime setup:
  - Fill SMTP credentials in environment variables from `.env.example`
  - Confirm whether production has a writable public storage path behind `https://buildplandrafting.com.au/storage`
- Important deployment note:
  - On static Netlify hosting, runtime writes into the repo `public/` directory do not automatically become public URLs on the live site
  - Current fallback is safe: uploaded files are attached to the enquiry email even when public URLs cannot be generated

## 2026-05-15 Latest Resume Point

- Current branch after the follow-up fix: `fix/enquiry-response-json-handling`
- Latest issue fixed:
  - local testing in Vite returned `404` for the enquiry endpoint
  - the frontend then failed on `response.json()` with `Unexpected end of JSON input`
- Latest code changes:
  - `src/components/ContactForm.tsx`: defensive response parsing for empty/non-JSON error responses
  - `vite.config.ts`: local dev middleware exposing the enquiry handler at `/.netlify/functions/send-enquiry`
- Validation completed:
  - `./node_modules/.bin/tsc --noEmit`
  - `npm run build`

## 2026-05-15 Current Resume Point

- Current branch: `fix/typescript-lint-errors-and-warnings`
- Latest session scope: WebStorm/ESLint type-error + warning cleanup, full agent suite (build-error-resolver, code-reviewer, security-reviewer, architect, tdd-guide, refactor-cleaner, e2e-runner)
- Pipeline state at end of session: `tsc --noEmit` clean • `eslint --max-warnings 0` clean • `npm test` 86/86 • `npm run test:e2e` 3/3 • `npm run build` clean

### Dev environment notes
- **Port 8080 is occupied by Apache2** on this machine; Vite dev server falls back to **8081**. `playwright.config.ts` and Playwright `baseURL` are hard-set to 8081.
- E2E command: `npm run test:e2e` (chromium only). Spec lives at `tests/e2e/enquiry-form.spec.ts`.
- Unit tests: `npm test` (Vitest). 86 tests across `src/lib/__tests__/enquiry.test.ts`, `src/lib/__tests__/send-enquiry.test.ts`, `src/components/__tests__/contact-form-helpers.test.ts`, `src/test/example.test.ts`.

### Shared types (single source of truth)
All enquiry response types now live in `src/lib/enquiry.ts`:
- `SubmissionSuccessPayload`, `SubmissionErrorPayload`, `SubmissionPayload` (discriminated union)
- `EnquiryUploadedFile`
- `isSubmissionPayload` runtime guard
- `enquirySubmissionSchema`, `enquiryClientSchema`, project-types/MIME constants

Both `ContactForm.tsx` (client) and `netlify/functions/send-enquiry.ts` (server) import these — do NOT redeclare any of them.

### Where extracted shadcn variants/utils live (for fast-refresh compliance)
| Component file | Variants/hooks moved to |
|---------------|--------------------------|
| `badge.tsx` | `badge-variants.ts` |
| `button.tsx` | `button-variants.ts` |
| `form.tsx` | `form-utils.ts` |
| `navigation-menu.tsx` | `navigation-menu-variants.ts` |
| `sidebar.tsx` | `sidebar-utils.ts` |
| `toggle.tsx` | `toggle-variants.ts` |
| `sonner.tsx` | (no sibling — `toast` is imported directly from `sonner`) |

If you add a new shadcn component that exports BOTH a component AND a hook/variant, follow this same split or ESLint will fail with `react-refresh/only-export-components`.

### Open work — PROMOTED FROM AGENT REVIEWS (handle on dedicated branches)
Priority order. Each item should go on its own branch (e.g. `fix/enquiry-smtp-error-leak`, `chore/enquiry-rate-limiting`).

1. **HIGH security** — `send-enquiry.ts:391` returns raw `error.message` (may include SMTP credentials/hostnames) to the client. Replace with a generic message + `console.error` server-side.
2. **HIGH security** — no rate limiting on `/.netlify/functions/send-enquiry`. Add Netlify WAF / Cloudflare / Netlify Blobs counter.
3. **CRITICAL maintainability** — `persistFiles` catch block silently swallows storage errors. Log the underlying error.
4. **MEDIUM security** — strip CRLF from `name`/`phone` Zod fields (defence-in-depth).
5. **MEDIUM correctness** — `fileCount > MAX_FILE_COUNT` is off-by-one; change to `>=` to align with the `filesLimit` event boundary.
6. **MEDIUM correctness** — `OPTIONS 204` response should not carry `Content-Type: application/json`.
7. **MEDIUM cosmetic** — `disabledDays` comment in `ContactForm.tsx:201` says "weekends" but only Sundays are disabled (UI copy is correct).
8. **MEDIUM architecture** — `public/storage/` is dead on Netlify CDN. Migrate to Netlify Blobs or S3/R2 with signed URLs.
9. **MEDIUM refactor** — lift `siteVisitDate` from `useState` into RHF schema (eliminate parallel state).
10. **LOW security** — dev middleware (`vite.config.ts:19`) should cap request body to ~6 MB.

## 2026-05-15 WebStorm Strict TypeScript Errors Resume Point

- **Current branch**: `fix/webstorm-strict-typescript-errors`
- **Always use `tsc --build`** — NOT `tsc --noEmit`. The project now has 3 tsconfigs via project references (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`, `tsconfig.netlify.json` for `netlify/`). Only `tsc --build` covers all three. `tsc --noEmit` only covers `src/`, so it WILL pass even when netlify code is broken.
- **Lib version**: `tsconfig.app.json` now sets `target: "ES2021"` and `lib: ["ES2021", "DOM", "DOM.Iterable"]` — `replaceAll` and other ES2021 features are available.
- **Enquiry schemas split**: 
  - `enquirySubmissionSchema` (server) — strict `z.enum(projectTypes)` — Netlify function uses this
  - `enquiryClientSchema` (form) — uses `z.string().superRefine(...)` for projectType so RHF can keep `""` as default; runtime still rejects `""` and invalid values
- **Single source of truth** for `isSubmissionPayload` — `src/lib/enquiry.ts`. Never re-declare it in `ContactForm.tsx` (TS2440).
- **Discriminated union narrowing**: when checking the response, split `!response.ok` and `!payload.ok` into separate `if` blocks rather than combining with `||`, so TS can narrow `payload` properly.
- **`.gitignore`**: `*.tsbuildinfo` is ignored — these are project-references build caches and should never be committed.
- **`@types/nodemailer`** is in devDependencies — required because `tsconfig.netlify.json` now type-checks the Netlify function which imports nodemailer.

## 2026-05-15 Zoho SMTP 535 Resume Point

- **Current branch**: `fix/enquiry-zoho-smtp-authentication`
- **Form submission status**: STILL BROKEN in production until the user updates Netlify env vars. The code fix is in place; the **runtime credentials are wrong**.

### Required operator actions (NOT code — environment only)

1. Change `SMTP_HOST` in **Netlify env panel** from `smtppro.zoho.com` → `smtppro.zoho.com.au`
2. Generate an app-specific password at `https://accounts.zoho.com.au/home#security/app_passwords`
3. Set `SMTP_PASS` in **Netlify env panel** to that generated password (NOT the login password)
4. Redeploy the function

### Diagnostic tooling

- `npm run diagnose:smtp` — runs `scripts/test-zoho-smtp.ts` which loads `.env`, runs `transporter.verify()`, and on failure prints `error.code`, `responseCode`, `response`, and a categorised diagnosis (wrong-region / app-password-required / smtp-disabled-or-from-mismatch / network / unknown)
- Override `.env` for one-off tests: `SMTP_HOST=smtppro.zoho.com.au SMTP_PASS=newpwd npm run diagnose:smtp`
- The same `classifyZohoSmtpError` helper now runs inside `send-enquiry.ts`, so production SMTP failures will be logged with actionable diagnosis at `console.error("[send-enquiry] SMTP failure:", ...)` in Netlify function logs

### Zoho regional SMTP hosts cheat-sheet

| Region | Free | Workspace (paid, custom domain) |
|--------|------|--------------------------------|
| US | `smtp.zoho.com` | `smtppro.zoho.com` |
| EU | `smtp.zoho.eu` | `smtppro.zoho.eu` |
| **AU** (this project) | `smtp.zoho.com.au` | **`smtppro.zoho.com.au`** |
| India | `smtp.zoho.in` | `smtppro.zoho.in` |
| China | `smtp.zoho.com.cn` | `smtppro.zoho.com.cn` |

Determine your region by logging into Zoho web mail and reading the URL: `mail.zoho.<region>`.

### Open items rolled forward

- **HIGH security** — H-2 from prior session: no rate limiting on `/.netlify/functions/send-enquiry`. Requires Cloudflare or Netlify WAF (infrastructure, not code).
- All other previously deferred items (CRITICAL `persistFiles` log, MEDIUM CRLF, OPTIONS Content-Type, fileCount off-by-one, public/storage architecture, `siteVisitDate` RHF lift, dev middleware body cap) remain open.

## 2026-05-15 README + Docs Rebrand Resume Point

- **Current branch**: `docs/rebrand-buildplanandrafting-readme`
- **What was done**: rewrote `README.md` to remove the stale "DraftWorks Australia" branding and reflect the actual live business **Build Plan & Drafting**. Updated session docs with this entry. No code changes — pure documentation.

### Authoritative brand identity (use these — do NOT call this project "DraftWorks")

| Field | Value |
|-------|-------|
| Business name | Build Plan & Drafting |
| Domain | `buildplanandrafting.com.au` |
| Email | `info@buildplanandrafting.com.au` |
| Phone | `+61 480 024 017` |
| Region | Australia-wide service; mailbox on Zoho Workspace AU (`smtppro.zoho.com.au`) |

### Service offering (from `src/lib/enquiry.ts` `projectTypes`)

DA / CDC Drawings · Architectural Drafting · Construction Documentation · Revit & BIM · Shop Drawings · Estimation & Planning · Small Drafting · Other

### Page composition (current order — confirmed against `src/pages/Index.tsx`)

`Navbar → HeroSection → ServicesOverview → ResidentialSection → StructuralSection → ProjectTypes → DeliverablesSection → PortfolioGallery → Testimonials → ContactForm → FAQSection → ContactCTA → Footer`

Note that `FAQSection` was reinstated and sits between `ContactForm` and `ContactCTA`.

### Stale "DraftWorks" references — flagged but NOT modified this session

These should be cleaned up in a dedicated branch `chore/rebrand-static-assets`:

1. `index.html:10` — `<link rel="canonical" href="https://draftworks.com.au" />` — needs to become `https://buildplanandrafting.com.au`
2. `public/placeholder.svg` — embedded "DRAFTWORKS" wordmark + `draftworks.com.au` URL text
3. `public/favicon.svg` and `public/favicon.ico` — both contain a "DW" monogram from the earlier brand

These were deliberately left in place to respect the session's documentation-only scope. A future agent should not change them on a docs branch.

### Pipeline state at end of session

No code changed. Verified earlier in the session:
- `tsc --build` clean
- `eslint . --max-warnings 0` clean
- `npm test` — 101/101 passed
- `npm run diagnose:smtp` — produces actionable diagnosis
