// =========================================================================
// DATA CONTRACT — yachts (inflatable, portable drop-stitch platforms).
// This file holds ONLY structured/numeric data, media slots and identifiers.
// All prose (tagline / story / idealFor / label) lives in i18n under
// yachts.<slug>.* so it can be translated for all 5 locales. Read those via:
//   const t = useTranslations(lang);
//   t(`yachts.${yacht.slug}.tagline`)
//   t(`yachts.${yacht.slug}.story`)
//   t(`yachts.${yacht.slug}.idealFor`)
//   t(`yachts.${yacht.slug}.label`)
// Spec labels (deckLengthInflated, beamInflated, …) live in i18n under
// yachtsCommon.*.
//
// PRODUCT = a premium, high-pressure INFLATABLE yacht / floating platform made
// from drop-stitch (double-layer PVC). It pumps up in minutes, feels rigid on
// the water, and folds into the boot of a car — no marina, no trailer.
//
// Spec figures are EXAMPLES from PROMPT v2 §4.1 and marked indicative /
// [[PLACEHOLDER]] until the owner confirms the real numbers.
// =========================================================================

export interface YachtSpec {
  /** Deck length once inflated, e.g. "5.8 m". */
  deckLengthInflated: string;
  /** Beam (width) once inflated, e.g. "2.4 m". */
  beamInflated: string;
  /** Packed dimensions, e.g. "2 bags, 120 × 60 × 40 cm". */
  packedSize: string;
  /** Total weight (may split into modules), e.g. "95 kg". */
  totalWeight: string;
  /** People / load capacity, e.g. "up to 8 people / 1000 kg". */
  capacity: string;
  /** Working pressure, e.g. "0.8–1.0 bar". */
  workingPressure: string;
  /** Inflation time, e.g. "~20 min (electric pump)". */
  inflationTime: string;
  /** Material / construction. */
  material: string;
  /** Drive / propulsion option. */
  drive: string;
  /** What's in the box. */
  included: string;
}

export type YachtSlug = 'festa' | 'aurora' | 'serenite';

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
  /** i18n namespace root for this yacht's prose, e.g. 'yachts.festa'. */
  i18nKey: string;
}

// NOTE: media paths are slots — files may not exist yet. Components must use
// withBase() and render an elegant gradient/placeholder when missing.
// All spec VALUES below are indicative examples — [[PLACEHOLDER]] until the
// owner confirms the real figures for each configuration.
const fleet: Yacht[] = [
  {
    // MARÉ Festa — the stage platform (largest; a day with friends/family).
    slug: 'festa',
    name: 'MARÉ Festa',
    order: 1,
    spec: {
      deckLengthInflated: '5.8 m [[PLACEHOLDER]]',
      beamInflated: '2.4 m [[PLACEHOLDER]]',
      packedSize: '2 bags, 120 × 60 × 40 cm [[PLACEHOLDER]]',
      totalWeight: '95 kg [[PLACEHOLDER]]',
      capacity: 'up to 8 people / 1000 kg [[PLACEHOLDER]]',
      workingPressure: '0.8–1.0 bar [[PLACEHOLDER]]',
      inflationTime: '~20 min (electric pump) [[PLACEHOLDER]]',
      material: 'Fusion drop-stitch, PVC 0.5 + 0.9 mm, Silvertex upholstery [[PLACEHOLDER]]',
      drive: 'Silent electric motor / oars / own outboard [[PLACEHOLDER]]',
      included: 'High-pressure pump, carry bags, repair kit, faux-teak deck [[PLACEHOLDER]]',
    },
    heroPlaceholder: 'media/fleet/model-festa.jpg',
    gallery: [
      'media/gallery/side-profile.jpg',
      'media/gallery/cockpit-topdown.jpg',
      'media/life/family-slide.jpg',
      'media/life/friends-sunset.jpg',
    ],
    i18nKey: 'yachts.festa',
  },
  {
    // MARÉ Aurora — go anywhere (most compact, lightest to transport).
    slug: 'aurora',
    name: 'MARÉ Aurora',
    order: 2,
    spec: {
      deckLengthInflated: '4.6 m [[PLACEHOLDER]]',
      beamInflated: '2.0 m [[PLACEHOLDER]]',
      packedSize: '1 bag, 110 × 55 × 35 cm [[PLACEHOLDER]]',
      totalWeight: '62 kg [[PLACEHOLDER]]',
      capacity: 'up to 4 people / 500 kg [[PLACEHOLDER]]',
      workingPressure: '0.8–1.0 bar [[PLACEHOLDER]]',
      inflationTime: '~12 min (electric pump) [[PLACEHOLDER]]',
      material: 'Fusion drop-stitch, PVC 0.5 + 0.9 mm, Silvertex upholstery [[PLACEHOLDER]]',
      drive: 'Silent electric motor / oars / own outboard [[PLACEHOLDER]]',
      included: 'High-pressure pump, carry bag, repair kit, faux-teak deck [[PLACEHOLDER]]',
    },
    heroPlaceholder: 'media/fleet/model-aurora.jpg',
    gallery: [
      'media/gallery/side-profile.jpg',
      'media/gallery/bow-detail.jpg',
      'media/life/couple-relax.jpg',
      'media/life/swim-ladder.jpg',
    ],
    i18nKey: 'yachts.aurora',
  },
  {
    // MARÉ Sérénité — a refuge on the water (relaxation, silent electric).
    slug: 'serenite',
    name: 'MARÉ Sérénité',
    order: 3,
    spec: {
      deckLengthInflated: '5.2 m [[PLACEHOLDER]]',
      beamInflated: '2.2 m [[PLACEHOLDER]]',
      packedSize: '2 bags, 115 × 58 × 38 cm [[PLACEHOLDER]]',
      totalWeight: '80 kg [[PLACEHOLDER]]',
      capacity: 'up to 6 people / 750 kg [[PLACEHOLDER]]',
      workingPressure: '0.8–1.0 bar [[PLACEHOLDER]]',
      inflationTime: '~16 min (electric pump) [[PLACEHOLDER]]',
      material: 'Fusion drop-stitch, PVC 0.5 + 0.9 mm, Silvertex upholstery [[PLACEHOLDER]]',
      drive: 'Silent electric motor [[PLACEHOLDER]]',
      included: 'High-pressure pump, carry bags, repair kit, faux-teak deck [[PLACEHOLDER]]',
    },
    heroPlaceholder: 'media/fleet/model-serenite.jpg',
    gallery: [
      'media/gallery/side-profile.jpg',
      'media/gallery/arch-detail.jpg',
      'media/life/couple-relax.jpg',
      'media/craft/deck-detail.jpg',
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

/** Ordered list of spec field keys → i18n label keys (used by SpecGrid/Tabs). */
export const specOrder: Array<{ key: keyof YachtSpec; labelKey: string }> = [
  { key: 'deckLengthInflated', labelKey: 'yachtsCommon.deckLengthInflated' },
  { key: 'beamInflated', labelKey: 'yachtsCommon.beamInflated' },
  { key: 'capacity', labelKey: 'yachtsCommon.capacity' },
  { key: 'totalWeight', labelKey: 'yachtsCommon.totalWeight' },
  { key: 'packedSize', labelKey: 'yachtsCommon.packedSize' },
  { key: 'workingPressure', labelKey: 'yachtsCommon.workingPressure' },
  { key: 'inflationTime', labelKey: 'yachtsCommon.inflationTime' },
  { key: 'material', labelKey: 'yachtsCommon.material' },
  { key: 'drive', labelKey: 'yachtsCommon.drive' },
  { key: 'included', labelKey: 'yachtsCommon.included' },
];
