import { PageWrapper } from "@/components/layout"
import PageHero from "@/components/ui/page-hero"
import { getBlogPageContent } from "@/helpers/blog-page-content.helpers"
import BlogMainContent from "@/components/sections/blog/BlogMainContent"
import PageCTA from "@/components/sections/shared/PageCTA"
import { Metadata } from "next"
import { JsonLd } from "@/components/SEO/JsonLd"

export const generateMetadata = async (): Promise<Metadata> => {

  const pageContent = await getBlogPageContent()

    if (!pageContent) {
        return {
            title: "Blog Page Not Found",
            description: "The requested blog page does not exist.",
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
            canonical: "/blog"
        }
    }
}

const Blog = async () => {
  const pageContent = await getBlogPageContent()

  if (!pageContent) throw new Error("Blog page content not found")

  return (
    <PageWrapper>

      <JsonLd schemas={pageContent.seo.schemas} />

      <PageHero
        title={pageContent.hero.title}
        subtitle={pageContent.hero.subtitle}
        description={pageContent.hero.description}
        breadcrumbs={[{ label: "Blog" }]}
      />

      <BlogMainContent posts={pageContent.blogList.posts} />

      <PageCTA cta={pageContent.cta} />
    </PageWrapper>
  )
}

export default Blog
