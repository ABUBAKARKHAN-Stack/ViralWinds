import { z } from "zod";
import { requiredLocalizedStringSchema, requiredLocalizedTextSchema, localizedStringSchema, localizedTextSchema, sectionHeadingSchema, seoSchema } from "./common";



export const portfolioPageContentSchema = z.object({
    hero: z.object({
        title: requiredLocalizedStringSchema,
        subtitle: requiredLocalizedStringSchema,
        description: requiredLocalizedTextSchema,
    }),
    portfolioList: z.object({
        projects: z.array(z.string()).min(1, "Select at least one project"), // Array of IDs, allows empty
    }),
    cta: z.object({
        sectionHeading: sectionHeadingSchema.optional(),
        formReference: z.string().optional(),
    }).optional(),

    // SEO
    seo: seoSchema.optional(),
});

export type PortfolioPageContentValues = z.infer<typeof portfolioPageContentSchema>;
