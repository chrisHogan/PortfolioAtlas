import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://portfolioatlas.org',
  trailingSlash: 'ignore',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/calculator'),
      serialize: (item) => {
        // Strip trailing slash from sitemap URLs (except root)
        if (item.url.endsWith('/') && item.url !== 'https://portfolioatlas.org/') {
          item.url = item.url.slice(0, -1);
        }
        return item;
      },
    }),
  ],
});
