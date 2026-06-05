// =========================================================================
// analytics.ts — GA4 (gtag) loader gated on consent + the global tracking API.
//
// Flow:
//  1. BaseLayout already set Consent Mode default = DENY and a gtag() shim.
//  2. consent.ts persists the visitor's choice and fires 'consent-updated'.
//  3. This module listens for that event; the FIRST time analytics is granted
//     it injects the GA4 script (site.ga4Id) and configures it. Consent Mode
//     ensures no cookies are written until storage is granted.
//  4. window.yachtsAnalytics.track(event, params) is ALWAYS safe to call:
//     - events are pushed via gtag (queued on dataLayer if GA4 not loaded yet),
//     - if analytics consent is absent, calls are silently dropped.
//
// The window.dataLayer / window.gtag / window.yachtsAnalytics types come from
// the shared contract in src/env.d.ts (Foundation) — we do NOT re-declare them.
// Builder Frontend only CALLS window.yachtsAnalytics?.track(...) — defined here.
// =========================================================================
import { site } from '../data/site';
import { CONSENT_EVENT, analyticsGranted, type ConsentRecord } from './consent';

// ---- Event contract (section 10) ----------------------------------------
export type AnalyticsEvent =
  | 'page_view'
  | 'view_yacht'
  | 'cta_click'
  | 'generate_lead'
  | 'language_switch'
  | 'scroll_depth'
  | 'video_play'
  | 'gallery_open';

const GA4_ID = site.ga4Id;
/** Treat unreplaced placeholder as "no real ID configured". */
const GA4_CONFIGURED = !!GA4_ID && !GA4_ID.includes('[[') && /^G-/.test(GA4_ID);

let ga4Loaded = false;

/** Inject the GA4 gtag library exactly once. Caller guarantees consent. */
function loadGa4(): void {
  if (ga4Loaded || !GA4_CONFIGURED || typeof document === 'undefined') return;
  ga4Loaded = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(s);

  // gtag() shim + dataLayer already exist (BaseLayout). Configure GA4.
  window.gtag?.('js', new Date());
  window.gtag?.('config', GA4_ID, {
    anonymize_ip: true,
    // We fire page_view manually so SPA-style navigations stay consistent.
    send_page_view: false,
  });

  // Initial page_view once GA4 is live.
  track('page_view', {
    page_location: location.href,
    page_title: document.title,
  });
}

/**
 * Send an event. Always safe:
 *  - drops the call if analytics consent is not granted,
 *  - otherwise pushes through gtag (queued on dataLayer until GA4 loads).
 * Accepts the section-10 event names (or any string, to satisfy the shared
 * window.yachtsAnalytics contract).
 */
function track(event: AnalyticsEvent | string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  if (!analyticsGranted()) return; // respect consent
  if (!GA4_CONFIGURED) return; // nothing to send to
  window.gtag?.('event', event, params);
}

// ---- Convenience helpers (named events; thin wrappers over track) --------
export const yachtsEvents = {
  viewYacht: (yachtName: string) => track('view_yacht', { yacht_name: yachtName }),
  ctaClick: (locationLabel: string) => track('cta_click', { location: locationLabel }),
  generateLead: (params: Record<string, unknown> = {}) => track('generate_lead', params),
  languageSwitch: (lang: string) => track('language_switch', { lang }),
  videoPlay: (params: Record<string, unknown> = {}) => track('video_play', params),
  galleryOpen: (params: Record<string, unknown> = {}) => track('gallery_open', params),
};

// ---- Scroll depth (25/50/75/100) ----------------------------------------
const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;
const firedScroll = new Set<number>();

function onScroll(): void {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return;
  const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
  for (const tHold of SCROLL_THRESHOLDS) {
    if (pct >= tHold && !firedScroll.has(tHold)) {
      firedScroll.add(tHold);
      track('scroll_depth', { percent: tHold });
    }
  }
}

let scrollBound = false;
function bindScrollDepth(): void {
  if (scrollBound) return;
  scrollBound = true;
  window.addEventListener('scroll', onScroll, { passive: true });
  // Evaluate once in case the page is short / already scrolled.
  onScroll();
}

// ---- Public global API ---------------------------------------------------
function installApi(): void {
  if (window.yachtsAnalytics) return;
  // Matches the shared YachtsAnalytics contract (src/env.d.ts): { track }.
  window.yachtsAnalytics = { track };
}

/** Boot analytics infrastructure (call once per page). */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  installApi();

  // React to consent decisions: load GA4 + scroll tracking when analytics is on.
  const onConsent = (e: Event) => {
    const detail = (e as CustomEvent<ConsentRecord>).detail;
    if (detail?.analytics || analyticsGranted()) {
      loadGa4();
      bindScrollDepth();
    }
  };
  window.addEventListener(CONSENT_EVENT, onConsent);

  // If consent was already granted on a previous visit, boot immediately.
  if (analyticsGranted()) {
    loadGa4();
    bindScrollDepth();
  }
}

// Self-initialize when imported as a module script.
initAnalytics();

export { track };
