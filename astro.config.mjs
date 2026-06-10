// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://pflgroup.github.io/yachts-promo/
// After attaching a custom domain, change `site` and set `base: '/'`,
// then add public/CNAME with the domain (see README).
//
// i18n: en is the default locale and IS prefixed in the URL (prefixDefaultLocale:true),
// so every localized page lives under /yachts-promo/<lang>/... and src/pages/index.astro
// redirects "/" to the best language.
export default defineConfig({
  site: 'https://pflgroup.github.io',
  base: '/yachts-promo',
  trailingSlash: 'ignore',
  integrations: [tailwind(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es', 'pl'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
