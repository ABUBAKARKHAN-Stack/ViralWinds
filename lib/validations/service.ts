import { z } from "zod";

import {
    requiredLocalizedStringSchema,
    requiredLocalizedTextSchema,
    seoSchema
} from "./common";

export const serviceFormSchema = z.object({
    title: requiredLocalizedStringSchema,
    description: requiredLocalizedTextSchema,
    heroImage: z.object({
        _type: z.literal('image').optional(),
        asset: z.object({
            _type: z.literal('reference').optional(),
            _ref: z.string(),
        }).optional(),
        url: z.string().optional(),
    }).optional(),
    heroImageAlt: requiredLocalizedStringSchema,
    items: z.array(requiredLocalizedStringSchema).min(1, "Add at least one items"),
    seo: seoSchema,
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
