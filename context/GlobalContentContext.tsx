"use client";

import { createContext, useContext, ReactNode } from "react";

export type GlobalContentData = {
    stats?: {
        since?: {value:string,label:string}
        projectsDelivered?: { value: string; label: string; suffix: string };
        yearsExperience?: { value: string; label: string; suffix: string };
        clientSatisfaction?: { value: string; label: string; suffix: string };
    };
    servicesPreview?: {
        sectionHeading: { eyebrow: string; title: string; description: string };
        buttonText: string;
        buttonUrl: string;
        featuredServices: Array<{ _id: string; title: string; slug: string; description: string; heroImage: { alt: string; source: string }; items: string[] }>;
    };
    whyChooseUs?: {
        sectionHeading?: { eyebrow?: string; title?: string; description?: string };
        benefits?: Array<{ title: string; description: string; iconName: string }>;
    };
    ourApproach?: {
        sectionHeading?: { eyebrow?: string; title?: string; description?: string };
        steps?: Array<{ title: string; description: string; featured?: boolean; iconName: string }>;
    };
    industriesWeServe?: {
        sectionHeading?: { eyebrow?: string; title?: string; description?: string };
        industries?: Array<{ name: string; description: string; iconName: string }>;
    };
    faqs?: {
        sectionHeading?: { eyebrow?: string; title?: string; description?: string };
        faqItems?: Array<{ question: string; answer: string }>;
        buttonText?: string;
        buttonUrl?: string;
    };
    leadership?: {
        sectionHeading?: { eyebrow?: string; title?: string; description?: string };
        founder?: {
            name: string;
            role: string;
            image?: { _id: string; url: string,altText:string };
            socialLinks?: Array<{ label: string,iconName: string; url: string }>;
        };
        agencyStructure?: Array<{ title: string; description: string; featured?: boolean; iconName: string }>;
    };
    cta?: {
        badge?: string;
        heading?: string;
        description?: string;
        benefits?: Array<{ text: string }>;
        formId?: string;
    };
};

type GlobalContentContextType = {
    globalContent: GlobalContentData | null;
};

const GlobalContentContext = createContext<GlobalContentContextType | null>(null);

export const GlobalContentProvider = ({
    children,
    globalContent
}: {
    children: ReactNode;
    globalContent: GlobalContentData | null;
}) => {
    return (
        <GlobalContentContext.Provider value={{ globalContent }}>
            {children}
        </GlobalContentContext.Provider>
    );
};

export const useGlobalContent = () => {
    const ctx = useContext(GlobalContentContext);
    if (!ctx) throw new Error("useGlobalContent must be inside GlobalContentProvider");
    return ctx;
};
