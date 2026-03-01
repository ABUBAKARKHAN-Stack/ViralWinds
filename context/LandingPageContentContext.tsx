"use client";

import { createContext, useContext, ReactNode } from "react";

// Define the type based on what getLandingPageContent returns
export type LandingPageContentData = {
    hero?: {
        badge?: string;
        headingLines?: Array<{
            text: string;
            style: 'normal' | 'stroke' | 'gradient';
        }>;
        descriptionParagraphs?: Array<{
            text: string;
        }>;
        ctaButtons?: Array<{
            text: string;
            url: string;
            variant: 'primary' | 'secondary';
        }>;
        featuredServices?: Array<{
            title: string;
            slug: string;
        }>;
    }
    portfolioPreview?: {
        sectionHeading: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
         featuredProjects: Array<{
            title: string,
            slug: string,
            category: string,
            mainImage: {
                source: string,
                alt: string
            }
        }>;
        buttonText?: string;
        buttonUrl?: string;
    };
    aboutPreview?: {
        sectionHeading: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        leftDescriptions?: Array<{ text: string }>;
        rightDescriptions?: Array<{ text: string }>;
        ctaText?: string;
        ctaUrl?: string;
    };
    
    faqs?: {
        sectionHeading?: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        faqItems?: Array<{
            question: string;
            answer: string;
        }>;
        buttonText?: string;
        buttonUrl?: string;
    };
    serviceHighlightsMarquee?: {
        highlights?: Array<{
            text: string;
        }>;
    };
    trustedByBrands?: {
        sectionHeading?: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        brandLogos?: Array<{
            asset?: {
                _id: string;
                url: string;
                altText?: string;
            };
        }>;
    };
    
    caseStudiesPreview?: {
        sectionHeading?: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        featuredCaseStudies?: Array<{
            title: string;
            slug: string;
            category: string;
            beforeImage: {
                _id: string;
                altText: string;
            };
            afterImage: {
                _id: string;
                altText: string;
            };
            testimonial: string;
            results: Array<{
                icon: string;
                label: string;
                value: string;
            }>;
        }>;
        buttonText: string;
        buttonUrl: string;
    };
    areasWeServe?: {
        sectionHeading?: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        areas?: Array<{
            region: string;
            locations: string[];
            featured?: boolean;
            clients: number;
            flag: string;
        }>;
    };
    
    testimonials?: {
        sectionHeading?: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        testimonials?: Array<{
            quote: string;
            author: string;
            role: string;
            company: string;
            avatar?: {
                _id: string;
                url: string;
            };
        }>;
    };
    
    blogPreview?: {
        sectionHeading?: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        featuredBlogs?: Array<{
            title: string;
            description: string;
            slug: string;
            mainImage: {
                source: string;
                alt: string;
            };
            categories: string[];
            publishedAt: string;
            readTime: number;
        }>;
        buttonText?: string;
        buttonUrl?: string;
    };
};

type LandingPageContentContextType = {
    landingPageContent: LandingPageContentData;
};

const LandingPageContentContext = createContext<LandingPageContentContextType | null>(null);

export const LandingPageContentProvider = ({
    children,
    landingPageContent
}: {
    children: ReactNode;
    landingPageContent: LandingPageContentData ;
}) => {
    return (
        <LandingPageContentContext.Provider value={{ landingPageContent }}>
            {children}
        </LandingPageContentContext.Provider>
    );
};

export const useLandingPageContent = () => {
    const ctx = useContext(LandingPageContentContext);
    if (!ctx) throw new Error("useLandingPageContent must be inside LandingPageContentProvider");
    return ctx;
};
