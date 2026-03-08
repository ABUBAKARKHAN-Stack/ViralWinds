import { z } from "zod";

import {
    localizedStringSchema,
    localizedTextSchema,
    requiredLocalizedStringSchema,
    requiredLocalizedTextSchema,
    sectionHeadingSchema,
    seoSchema
} from "./common";

export const serviceFormSchema = z.object({
    title: requiredLocalizedStringSchema,
    subtitle: requiredLocalizedStringSchema,
    description: requiredLocalizedTextSchema,
    slug: z.string().min(1, "Slug is required"),

    // Hero
    heroImage: z.object({
        _type: z.literal('image').optional(),
        asset: z.object({
            _type: z.literal('reference').optional(),
            _ref: z.string(),
        }).optional(),
        url: z.string().optional(),
    }).optional(),
    heroImageAlt: requiredLocalizedStringSchema,

    // Intro
    introTagLine: requiredLocalizedStringSchema,
    introTitle: requiredLocalizedStringSchema,
    introContent: requiredLocalizedTextSchema,

    // Role
    roleTitle: requiredLocalizedStringSchema,
    roleContent: z.array(requiredLocalizedTextSchema).min(1, "At least one role description is required"),

    // How We Help
    howWeHelpSection: sectionHeadingSchema,
    howWeHelpPoints: z.array(z.object({
        _key: z.string().optional(),
        title: requiredLocalizedStringSchema,
        description: requiredLocalizedTextSchema
    })).min(1, "Add at least one help point"),

    // Overview
    overviewSection: sectionHeadingSchema,
    items: z.array(requiredLocalizedStringSchema).min(1, "Add at least one items"),

    // Process
    processSection: sectionHeadingSchema,
    process: z.array(z.object({
        _key: z.string().optional(),
        step: z.string().min(1, "Step number is required"),
        title: requiredLocalizedStringSchema,
        desc: requiredLocalizedTextSchema
    })).min(1, "Add at least one process step"),

    // Areas
    areasSection: sectionHeadingSchema,
    areas: z.array(z.object({
        _key: z.string().optional(),
        region: requiredLocalizedStringSchema,
        locations: z.array(requiredLocalizedStringSchema).min(1, "Add at least one location"),
        featured: z.boolean().default(false),
        clients: z.string().min(1, "Required"),
        flag: z.string().optional()
    })).min(1, "Add at least one area"),

    // Industries
    industriesSection: sectionHeadingSchema,
    industries: z.array(z.object({
        _key: z.string().optional(),
        name: requiredLocalizedStringSchema,
        description: requiredLocalizedTextSchema
    })).min(1, "Add at least one industry"),

    // Benefits
    benifitsSection: sectionHeadingSchema,
    benefits: z.array(requiredLocalizedStringSchema).min(1, "Add at least one benefit"),

    // Why Choose Us
    whyChooseUsSection: sectionHeadingSchema,
    whyChooseUsPoints: z.array(z.object({
        _key: z.string().optional(),
        title: requiredLocalizedStringSchema,
        description: requiredLocalizedTextSchema
    })).min(1, "Add at least one point"),

    // Case Studies
    caseStudiesSection: sectionHeadingSchema,
    caseStudies: z.array(z.object({
        _key: z.string().optional(),
        title: requiredLocalizedStringSchema,
        problem: requiredLocalizedTextSchema,
        solution: requiredLocalizedTextSchema,
        result: requiredLocalizedTextSchema
    })).min(1, "Add at least one case study"),

    // FAQs
    faqsSection: sectionHeadingSchema,
    faqs: z.array(z.object({
        _key: z.string().optional(),
        question: requiredLocalizedStringSchema,
        answer: requiredLocalizedTextSchema
    })).min(1, "Add at least one FAQ"),



    // Other Services
    otherServicesSection: sectionHeadingSchema,
    otherServices: z.array(z.string()).optional().default([]),
    otherServicesButtonText: z.string().optional(),
    otherServicesButtonUrl: z.string().optional(),

    seo: seoSchema,
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
