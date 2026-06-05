// =========================================================================
// lenis.ts — reusable smooth-scroll initializer.
//
// BaseLayout (Foundation) already inlines a Lenis init for the global page.
// This module exposes a single reusable `initLenis()` so that:
//   - any island / page that needs a Lenis handle (e.g. animations.ts wiring
//     ScrollTrigger to Lenis) can obtain the SAME instance, and
//   - the smooth-scroll config lives in one place.
//
// It is intentionally idempotent: calling it twice returns the existing
// instance instead of creating a second RAF loop. Disabled (returns null)
// under prefers-reduced-motion so native scrolling remains.
// =========================================================================
import Lenis from 'lenis';

// Stash the instance on window so BaseLayout's inline init and animations.ts
// converge on one object regardless of import/bundle boundaries.
declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Initialize (or reuse) the global Lenis smooth-scroll instance.
 * Returns the instance, or null when motion is reduced / unavailable.
 */
export function initLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (prefersReducedMotion()) return null;
  if (window.__lenis) return window.__lenis;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
    smoothWheel: true,
  });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  window.__lenis = lenis;
  return lenis;
}

/** Return the active Lenis instance if one exists (does not create it). */
export function getLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  return window.__lenis ?? null;
}
