// =========================================================================
// DATA CONTRACT — yachts.
// This file holds ONLY structured/numeric data, media slots and identifiers.
// All prose (tagline / story / idealFor) lives in i18n under yachts.<slug>.*
// so it can be translated for all 5 locales. Read those via:
//   const t = useTranslations(lang);
//   t(`yachts.${yacht.slug}.tagline`)
//   t(`yachts.${yacht.slug}.story`)
//   t(`yachts.${yacht.slug}.idealFor`)
// Spec labels (LOA, Beam, …) live in i18n under yachtsCommon.*.
//
// Spec figures are placeholders from section 7.1 and marked indicative.
// =========================================================================

export interface YachtSpec {
  loa: string;
  beam: string;
  draft: string;
  guests: string;
  cabins?: string;
  range?: string;
  speed?: string;
  sundeck?: string;
  propulsion: string;
}

export type YachtSlug = 'aurora' | 'festa' | 'serenite';

export interface Yacht {
  slug: YachtSlug;
  name: string;
  /** Sort order within the fleet (ascending). */
  order: number;
  spec: YachtSpec;
  /**
   * Placeholder hero media path (relative to /public, joined with base via
   * withBase() at render time). Replace with real media when available.
   */
  heroPlaceholder: string;
  /** Gallery media paths (relative to /public). Empty-friendly placeholders. */
  gallery: string[];
  /** i18n namespace root for this yacht's prose, e.g. 'yachts.aurora'. */
  i18nKey: string;
}

// NOTE: media paths are slots — files may not exist yet. Components must use
// withBase() and render an elegant gradient/placeholder when missing.
const fleet: Yacht[] = [
  {
    slug: 'aurora',
    name: 'MARÉ Aurora',
    order: 1,
    spec: {
      loa: '14.2 m',
      beam: '4.3 m',
      draft: '1.1 m',
      guests: '6',
      cabins: '2',
      range: '320 nm',
      propulsion: '2× 180 kW hybrid',
    },
    heroPlaceholder: 'media/yachts/aurora-hero.jpg',
    gallery: [
      'media/yachts/aurora-01.jpg',
      'media/yachts/aurora-02.jpg',
      'media/yachts/aurora-03.jpg',
      'media/yachts/aurora-04.jpg',
    ],
    i18nKey: 'yachts.aurora',
  },
  {
    slug: 'festa',
    name: 'MARÉ Festa',
    order: 2,
    spec: {
      loa: '11.8 m',
      beam: '4.0 m',
      draft: '0.9 m',
      guests: '12',
      sundeck: '18 m²',
      speed: '24 kn',
      propulsion: '2× 220 kW',
    },
    heroPlaceholder: 'media/yachts/festa-hero.jpg',
    gallery: [
      'media/yachts/festa-01.jpg',
      'media/yachts/festa-02.jpg',
      'media/yachts/festa-03.jpg',
      'media/yachts/festa-04.jpg',
    ],
    i18nKey: 'yachts.festa',
  },
  {
    slug: 'serenite',
    name: 'MARÉ Sérénité',
    order: 3,
    spec: {
      loa: '12.6 m',
      beam: '4.1 m',
      draft: '1.0 m',
      guests: '4 (+2)',
      cabins: '1 master',
      range: '180 nm',
      propulsion: 'Silent electric',
    },
    heroPlaceholder: 'media/yachts/serenite-hero.jpg',
    gallery: [
      'media/yachts/serenite-01.jpg',
      'media/yachts/serenite-02.jpg',
      'media/yachts/serenite-03.jpg',
      'media/yachts/serenite-04.jpg',
    ],
    i18nKey: 'yachts.serenite',
  },
];

/** Fleet, sorted ascending by `order`. */
export const yachts: Yacht[] = [...fleet].sort((a, b) => a.order - b.order);

/** Lookup a yacht by slug. Returns undefined when not found. */
export function getYacht(slug: string): Yacht | undefined {
  return yachts.find((y) => y.slug === slug);
}
