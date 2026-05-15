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
