# DraftWorks Australia — Marketing Website

Professional residential architectural and structural engineering drafting services website built with Vite + React + TypeScript.

## Business

**DraftWorks Australia** provides precision drafting services for builders, engineers, architects, and homeowners across Australia — from DA submissions and construction documentation through to structural steel shop drawings and CAD conversion.

- **Domain**: draftworks.com.au
- **Contact**: info@draftworks.com.au

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite 5 |
| Language | TypeScript 5 (strict mode) |
| UI Framework | React 18 |
| Component Library | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 12 |
| Form Handling | React Hook Form + Zod |
| Routing | React Router v6 |
| Testing | Vitest + Testing Library |
| Package Manager | Bun (lockfile) / npm |

---

## Project Structure

```
src/
├── assets/                  # Static images (hero, portfolio, drafting detail)
├── components/
│   ├── ui/                  # shadcn/ui primitives (button, input, form, etc.)
│   ├── Navbar.tsx           # Fixed top nav with mobile hamburger menu
│   ├── HeroSection.tsx      # Full-screen hero with background image + stats
│   ├── ServicesOverview.tsx # Two-card services grid (Residential + Structural)
│   ├── ResidentialSection.tsx # Residential drafting categories with image
│   ├── StructuralSection.tsx  # Structural engineering categories (dark bg)
│   ├── ProjectTypes.tsx     # Residential vs structural project type lists
│   ├── DeliverablesSection.tsx # 4-card deliverables (PDF, DWG, revisions, etc.)
│   ├── PortfolioGallery.tsx # Filterable 6-image gallery with lightbox
│   ├── Testimonials.tsx     # 4-testimonial 2-col grid with star ratings
│   ├── ContactForm.tsx      # Enquiry form (RHF + Zod validation, 5 fields)
│   ├── ContactCTA.tsx       # Email / phone / location contact cards
│   ├── Footer.tsx           # Minimal footer with nav links + copyright
│   └── NavLink.tsx          # Nav link utility component
├── pages/
│   ├── Index.tsx            # Single-page layout composing all sections
│   └── NotFound.tsx         # 404 page
├── lib/utils.ts             # cn() Tailwind merge utility
├── App.tsx                  # Router root
├── main.tsx                 # React entry point
└── index.css                # Tailwind directives + CSS custom properties
```

---

## Page Sections (top → bottom)

| Section | ID | Background |
|---------|-----|-----------|
| Navbar | — | `bg-secondary/95` (dark, fixed) |
| Hero | — | `hero-architecture.jpg` with overlay |
| Services Overview | `#services` | Light warm |
| Residential Drafting | `#residential` | `section-warm` |
| Structural Drafting | `#structural` | `section-dark` |
| Project Types | `#projects` | Light |
| Deliverables | `#deliverables` | `section-warm` |
| Portfolio Gallery | `#portfolio` | `section-dark` |
| Testimonials | `#testimonials` | `section-warm` |
| Enquiry Form | `#enquiry` | Light background |
| Contact CTA | `#contact` | `section-dark` |
| Footer | — | `bg-secondary` |

---

## Brand Design Tokens

```css
--gold:           hsl(36 80% 50%)   /* #E8941A — primary accent */
--secondary:      hsl(220 15% 20%)  /* dark navy/charcoal — nav, dark sections */
--surface-warm:   hsl(36 30% 92%)   /* warm off-white — alternating sections */
--font-display:   'Space Grotesk'   /* headings, labels, navbar logo */
--font-body:      'Inter'           /* body copy */
```

Logo is text-based: `DRAFT` (white) + `WORKS` (gold), no external image dependency.

---

## Local Development

```sh
# Install dependencies (Bun preferred, npm also works)
bun install
# or
npm install

# Start dev server at http://localhost:8080
bun run dev
# or
npm run dev
```

## Build

```sh
bun run build
# or
npm run build
```

Output lands in `dist/`.

## Tests

```sh
bun run test
# or
npm test
```

---

## Public Assets

| File | Purpose |
|------|---------|
| `public/favicon.svg` | SVG favicon (modern browsers) — dark navy + blueprint motif |
| `public/favicon.ico` | ICO fallback (16/32/48 px) — same DraftWorks motif |
| `public/placeholder.svg` | Blueprint-themed image placeholder for missing/loading images |
| `public/robots.txt` | SEO robots directives |

---

## Git Branch Convention

```
feat/<description>     New features
fix/<description>      Bug fixes
refactor/<description> Code refactoring
chore/<description>    Dependency, config, build changes
docs/<description>     Documentation updates
```

**Never** branch from or merge directly into `main`/`master`/`production` — all work goes through feature branches and PRs.

---

## SEO

The site targets Australian search terms for architectural and structural drafting. Key metadata is in `index.html`:

- Page title: *DraftWorks Australia | Residential & Structural Engineering Drafting Services*
- Canonical URL: `https://draftworks.com.au`
- Schema.org `ProfessionalService` JSON-LD structured data
- Open Graph and Twitter Card meta tags
