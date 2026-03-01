'use server'

import { serviceFormSchema, ServiceFormValues } from "@/lib/validations/service"
import { adminClient } from "@/sanity/lib/admin-client"
import { slugify } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { sanityFetch } from "@/sanity/lib/live"

import { unstable_noStore } from "next/cache"

export async function getDashboardServices() {
    unstable_noStore()
    try {
        const query = `*[_type == "service"] | order(_updatedAt desc) {
            _id,
            title,
            slug,
            "heroImageUrl": heroImage.asset->url,
            _updatedAt
        }`
        const data = await adminClient.fetch(query, {}, {
            perspective: "raw",
            useCdn: false,
        })



        const serviceMap = new Map<string, any>()

        data.forEach((service: any) => {
            const isDraft = service._id.startsWith('drafts.')
            const baseId = service._id.replace(/^(drafts\.)+/, '');

            // Safely extract a title string
            const titleValue = service.title;
            const titleStr = typeof titleValue === 'string'
                ? titleValue
                : (titleValue?.en || titleValue?.ar || (titleValue && typeof titleValue === 'object' ? Object.values(titleValue)[0] : null));

            // Safely extract a slug string
            const slugStr = typeof service.slug === 'string' ? service.slug : service.slug?.current;

            // DONT skip drafts that have a title but no slug (new drafts)
            // ONLY skip if it's truly empty shells (no title AND no slug)
            if (!titleStr && !slugStr) return;

            const displayTitle = titleStr || "Untitled Service";
            const displaySlug = slugStr || "";

            if (!serviceMap.has(baseId)) {
                serviceMap.set(baseId, {
                    ...service,
                    _id: baseId,
                    title: displayTitle,
                    slug: displaySlug,
                    status: isDraft ? 'Draft' : 'Published'
                })
            } else {
                const existing = serviceMap.get(baseId)
                if (isDraft) {
                    serviceMap.set(baseId, {
                        ...service,
                        _id: baseId,
                        title: displayTitle,
                        slug: displaySlug,
                        status: 'Draft',
                        hasPublished: true
                    })
                } else {
                    serviceMap.set(baseId, {
                        ...existing,
                        status: 'Draft',
                        hasPublished: true
                    })
                }
            }
        })

        return Array.from(serviceMap.values())
    } catch (error) {
        console.error("Failed to fetch dashboard services:", error)
        return []
    }
}

export async function getServiceById(id: string) {
    try {
        const query = `*[_type == "service" && (_id == $id || _id == "drafts." + $id)] | order(_updatedAt desc)[0] {
            _id,
            _type,
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
            seo
        }`

        const service = await sanityFetch({ query, params: { id } })
        return service.data
    } catch (error) {
        console.error("Failed to fetch service by ID:", error)
        return null
    }
}

