'use server'

import { blogPostSchema, BlogPostValues } from "@/lib/validations/blog"
import { adminClient } from "@/sanity/lib/admin-client"
import { revalidatePath } from "next/cache";

const sanitizeSanityData = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(sanitizeSanityData);
    }
    if (data !== null && typeof data === 'object') {
        const cleaned: any = {};
        for (const key in data) {
            // Strip Sanity internal fields but KEEP _id and _ref for references
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


export async function saveBlogDraft(id: string, data: Partial<BlogPostValues>) {
    try {
        if (!id) return { success: false, error: "ID required for draft" }

        // Normalize ID to prevent recursive 'drafts.drafts.' occurrences
        const cleanId = id.replace(/^(drafts\.)+/, '');
        const draftId = `drafts.${cleanId}`;

        // Sanitize data
        const sanitizedData = sanitizeSanityData(data);

        // Build surgical patch
        const toSet: any = {};
        const toUnset: string[] = [];

        // 1. Basic Fields (Title, Description, Slug)
        if (sanitizedData.title) toSet.title = sanitizedData.title;
        if (sanitizedData.description) toSet.description = sanitizedData.description;
        if (sanitizedData.slug?.current) {
            toSet.slug = {
                _type: 'slug',
                current: sanitizedData.slug.current
            };
        }

        // 2. Tags
        if (sanitizedData.tags) {
            if (typeof sanitizedData.tags === 'string') {
                toSet.tags = sanitizedData.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
            } else if (Array.isArray(sanitizedData.tags)) {
                toSet.tags = sanitizedData.tags;
            }
        }

        // 3. Featured & Metadata
        if (typeof sanitizedData.featured === 'boolean') toSet.featured = sanitizedData.featured;
        if (sanitizedData.author) toSet.author = sanitizedData.author;
        if (typeof sanitizedData.readTime === 'number') toSet.readTime = sanitizedData.readTime;
        if (sanitizedData.publishedAt) toSet.publishedAt = sanitizedData.publishedAt;

        // 4. References (Locations, Service)
        if (Array.isArray(sanitizedData.locations)) {
            toSet.locations = sanitizedData.locations
                .filter((locId: string) => typeof locId === 'string' && locId !== 'none')
                .map((locId: string) => ({
                    _type: 'reference',
                    _ref: locId,
                    _key: locId
                }));
        }
        if (sanitizedData.service) {
            if (sanitizedData.service === 'none') {
                toUnset.push('service');
            } else {
                toSet.service = { _type: 'reference', _ref: sanitizedData.service };
            }
        }

        // 5. Categories
        if (Array.isArray(sanitizedData.categories)) {
            toSet.categories = sanitizedData.categories
                .filter((catId: string) => typeof catId === 'string' && catId !== 'none')
                .map((catId: string) => ({
                    _type: 'reference',
                    _ref: catId,
                    _key: catId
                }));
        }

        // 6. Main Image - SURGICAL
        const mainImageId = sanitizedData.mainImage?._ref || sanitizedData.mainImage?._id || (typeof sanitizedData.mainImage === 'string' ? sanitizedData.mainImage : null);
        if (mainImageId) {
            toSet.mainImage = {
                _type: 'image',
                asset: { _type: 'reference', _ref: mainImageId }
            };
        } else if (sanitizedData.mainImage === null) {
            toUnset.push('mainImage');
        }

        // 7. SEO
        if (sanitizedData.seo) {
            toSet.seo = sanitizedData.seo;
        }

        // 8. Body Content
        if (sanitizedData.body) {
            toSet.body = sanitizedData.body;
        }

        if (Object.keys(toSet).length === 0 && toUnset.length === 0) {
            return { success: true, message: "No changes to save" };
        }

        // Ensure the base document exists
        await adminClient.createIfNotExists({
            _id: draftId,
            _type: 'post'
        });

        const patch = adminClient.patch(draftId).set(toSet);
        if (toUnset.length > 0) patch.unset(toUnset);
        await patch.commit();

        revalidatePath(`/admin/blogs/${id}`)

        return { success: true }
    } catch (error: any) {
        console.error("CRITICAL ERROR: Failed to save blog draft:", error);
        // Include more details if available
        if (error.details) {
            console.error("Error details:", JSON.stringify(error.details, null, 2));
        }
        return { success: false, error: error.message || "Failed to save draft" }
    }
}

export async function getBlogDraft(id: string) {
    try {
        if (!id) return null
        const draft = await adminClient.getDocument(`drafts.${id}`)

        return draft
    } catch (error: any) {
        if (error.statusCode === 404) return null
        console.error("Failed to fetch blog draft:", error)
        return null
    }
}
