import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    // Load Markdown and MDX files in src/content/blog.
    // Type-check frontmatter using a schema
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            // Transform string to Date object
            pubDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            heroImage: image().optional(),
        }),
});

export const collections = { blog };