export async function createService(data: ServiceFormValues) {
    try {
        const validatedFields = serviceFormSchema.parse(data)
        const slug = validatedFields.slug || slugify(validatedFields.title)

        const doc = {
            _type: 'service',
            title: validatedFields.title,
            subtitle: validatedFields.subtitle,
            description: validatedFields.description,
            slug: { _type: 'slug', current: slug },
            ...(validatedFields.heroImage && {
                heroImage: {
                    _type: 'image',
                    asset: validatedFields.heroImage.asset,
                    alt: validatedFields.heroImageAlt
                }
            }),
            introTagLine: validatedFields.introTagLine,
            introTitle: validatedFields.introTitle,
            introContent: validatedFields.introContent,
            roleTitle: validatedFields.roleTitle,
            roleContent: validatedFields.roleContent,
            howWeHelpSection: { _type: 'sectionHeading', ...validatedFields.howWeHelpSection },
            howWeHelpPoints: validatedFields.howWeHelpPoints,
            overviewSection: { _type: 'sectionHeading', ...validatedFields.overviewSection },
            items: validatedFields.items,
            processSection: { _type: 'sectionHeading', ...validatedFields.processSection },
            process: validatedFields.process,
            areasSection: { _type: 'sectionHeading', ...validatedFields.areasSection },
            areas: validatedFields.areas,
            industriesSection: { _type: 'sectionHeading', ...validatedFields.industriesSection },
            industries: validatedFields.industries,
            benifitsSection: { _type: 'sectionHeading', ...validatedFields.benifitsSection },
            benefits: validatedFields.benefits,
            whyChooseUsSection: { _type: 'sectionHeading', ...validatedFields.whyChooseUsSection },
            whyChooseUsPoints: validatedFields.whyChooseUsPoints,
            caseStudiesSection: { _type: 'sectionHeading', ...validatedFields.caseStudiesSection },
            caseStudies: validatedFields.caseStudies,
            faqsSection: { _type: 'sectionHeading', ...validatedFields.faqsSection },
            faqs: validatedFields.faqs,
            blogsSection: { _type: 'sectionHeading', ...validatedFields.blogsSection },
            blogs: validatedFields.blogs?.map(id => ({ _type: 'reference', _ref: id, _key: Math.random().toString(36).substring(2, 9) })),
            blogsButtonText: validatedFields.blogsButtonText,
            blogsButtonUrl: validatedFields.blogsButtonUrl,
            otherServicesSection: { _type: 'sectionHeading', ...validatedFields.otherServicesSection },
            otherServices: validatedFields.otherServices?.map(id => ({ _type: 'reference', _ref: id, _key: Math.random().toString(36).substring(2, 9) })),
            otherServicesButtonText: validatedFields.otherServicesButtonText,
            otherServicesButtonUrl: validatedFields.otherServicesButtonUrl,
            seo: validatedFields.seo
        }

        const result = await adminClient.create(doc)
        revalidatePath('/admin/services')
        return { success: true, id: result._id }
    } catch (error: any) {
        console.error("Failed to create service:", error)
        return { success: false, error: error.message }
    }
}

export async function updateService(id: string, data: ServiceFormValues) {
    try {
        if (!id) return { success: false, error: "Service ID is required" }
        const validatedFields = serviceFormSchema.parse(data)
        const baseId = id.replace(/^(drafts\.)+/, '');

        const docData: any = {
            _type: 'service',
            title: validatedFields.title,
            subtitle: validatedFields.subtitle,
            description: validatedFields.description,
            slug: { _type: 'slug', current: validatedFields.slug },
            ...(validatedFields.heroImage && {
                heroImage: {
                    _type: 'image',
                    asset: validatedFields.heroImage.asset,
                    heroImageAlt: validatedFields.heroImageAlt
                }
            }),
            introTagLine: validatedFields.introTagLine,
            introTitle: validatedFields.introTitle,
            introContent: validatedFields.introContent,
            roleTitle: validatedFields.roleTitle,
            roleContent: validatedFields.roleContent,
            howWeHelpSection: { _type: 'sectionHeading', ...validatedFields.howWeHelpSection },
            howWeHelpPoints: validatedFields.howWeHelpPoints,
            overviewSection: { _type: 'sectionHeading', ...validatedFields.overviewSection },
            items: validatedFields.items,
            processSection: { _type: 'sectionHeading', ...validatedFields.processSection },
            process: validatedFields.process,
            areasSection: { _type: 'sectionHeading', ...validatedFields.areasSection },
            areas: validatedFields.areas.map((area: any) => ({
                ...area,
                _key: area._key || Math.random().toString(36).substring(2, 9)
            })),
            industriesSection: { _type: 'sectionHeading', ...validatedFields.industriesSection },
            industries: validatedFields.industries.map((ind: any) => ({
                ...ind,
                _key: ind._key || Math.random().toString(36).substring(2, 9)
            })),
            benifitsSection: { _type: 'sectionHeading', ...validatedFields.benifitsSection },
            benefits: validatedFields.benefits,
            whyChooseUsSection: { _type: 'sectionHeading', ...validatedFields.whyChooseUsSection },
            whyChooseUsPoints: validatedFields.whyChooseUsPoints.map((p: any) => ({
                ...p,
                _key: p._key || Math.random().toString(36).substring(2, 9)
            })),
            caseStudiesSection: { _type: 'sectionHeading', ...validatedFields.caseStudiesSection },
            caseStudies: validatedFields.caseStudies.map((cs: any) => ({
                ...cs,
                _key: cs._key || Math.random().toString(36).substring(2, 9)
            })),
            faqsSection: { _type: 'sectionHeading', ...validatedFields.faqsSection },
            faqs: validatedFields.faqs.map((f: any) => ({
                ...f,
                _key: f._key || Math.random().toString(36).substring(2, 9)
            })),
            blogsSection: { _type: 'sectionHeading', ...validatedFields.blogsSection },
            blogs: validatedFields.blogs?.map(id => ({ _type: 'reference', _ref: id, _key: Math.random().toString(36).substring(2, 9) })),
            blogsButtonText: validatedFields.blogsButtonText,
            blogsButtonUrl: validatedFields.blogsButtonUrl,
            otherServicesSection: { _type: 'sectionHeading', ...validatedFields.otherServicesSection },
            otherServices: validatedFields.otherServices?.map(id => ({ _type: 'reference', _ref: id, _key: Math.random().toString(36).substring(2, 9) })),
            otherServicesButtonText: validatedFields.otherServicesButtonText,
            otherServicesButtonUrl: validatedFields.otherServicesButtonUrl,
            seo: validatedFields.seo
        }

        // Use createOrReplace to publish the document to the base ID
        await adminClient.createOrReplace({
            ...docData,
            _id: baseId
        })

        // Delete draft if it exists
        try {
            await adminClient.delete(`drafts.${baseId}`)
        } catch (e) {
            // Ignore if no draft
        }

        revalidatePath('/admin/services')
        revalidatePath(`/services/${baseId}`)

        return { success: true, id: baseId }
    } catch (error: any) {
        console.error("Failed to update service:", error)
        return { success: false, error: error.message }
    }
}

