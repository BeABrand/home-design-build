# Build Plan & Drafting — Marketing Website

Professional council approval, architectural, and construction drafting services website for **Build Plan & Drafting** — built with Vite + React + TypeScript and deployed via Netlify.

## Business

**Build Plan & Drafting** delivers professional drafting services across Australia: council approval documentation (DA / CDC), architectural drafting, construction documentation, Revit/BIM, shop drawings, and estimation support for builders, engineers, architects, and homeowners.

| | |
|---|---|
| Domain | `buildplanandrafting.com.au` |
| Email | `info@buildplanandrafting.com.au` |
| Phone | `+61 480 024 017` |
| Service area | Australia-wide |
| Mailbox host | Zoho Workspace (Australian region) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite 5 |
| Language | TypeScript 5 (project references: `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.netlify.json`) |
| UI Framework | React 18 |
| Component Library | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 12 |
| Forms | React Hook Form + Zod |
| Routing | React Router v6 (single-page) |
| Unit Tests | Vitest + Testing Library — 101 tests |
| E2E Tests | Playwright (chromium) — 3 tests |
| Backend | Netlify Functions (Node) — `netlify/functions/send-enquiry.ts` |
| Email | Nodemailer → Zoho SMTP (regional host `smtppro.zoho.com.au`) |
| File uploads | Busboy multipart parser → email attachment + optional `public/storage/` mirror |
| Package manager | Bun (lockfile) / npm |

---

## Project Structure

```
src/
├── assets/                  # Hero, portfolio, drafting-detail JPGs
├── components/
│   ├── ui/                  # shadcn primitives (button, input, form, etc.)
│   │                        # + extracted variant/util sibling files (badge-variants.ts,
│   │                        # button-variants.ts, form-utils.ts, sidebar-utils.ts,
│   │                        # toggle-variants.ts, navigation-menu-variants.ts)
│   ├── Navbar.tsx           # Fixed top nav, "Build Plan & Drafting" wordmark
│   ├── HeroSection.tsx      # Full-screen hero with stats bar
│   ├── ServicesOverview.tsx # Services grid (Council, Architectural, Construction, Revit/BIM, ...)
│   ├── ResidentialSection.tsx
│   ├── StructuralSection.tsx
│   ├── ProjectTypes.tsx
│   ├── DeliverablesSection.tsx
│   ├── PortfolioGallery.tsx # Filterable gallery + lightbox
│   ├── Testimonials.tsx
│   ├── ContactForm.tsx      # /#enquiry form: name/email/phone/projectType/message
│   │                        # + optional siteVisitDate + optional file uploads
│   │                        # + Zod (enquiryClientSchema) validation
│   │                        # + POST to /.netlify/functions/send-enquiry
│   ├── FAQSection.tsx
│   ├── ContactCTA.tsx       # Email / phone / location cards
│   └── Footer.tsx
├── lib/
│   ├── enquiry.ts           # SHARED — Zod schemas (server + client), shared types,
│   │                        # isSubmissionPayload runtime guard, projectTypes/MIME constants
│   ├── utils.ts             # cn() Tailwind merge helper
│   └── __tests__/           # Vitest unit tests
├── pages/
│   ├── Index.tsx            # Composes all sections in order
│   └── NotFound.tsx
└── index.css                # Tailwind directives + CSS custom properties

netlify/
└── functions/
    ├── send-enquiry.ts      # Main handler — parses multipart, validates, persists files,
    │                        # sends email via Nodemailer/Zoho, uses error classifier
    └── zoho-error-classifier.ts  # Reusable Zoho SMTP error → cause mapper

scripts/
└── test-zoho-smtp.ts        # CLI: npm run diagnose:smtp — verifies SMTP credentials
                             # and prints categorised diagnosis on failure

tests/
└── e2e/
    └── enquiry-form.spec.ts # Playwright: validation / happy-path / file-upload

documents/
├── SESSION_RECOVERY.md      # Full session-by-session change log
└── RESUME_INSTRUCTIONS.md   # Onboarding for the next Claude Code session
```

---

## Page Sections (top → bottom)

| Section | ID | Content |
|---------|-----|---------|
| Navbar | — | Fixed top nav with "Build Plan & Drafting" wordmark, mobile hamburger, "Get a Quote" CTA |
| Hero | — | Full-screen hero image with stats (500+ projects, 100% Australian, DA & CDC) |
| Services Overview | `#services` | Council Approvals / Architectural / Construction / Revit & BIM / Shop Drawings / Estimation |
| Residential | `#residential` | Residential drafting categories with image |
| Structural | `#structural` | Structural drafting categories (dark section) |
| Project Types | `#projects` | Residential vs structural project type lists |
| Deliverables | `#deliverables` | What clients receive (PDF sets, DWG, revisions, title blocks) |
| Portfolio | `#portfolio` | 6-image filterable gallery with lightbox |
| Testimonials | `#testimonials` | 4 client reviews with star ratings |
| Enquiry Form | `#enquiry` | Request a Free Quote form — submits to Netlify Function |
| FAQ | — | Common questions |
| Contact CTA | `#contact` | Email card, phone card, location card (dark section) |
| Footer | — | Wordmark, links, copyright |

---

## Brand Design Tokens

```css
--gold:        hsl(36 80% 50%)   /* primary accent — buttons, highlights, dividers */
--secondary:   hsl(220 15% 20%)  /* dark navy/charcoal — nav, dark sections */
--surface-warm: hsl(36 30% 92%)  /* warm off-white — alternating sections */
--font-display: 'Space Grotesk'  /* headings, labels, wordmark */
--font-body:   'Inter'           /* body copy */
```

