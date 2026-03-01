import { z } from "zod";
import { requiredLocalizedArraySchema, requiredLocalizedStringSchema, requiredLocalizedTextSchema, seoSchema } from "./common";

export const blogPostSchema = z.object({
    title: requiredLocalizedStringSchema,
    description: requiredLocalizedTextSchema,
    featured: z.boolean().optional(),
    slug: z.object({
        current: z.string().min(1, "Slug is required"),
    }),
    readTime: z.number().min(1, "Read time must be at least 1 minute").optional(),
    author: z.string().min(1, "Author name is required"),
    tags: requiredLocalizedArraySchema,
    locations: z.array(z.string()).optional(),
    service: z.string().nullable().optional(), // Reference ID
    publishedAt: z.string().optional(), // ISO date string
    mainImage: z.any().optional(), // Image object
    categories: z.array(z.string()).optional(), // Array of Reference IDs
    body: z.array(z.any()).min(1, "Body content is required"),
    seo: seoSchema.optional(),
});

export type BlogPostValues = z.infer<typeof blogPostSchema>;
