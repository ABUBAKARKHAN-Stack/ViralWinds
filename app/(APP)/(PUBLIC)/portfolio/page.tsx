import { PageWrapper } from "@/components/layout";
import { PortfolioPageHero, MainContent } from "@/components/sections/portfolio/all-projects/";
import { Metadata } from "next";
import { getPortfolioPageContent } from "@/helpers/portfolio-page-content.helpers";
import PageCTA from "@/components/sections/shared/PageCTA";
import { JsonLd } from "@/components/SEO/JsonLd";


export const generateMetadata = async (): Promise<Metadata> => {

    const pageContent = await getPortfolioPageContent();

    if (!pageContent) {
        return {
            title: "Portfolio Page Not Found",
            description: "The requested portfolio page does not exist.",
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
            canonical: "/portfolio"
        }
    }
}


const Portfolio = async () => {
  const pageContent = await getPortfolioPageContent();

  if (!pageContent) throw new Error("Portfolio page content not found");

  return (
    <PageWrapper>
      <JsonLd schemas={pageContent.seo.schemas} />
      <PortfolioPageHero
        title={pageContent.hero.title}
        subtitle={pageContent.hero.subtitle}
        description={pageContent.hero.description}
      />
      <MainContent projects={pageContent.portfolioList.projects} />
      <PageCTA cta={pageContent.cta} />
    </PageWrapper>
  );
};

export default Portfolio;
