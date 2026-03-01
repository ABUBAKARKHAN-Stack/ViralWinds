import { PageWrapper } from "@/components/layout";
import { JsonLd } from "@/components/SEO/JsonLd";
import { CTA } from "@/components/sections/services/all-services";
import {
    ServiceDetailsPageHero,
    HeroImage,
    ServiceOverview,
    OtherServices,
    ServiceBenefits,
    ServiceProcess,
    HowWeHelpSection,
    CaseStudiesSection,
    FAQSection,
    IndustriesSection,
    AreasWeServeSection,
    IntroSection,
    ServiceBlogs,
} from "@/components/sections/services/service-details/";
import { APP_NAME } from "@/constants/app.constants";
import {
    getService,
    getServicesCTA,
    getServiceSeo,
    getServicesForSSG
} from "@/helpers/service.helpers";
import { urlFor } from "@/sanity/lib/image";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";


type Props = {
    params: Promise<{ slug: string }>
}

//* SSG
export async function generateStaticParams() {
    const services = await getServicesForSSG()
    return services.map((s) => ({ slug: s.slug }))
}

//* Metadata
export async function generateMetadata(
    { params }: Props,
    _parent: ResolvingMetadata,
): Promise<Metadata> {
    const { slug } = await params;
    const service = await getServiceSeo(slug);

    if (!service) {
        return {
            title: "Service Not Found",
            description: "The requested service does not exist.",
            robots: { index: false },
        };
    }

    //* Base Metadata
    const title = service.seo.metaTitle;
    const description =
        service.seo.metaDescription;
    const focusKeyword = service.seo.focusKeyword;
    const relatedKeywords = service.seo.relatedKeywords;

    //* Open Graph Metadata
    const imageUrl = urlFor(service.heroImage.source)
        .quality(85)
        .width(1200)
        .fit("clip")
        .format("jpg")
        .url();
    const imageAlt = service.heroImage.alt;

    //* URL
    const serviceUrl = `/services/${slug}`;

    return {
        title,
        description,
        keywords: [focusKeyword, ...(relatedKeywords || [])].filter(Boolean) as string[],
        publisher: APP_NAME,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: imageAlt || title,
                },
            ],
            type: "article",
            siteName: APP_NAME,
            url: serviceUrl,
        },
        twitter: {
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: imageAlt || title,
                },
            ],
            card: "summary_large_image",
            site: serviceUrl,
            creator: APP_NAME,
        },
        alternates: {
            canonical: serviceUrl,
        },
    };
}

//* Page Component
const ServiceDetailPage = async ({
    params
}: Props) => {
    const { slug } = await params;
    const service = await getService(slug);
    const cta = await getServicesCTA()

    if (!service) {
        return notFound();
    }


    return (
        <PageWrapper>
            <JsonLd schemas={service.seo?.schemas} />

            {/* Service Page Hero Section */}

            <ServiceDetailsPageHero
                serviceTitle={service.title}
                serviceSubtitle={service.subtitle}
                serviceDescription={service.description}
            />

            {/* Service Hero Image Section */}

            <HeroImage
                heroImage={service.heroImage}
            />

            {/* Introduction of service Section */}

            <IntroSection
                introTagLine={service.introTagLine}
                introTitle={service.introTitle}
                introContent={service.introContent}
                roleTitle={service.roleTitle}
                roleContent={service.roleContent}
            />

            {/* How we help  Section */}

            <HowWeHelpSection
                points={service.howWeHelpPoints}
                howWeHelpSectionHeader={service.howWeHelpSection}
            />

            {/* Overview Of Service Section */}

            <ServiceOverview
                serviceOverviewSectionHeader={service.overviewSection}
                features={service.items}
            />

            {/* Service Process TIMELINE Section */}

            <ServiceProcess
                processSectionHeader={service.processSection}
                process={service.process}
            />

            {/* Areas We Serve Section */}

            <AreasWeServeSection
                areasWeServeSectionHeader={service.areasSection}
                areas={service.areas}
            />


            {/* Industries Section */}

            <IndustriesSection
                industriesSectionHeader={service.industriesSection}
                industries={service.industries}
            />


            {/* Service Benifits  & Why Choose US Section*/}

            <ServiceBenefits
                whyChooseUsSectionHeading={service.whyChooseUsSection}
                whyChooseUsPoints={service.whyChooseUsPoints}
                benifitsSectionHeading={service.benifitsSection}
                benefits={service.benefits}
            />

            {/* Case Studies Section */}

            <CaseStudiesSection
                caseStudiesSectionHeader={service.caseStudiesSection}
                caseStudies={service.caseStudies}
            />

            {/* FAQ Section */}

            <FAQSection
                faqsSectionHeader={service.faqsSection}
                faqs={service.faqs}
            />

            {/* Service CTA Section */}
            <CTA
                cta={cta}
            />

            <ServiceBlogs
                blogs={service.blogs}
                blogsSectionHeader={service.blogsSection}
                blogsButtonText={service.blogsButtonText}
                blogsButtonUrl={service.blogsButtonUrl}
            />

            {/* Other Services Section */}
            <OtherServices
                otherServices={service.otherServices}
                otherServicesSectionHeader={service.otherServicesSection}
                otherServicesButtonText={service.otherServicesButtonText}
                otherServicesButtonUrl={service.otherServicesButtonUrl}
            />


        </PageWrapper>
    )


};

export default ServiceDetailPage;