"use client";

import { createContext, useContext, ReactNode } from "react";

export type AboutPageContentData = {
    hero?: {
        title?: string;
        subtitle?: string;
        description?: string;
    };
    intro?: {
        badge?: string;
        heading?: string;
        description1?: string;
        description2?: string;
        quote?: string;
        mainImage?: {
            _id: string;
            url: string;
        };
        sinceYear?: number;
    };
    missionVision?: {
        sectionHeading?: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        mission?: {
            eyebrow?: string;
            title?: string;
            description1?: string;
            description2?: string;
            keyPoints?: string[];
        };
        vision?: {
            eyebrow?: string;
            title?: string;
            description1?: string;
            description2?: string;
            keyPoints?: string[];
        };
    };
    philosophy?: {
        sectionHeading?: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        quoteBlock?: string;
        description1?: string;
        description2?: string;
        steps?: Array<{ label: string; iconName: string }>;
    };
    globalReach?: {
        badge?: string;
        heading?: string;
        description1?: string;
        description2?: string;
        regions?: string[];
        stats?: Array<{
            value: string;
            label: string;
        }>;
    };
    culture?: {
        sectionHeading?: {
            eyebrow?: string;
            title?: string;
            description?: string;
        };
        values?: Array<{
            title: string;
            description: string;
            iconName: string;
        }>;
        quote?: string;
        quoteHighlight?: string;
    };
};

type AboutPageContentContextType = {
    aboutPageContent: AboutPageContentData | null;
};

const AboutPageContentContext = createContext<AboutPageContentContextType | null>(null);

export const AboutPageContentProvider = ({
    children,
    aboutPageContent
}: {
    children: ReactNode;
    aboutPageContent: AboutPageContentData | null;
}) => {
    return (
        <AboutPageContentContext.Provider value={{ aboutPageContent }}>
            {children}
        </AboutPageContentContext.Provider>
    );
};

export const useAboutPageContent = () => {
    const ctx = useContext(AboutPageContentContext);
    if (!ctx) throw new Error("useAboutPageContent must be inside AboutPageContentProvider");
    return ctx;
};
