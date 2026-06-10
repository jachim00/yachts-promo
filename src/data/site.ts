// =========================================================================
// SITE CONTRACT — brand, contact, social, integrations.
// Foundation defines the SHAPE and exports with placeholders.
// Builder Systems fills the real values (and may extend social links).
// Replace every [[PLACEHOLDER]] before going live.
// =========================================================================

export interface SiteContact {
  email: string;
  phone: string;
  address: string;
}

export interface SiteSocial {
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
}

export interface SiteConfig {
  brand: string;
  tagline: string;
  url: string;
  contact: SiteContact;
  social: SiteSocial;
  /** Serverless form endpoint (Web3Forms / Formspree). */
  formEndpoint: string;
  /** GA4 measurement ID, e.g. G-XXXXXXXXXX. */
  ga4Id: string;
  /** Open Graph image path (relative to /public, join with withBase()). */
  ogImage: string;
}

export const site: SiteConfig = {
  brand: 'MARÉ',
  tagline: 'The sea, wherever you take it.',
  url: 'https://pflgroup.github.io/yachts-promo',
  contact: {
    // Replace before launch with the real channels.
    email: '[[EMAIL]]',
    phone: '[[PHONE]]',
    address: '[[ADDRESS]]',
  },
  social: {
    // Full profile URLs (https://…). Empty-friendly: components hide blanks.
    instagram: '[[SOCIAL_INSTAGRAM]]',
    facebook: '[[SOCIAL_FACEBOOK]]',
    youtube: '[[SOCIAL_YOUTUBE]]',
    linkedin: '[[SOCIAL_LINKEDIN]]',
  },
  // Serverless form endpoint (Web3Forms / Formspree). Set before go-live.
  formEndpoint: '[[FORM_ENDPOINT]]',
  // GA4 measurement ID, e.g. G-XXXXXXXXXX. Analytics stay off until consent.
  ga4Id: '[[GA4_MEASUREMENT_ID]]',
  // Relative to /public — consumers join with withBase('media/og/og-default.jpg').
  // Slot file lives in public/media/og/ (1200×630).
  ogImage: 'media/og/og-default.jpg',
};
