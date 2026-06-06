// =========================================================================
// animations.ts — GSAP + ScrollTrigger motion layer.
//
// Loaded as an island ONLY on pages that need it (home + yacht detail).
// Responsibilities:
//   - reveals (opacity + y), with optional stagger of [data-reveal-item]
//   - parallax on hero background + section accents
//   - viewport-triggered spec counters (0 → target)
//   - keeps ScrollTrigger in sync with Lenis if the smooth-scroll is active
//
// Accessibility: under prefers-reduced-motion we DO NOTHING (no hiding, no
// pinning) — the CSS in each component already shows a static, readable state.
// The `html.js-anim` flag (set here, before anything) is what arms the
// initial-hidden CSS in Reveal.astro, so no-JS users never see hidden content.
// =========================================================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis, prefersReducedMotion } from './lenis';

const reduce = prefersReducedMotion();

// Arm the "hidden until revealed" CSS only when we can actually animate.
if (!reduce) {
  document.documentElement.classList.add('js-anim');
}

function setup(): void {
  if (reduce) return;

  gsap.registerPlugin(ScrollTrigger);

  // --- Sync ScrollTrigger with Lenis (so scrub tracks the smoothed scroll) ---
  // Lenis still scrolls the real window/body, so the default ScrollTrigger
  // scroller is correct; we only need to tell ScrollTrigger to update on each
  // Lenis tick so scrubbed animations follow the smoothed position precisely.
  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
  }

  // ----------------------------------------------------------------------- //
  // 1) REVEALS
  // ----------------------------------------------------------------------- //
  const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  reveals.forEach((el) => {
    const isStagger = el.hasAttribute('data-reveal-stagger');
    const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0') || 0;

    if (isStagger) {
      const items = el.querySelectorAll<HTMLElement>(':scope > [data-reveal-item]');
      const targets = items.length ? items : [el];
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        delay,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
    } else {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    }
  });

  // ----------------------------------------------------------------------- //
  // 2) HERO PARALLAX (background drifts slower than scroll)
  // ----------------------------------------------------------------------- //
  const heroBg = document.querySelector<HTMLElement>('[data-hero-bg]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (heroBg && hero) {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // ----------------------------------------------------------------------- //
  // 3) SECTION-LEVEL SUBTLE PARALLAX on decorative accents (optional hook)
  // ----------------------------------------------------------------------- //
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax') || '0.1');
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // ----------------------------------------------------------------------- //
  // 4) SPEC COUNTERS (count up from 0 on enter)
  // ----------------------------------------------------------------------- //
  const counters = gsap.utils.toArray<HTMLElement>('[data-counter]');
  counters.forEach((el) => {
    const raw = el.getAttribute('data-counter') || '0';
    const target = parseFloat(raw.replace(',', '.'));
    if (!isFinite(target)) return;
    const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
    // Preserve the trailing unit/suffix that was rendered server-side.
    const fullText = el.textContent || '';
    const suffix = fullText.replace(/^\s*[\d.,]+/, '');

    const obj = { v: 0 };
    el.textContent = `0${suffix}`;
    gsap.to(obj, {
      v: target,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = `${obj.v.toFixed(decimals)}${suffix}`;
      },
      onComplete: () => {
        // Snap back to the exact original string (handles "(+2)", "×", etc).
        el.textContent = fullText;
      },
    });
  });

  // Recalculate on full load (fonts/images can shift layout).
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

// Defer to idle so we never block first paint / interaction.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup, { once: true });
} else {
  setup();
}
