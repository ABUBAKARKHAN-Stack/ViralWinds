import { z } from "zod";

export const localizedStringSchema = z.string().min(1, "Required");
export const requiredLocalizedStringSchema = z.string().min(1, "Required");
export const localizedTextSchema = z.string().min(1, "Required");
export const requiredLocalizedTextSchema = z.string().min(1, "Required");
export const localizedArraySchema = z.array(z.string());
export const requiredLocalizedArraySchema = z.array(z.string()).min(1, "At least one item required");

export const sectionHeadingSchema = z.object({
    _key: z.string().optional(),
    eyebrow: z.string().optional(),
    title: z.string().min(1, "Required"),
    description: z.string().optional(),
});

export const seoSchema = z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    focusKeyword: z.string().optional(),
    relatedKeywords: z.array(z.string()).optional(),
    schemas: z.array(z.string()).transform(arr => arr.filter(s => s.trim() !== "")).optional(),
});