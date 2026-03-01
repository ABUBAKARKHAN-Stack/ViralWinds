"use client"
import PageHero from '@/components/ui/page-hero'
import { useAboutPageContent } from '@/context/AboutPageContentContext';

const AboutPageHero = () => {
    const { aboutPageContent } = useAboutPageContent();
    const heroData = aboutPageContent?.hero;

    return (
        <PageHero
            title={heroData?.title || "About"}
            subtitle={heroData?.subtitle || "Our Story"}
            description={heroData?.description || "A full-service creative digital agency dedicated to helping businesses build strong brands and grow with confidence."}
            breadcrumbs={[{ label: "About" }]}
        />
    )
}

export default AboutPageHero