'use server'

import { projectSchema, ProjectValues } from "@/lib/validations/project"
import { adminClient } from "@/sanity/lib/admin-client"
import { revalidatePath } from "next/cache";

const sanitizeSanityData = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(sanitizeSanityData);
    }
    if (data !== null && typeof data === 'object') {
        const cleaned: any = {};
        for (const key in data) {
            if (['_rev', '_createdAt', '_updatedAt'].includes(key)) continue;
            if (key === 'url' && data._type === 'reference') continue;
            cleaned[key] = sanitizeSanityData(data[key]);
        }
        return cleaned;
    }
    return data;
};

export async function saveProjectDraft(id: string | undefined, data: Partial<ProjectValues>) {
    try {
        let draftId: string;

        if (!id) {
            // For new projects, create a new draft document with ALL fields initialized
            const newDoc = {
                _type: 'project',
                title: data.title || "",
                slug: { _type: 'slug', current: "" },
                category: data.category || "",
                description: data.description || "",
                tags: [],
                caseStudy: {
                    title: data.caseStudy?.title || "",
                    testimonial: data.caseStudy?.testimonial || "",
                    results: []
                }
            };
            const result = await adminClient.create(newDoc);
            // Sanity will return a published ID, we need the draft version
            draftId = `drafts.${result._id}`;
            // Also ensure the draft exists
            await adminClient.createIfNotExists({ _id: draftId, ...newDoc });
            return { success: true, id: result._id }; // Return the base ID
        } else {
            const cleanId = id.replace(/^(drafts\.)+/, '');
            draftId = `drafts.${cleanId}`;
        }

        const sanitizedData = sanitizeSanityData(data);
        const patch = adminClient.patch(draftId);
        const toSet: any = {};
        const toUnset: string[] = [];

        // Helper to flatten object to dot notation for surgical patching
        const flattenToPatch = (obj: any, prefix = "") => {
            if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;

            for (const key in obj) {
                if (key === '_id' || key === '_type') continue;
                const val = obj[key];
                const fullKey = prefix ? `${prefix}.${key}` : key;

                if (val === undefined) continue;

                // Handle null/empty states specifically
                if (val === null) {
                    toUnset.push(fullKey);
                    continue;
                }

                // IMAGE HANDLING: Only update if we have a valid reference, never unset automatically
                if (fullKey === "mainImage" || fullKey === "caseStudy.beforeImage" || fullKey === "caseStudy.afterImage") {
                    const ref = val?._id || val?.asset?._ref || val?.asset?._id;
                    if (ref) {
                        toSet[fullKey] = {
                            _type: 'image',
                            asset: { _type: 'reference', _ref: ref }
                        };
                    }
                    // Note: No "else toUnset" here to prevent accidental deletion during form transitions
                    continue;
                }

                // SLUG HANDLING
                if (fullKey === "slug" || fullKey === "caseStudy.slug") {
                    const slugVal = typeof val === 'string' ? val : (val.current || "");
                    if (slugVal) {
                        toSet[fullKey] = { _type: 'slug', current: slugVal };
                    }
                    continue;
                }

                // TAGS HANDLING (Comma string to Array)
                if (fullKey === "tags") {
                    if (typeof val === 'string') {
                        toSet[fullKey] = val.split(',').map((t: string) => t.trim()).filter(Boolean);
                    } else if (Array.isArray(val)) {
                        toSet[fullKey] = val;
                    }
                    continue;
                }

                // RESULTS ARRAY HANDLING
                if (fullKey === "caseStudy.results") {
                    if (Array.isArray(val)) {
                        toSet[fullKey] = val.map(res => ({
                            _key: res._key || Math.random().toString(36).substring(2, 9),
                            icon: res.icon || "TrendingUp",
                            value: res.value || "",
                            label: res.label || ""
                        }));
                    }
                    continue;
                }

                // Recurse for nested objects (like caseStudy) but stop at known units
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                    flattenToPatch(val, fullKey);
                } else if (val !== undefined) {
                    toSet[fullKey] = val;
                }
            }
        };

        flattenToPatch(sanitizedData);

        if (Object.keys(toSet).length === 0 && toUnset.length === 0) {
            return { success: true };
        }

        if (Object.keys(toSet).length > 0) patch.set(toSet);
        if (toUnset.length > 0) patch.unset(toUnset);

        await adminClient.createIfNotExists({ _id: draftId, _type: 'project' });
        await patch.commit();

        revalidatePath(`/admin/portfolio/${id}`)

        return { success: true }
    } catch (error: any) {
        console.error("Failed to save project draft:", error);
        return { success: false, error: error.message || "Failed to save draft" }
    }
}

export async function getProjectDraft(id: string) {
    try {
        if (!id) return null
        const draft = await adminClient.getDocument(`drafts.${id}`)
        return draft
    } catch (error: any) {
        if (error.statusCode === 404) return null
        console.error("Failed to fetch project draft:", error)
        return null
    }
}
