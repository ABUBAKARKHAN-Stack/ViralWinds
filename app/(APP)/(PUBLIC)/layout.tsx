import FloatingContactBadge from "@/components/FloatingContactBadge";
import { Navbar, Footer } from "@/components/layout";
import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import PublicProvider from "@/provider/PublicProvider";
import { JsonLd } from "@/components/SEO/JsonLd";
import { SanityLive } from "@/sanity/lib/live";
import { getSiteSettings } from "@/helpers/site-settings.helpers";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { GlobalContentProvider } from "@/context/GlobalContentContext";
import { getGlobalSections } from "@/helpers/global-sections.helpers";
import { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import { APP_NAME, BASE_URL, BRAND_DESCRIPTION, TAGLINE } from "@/constants/app.constants";



interface Props {
    children: ReactNode;
}

export const generateMetadata = async (): Promise<Metadata> => {
    const siteSettings = await getSiteSettings();

    if (!siteSettings) {
        return {
            title: `${TAGLINE} | ${APP_NAME}`,
            description: BRAND_DESCRIPTION,
            keywords: [
                "creative design agency",
                "branding agency",
                "logo design agency",
                "web design agency",
                "digital design agency",
                "branding and web development",
                "creative agency for startups",
                "AI marketing agency",
                "digital marketing with AI",
                "AI-powered marketing",
                "viral marketing agency",
                "social media marketing agency",
                "performance marketing agency",
                "growth marketing agency",
                "AI-driven branding",
                "marketing automation agency",
                "content marketing agency",
                "digital growth strategies",
                "brand engagement campaigns"
            ],
            alternates: {
                canonical: "/",
            },
            robots: {
                index: true,
                follow: true,
            },
        }
    }

    const metaTitle = siteSettings?.seo?.metaTitle;
    const metaDescription = siteSettings?.seo?.metaDescription;
    const focusKeyword = siteSettings?.seo?.focusKeyword;
    const relatedKeywords = siteSettings?.seo?.relatedKeywords;

    const openGraphImage = siteSettings?.logo?._id ? urlFor(siteSettings?.logo?._id)
        .width(1200)
        .height(630)
        .url() : "";

    return {
        //* Base Metadata
        metadataBase: new URL(BASE_URL),
        title: {
            default: `${metaTitle}| ${siteSettings.siteName}`,
            template: `%s | ${siteSettings.siteName}`,
        },
        description: metaDescription,
        keywords: [focusKeyword, ...(relatedKeywords || [])].filter(Boolean) as string[],

        //* Open Graph Metadata
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            type: "website",
            url: "/",
            images: [
                {
                    url: openGraphImage,
                    width: 1200,
                    height: 630,
                },
            ],
            siteName: siteSettings.siteName,
        },

        //* Twitter Metadata
        twitter: {
            card: "summary_large_image",
            title: metaTitle,
            description: metaDescription,
            images: [openGraphImage],
        },

        //* Alternates Metadata
        alternates: {
            canonical: "/",
            languages: {
                "en": "/"
            }
        },

        //* Icons Metadata
        icons: {
            icon: siteSettings?.favicon?._id ? urlFor(siteSettings?.favicon?._id)
                .width(16)
                .height(16)
                .url() : "",
            shortcut: siteSettings?.favicon?._id ? urlFor(siteSettings?.favicon?._id)
                .width(32)
                .height(32)
                .url() : "",
            apple: siteSettings?.favicon?._id ? urlFor(siteSettings?.favicon?._id)
                .width(180)
                .height(180)
                .url() : "",
        },

        //* Robots Metadata
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default async function PublicLayout({ children }: Props) {

    const [
        siteSettingsResult,
        globalContentResult
    ] = await Promise.allSettled([
        getSiteSettings(),
        getGlobalSections(),
    ])

    const siteSettings = siteSettingsResult.status === "fulfilled" ? siteSettingsResult.value : null;
    const globalContent = globalContentResult.status === "fulfilled" ? globalContentResult.value : null;




    return (

        <SiteSettingsProvider settings={siteSettings}>
            <GlobalContentProvider globalContent={globalContent}>

                <JsonLd schemas={siteSettings?.seo?.schemas} />
                <PublicProvider>

                    <div className="min-h-screen flex flex-col">
                        <SanityLive />
                        <Navbar />

                        <main className="flex-1 pt-20">
                            <AnimatePresence mode="wait">
                                {children}
                            </AnimatePresence>
                        </main>

                        <FloatingContactBadge />
                        <Footer />
                    </div>
                </PublicProvider>
            </GlobalContentProvider>
        </SiteSettingsProvider>

    );
}
