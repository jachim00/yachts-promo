# CLAUDE.md — projekt `yachts-promo` (MARÉ)

Kontekst dla Claude przy pracy nad tym projektem. Czytaj przed zmianami.

## Czym jest

Kinowa, wielojęzyczna (EN/DE/FR/ES/PL), **statyczna** strona promocyjna jachtów
o charakterze storytellingu lead-gen (nie e-commerce). Marka robocza **MARÉ**,
slogan *„Stories the sea remembers."*. Cel: emocja → kontakt (miękkie CTA), nie sprzedaż.
Budowana zespołowo (Foundation → Frontend → Systems → Integrator) wg
`D:\Automatyzacje\Landing Page\PROMPT-Claude-Code-yachts-promo.md`.

## Lokalizacja

- **Kod:** `D:\Automatyzacje\Landing Page\Projekty\yachts-promo\`
- **Repo:** `Jachim00/yachts-promo` (GitHub, publiczne)
- **Hosting:** GitHub Pages (GitHub Actions), URL **https://Jachim00.github.io/yachts-promo/**
- Zgodne z konwencją innych landingów usera (statyczne na GH Pages — patrz pamięć
  `feedback_landing_hosting_github_pages`, `project_restauracja_different_landing`).

## Stack

Astro 5 (static) · Tailwind 3.4 (`@astrojs/tailwind` ^6) · TypeScript strict ·
GSAP + ScrollTrigger · Lenis · `@astrojs/sitemap` · sharp. GA4 + Consent Mode v2.
Formularz: Web3Forms/Formspree (endpoint w configu, demo-mode gdy pusty).

**Odstępstwa od briefu (zamierzone, build zielony):** Tailwind v3.4 (nie v4 `@theme`);
pakiet `lenis` (nie `@studio-freight/lenis`); `prefixDefaultLocale:true` → EN też pod `/en`,
`/` redirectuje do najlepszego locale.

## Struktura i kontrakty (zamrożone)

- `src/i18n/utils.ts` — `useTranslations()`, `getEntry()`, `getLocaleFromUrl()`,
  `withBase()`, `localizedPath()`. **Wszystkie** linki/assety przez `withBase`/`localizedPath`
  (krytyczne dla `base: /yachts-promo`). Wszystkie teksty przez `t()` — zero zaszytych stringów.
- `src/i18n/{en,de,fr,es,pl}.json` — `en.json` = kanon. **Parytet: dokładnie 144 leaf-keys
  w każdym locale** (zweryfikowane skryptem). Nie dodawaj/usuwaj kluczy w jednym locale bez
  pozostałych — łamie parytet i SEO hreflang spójność.
- `src/data/yachts.ts` — 3 jachty (`aurora`/`festa`/`serenite`), specy z sekcji 7.1;
  proza/tagline w i18n.
- `src/data/site.ts` — marka, kontakt, social, `formEndpoint`, `ga4Id`, `ogImage` (placeholdery).
- `src/layouts/BaseLayout.astro` — `<head>`, **Consent Mode default-DENY** (przed czymkolwiek),
  fonty, skip-link, init Lenis (przez `scripts/lenis.ts initLenis()` — jedna instancja na `window.__lenis`).
- `src/components/Seo.astro` — canonical (base-aware), hreflang 5 + x-default, OG/Twitter,
  JSON-LD Organization (+ opcjonalny Product per jacht).
- Wyspy JS: `scripts/animations.ts` (GSAP, gated `prefers-reduced-motion`),
  `scripts/consent.ts` + `scripts/analytics.ts` (GA4 dopiero po zgodzie).

Struktura plików = sekcja 13 briefu. Nie dodawaj plików poza tą strukturą.

## Status (2026-06-05)

**COMPLETE — production-ready, wdrożony na GitHub Pages.**
- `npm run build` ✅ czysto (30 stron). `astro check` = 0 errors / 0 warnings / 2 hints
  (kosmetyczne `Props declared but never used` w Reveal/SectionHeader — to kontrakt typów
  `Astro.props`, NIE martwy kod; usunięcie pogarsza typowanie).
- i18n parytet 5×144 ✅. Kontrast WCAG AA ✅ (wszystkie pary kolor/tło ≥4.5:1).
- Cookie consent + Consent Mode v2 + GA4-po-zgodzie ✅. SEO hreflang+canonical+sitemap+JSON-LD ✅.
- Formularz lead-gen waliduje + demo-mode ✅. Preview pod base sprawdzony ✅.

## Placeholdery do podmiany przez właściciela

Pełna lista i instrukcja w `README.md` (sekcja „What to replace before go-live").
W skrócie: `site.ts` (brand/kontakt/social/`formEndpoint`/`ga4Id`/`ogImage`), media w
`public/media` + `public/og`, dane firmy w `legal.*` we wszystkich 5 `i18n/*.json`
(`[[COMPANY_NAME/ADDRESS/TAX_ID/EMAIL]]`, `[[SUPERVISORY_AUTHORITY]]`, daty, retencja,
listy cookies), CE cert w `craft.points`, atrybucje w `testimonials.items`.

## Gotchas

- Project Pages = `base: /yachts-promo`. Nigdy nie hardcode'uj ścieżek root-relative.
- Po edycji i18n trzymaj parytet 5 locali (skrypt parytetu — uruchamiany spoza drzewa repo,
  żeby nie zaśmiecać struktury z sekcji 13).
- GA4 nie ładuje się dopóki user nie zaakceptuje analityki — to celowe (RODO).
- Media to gradientowe placeholdery; brak realnych plików degraduje się łagodnie (gradient zostaje).
- Custom domena: w `astro.config.mjs` ustaw `site`=domena + `base:'/'`, dodaj `public/CNAME`.
