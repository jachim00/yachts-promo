// =========================================================================
// consent.ts — GDPR/RODO consent state + Google Consent Mode v2 bridge.
//
// Responsibilities (Builder Systems owns this module):
//  - Read/write the visitor's choice to localStorage AND a first-party cookie,
//    stamped with a policy version + date so we can re-prompt on policy change.
//  - Map our 3 UI categories (necessary / analytics / marketing) to the
//    Consent Mode v2 signals and push gtag('consent','update', …).
//  - Emit a 'consent-updated' CustomEvent so analytics.ts can lazily load GA4.
//  - Provide a tiny API the CookieConsent component imports (no DOM here).
//
// Necessary is ALWAYS granted (it is not real consent — it keeps the site
// working) and is never written as "denied". Default before any choice is
// DENY for analytics + marketing (Consent Mode default is set in BaseLayout).
// =========================================================================

/** Bump when the cookie/privacy policy materially changes → re-prompts users. */
export const CONSENT_VERSION = 1;

/** localStorage + cookie key. */
const STORAGE_KEY = 'mare_consent';

/** Cookie lifetime in days (EU guidance: ~6–12 months; we use 6). */
const COOKIE_MAX_AGE_DAYS = 182;

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentChoice {
  necessary: true; // always on
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentRecord extends ConsentChoice {
  /** Policy version this choice was made against. */
  v: number;
  /** ISO timestamp of the decision. */
  date: string;
}

/** Event name fired (on window) whenever a valid consent state is applied. */
export const CONSENT_EVENT = 'consent-updated';

/** Event name the footer / legal pages dispatch to reopen the settings modal. */
export const OPEN_SETTINGS_EVENT = 'open-cookie-settings';

// window.dataLayer / window.gtag types are provided by the shared contract in
// src/env.d.ts (set up by BaseLayout's inline Consent Mode bootstrap). We do
// not re-declare them here to avoid clashing modifiers.

// ---------------------------------------------------------------------------
// Low-level persistence
// ---------------------------------------------------------------------------

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string, maxAgeDays: number): void {
  if (typeof document === 'undefined') return;
  const maxAge = Math.round(maxAgeDays * 24 * 60 * 60);
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function safeParse(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Partial<ConsentRecord>;
    if (typeof obj !== 'object' || obj === null) return null;
    if (obj.v !== CONSENT_VERSION) return null; // stale → re-prompt
    return {
      necessary: true,
      analytics: Boolean(obj.analytics),
      marketing: Boolean(obj.marketing),
      v: CONSENT_VERSION,
      date: typeof obj.date === 'string' ? obj.date : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public read API
// ---------------------------------------------------------------------------

/**
 * Returns the stored consent record, or null if the visitor has not chosen yet
 * (or the stored policy version is outdated). localStorage is primary; the
 * cookie is the fallback (e.g. when storage is cleared but the cookie remains).
 */
export function getStoredConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  let fromLs: string | null = null;
  try {
    fromLs = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    fromLs = null; // storage may be blocked
  }
  return safeParse(fromLs) ?? safeParse(readCookie(STORAGE_KEY));
}

/** True when a valid (current-version) choice exists → banner stays hidden. */
export function hasDecided(): boolean {
  return getStoredConsent() !== null;
}

/** Convenience: has the visitor granted analytics? */
export function analyticsGranted(): boolean {
  return getStoredConsent()?.analytics === true;
}

// ---------------------------------------------------------------------------
// Consent Mode v2 bridge
// ---------------------------------------------------------------------------

/**
 * Push a Consent Mode v2 update derived from a choice. Safe to call even if
 * gtag is missing (the dataLayer shim from BaseLayout is enough; values are
 * queued). Marketing maps to the ad_* signals, analytics to analytics_storage.
 */
export function applyConsentMode(choice: ConsentChoice): void {
  if (typeof window === 'undefined') return;
  const grant = (b: boolean) => (b ? 'granted' : 'denied');
  const update = {
    analytics_storage: grant(choice.analytics),
    ad_storage: grant(choice.marketing),
    ad_user_data: grant(choice.marketing),
    ad_personalization: grant(choice.marketing),
  };
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', update);
  } else {
    // Fallback: queue directly on dataLayer in gtag's argument shape.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(['consent', 'update', update]);
  }
}

// ---------------------------------------------------------------------------
// Public write API
// ---------------------------------------------------------------------------

/**
 * Persist a choice (localStorage + cookie, versioned & dated), push the
 * Consent Mode update, and emit CONSENT_EVENT with the record so analytics.ts
 * can react (e.g. load GA4 when analytics is granted).
 */
export function saveConsent(choice: ConsentChoice): ConsentRecord {
  const record: ConsentRecord = {
    necessary: true,
    analytics: Boolean(choice.analytics),
    marketing: Boolean(choice.marketing),
    v: CONSENT_VERSION,
    date: new Date().toISOString(),
  };
  const serialized = JSON.stringify(record);
  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    /* storage blocked — cookie still carries the choice */
  }
  writeCookie(STORAGE_KEY, serialized, COOKIE_MAX_AGE_DAYS);

  applyConsentMode(record);

  window.dispatchEvent(
    new CustomEvent<ConsentRecord>(CONSENT_EVENT, { detail: record }),
  );
  return record;
}

/** Accept every category. */
export function acceptAll(): ConsentRecord {
  return saveConsent({ necessary: true, analytics: true, marketing: true });
}

/** Reject every non-essential category. */
export function rejectAll(): ConsentRecord {
  return saveConsent({ necessary: true, analytics: false, marketing: false });
}

/**
 * On every page load: if a valid choice already exists, re-assert it into
 * Consent Mode (the inline default ran first) and emit CONSENT_EVENT so
 * analytics can boot. Returns the record (or null if undecided).
 */
export function initConsent(): ConsentRecord | null {
  const stored = getStoredConsent();
  if (stored) {
    applyConsentMode(stored);
    window.dispatchEvent(
      new CustomEvent<ConsentRecord>(CONSENT_EVENT, { detail: stored }),
    );
  }
  return stored;
}

/** Ask the UI (CookieConsent component) to reopen the settings modal. */
export function openSettings(): void {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}
