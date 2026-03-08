import ContactClient from "./ContactClient";
import { JsonLd } from "@/components/SEO/JsonLd";
import { DataMissing } from "@/components/ui/DataMissing";
import { getContactPageContent } from "@/helpers/contact-page-content";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {

    const pageContent = await getContactPageContent();

    if (!pageContent) {
        return {
            title: "Contact Page Not Found",
            description: "The requested contact page does not exist.",
            robots: { index: false },
        };
    }

    //* Base Metadata
    const title = pageContent?.seo?.metaTitle || "Contact Us";
    const description = pageContent?.seo?.metaDescription || "";
    const focusKeyword = pageContent?.seo?.focusKeyword;
    const relatedKeywords = pageContent?.seo?.relatedKeywords;


    return {
        title,
        description,
        keywords: [focusKeyword, ...(relatedKeywords || [])].filter(Boolean) as string[],
        openGraph: {
            title,
            description,
        },
        alternates: {
            canonical: "/contact"
        }
    }
}

export default async function ContactPage() {
    const pageData = await getContactPageContent();

    if (!pageData) {
        return (
            <DataMissing
                title="Contact Page Under Maintenance"
                description="We're currently updating our contact channels. Please try again in a few minutes."
            />
        )
    }

    return (
        <>
            <JsonLd schemas={pageData?.seo?.schemas} />
            <ContactClient
                pageData={pageData}
            />
        </>
    );
}

