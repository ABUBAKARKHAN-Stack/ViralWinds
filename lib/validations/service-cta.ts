import { z } from "zod";

export const serviceCtaSchema = z.object({
    ctaBadgeText: z.string().min(1, "Required"),
    ctaTitle: z.string().min(1, "Required"),
    ctaDescription: z.string().min(1, "Required"),
    ctaButtonText: z.string().min(1, "Required"),
    ctaButtonUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const serviceCtaFormSchema = z.object({
    ctaBadgeText: z.string().min(1, "Required"),
    ctaTitle: z.string().min(1, "Required"),
    ctaDescription: z.string().min(1, "Required"),
    ctaButtonText: z.string().min(1, "Required"),
    ctaButtonUrl: z.string().optional().or(z.literal("")),
});

export type ServiceCtaValues = z.infer<typeof serviceCtaFormSchema>;
