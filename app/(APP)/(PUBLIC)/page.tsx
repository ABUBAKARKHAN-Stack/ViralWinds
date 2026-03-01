import { PageWrapper } from "@/components/layout";
import {
  Hero,
  ServiceHighlightsMarquee,
  TrustedByBrands,
  AboutPreview,
  PortfolioPreview,
  Testimonials,
  FAQs,
  BlogPreview,
  CaseStudiesPreview,
  AreasWeServe,
} from "@/components/sections/landing/";

import {
  ServicesPreview,
  IndustriesWeServe,
  Leadership,
  OurApproach,
  WhyChooseUs,
  CTA,
} from "@/components/sections/shared/";

import { JsonLd } from "@/components/SEO/JsonLd";
import { LandingPageContentProvider } from "@/context/LandingPageContentContext";
import { getLandingPageContent } from "@/helpers/landing-page-content.helpers";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {

  const pageContent = await getLandingPageContent();

  if (!pageContent) {
    return {
      title: "Home Page Not Found",
      description: "The requested home page does not exist.",
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
      canonical: "/"
    }
  }
}

const HomePage = async () => {
  const pageContent = await getLandingPageContent();

  if (!pageContent) {
    throw new Error("Home page content not found");
  }

  return (
    <LandingPageContentProvider landingPageContent={pageContent}>
      <PageWrapper>
        {/* SEO */}
        <JsonLd schemas={pageContent.seo.schemas} />

        {/* Hero */}
        <Hero />

        {/* Service Highlights Marquee */}
        <ServiceHighlightsMarquee />

        {/* Trusted By Brands */}
        <TrustedByBrands />

        {/* About Preview */}
        <AboutPreview />

        {/* Our Approach */}
        <OurApproach />

        {/* Services Preview */}
        <ServicesPreview />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Portfolio Preview */}
        <PortfolioPreview />

        {/* Case Studies Preview */}
        <CaseStudiesPreview />

        {/* Areas We Serve */}
        <AreasWeServe />

        {/* Industries We Serve */}
        <IndustriesWeServe />

        {/* Testimonials */}
        <Testimonials />

        {/* Leadership */}
        <Leadership />

        {/* Blog Preview */}
        <BlogPreview />

        {/* FAQs */}
        <FAQs />

        {/* CTA */}
        <CTA />
      </PageWrapper>
    </LandingPageContentProvider>
  );
};

export default HomePage;