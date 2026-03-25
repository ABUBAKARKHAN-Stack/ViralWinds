'use server'

import { ServiceFormValues } from "@/lib/validations/service"
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
        if (sanitizedData.description) toSet.description = sanitizedData.description;
    

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

        // 3. Items
        if (Array.isArray(sanitizedData.items)) toSet.items = sanitizedData.items;
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
