// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        // Use built-in Shiki themes to avoid load issues.
        light: 'rose-pine-dawn',
        dark: 'rose-pine',
      },
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Ensure KaTeX CSS is bundled by Vite instead of being loaded directly by Node.
      noExternal: ['katex'],
    },
  },
});
