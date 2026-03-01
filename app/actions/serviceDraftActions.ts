'use server'

import { serviceFormSchema, ServiceFormValues } from "@/lib/validations/service"
import { adminClient } from "@/sanity/lib/admin-client"
import { revalidatePath } from "next/cache"

const sanitizeSanityData = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(sanitizeSanityData);
    }
    if (data !== null && typeof data === 'object') {
        const cleaned: any = {};
        for (const key in data) {
            // Filter out internal system fields but keep _id and _type
            if (['_rev', '_createdAt', '_updatedAt'].includes(key)) continue;

            // If this is a reference object, don't allow 'url' key
            if (key === 'url' && data._type === 'reference') {
                continue;
            }
            cleaned[key] = sanitizeSanityData(data[key]);
        }
        return cleaned;
    }
    return data;
};

export async function saveServiceDraft(id: string, data: Partial<ServiceFormValues>) {
    try {
        if (!id) return { success: false, error: "ID required for draft" }

        // Normalize ID
        const cleanId = id.replace(/^(drafts\.)+/, '');
        const draftId = `drafts.${cleanId}`;

        // Sanitize data
        const sanitizedData = sanitizeSanityData(data);

        // Build surgical patch
        const toSet: any = {};
        const toUnset: string[] = [];

        // 1. Basic Info
        if (sanitizedData.title) toSet.title = sanitizedData.title;
        if (sanitizedData.subtitle) toSet.subtitle = sanitizedData.subtitle;
        if (sanitizedData.description) toSet.description = sanitizedData.description;
        if (sanitizedData.slug) {
            toSet.slug = { _type: 'slug', current: sanitizedData.slug };
        }

        // 2. Hero
        if (sanitizedData.heroImage) {
            const assetId = sanitizedData.heroImage.asset?._ref || sanitizedData.heroImage.asset?._id;
            if (assetId) {
                toSet.heroImage = {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: assetId },
                    heroImageAlt: sanitizedData.heroImageAlt
                };
            } else if (sanitizedData.heroImage === null) {
                toUnset.push('heroImage');
            }
        } else if (sanitizedData.heroImageAlt) {
            // If image is already there but only alt is changing
            toSet['heroImage.heroImageAlt'] = sanitizedData.heroImageAlt;
        }

        // 3. Intro
        if (sanitizedData.introTagLine) toSet.introTagLine = sanitizedData.introTagLine;
        if (sanitizedData.introTitle) toSet.introTitle = sanitizedData.introTitle;
        if (sanitizedData.introContent) toSet.introContent = sanitizedData.introContent;

        // 4. Role
        if (sanitizedData.roleTitle) toSet.roleTitle = sanitizedData.roleTitle;
        if (Array.isArray(sanitizedData.roleContent)) toSet.roleContent = sanitizedData.roleContent;

        // 5. How We Help
        if (sanitizedData.howWeHelpSection) toSet.howWeHelpSection = sanitizedData.howWeHelpSection;
        if (Array.isArray(sanitizedData.howWeHelpPoints)) toSet.howWeHelpPoints = sanitizedData.howWeHelpPoints.map((p: any) => ({ ...p, _key: p._key || Math.random().toString(36).substring(2, 9) }));

        // 6. Overview
        if (sanitizedData.overviewSection) toSet.overviewSection = sanitizedData.overviewSection;
        if (Array.isArray(sanitizedData.items)) toSet.items = sanitizedData.items;

        // 7. Process
        if (sanitizedData.processSection) toSet.processSection = sanitizedData.processSection;
        if (Array.isArray(sanitizedData.process)) toSet.process = sanitizedData.process.map((p: any) => ({ ...p, _key: p._key || Math.random().toString(36).substring(2, 9) }));

        // 8. Areas
        if (sanitizedData.areasSection) toSet.areasSection = sanitizedData.areasSection;
        if (Array.isArray(sanitizedData.areas)) toSet.areas = sanitizedData.areas.map((p: any) => ({ ...p, _key: p._key || Math.random().toString(36).substring(2, 9) }));

        // 9. Industries
        if (sanitizedData.industriesSection) toSet.industriesSection = sanitizedData.industriesSection;
        if (Array.isArray(sanitizedData.industries)) toSet.industries = sanitizedData.industries.map((p: any) => ({ ...p, _key: p._key || Math.random().toString(36).substring(2, 9) }));

        // 10. Benefits
        if (sanitizedData.benifitsSection) toSet.benifitsSection = sanitizedData.benifitsSection;
        if (Array.isArray(sanitizedData.benefits)) toSet.benefits = sanitizedData.benefits;

        // 11. Why Choose Us
        if (sanitizedData.whyChooseUsSection) toSet.whyChooseUsSection = sanitizedData.whyChooseUsSection;
        if (Array.isArray(sanitizedData.whyChooseUsPoints)) toSet.whyChooseUsPoints = sanitizedData.whyChooseUsPoints.map((p: any) => ({ ...p, _key: p._key || Math.random().toString(36).substring(2, 9) }));

        // 12. Case Studies
        if (sanitizedData.caseStudiesSection) toSet.caseStudiesSection = sanitizedData.caseStudiesSection;
        if (Array.isArray(sanitizedData.caseStudies)) toSet.caseStudies = sanitizedData.caseStudies.map((p: any) => ({ ...p, _key: p._key || Math.random().toString(36).substring(2, 9) }));

        // 13. FAQs
        if (sanitizedData.faqsSection) toSet.faqsSection = sanitizedData.faqsSection;
        if (Array.isArray(sanitizedData.faqs)) toSet.faqs = sanitizedData.faqs.map((p: any) => ({ ...p, _key: p._key || Math.random().toString(36).substring(2, 9) }));

        // 14. Blogs
        if (sanitizedData.blogsSection) toSet.blogsSection = { _type: 'sectionHeading', ...sanitizedData.blogsSection };
        if (Array.isArray(sanitizedData.blogs)) {
            toSet.blogs = sanitizedData.blogs.map((id: string) => ({
                _type: 'reference',
                _ref: id,
                _key: Math.random().toString(36).substring(2, 9)
            }));
        }
        if (sanitizedData.blogsButtonText) toSet.blogsButtonText = sanitizedData.blogsButtonText;
        if (sanitizedData.blogsButtonUrl) toSet.blogsButtonUrl = sanitizedData.blogsButtonUrl;

        // 14.5 Other Services
        if (sanitizedData.otherServicesSection) toSet.otherServicesSection = { _type: 'sectionHeading', ...sanitizedData.otherServicesSection };
        if (Array.isArray(sanitizedData.otherServices)) {
            toSet.otherServices = sanitizedData.otherServices.map((id: string) => ({
                _type: 'reference',
                _ref: id,
                _key: Math.random().toString(36).substring(2, 9)
            }));
        }
        if (sanitizedData.otherServicesButtonText) toSet.otherServicesButtonText = sanitizedData.otherServicesButtonText;
        if (sanitizedData.otherServicesButtonUrl) toSet.otherServicesButtonUrl = sanitizedData.otherServicesButtonUrl;

        // 15. SEO
        if (sanitizedData.seo) toSet.seo = sanitizedData.seo;

        if (Object.keys(toSet).length === 0 && toUnset.length === 0) {
            return { success: true, message: "No data to update" };
        }

        // Ensure the base document exists
        await adminClient.createIfNotExists({
            _id: draftId,
            _type: 'service'
        });

        const patch = adminClient.patch(draftId).set(toSet);
        if (toUnset.length > 0) patch.unset(toUnset);
        await patch.commit();

        revalidatePath('/admin/services')
        revalidatePath(`/admin/services/${id}`)
        return { success: true }
    } catch (error: any) {
        console.error("Failed to save service draft:", error)
        return { success: false, error: error.message || "Failed to save draft" }
    }
}

export async function getServiceDraft(id: string) {
    try {
        if (!id) return null
        const query = `*[_id == $draftId][0] {
            ...,
            heroImage {
                ...,
                asset,
                "url": asset->url
            }
        }`
        const draft = await adminClient.fetch(query, { draftId: `drafts.${id}` }, {
            perspective: "raw",
            useCdn: false
        })
        return draft
    } catch (error: any) {
        console.error("Failed to fetch service draft:", error)
        return null
    }
}

export async function discardServiceDraft(id: string) {
    try {
        if (!id) return { success: false, error: "ID required" }
        await adminClient.delete(`drafts.${id}`)
        revalidatePath(`/admin/services/edit/${id}`)
        return { success: true }
    } catch (error: any) {
        console.error("Failed to discard service draft:", error)
        return { success: false, error: error.message || "Failed to discard draft" }
    }
}
