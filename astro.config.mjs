import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://portfolioatlas.org',
  output: 'static',
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/calculator'),
    }),
  ],
});
