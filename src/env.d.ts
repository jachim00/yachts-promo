/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// =========================================================================
// Global type contracts shared across layers.
//  - gtag / dataLayer: set up by BaseLayout's Consent Mode v2 inline script.
//  - yachtsAnalytics: defined by Builder Systems (src/scripts/analytics.ts),
//    called defensively by Builder Frontend via window.yachtsAnalytics?.track().
// =========================================================================

interface YachtsAnalytics {
  /** Safe no-op until analytics consent is granted. */
  track(event: string, params?: Record<string, unknown>): void;
}

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  yachtsAnalytics?: YachtsAnalytics;
}
