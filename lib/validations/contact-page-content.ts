import { z } from "zod";
import { localizedStringSchema, localizedTextSchema, sectionHeadingSchema, seoSchema } from "./common";

export const contactPageContentSchema = z.object({
    hero: z.object({
        title: localizedStringSchema,
        subtitle: localizedStringSchema.optional(),
        description: localizedTextSchema,
    }),
    contactForm: z.object({
        formHeading: z.string().min(1, "Heading is required"),
        formDescription: z.string().min(1, "Description is required"),
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
