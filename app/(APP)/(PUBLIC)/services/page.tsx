import { PageWrapper } from '@/components/layout'
import {
    AllServices,
    CTA,
    ProcessTimeline,
    ServicesBlogs,
    ServicesIntro,
    ServicesPageHero,
    WhyWorkWithUs
} from '@/components/sections/services/all-services'
import { JsonLd } from '@/components/SEO/JsonLd'
import { getServicesCTA } from '@/helpers/service.helpers'
import { getServicesPageContent } from '@/helpers/services-page-content.helpers'
import { Metadata } from 'next'


export const generateMetadata = async (): Promise<Metadata> => {

    const pageContent = await getServicesPageContent();

    if (!pageContent) {
        return {
            title: "Services Page Not Found",
            description: "The requested services page does not exist.",
            robots: { index: false },
        };
    }

    //* Base Metadata
    const title = pageContent?.seo?.metaTitle;
    const description = pageContent.seo.description;
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
            canonical: "/services"
        }
    }
}

const ServicesPage = async () => {
    const [ctaResult, pageContentResult] = await Promise.allSettled([
        getServicesCTA(),
        getServicesPageContent()
    ]);


    const cta = ctaResult.status === "fulfilled" ? ctaResult.value : null;
    const pageContent = pageContentResult.status === "fulfilled" ? pageContentResult.value : null;


    //* Provide fallback if content not found
    if (!pageContent || !cta) {
        throw new Error("Services page content not found");
    }

    return (
        <PageWrapper>

            {/* JSON-LD Schema */}
            <JsonLd schemas={pageContent.seo?.schemas} />

            {/* Hero Section */}
            <ServicesPageHero
                title={pageContent.hero.title}
                subtitle={pageContent.hero.subtitle}
                description={pageContent.hero.description}
            />

            {/* Intro Section */}
            <ServicesIntro
                badgeText={pageContent.intro.badgeText}
                heading={pageContent.intro.heading}
                headingAccent={pageContent.intro.headingAccent}
                description={pageContent.intro.description}
            />

            {/* All Services Section */}
            <AllServices
             sectionHeading={pageContent.servicesList.sectionHeading}
                services={pageContent.servicesList.services}
            />

            {/* Process Timeline Section */}
            <ProcessTimeline
                sectionHeading={pageContent.process.sectionHeading}
                steps={pageContent.process.steps}
            />
            {/* Why Work With Us Section */}
            <WhyWorkWithUs
                sectionHeading={pageContent.whyChooseUs.sectionHeading}
                guaranteePoints={pageContent.whyChooseUs.guaranteePoints}
                benefits={pageContent.whyChooseUs.benefits}
            />

            {/* CTA Section */}
            <CTA cta={cta} />

            {/* Services Blogs Section */}
            <ServicesBlogs
                sectionHeading={pageContent.serviceBlogs.sectionHeading}
                blogs={pageContent.serviceBlogs.blogs}
                buttonText={pageContent.serviceBlogs.buttonText}
                buttonUrl={pageContent.serviceBlogs.buttonUrl}
            />
        </PageWrapper>
    )
}

export default ServicesPage