import { z } from "zod";
import { localizedStringSchema, localizedTextSchema, sectionHeadingSchema, seoSchema } from "./common";

export const contactPageContentSchema = z.object({
    hero: z.object({
        title: localizedStringSchema,
        subtitle: localizedStringSchema.optional(),
        description: localizedTextSchema,
    }),
   
    faqs: z.object({
        sectionHeading: sectionHeadingSchema.optional(),
        faqItems: z.array(z.object({
            question: localizedStringSchema,
            answer: localizedTextSchema,
        })).optional(),
    }).optional(),
    seo: seoSchema.optional(),
});

export type ContactPageContentValues = z.infer<typeof contactPageContentSchema>;
