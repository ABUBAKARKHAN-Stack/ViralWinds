import { z } from "zod";
import { requiredLocalizedStringSchema, requiredLocalizedTextSchema, localizedStringSchema, localizedTextSchema, sectionHeadingSchema, seoSchema } from "./common";



export const blogPageContentSchema = z.object({
    hero: z.object({
        title: requiredLocalizedStringSchema,
        subtitle: requiredLocalizedStringSchema,
        description: requiredLocalizedTextSchema,
    }),
    blogList: z.object({
        posts: z.array(z.string()).min(1, "Select at least one blog post"), // Array of IDs, allows empty
    }),
    cta: z.object({
        sectionHeading: sectionHeadingSchema.optional(),
        formReference: z.string().optional(),
    }).optional(),

    // SEO
    seo: seoSchema.optional(),
});

export type BlogPageContentValues = z.infer<typeof blogPageContentSchema>;
