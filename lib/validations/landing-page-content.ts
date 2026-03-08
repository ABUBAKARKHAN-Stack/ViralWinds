import { z } from "zod";
import { sectionHeadingSchema, seoSchema } from "./common";

// Heading Line Schema
const headingLineSchema = z.object({
    _key: z.string().optional(),
    text: z.string().min(1, "Text is required"),
    style: z.enum(['normal', 'stroke', 'gradient']),
});

// Description Paragraph Schema
const descriptionParagraphSchema = z.object({
    _key: z.string().optional(),
    text: z.string().min(1, "Text is required"),
});

// CTA Button Schema
const ctaButtonSchema = z.object({
    _key: z.string().optional(),
    text: z.string().min(1, "Text is required"),
    url: z.string("Must be a URL or Route").min(1, "Required"),
    variant: z.enum(['primary', 'secondary']),
});


// Main Landing Page Content Schema
export const landingPageContentSchema = z.object({
    // Hero Section
    hero: z.object({
        badge: z.string().min(1, "Badge is required"),
        headingLines: z.array(headingLineSchema).min(1, "At least one heading line is required").max(3, "Maximum 3 heading lines allowed"),
        descriptionParagraphs: z.array(descriptionParagraphSchema).min(1, "At least one paragraph is required").max(5, "Maximum 5 paragraphs allowed"),
        ctaButtons: z.array(ctaButtonSchema).length(2, "Exactly 2 CTA buttons are required"),
        featuredServices: z.array(z.string()).max(8).optional(),
    }),


    // Portfolio Preview Section
    portfolioPreview: z.object({
        sectionHeading: sectionHeadingSchema,
        featuredProjects: z.array(z.string()).max(8).optional(),
        buttonText: z.string().optional(),
        buttonUrl: z.string().optional(),
    }),

    // About Preview Section
    aboutPreview: z.object({
        sectionHeading: sectionHeadingSchema,
        leftDescriptions: z.array(z.object({
            _key: z.string().optional(),
            text: z.string().min(1, "Text is required")
        })).min(2, "Exactly 2 left descriptions required").max(2, "Exactly 2 left descriptions required"),
        rightDescriptions: z.array(z.object({
            _key: z.string().optional(),
            text: z.string().min(1, "Text is required")
        })).min(2, "Exactly 2 right descriptions required").max(2, "Exactly 2 right descriptions required"),
        ctaText: z.string().min(1, "CTA Text is required"),
        ctaUrl: z.string().min(1, "Required"),
    }),





    // Service Highlights Marquee
    serviceHighlightsMarquee: z.object({
        highlights: z.array(z.object({
            _key: z.string().optional(),
            text: z.string().min(1, "Text is required"),
        })).min(1, "At least one highlight is required"),
    }),

    // Trusted By Brands
    trustedByBrands: z.object({
        sectionHeading: sectionHeadingSchema,
        brandLogos: z.array(z.any()).min(1, "At least one brand logo is required"), // Array of Sanity image references
    }),


    // Case Studies Preview
    caseStudiesPreview: z.object({
        sectionHeading: sectionHeadingSchema,
        featuredCaseStudies: z.array(z.string()).max(8).optional(),
        buttonText: z.string().optional(),
        buttonUrl: z.string().optional(),
    }),

    // Areas We Serve
    areasWeServe: z.object({
        sectionHeading: sectionHeadingSchema,
        areas: z.array(z.object({
            _key: z.string().optional(),
            region: z.string().min(1, "Region is required"),
            locations: z.array(z.string()).min(1, "At least one location is required"),
            featured: z.boolean().optional(),
            clients: z.number().min(0).optional(),
            flag: z.string().max(10).optional(),
        })).min(1, "At least one region is required"),
    }),


    // Testimonials
    testimonials: z.object({
        sectionHeading: sectionHeadingSchema,
        testimonials: z.array(z.object({
            _key: z.string().optional(),
            quote: z.string().min(1, "Quote is required"),
            author: z.string().min(1, "Author is required"),
            role: z.string().min(1, "Role is required"),
            company: z.string().optional(),
            avatar: z.any().optional(), // Image type
        })).min(1, "At least one testimonial is required"),
    }),

    // SEO
    seo: seoSchema.optional(),
});

export type LandingPageContentValues = z.infer<typeof landingPageContentSchema>;
