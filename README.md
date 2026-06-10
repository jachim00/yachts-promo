# MARÉ — cinematic yacht storytelling site

A multilingual (EN / DE / FR / ES / PL), static, lead-generation landing built as a
**cinematic story** about yachts — emotion first, sales second. Astro 5 + Tailwind +
GSAP/ScrollTrigger + Lenis, deployed to GitHub Pages.

> Working brand: **MARÉ** · *"Stories the sea remembers."* — everything is a
> placeholder, easy to rebrand from one config + the i18n dictionaries.

Live (after deploy): **https://pflgroup.github.io/yachts-promo/**

---

## Quick start

```bash
npm install        # install dependencies
npm run dev        # dev server  → http://localhost:4321/yachts-promo
npm run build      # static build → ./dist
npm run preview    # serve ./dist locally (same base path)
npm run astro check  # full TypeScript / template diagnostics
```

Node 18+ (developed on Node 24). The site is fully static — no server, no database.

If the build ever runs short on memory, prefix it:
`NODE_OPTIONS=--max-old-space-size=2048 npm run build`.

---

## Stack

| Layer        | Choice | Notes |
|--------------|--------|-------|
| Framework    | **Astro 5** (`^5.13`, runtime 5.18) | static output, island architecture, native i18n |
| Styling      | **Tailwind CSS 3.4** via `@astrojs/tailwind` ^6 | design tokens mirrored in `global.css` + `tailwind.config.mjs` |
| Language     | **TypeScript** (strict) | |
| Motion       | **GSAP + ScrollTrigger** (`^3.13`) | reveals, parallax, pinned horizontal scroll, spec counters |
| Smooth scroll| **Lenis** (`^1.3`) | guarded by `prefers-reduced-motion` |
| Sitemap      | `@astrojs/sitemap` | emits `sitemap-index.xml` |
| Images       | `sharp` | for `astro:assets` when real media is added |
| Form         | **Web3Forms / Formspree** (placeholder endpoint) | client-side validation; demo-mode when endpoint unset |
| Analytics    | **GA4 (gtag) + Consent Mode v2** | default DENY, loads only after consent |

> **Stack deviations from the brief** (all intentional, build is green):
> - Tailwind **v3.4** (classic config) instead of v4 `@theme`, matching `@astrojs/tailwind` ^6 and the reference project.
> - `lenis` package (not the deprecated `@studio-freight/lenis`).
> - `prefixDefaultLocale: true` → English also lives under `/en` (so `/` redirects to the best locale).

---

## Project structure

```
yachts-promo/
├─ astro.config.mjs          # site, base (/yachts-promo), i18n, integrations
├─ tailwind.config.mjs       # design tokens (mirror of global.css)
├─ tsconfig.json
├─ package.json
├─ public/
│  ├─ robots.txt
│  ├─ favicon.svg
│  ├─ og/                     # OG image slot (add og-image.jpg, 1200×630)
│  └─ media/                  # real yacht photos/video go here (see README inside)
├─ src/
│  ├─ styles/global.css       # CSS custom-property tokens + base layer
│  ├─ i18n/
│  │  ├─ en.json de.json fr.json es.json pl.json   # 144 leaf keys each (en is canonical)
│  │  └─ utils.ts             # useTranslations(), getLocaleFromUrl(), withBase(), localizedPath()
│  ├─ data/
│  │  ├─ yachts.ts            # 3 yachts (aurora / festa / serenite) + specs
│  │  └─ site.ts              # brand, contact, social, formEndpoint, ga4Id, ogImage
│  ├─ layouts/BaseLayout.astro# <head>, Consent Mode default-DENY, fonts, skip-link, Lenis init
│  ├─ components/             # 21 components (Nav, Hero, FleetTeaser, ExperienceScroll, …)
│  ├─ scripts/                # lenis.ts, animations.ts, consent.ts, analytics.ts
│  └─ pages/
│     ├─ index.astro          # "/" → best locale (Accept-Language) + no-JS meta refresh
│     ├─ [lang]/index.astro   # one-page cinematic home
│     ├─ [lang]/fleet/[slug].astro
│     ├─ [lang]/privacy.astro
│     └─ [lang]/cookies.astro
├─ .github/workflows/deploy.yml
└─ .gitignore
```

### Pages produced (30 total)
- 5 home pages (one per locale)
- 15 fleet pages (5 locales × 3 yachts)
- 5 privacy + 5 cookies legal pages
- 1 root redirect

---

## ⚠️ What to replace before go-live (`[[PLACEHOLDER]]`)

Everything below is an unfilled placeholder. Search the repo for `[[` to find them all.

### 1. Brand & contact — `src/data/site.ts`
| Field | Placeholder | What to put |
|-------|-------------|-------------|
| `brand` | `MARÉ` | your brand name (also update `MAR<span>É</span>` wordmark in `src/components/Nav.astro` if it changes) |
| `tagline` | `Stories the sea remembers.` | your slogan |
| `contact.email` | `[[EMAIL]]` | public contact email |
| `contact.phone` | `[[PHONE]]` | phone (E.164, e.g. `+48…`) |
| `contact.address` | `[[ADDRESS]]` | physical address |
| `social.instagram/facebook/youtube/linkedin` | `[[SOCIAL_*]]` | full profile URLs (blanks auto-hide in Footer/JSON-LD) |
| `formEndpoint` | `[[FORM_ENDPOINT]]` | Web3Forms / Formspree POST URL (see below) |
| `ga4Id` | `[[GA4_MEASUREMENT_ID]]` | GA4 ID `G-XXXXXXXXXX` (see below) |
| `ogImage` | `og/og-image.jpg` | path is set; add the actual file (see Media) |

