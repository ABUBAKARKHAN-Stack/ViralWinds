import { z } from "zod";
import { requiredLocalizedStringSchema, requiredLocalizedTextSchema } from "./common";

// Stat Schema
const statSchema = z.object({
    _key: z.string().optional(),
    value: z.string().min(1, "Value must be at least 1"),
    label: requiredLocalizedStringSchema,
    suffix: z.string().min(1, "Suffix is required (e.g., +, %)"),
});

// Benefit Schema
const benefitSchema = z.object({
    _key: z.string().optional(),
    title: requiredLocalizedStringSchema,
    description: requiredLocalizedTextSchema,
    iconName: z.string().min(1, "Icon name is required"),
});

// FAQ Schema
const faqSchema = z.object({
    _key: z.string().optional(),
    question: requiredLocalizedStringSchema,
    answer: requiredLocalizedTextSchema,
});

// Section Heading Schema
const sectionHeadingSchema = z.object({
    eyebrow: requiredLocalizedStringSchema.optional(),
    title: requiredLocalizedStringSchema,
    description: requiredLocalizedTextSchema.optional(),
});

export const globalSectionsSchema = z.object({
    // Stats Section
    stats: z.object({
        since: z.object({
            _key: z.string().optional(),
            value: z.string().min(1, "Value must be at least 1"),
            label: requiredLocalizedStringSchema,
        }),
        projectsDelivered: statSchema,
        yearsExperience: statSchema,
        clientSatisfaction: statSchema,
    }),

    // Services Preview Section
    servicesPreview: z.object({
        sectionHeading: sectionHeadingSchema,
        featuredServices: z.array(z.string()).max(8).optional(),
        buttonText: requiredLocalizedStringSchema.optional(),
        buttonUrl: requiredLocalizedStringSchema.optional(),
    }),

    // Why Choose Us Section
    whyChooseUs: z.object({
        sectionHeading: sectionHeadingSchema,
        benefits: z.array(benefitSchema).min(1, "At least one benefit is required"),
    }),

    // Our Approach
    ourApproach: z.object({
        sectionHeading: sectionHeadingSchema,
        steps: z.array(z.object({
            _key: z.string().optional(),
            title: requiredLocalizedStringSchema,
            description: requiredLocalizedTextSchema,
            iconName: z.string().min(1, "Icon is required"),
        })).min(1, "At least one step is required"),
    }),

    // Industries We Serve
    industriesWeServe: z.object({
        sectionHeading: sectionHeadingSchema,
        industries: z.array(z.object({
            _key: z.string().optional(),
            name: requiredLocalizedStringSchema,
            description: requiredLocalizedTextSchema.optional(),
            iconName: z.string().min(1, "Icon name is required"),
        })).min(1, "At least one industry is required"),
    }),

    // FAQs Section
    faqs: z.object({
        sectionHeading: sectionHeadingSchema,
        faqItems: z.array(faqSchema).min(1, "At least one FAQ is required"),
        buttonText: requiredLocalizedStringSchema.optional(),
        buttonUrl: requiredLocalizedStringSchema.optional(),
    }),

    // Leadership
    leadership: z.object({
        sectionHeading: sectionHeadingSchema,
        founder: z.object({
            name: requiredLocalizedStringSchema,
            role: requiredLocalizedStringSchema,
            image: z.any(), // Image type
            socialLinks: z.array(z.object({
                _key: z.string().optional(),
                iconName: z.string().min(1, "Icon is required"),
                label: requiredLocalizedStringSchema,
                url: z.string().url("Must be a valid URL"),
            })).optional(),
        }),
        agencyStructure: z.array(z.object({
            _key: z.string().optional(),
            title: requiredLocalizedStringSchema,
            description: requiredLocalizedStringSchema,
            featured: z.boolean().optional(),
            iconName: z.string().min(1, "Icon is required"),
        })).min(1, "At least one team is required"),
    }),

    // CTA
    cta: z.object({
        badge: requiredLocalizedStringSchema,
        heading: requiredLocalizedStringSchema,
        description: requiredLocalizedTextSchema,
        benefits: z.array(z.object({
            _key: z.string().optional(),
            text: requiredLocalizedStringSchema,
        })).min(1, "At least one benefit is required"),
    }),
});

export type GlobalSectionsValues = z.infer<typeof globalSectionsSchema>;
