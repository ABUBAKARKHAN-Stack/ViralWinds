import { ServiceForm } from "@/components/admin/services/ServiceForm"
import { getServiceDraft } from "@/app/actions/serviceDraftActions"
import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import { getDashboardPosts } from "@/app/actions/blog"
import { getDashboardServices } from "@/app/actions/service"

interface Service {
    _id: string
    _updatedAt: string
    title: string
    subtitle: string
    description: string
    slug: { current: string }
    heroImage?: {
        _type: 'image',
        asset?: {
            _ref: string,
            _type: 'reference',
            url?: string
        },
        heroImageAlt: string
    }
    introTagLine: string
    introTitle: string
    introContent: string
    roleTitle: string
    roleContent: string[]
    howWeHelpSection: any
    howWeHelpPoints: any[]
    overviewSection: any
    items: string[]
    processSection: any
    process: any[]
    areasSection: any
    areas?: any[]
    industriesSection: any
    industries?: any[]
    benifitsSection: any
    benefits: string[]
    whyChooseUsSection: any
    whyChooseUsPoints: any[]
    caseStudiesSection: any
    caseStudies?: any[]
    faqs?: any[]
    blogsSection?: any
    blogs?: any[]
    blogsButtonText?: any
    blogsButtonUrl?: any
    otherServicesSection?: any
    otherServices?: any[]
    otherServicesButtonText?: any
    otherServicesButtonUrl?: any
    seo: any
}

async function getService(id: string) {
    const query = `*[_type == "service" && _id == $id][0] {
        _id,
        _updatedAt,
        title,
        subtitle,
        description,
        slug,
        heroImage {
            ...,
            asset,
            "url": asset->url
        },
        introTagLine,
        introTitle,
        introContent,
        roleTitle,
        roleContent,
        howWeHelpSection,
        howWeHelpPoints,
        overviewSection,
        items,
        processSection,
        process,
        areasSection,
        areas,
        industriesSection,
        industries,
        benifitsSection,
        benefits,
        whyChooseUsSection,
        whyChooseUsPoints,
        caseStudiesSection,
        caseStudies,
        faqsSection,
        faqs,
        blogsSection,
        blogs,
        blogsButtonText,
        blogsButtonUrl,
        otherServicesSection,
        otherServices,
        otherServicesButtonText,
        otherServicesButtonUrl,
        seo
    }`

    const service = await sanityFetch({ query, params: { id } })
    return service.data as Service
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const draft = (await getServiceDraft(id)) as any
    const published = await getService(id)
    const blogs = await getDashboardPosts()
    const services = await getDashboardServices()

    const service = draft || published

    if (!service) {
        notFound()
    }

    const hasDraft = !!draft
    const draftUpdatedAt = draft?._updatedAt || null


    // Transform service data to match form structure
    const initialData = {
        title: service.title || "",
        subtitle: service.subtitle || "",
        description: service.description || "",
        slug: service.slug?.current || "",
        heroImage: service.heroImage,
        heroImageAlt: service.heroImage?.heroImageAlt || "",
        introTagLine: service.introTagLine || "",
        introTitle: service.introTitle || "",
        introContent: service.introContent || "",
        roleTitle: service.roleTitle || "",
        roleContent: service.roleContent || [""],
        howWeHelpSection: service.howWeHelpSection || { _key: 'initial-how-1', title: "", description: "", eyebrow: "" },
        howWeHelpPoints: service.howWeHelpPoints || [{ _key: 'initial-help-1', title: "", description: "" }],
        overviewSection: service.overviewSection || { _key: 'initial-over-1', title: "", description: "", eyebrow: "" },
        items: (service.items && service.items.length >= 2) ? service.items : (service.items && service.items.length === 1) ? [service.items[0], ""] : ["", ""],
        processSection: service.processSection || { _key: 'initial-proc-1', title: "", description: "", eyebrow: "" },
        process: service.process || [{ _key: 'initial-proc-step-1', step: "01", title: "", desc: "" }],
        areasSection: service.areasSection || { _key: 'initial-area-1', title: "", description: "", eyebrow: "" },
        areas: (service.areas && service.areas.length > 0) ? service.areas.map((area: any) => ({
            ...area,
            clients: String(area.clients ?? "")
        })) : [{ _key: 'initial-area-item-1', region: "", locations: [""], featured: false, clients: "", flag: "" }],
        industriesSection: service.industriesSection || { _key: 'initial-ind-1', title: "", description: "", eyebrow: "" },
        industries: (service.industries && service.industries.length > 0) ? service.industries : [{ _key: 'initial-ind-item-1', name: "", description: "" }],
        benifitsSection: service.benifitsSection || { _key: 'initial-ben-1', title: "", description: "", eyebrow: "" },
        benefits: service.benefits || [""],
        whyChooseUsSection: service.whyChooseUsSection || { _key: 'initial-why-1', title: "", description: "", eyebrow: "" },
        whyChooseUsPoints: service.whyChooseUsPoints || [{ _key: 'initial-why-item-1', title: "", description: "" }],
        caseStudiesSection: service.caseStudiesSection || { _key: 'initial-case-1', title: "", description: "", eyebrow: "" },
        caseStudies: (service.caseStudies && service.caseStudies.length > 0) ? service.caseStudies : [{ _key: 'initial-case-item-1', title: "", problem: "", solution: "", result: "" }],
        faqsSection: service.faqsSection || { _key: 'initial-faq-1', title: "", description: "", eyebrow: "" },
        faqs: (service.faqs && service.faqs.length > 0) ? service.faqs : [{ _key: 'initial-faq-item-1', question: "", answer: "" }],
        blogsSection: service.blogsSection || { _key: 'initial-blogs-1', title: "", description: "", eyebrow: "" },
        blogs: service.blogs?.map((b: any) => b._ref || b._id) || [],
        blogsButtonText: service.blogsButtonText || "",
        blogsButtonUrl: service.blogsButtonUrl || "",
        otherServicesSection: service.otherServicesSection || { _key: 'initial-other-1', title: "", description: "", eyebrow: "" },
        otherServices: service.otherServices?.map((s: any) => s._ref || s._id) || [],
        otherServicesButtonText: service.otherServicesButtonText || "",
        otherServicesButtonUrl: service.otherServicesButtonUrl || "",
        seo: service.seo || { relatedKeywords: [], schemas: [] }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
                <p className="text-muted-foreground">
                    Update service information and content.
                </p>
            </div>
            <ServiceForm
                initialData={initialData as any}
                serviceId={published?._id || service._id}
                hasDraft={hasDraft}
                draftUpdatedAt={draftUpdatedAt}
                availableBlogs={blogs}
                availableServices={services}
            />
        </div>
    )
}