### 2. GA4 measurement ID
Set `ga4Id` in `src/data/site.ts` to your `G-XXXXXXXXXX`. Analytics stay **off**
until the visitor accepts analytics cookies (Consent Mode v2 default-DENY is injected
in `BaseLayout.astro` before anything else). No code change beyond the ID is needed.

### 3. Contact-form endpoint
Set `formEndpoint` in `src/data/site.ts` to your serverless endpoint:
- **Web3Forms:** `https://api.web3forms.com/submit` (and add a hidden `access_key` input in `src/components/ContactForm.astro`).
- **Formspree:** `https://formspree.io/f/yourid`.

While the endpoint is still `[[FORM_ENDPOINT]]`, the form runs in **demo mode**:
it validates, shows the success state and fires `generate_lead`, but does **not** send a network request.

### 4. Media — `public/media/` and `public/og/`
The site currently renders **elegant gradient placeholders** everywhere (no media files
ship). Drop real files in to replace them (graceful: missing files keep the gradients):
- `public/og/og-image.jpg` — social-share image, **1200×630**.
- `public/media/hero.mp4`, `hero.webm`, `hero-poster.jpg` — hero background video + poster.
- `public/media/yachts/<slug>-hero.jpg` and `<slug>-01..04.jpg` for each slug
  (`aurora`, `festa`, `serenite`). Paths are listed in `src/data/yachts.ts`.

### 5. Company data in legal pages — `src/i18n/*.json` (`legal.*`)
Localized GDPR/RODO templates. Fill **in every locale file** (en/de/fr/es/pl):
| Placeholder | Meaning |
|-------------|---------|
| `[[COMPANY_NAME]]` | legal company name |
| `[[COMPANY_ADDRESS]]` | registered address |
| `[[COMPANY_TAX_ID]]` | NIP / KRS / VAT id |
| `[[COMPANY_EMAIL]]` | data-protection contact email |
| `[[SUPERVISORY_AUTHORITY]]` | supervisory authority (e.g. UODO in PL) |
| `[[PLACEHOLDER — date]]` | "last updated" date |
| `[[PLACEHOLDER — retention period]]` | data retention period |
| `[[PLACEHOLDER — list of … cookies]]` | concrete cookie lists per category |

### 6. Editorial placeholders in copy — `src/i18n/*.json`
- `craft.points[1]` — `CE certification [[PLACEHOLDER]]` → real CE class / cert number.
- `testimonials.items[].author` / `.role` — `[[PLACEHOLDER — owner name]]` → real (consented) attributions, or keep anonymized.

> After editing the dictionaries, keep all 5 locales at the **same key set**. A parity
> check confirms it (de/fr/es/pl must match `en.json` exactly — currently 144 keys each).

---

## Design system

All values live as CSS custom properties in `src/styles/global.css` and are mirrored
into Tailwind in `tailwind.config.mjs`. **Use only this scale — no magic pixels.**
- Colours: `ink-900..600` (ocean depth), `sand-100..300` (paper/light), `coral-500/600`
  (CTA), `lagoon-400/500` (interactive), `slate-500`, `line`.
- All text/accent pairs meet **WCAG AA** on dark (verified: sand-100 16.3:1, coral CTA
  6.6:1, lagoon overline 11.2:1, slate helper 4.99:1).
- Fonts: Fraunces (display), Plus Jakarta Sans (UI), Space Mono (technical labels) —
  `font-display: swap`, preconnected.
- Fluid type (`--fs-*` clamp), 8pt spacing (`--space-1..12`), radius/shadow/glow/motion tokens.

Motion is fully gated behind `prefers-reduced-motion` (Lenis off, GSAP no-ops, content
always visible without JS).

---

## Privacy & analytics

- **Consent Mode v2** default = DENY (ad_storage / ad_user_data / ad_personalization /
  analytics_storage), injected in `<head>` before any script (`BaseLayout.astro`).
- Custom cookie banner + settings modal (`CookieConsent.astro` + `scripts/consent.ts`):
  Necessary (locked on) / Analytics / Marketing, choice stored in `localStorage` + cookie.
- GA4 (`scripts/analytics.ts`) loads **only after** analytics consent, then maps events:
  `page_view`, `view_yacht`, `cta_click`, `generate_lead`, `language_switch`,
  `scroll_depth` (25/50/75/100), `video_play`, `gallery_open`.
- "Cookie settings" link in the footer re-opens the modal.

---

## SEO

Per-locale `<title>` + description; OG + Twitter cards; **hreflang for all 5 locales +
`x-default`**; base-aware absolute canonical; `@astrojs/sitemap`; `robots.txt`;
JSON-LD `Organization` (always) + `Product` per yacht. All in `src/components/Seo.astro`.

---

## Deploy — GitHub Pages

The repo ships `.github/workflows/deploy.yml` (build with `withastro/action@v3` →
`actions/deploy-pages@v4`). It triggers on push to `main`.

1. Push to `PFLGroup/yachts-promo` (`main`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions** (one-time).
   Equivalent via CLI: `gh api -X POST repos/PFLGroup/yachts-promo/pages -f build_type=workflow`.
3. The workflow builds and publishes. Live at **https://pflgroup.github.io/yachts-promo/**.

### Base path
This is a **project** Pages site, so it serves under `/yachts-promo/`. `astro.config.mjs`
sets `base: '/yachts-promo'` and every internal link/asset goes through `withBase()` /
`localizedPath()`. **Do not** hardcode root-relative paths.

### Custom domain (optional)
To serve at a bare domain: in `astro.config.mjs` set `site` to the domain and
`base: '/'`, add `public/CNAME` with the domain, then configure the domain in
Pages settings.
