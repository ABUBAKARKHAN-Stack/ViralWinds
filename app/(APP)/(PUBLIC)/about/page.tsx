
import {
    AboutPageHero,
    IntroSection,
    MissionVisionSection,
    PhilosophySection,
    GlobalReachSection,
    CultureSection,
} from '@/components/sections/about'
import { PageWrapper } from "@/components/layout";
import {
    ServicesPreview,
    IndustriesWeServe,
    Leadership,
    CTA,
    WhyChooseUs,
    OurApproach,

} from "@/components/sections/shared/";
import { AboutPageContentProvider } from '@/context/AboutPageContentContext';
import { getAboutPageContent } from '@/helpers/about-page-content.helpers';
import { Metadata } from 'next';
import { JsonLd } from '@/components/SEO/JsonLd';


export const generateMetadata = async (): Promise<Metadata> => {

    const pageContent = await getAboutPageContent();

    if (!pageContent) {
        return {
            title: "About Page Not Found",
            description: "The requested about page does not exist.",
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
            canonical: "/about"
        }
    }
}


const About = async () => {

    const pageContent = await getAboutPageContent()

    if (!pageContent) {
        throw new Error("About page content not found");
    }


    return (
        <AboutPageContentProvider aboutPageContent={pageContent}>
            <PageWrapper>
                <JsonLd schemas={pageContent.seo.schemas} />
                <AboutPageHero />
                <IntroSection />
                <MissionVisionSection />
                <PhilosophySection />
                <ServicesPreview />
                <OurApproach />
                <IndustriesWeServe />
                <GlobalReachSection />
                <WhyChooseUs />
                <Leadership />
                <CultureSection />
                <CTA />
            </PageWrapper>
        </AboutPageContentProvider>
    );
};

export default About;
