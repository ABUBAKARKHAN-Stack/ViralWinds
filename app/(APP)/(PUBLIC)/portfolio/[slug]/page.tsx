import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { getProject, getProjectSeo, getProjectSlugs } from "@/helpers/portfolio.helpers"
import { ContainerLayout, PageWrapper } from "@/components/layout"
import { Quote } from "lucide-react"
import { urlFor } from "@/sanity/lib/image"
import { APP_NAME } from "@/constants/app.constants"
import { JsonLd } from "@/components/SEO/JsonLd"
import {
    PortfolioPageHero,
    CaseStudyResults,
    BeforeAfter,
    ProjectHeroImage
} from "@/components/sections/portfolio/project-details"
import { LinkProcessor } from "@/components/ui/LinkProcessor"

interface Props {
    params: Promise<{
        slug: string
    }>
}

//* SSG
export async function generateStaticParams() {
    const slugs = await getProjectSlugs()

    return slugs.map(({ slug }) => ({
        slug,
    }))
}

//* Metadata
export async function generateMetadata(
    { params }: Props,
    _parent: ResolvingMetadata,
): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectSeo(slug);

    if (!project) {
        return {
            title: "Project Not Found",
            description: "The requested project does not exist.",
            robots: { index: false },
        };
    }

    //* Base Metadata
    const title = project.seo.metaTitle;
    const description =
        project.seo.metaDescription;
    const focusKeyword = project.seo.focusKeyword;
    const relatedKeywords = project.seo.relatedKeywords;

    //* Open Graph Metadata
    const imageUrl = urlFor(project.mainImage.source)
        .quality(85)
        .width(1200)
        .fit("clip")
        .format("jpg")
        .url();
    const imageAlt = project.mainImage.alt;

    //* URL
    const projectUrl = `/portfolio/${slug}`;

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
            url: projectUrl,
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
            site: projectUrl,
            creator: APP_NAME,
        },
        alternates: {
            canonical: projectUrl,
        },
    };
}

export default async function PortfolioDetailsPage({ params }: Props) {
    const { slug } = await params
    const project = await getProject(slug)

    if (!project) {
        notFound()
    }

    const { caseStudy } = project
    

    return (
        <PageWrapper>
            <JsonLd schemas={project.seo.schemas} />

            <PortfolioPageHero
                projectTitle={project.title}
                projectDescription={project.description}

            />

            <ProjectHeroImage
                heroImage={project.mainImage}
            />

            <ContainerLayout>
                <div className="max-w-4xl mx-auto space-y-24">
                    {/* Project Overview */}
                    <section className="pt-24">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="md:col-span-2">
                                <h2 className="text-3xl font-display font-bold mb-6">The Challenge</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    <LinkProcessor text={project.description} />
                                </p>

                                {/* Tags */}
                                {project.tags && Array.isArray(project.tags) && (
                                    <div className="flex flex-wrap gap-2 mt-8">
                                        {project.tags.map((tag: string) => (
                                            <span
                                                key={tag.trim()}
                                                className="px-4 py-1.5 text-xs font-medium uppercase tracking-widest bg-muted text-muted-foreground border border-border rounded-full hover:border-accent hover:text-accent transition-all duration-300 cursor-default"
                                            >
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-1 space-y-8">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-widest text-accent mb-2">Category</h3>
                                    <p className="font-medium">{caseStudy?.category || project.category}</p>
                                </div>
                                {caseStudy?.title && (
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-widest text-accent mb-2">Client</h3>
                                        <p className="font-medium">{caseStudy.title}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Results / Stats */}
                    {caseStudy?.results && (
                        <CaseStudyResults results={caseStudy.results} />
                    )}

                    {/* Before/After Section */}
                    {caseStudy?.beforeImage?.url && caseStudy?.afterImage?.url && (
                        <section>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-display font-bold mb-4">Transformation</h2>
                                <p className="text-muted-foreground">Witness the evolution of the brand through our strategic design process.</p>
                            </div>
                            <BeforeAfter
                                beforeImage={caseStudy.beforeImage}
                                afterImage={caseStudy.afterImage}
                            />
                        </section>
                    )}

                    {/* Testimonial */}
                    {caseStudy?.testimonial && (
                        <section className="relative py-24 px-8 md:px-16 bg-muted/30 rounded-3xl border border-border overflow-hidden">
                            <Quote className="absolute top-8 left-8 h-12 w-12 text-accent/10" />
                            <div className="relative z-10 text-center max-w-2xl mx-auto">
                                <p className="text-xl md:text-2xl font-display italic leading-relaxed mb-8">
                                    "<LinkProcessor text={caseStudy.testimonial} />"
                                </p>
                                <div className="flex items-center justify-center gap-4 text-accent">
                                    <div className="h-px w-8 bg-accent/30" />
                                    <span className="font-semibold uppercase tracking-widest text-sm">Client Testimonial</span>
                                    <div className="h-px w-8 bg-accent/30" />
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </ContainerLayout>
        </PageWrapper>
    )
}
