// =========================================================================
// i18n CONTRACT — single source for translation lookup + path helpers.
// Foundation owns these signatures; no other agent changes them (only the
// Integrator may, and only to fix a build).
//
// Usage in any .astro page/component:
//   import { useTranslations, getLocaleFromUrl, localizedPath, withBase } from '../i18n/utils';
//   const lang = getLocaleFromUrl(Astro.url);
//   const t = useTranslations(lang);
//   t('hero.headline')                        // -> string
//   localizedPath('de', 'fleet/aurora')       // -> /yachts-promo/de/fleet/aurora
//   withBase('media/hero.jpg')                // -> /yachts-promo/media/hero.jpg
// =========================================================================

import en from './en.json';
import de from './de.json';
import fr from './fr.json';
import es from './es.json';
import pl from './pl.json';

/** Supported locales. `en` is the default and IS prefixed in URLs. */
export const locales = ['en', 'de', 'fr', 'es', 'pl'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Static dictionary registry. en.json is the canonical key contract. */
const dictionaries: Record<Locale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  de: de as Record<string, unknown>,
  fr: fr as Record<string, unknown>,
  es: es as Record<string, unknown>,
  pl: pl as Record<string, unknown>,
};

/** Type guard: is the given string one of our supported locales? */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Resolve a dotted key (e.g. 'experiences.scenes.firstLight.title') against a
 * dictionary object. Returns the string value or undefined if any segment is
 * missing or the leaf is not a string.
 */
function lookup(dict: Record<string, unknown>, key: string): string | undefined {
  const segments = key.split('.');
  let current: unknown = dict;
  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Returns a translator `t(key)` bound to `lang`.
 * Resolution order: requested locale -> en fallback -> raw key (never throws).
 * This is the ONLY way components/pages should read UI text.
 */
export function useTranslations(lang: Locale): (key: string) => string {
  const primary = dictionaries[lang] ?? dictionaries[defaultLocale];
  const fallback = dictionaries[defaultLocale];
  return (key: string): string => {
    const fromPrimary = lookup(primary, key);
    if (fromPrimary !== undefined) return fromPrimary;
    const fromFallback = lookup(fallback, key);
    if (fromFallback !== undefined) return fromFallback;
    return key;
  };
}

/**
 * Resolve an arbitrary (possibly array/object) value from the active locale's
 * dictionary, with en fallback. Useful for repeated structures such as
 * testimonials.items[] or craft.points[]. Returns undefined if absent.
 */
export function getEntry<T = unknown>(lang: Locale, key: string): T | undefined {
  const resolve = (dict: Record<string, unknown>): unknown => {
    const segments = key.split('.');
    let current: unknown = dict;
    for (const segment of segments) {
      if (
        current &&
        typeof current === 'object' &&
        segment in (current as Record<string, unknown>)
      ) {
        current = (current as Record<string, unknown>)[segment];
      } else {
        return undefined;
      }
    }
    return current;
  };
  const primary = resolve(dictionaries[lang] ?? dictionaries[defaultLocale]);
  if (primary !== undefined) return primary as T;
  return resolve(dictionaries[defaultLocale]) as T | undefined;
}

/**
 * Extract the active locale from a URL. Looks at the path segment right after
 * the deploy base (e.g. /yachts-promo/de/... -> 'de'). Falls back to default.
 */
export function getLocaleFromUrl(url: URL): Locale {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, ''); // strip trailing slash(es)
  let path = url.pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  const first = path.split('/').filter(Boolean)[0];
  if (first && isLocale(first)) return first;
  return defaultLocale;
}

/**
 * Join a path onto the deploy base without producing double slashes.
 * Use for EVERY asset/link path.
 *   withBase('media/x.jpg') -> '/yachts-promo/media/x.jpg'
 *   withBase('/en')         -> '/yachts-promo/en'
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = String(path).replace(/^\/+/, '');
  return clean ? `${base}/${clean}` : `${base}/`;
}

/**
 * Build a base-aware, locale-prefixed path.
 *   localizedPath('de', 'fleet/aurora') -> /yachts-promo/de/fleet/aurora
 *   localizedPath('en', '')             -> /yachts-promo/en
 * Used in Nav/Footer/LanguageSwitcher/YachtCard/legal pages.
 */
export function localizedPath(lang: Locale, path: string = ''): string {
  const clean = String(path).replace(/^\/+/, '').replace(/\/+$/, '');
  return withBase(clean ? `${lang}/${clean}` : `${lang}`);
}