export async function duplicateService(id: string) {
    try {
        const sourceService = await getServiceById(id)
        if (!sourceService) return { success: false, error: "Source service not found" }

        const newDoc: any = {
            _type: 'service',
            title: `${sourceService.title} (Copy)`,
            subtitle: sourceService.subtitle,
            description: sourceService.description,
            // Slug is intentionally omitted
            heroImage: sourceService.heroImage?.asset ? {
                _type: 'image',
                asset: sourceService.heroImage.asset,
                heroImageAlt: sourceService.heroImage.heroImageAlt
            } : undefined,
            introTagLine: sourceService.introTagLine,
            introTitle: sourceService.introTitle,
            introContent: sourceService.introContent,
            roleTitle: sourceService.roleTitle,
            roleContent: sourceService.roleContent,
            howWeHelpSection: sourceService.howWeHelpSection,
            howWeHelpPoints: sourceService.howWeHelpPoints,
            overviewSection: sourceService.overviewSection,
            items: sourceService.items,
            processSection: sourceService.processSection,
            process: sourceService.process,
            areasSection: sourceService.areasSection,
            areas: sourceService.areas,
            industriesSection: sourceService.industriesSection,
            industries: sourceService.industries,
            benifitsSection: sourceService.benifitsSection,
            benefits: sourceService.benefits,
            whyChooseUsSection: sourceService.whyChooseUsSection,
            whyChooseUsPoints: sourceService.whyChooseUsPoints,
            caseStudiesSection: sourceService.caseStudiesSection,
            caseStudies: sourceService.caseStudies,
            faqsSection: sourceService.faqsSection,
            faqs: sourceService.faqs,
            blogsSection: sourceService.blogsSection,
            blogs: sourceService.blogs,
            seo: sourceService.seo
        }

        const result = await adminClient.create(newDoc)
        revalidatePath('/admin/services')
        return { success: true, id: result._id }
    } catch (error: any) {
        console.error("Failed to duplicate service:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteService(id: string) {
    try {
        const baseId = id.replace(/^(drafts\.)+/, '');
        const transaction = adminClient.transaction()
        transaction.delete(baseId)
        transaction.delete(`drafts.${baseId}`)
        await transaction.commit()

        revalidatePath('/admin/services')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete service:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteMultipleServices(ids: string[]) {
    try {
        const transaction = adminClient.transaction()
        ids.forEach(id => {
            const baseId = id.replace(/^(drafts\.)+/, '');
            transaction.delete(baseId)
            transaction.delete(`drafts.${baseId}`)
        })
        await transaction.commit()
        revalidatePath('/admin/services')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete multiple services:", error)
        return { success: false, error: error.message }
    }
}
