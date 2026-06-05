/** @type {import('tailwindcss').Config} */
// All values mirror the CSS custom properties in src/styles/global.css.
// Tokens map onto var(--…) so global.css remains the single source of truth:
// changing a color there changes both `var(--ink-900)` and `bg-ink-900`.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
          // Canonical DARK text token (light theme). Use text-ink-text wherever
          // dark text is wanted, since ink-900 is now a light surface value.
          text: 'var(--ink-text)',
        },
        sand: {
          100: 'var(--sand-100)',
          200: 'var(--sand-200)',
          300: 'var(--sand-300)',
        },
        coral: {
          500: 'var(--coral-500)',
          600: 'var(--coral-600)',
        },
        lagoon: {
          400: 'var(--lagoon-400)',
          500: 'var(--lagoon-500)',
        },
        slate: {
          500: 'var(--slate-500)',
        },
        line: 'var(--line)',
      },
      backgroundImage: {
        'grad-hero': 'var(--grad-hero)',
        'grad-accent': 'var(--grad-accent)',
      },
      fontFamily: {
        // Loaded via <link> in BaseLayout (Google Fonts) with latin + latin-ext.
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // [size, lineHeight] tuples following section 4.3.
        display: ['var(--fs-display)', { lineHeight: '1.02' }],
        h1: ['var(--fs-h1)', { lineHeight: '1.05' }],
        h2: ['var(--fs-h2)', { lineHeight: '1.1' }],
        h3: ['var(--fs-h3)', { lineHeight: '1.15' }],
        'body-l': ['var(--fs-body-l)', { lineHeight: '1.6' }],
        body: ['var(--fs-body)', { lineHeight: '1.65' }],
        small: ['var(--fs-small)', { lineHeight: '1.55' }],
        overline: ['var(--fs-overline)', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      spacing: {
        // 8pt scale (section 4.4). Use p-/m-/gap- exclusively from these.
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
        9: 'var(--space-9)',
        10: 'var(--space-10)',
        11: 'var(--space-11)',
        12: 'var(--space-12)',
        gutter: 'var(--gutter)',
        section: 'var(--section-pad)',
      },
      maxWidth: {
        shell: '1280px',
        wide: '1440px',
        measure: '68ch',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        'glow-coral': 'var(--glow-coral)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        inout: 'var(--ease-inout)',
      },
      transitionDuration: {
        fast: '200ms',
        base: '400ms',
        slow: '700ms',
        cine: '1100ms',
      },
      letterSpacing: {
        overline: '0.18em',
      },
    },
  },
  plugins: [],
};