The wordmark is text-only: "Build Plan & Drafting" in display font, no external image dependency.

---

## Local Development

```sh
# Install dependencies
bun install
# or
npm install

# Start dev server (port 8080 — falls back to 8081 if Apache holds 8080)
bun run dev
# or
npm run dev
```

The Vite dev server includes custom middleware at `vite.config.ts` that proxies `/.netlify/functions/send-enquiry` to the same handler used in production, so the enquiry form works locally without `netlify dev`.

## Build & Verify

```sh
# Full project-references type-check (covers src/, vite.config.ts, AND netlify/)
./node_modules/.bin/tsc --build

# Lint (zero warnings expected)
npm run lint              # or: npx eslint . --max-warnings 0

# Unit tests (Vitest)
npm test                  # 101 tests across 5 files

# E2E tests (Playwright, chromium only)
npm run test:e2e          # 3 tests against http://localhost:8081

# Production build
npm run build
```

**Important**: always use `tsc --build`, NOT `tsc --noEmit`. The latter only covers `src/` (per `tsconfig.app.json` includes) and silently skips the Netlify function code.

---

## Backend: Enquiry Form Email Flow

The `/#enquiry` form submits to `/.netlify/functions/send-enquiry` which:

1. Parses multipart form data via Busboy (limits: 5 files, 10 MB each, JPG/PNG/WebP/PDF only)
2. Validates fields with `enquirySubmissionSchema` from `src/lib/enquiry.ts`
3. Optionally writes files to `public/storage/` (when the runtime supports it — Netlify CDN does NOT serve files written at runtime, so production falls back to attachments-only)
4. Sends an HTML + text email via Nodemailer through Zoho SMTP
5. On SMTP failure, `classifyZohoSmtpError` produces a server-side `operatorMessage` (logged to Netlify function logs) and a generic `clientMessage` for the public response — credentials NEVER leak to the client

### Required environment variables

See `.env.example` for the full annotated list. Critical ones:

| Variable | Notes |
|----------|-------|
| `SMTP_HOST` | **Must match Zoho region**. For AU Workspace: `smtppro.zoho.com.au`. Other regions documented in `.env.example`. |
| `SMTP_PORT` | `465` for SSL |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | Full Zoho mailbox address (e.g. `info@buildplanandrafting.com.au`) |
| `SMTP_PASS` | **App-specific password** from Zoho → Security → App Passwords. NOT the regular login password. |
| `ENQUIRY_TO_EMAIL` | Recipient mailbox |
| `ENQUIRY_FROM_EMAIL` | Must equal `SMTP_USER` or a verified Zoho alias |
| `ENQUIRY_FROM_NAME` | Display name |

### Diagnosing SMTP issues

```sh
# Verify SMTP credentials + send a test email
npm run diagnose:smtp

# Override env values for testing
SMTP_HOST=smtppro.zoho.com.au SMTP_PASS=<app-password> npm run diagnose:smtp
```

The CLI loads `.env` (or `process.env` overrides), runs `transporter.verify()` then sends a test email, and on failure prints the raw `error.code` / `responseCode` / `response` plus a categorised diagnosis (`wrong-region`, `app-password-required`, `smtp-disabled-or-from-mismatch`, `network`, `unknown`).

---

## Public Assets

| File | Purpose |
|------|---------|
| `public/favicon.svg` | SVG favicon (modern browsers) — blueprint motif |
| `public/favicon.ico` | Multi-size ICO fallback (16/32/48 px) |
| `public/placeholder.svg` | Blueprint-themed image placeholder (NOTE: still contains "DraftWorks" text from prior branding — open item) |
| `public/robots.txt` | SEO robots directives |
| `public/storage/.gitkeep` | Runtime upload directory placeholder |

---

## Git Branch Convention

```
feat/<description>     New features
fix/<description>      Bug fixes
refactor/<description> Code refactoring
chore/<description>    Config / dependency changes
docs/<description>     Documentation updates
test/<description>     Test-only changes
```

**Never** branch from or merge directly into `main` / `master` / `production` — all work goes through a named branch.

Commits do NOT include any AI-attribution trailer.

---

## Open Items

Tracked in `documents/SESSION_RECOVERY.md` and `documents/RESUME_INSTRUCTIONS.md`. Notable outstanding items:

- **HIGH security** — add rate limiting (Cloudflare or Netlify WAF) on `/.netlify/functions/send-enquiry`
- **HIGH operations** — the production `SMTP_HOST` and `SMTP_PASS` env vars must be updated in Netlify (set host to `smtppro.zoho.com.au`, set password to a Zoho app-specific password)
- **MEDIUM rebrand** — three stale "DraftWorks" references remain:
  - `index.html:10` canonical URL still points to `https://draftworks.com.au`
  - `public/placeholder.svg` contains "DRAFTWORKS" wordmark + `draftworks.com.au`
  - `public/favicon.svg` and `public/favicon.ico` contain a "DW" monogram
- **MEDIUM architecture** — migrate `public/storage/` runtime writes to Netlify Blobs or S3/R2 (Netlify static hosting does NOT expose runtime-written files)
- **MEDIUM** — lift `siteVisitDate` from parallel `useState` into the RHF schema in `ContactForm.tsx`

---

## SEO

Schema.org `ProfessionalService` JSON-LD structured data in `index.html` lists the six service types: Council Approval Drawings, Architectural Drafting, Construction Documentation, Revit & BIM Documentation, Shop Drawings & Fabrication, Estimation & Planning Support. The canonical URL meta currently has a stale reference (see Open Items above).
