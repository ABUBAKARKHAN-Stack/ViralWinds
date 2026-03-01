import { z } from "zod";
import {
    requiredLocalizedStringSchema,
    localizedStringSchema,
    requiredLocalizedTextSchema,
    localizedTextSchema,
    seoSchema,
    localizedArraySchema
} from "./common";

export const siteSettingsSchema = z.object({
    siteName: requiredLocalizedStringSchema,
    tagline: requiredLocalizedStringSchema,

    logo: z.object({
        _type: z.literal('image').optional(),
        asset: z.object({
            _type: z.literal('reference').optional(),
            _ref: z.string().optional(),
        }).optional(),
        url: z.string().optional(),
    }).optional().nullable(),

    favicon: z.object({
        _type: z.literal('image').optional(),
        asset: z.object({
            _type: z.literal('reference').optional(),
            _ref: z.string().optional(),
        }).optional(),
        url: z.string().optional(),
    }).optional().nullable(),

    // Local strict SEO schema to enforce requirements
    seo: z.object({
        metaTitle: requiredLocalizedStringSchema,
        metaDescription: requiredLocalizedTextSchema,
        focusKeyword: localizedStringSchema.optional(),
        relatedKeywords: localizedArraySchema.optional(),
        schemas: z.array(z.string().min(1, "Schema cannot be empty")).optional(),
    }),

    footerText: requiredLocalizedTextSchema,
    copyright: requiredLocalizedStringSchema,

    headerMenu: z.object({
        _type: z.literal('reference').optional(),
        _ref: z.string().optional(),
    }).optional().nullable(),

    footerMenu: z.object({
        _type: z.literal('reference').optional(),
        _ref: z.string().optional(),
    }).optional().nullable(),

    contactInfo: z.array(z.object({
        _key: z.string().optional(),
        label: requiredLocalizedStringSchema,
        value: requiredLocalizedStringSchema,
        icon: z.string().min(1, "Icon name is required"),
    })).optional(),
    socialLinks: z.array(z.object({
        _key: z.string().optional(),
        label: requiredLocalizedStringSchema,
        icon: z.string().min(1, "Icon name is required"),
        url: z.string().url("Must be a valid URL"),
    })).optional(),

    footerCTA: z.object({
        eyebrow: localizedStringSchema.optional(),
        headingPrefix: localizedStringSchema.optional(),
        headingHighlight: localizedStringSchema.optional(),
        buttonText: localizedStringSchema.optional(),
        buttonUrl: z.string().optional(),
    }).optional(),
});

export type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;
