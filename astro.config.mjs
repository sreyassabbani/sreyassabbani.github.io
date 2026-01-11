// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

// https://astro.build/config
export default defineConfig({
    site: "https://sreyassabbani.github.io",
    integrations: [mdx(), react(), sitemap()],
    markdown: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        syntaxHighlight: "shiki",
        shikiConfig: {
            themes: {
                // Catppuccin themes for consistent aesthetic
                light: "catppuccin-latte",
                dark: "catppuccin-frappe",
            },
            wrap: true,
        },
    },

    vite: {
        plugins: [tailwindcss()],
        ssr: {
            // Ensure KaTeX CSS is bundled by Vite instead of being loaded directly by Node.
            noExternal: ["katex"],
        },
    },
});
