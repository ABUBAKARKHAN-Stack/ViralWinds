import { z } from "zod";
import {
    requiredLocalizedStringSchema,
    requiredLocalizedTextSchema,
    requiredLocalizedArraySchema,
    seoSchema
} from "./common";

export const projectSchema = z.object({
    title: requiredLocalizedStringSchema,
    slug: z.object({
        current: z.string().min(1, "Slug is required"),
    }),
    category: requiredLocalizedStringSchema,
    description: requiredLocalizedTextSchema,
    tags: requiredLocalizedArraySchema,
    mainImage: z.object({
        _id: z.string().min(1, "Main image is required"),
        url: z.string().optional(),
    }),
    caseStudy: z.object({
        title: requiredLocalizedStringSchema,
        beforeImage: z.object({
            _id: z.string().min(1, "Before image is required"),
            url: z.string().optional(),
        }),
        afterImage: z.object({
            _id: z.string().min(1, "After image is required"),
            url: z.string().optional(),
        }),
        testimonial: requiredLocalizedTextSchema,
        results: z.array(z.object({
            _key: z.string().optional(),
            icon: z.string().min(1, "Icon is required"),
            value: requiredLocalizedStringSchema,
            label: requiredLocalizedStringSchema,
        })).min(1, "At least one result is required"),
    }),
    seo: seoSchema.optional(),
});

export type ProjectValues = z.infer<typeof projectSchema>;
