import ContactClient from "./ContactClient";
import { Metadata } from "next";
import { getContactPageContent } from "@/helpers/contact-page-content";
import { PageWrapper } from "@/components/layout";
import { JsonLd } from "@/components/SEO/JsonLd";

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
    const title = pageContent?.seo?.metaTitle;
    const description = pageContent.seo.metaDescription;
    const focusKeyword = pageContent.seo.focusKeyword;
    const relatedKeywords = pageContent.seo.relatedKeywords;


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

    return (
        <>
            <JsonLd schemas={pageData.seo.schemas} />
            <ContactClient
                pageData={pageData}
            />
        </>
    );
}

