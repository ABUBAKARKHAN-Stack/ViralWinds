'use server'

import { adminClient } from "@/sanity/lib/admin-client"
import { revalidatePath } from "next/cache"
import { projectSchema, ProjectValues } from "@/lib/validations/project"

export async function getDashboardProjects() {
    try {
        const query = `*[_type == "project"] | order(_updatedAt desc) {
            _id,
            title,
            description,
            "slug": slug.current,
            "mainImage": coalesce(mainImage.asset->url, mainImage.url, null),
            _updatedAt
        }`

        const data = await adminClient.fetch(query, {}, {
            perspective: "raw",
            useCdn: false
        })

        const projectMap = new Map<string, any>()

        data.forEach((project: any) => {
            const isDraft = project._id.startsWith('drafts.')
            const baseId = project._id.replace(/^(drafts\.)+/, '');

            if (!projectMap.has(baseId)) {
                projectMap.set(baseId, {
                    ...project,
                    _id: baseId,
                    _originalId: project._id,
                    status: isDraft ? 'Draft' : 'Published'
                })
            } else {
                const existing = projectMap.get(baseId)
                if (isDraft) {
                    projectMap.set(baseId, {
                        ...project,
                        _id: baseId,
                        _originalId: baseId,
                        status: 'Draft',
                        hasPublished: true
                    })
                } else {
                    projectMap.set(baseId, {
                        ...existing,
                        status: 'Draft',
                        hasPublished: true
                    })
                }
            }
        })

        return Array.from(projectMap.values())
    } catch (error) {
        console.error("Failed to fetch dashboard projects:", error)
        return []
    }
}

export async function getProjectById(id: string) {
    try {
        const query = `*[_type == "project" && (_id == $id || _id == "drafts." + $id)] | order(_updatedAt desc)[0] {
            _id,
            _type,
            title,
            category,
            description,
            tags,
            "slug": { "current": slug.current },
            "mainImage": select(
                mainImage.asset != null => {
                    "asset": mainImage.asset,
                    "url": mainImage.asset->url,
                    "_id": mainImage.asset->._id
                },
                null
            ),
            "caseStudy": {
                "title": caseStudy.title,
                "testimonial": caseStudy.testimonial,
                "beforeImage": select(
                    caseStudy.beforeImage.asset != null => {
                        "asset": caseStudy.beforeImage.asset,
                        "url": caseStudy.beforeImage.asset->url,
                        "_id": caseStudy.beforeImage.asset->._id
                    },
                    null
                ),
                "afterImage": select(
                    caseStudy.afterImage.asset != null => {
                        "asset": caseStudy.afterImage.asset,
                        "url": caseStudy.afterImage.asset->url,
                        "_id": caseStudy.afterImage.asset->._id
                    },
                    null
                ),
                "results": caseStudy.results[] {
                    _key,
                    icon,
                    value,
                    label
                }
            },
            seo
        }`
        const result = await adminClient.fetch(query, { id }, {
            perspective: "raw",
            useCdn: false
        })


        return result
    } catch (error) {
        console.error("Failed to fetch project:", error)
        return null
    }
}

export async function getProjectForView(id: string) {
    try {
        const baseId = id.replace(/^(drafts\.)+/, '');
        const query = `*[_type == "project" && (_id == $baseId || _id == "drafts." + $baseId)] {
            ...,
            "slug": slug.current,
            "mainImageUrl": mainImage.asset->url,
            "caseStudy": {
                ...,
                "beforeImageUrl": caseStudy.beforeImage.asset->url,
                "afterImageUrl": caseStudy.afterImage.asset->url,
                "results": caseStudy.results[] {
                    ...,
                    "icon": icon,
                    "value": value,
                    "label": label
                }
            }
        }`
        const results = await adminClient.fetch(query, { baseId }, {
            perspective: "raw",
            useCdn: false
        })

        const draft = results.find((s: any) => s._id.startsWith('drafts.'));
        const published = results.find((s: any) => !s._id.startsWith('drafts.'));

        if (!draft && !published) return null;

        const latest = draft || published;

        // Safely extract values (handling potential localization objects)
        const getVal = (val: any) => typeof val === 'string' ? val : (val?.en || val?.ar || (val && typeof val === 'object' ? Object.values(val)[0] : null));

        return {
            ...latest,
            _id: baseId,
            displayTitle: getVal(latest.title) || "Untitled Project",
            displayDescription: getVal(latest.description) || "",
            displayCategory: getVal(latest.category) || "",
            status: draft ? 'Draft' : 'Published',
            hasPublished: !!published
        }
    } catch (error) {
        console.error("Failed to fetch project for view:", error)
        return null
    }
}

export async function createProject(data: ProjectValues, id?: string) {
    try {
        const validated = projectSchema.parse(data)

        const doc: any = {
            _type: 'project',
            title: validated.title,
            slug: {
                _type: 'slug',
                current: validated.slug.current
            },
            description: validated.description,
            category: validated.category,
            tags: validated.tags?.map(t => t.trim()).filter(Boolean),
            mainImage: validated.mainImage?._id ? {
                _type: 'image',
                asset: { _type: 'reference', _ref: validated.mainImage._id }
            } : undefined,
            caseStudy: validated.caseStudy ? {
                title: validated.caseStudy.title,
                beforeImage: validated.caseStudy.beforeImage?._id ? {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: validated.caseStudy.beforeImage._id }
                } : undefined,
                afterImage: validated.caseStudy.afterImage?._id ? {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: validated.caseStudy.afterImage._id }
                } : undefined,
                testimonial: validated.caseStudy.testimonial,
                results: validated.caseStudy.results?.map(res => ({
                    _key: res._key || Math.random().toString(36).substring(2, 9),
                    icon: res.icon,
                    value: res.value,
                    label: res.label
                }))
            } : undefined,
            seo: validated.seo
        }

        if (id) {
            const docWithId = { ...doc, _id: id }
            const result = await adminClient.createOrReplace(docWithId)
            await adminClient.delete(`drafts.${id}`).catch(() => { })
            revalidatePath('/admin/portfolio')
            revalidatePath(`/portfolio/${validated.slug.current}`)
            return { success: true, id: result._id }
        } else {
            const result = await adminClient.create(doc)
            revalidatePath('/admin/portfolio')
            revalidatePath(`/portfolio/${validated.slug.current}`)
            return { success: true, id: result._id }
        }
    } catch (error: any) {
        console.error("Failed to create project:", error)
        return { success: false, error: error.message }
    }
}

export async function updateProject(id: string, data: ProjectValues) {
    try {
        const validated = projectSchema.parse(data)

        const toSet: any = {
            title: validated.title,
            slug: {
                _type: 'slug',
                current: validated.slug.current
            },
            description: validated.description,
            category: validated.category,
            tags: validated.tags?.map((t: string) => t.trim()).filter(Boolean),
            caseStudy: {
                title: validated.caseStudy.title,
                testimonial: validated.caseStudy.testimonial,
                results: validated.caseStudy.results?.map(res => ({
                    _key: res._key || Math.random().toString(36).substring(2, 9),
                    icon: res.icon,
                    value: res.value,
                    label: res.label
                }))
            },
            seo: validated.seo
        }

        if (validated.caseStudy.beforeImage?._id) {
            toSet.caseStudy.beforeImage = {
                _type: 'image',
                asset: { _type: 'reference', _ref: validated.caseStudy.beforeImage._id }
            }
        }
        if (validated.caseStudy.afterImage?._id) {
            toSet.caseStudy.afterImage = {
                _type: 'image',
                asset: { _type: 'reference', _ref: validated.caseStudy.afterImage._id }
            }
        }

        const toUnset = []

        if (validated.mainImage?._id) {
            toSet.mainImage = {
                _type: 'image',
                asset: { _type: 'reference', _ref: validated.mainImage._id }
            }
        } else {
            toUnset.push('mainImage')
        }

        const patch = adminClient.patch(id).set(toSet)
        if (toUnset.length > 0) patch.unset(toUnset)
        await patch.commit()

        await adminClient.delete(`drafts.${id}`).catch(() => { })

        revalidatePath('/admin/portfolio')
        if (validated.slug?.current) {
            revalidatePath(`/portfolio/${validated.slug.current}`)
        }
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update project:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteProject(id: string) {
    try {
        await adminClient.delete(id)
        await adminClient.delete(`drafts.${id}`).catch(() => { })
        revalidatePath('/admin/portfolio')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete project:", error)
        return { success: false, error: error.message }
    }
}
export async function deleteProjects(ids: string[]) {
    try {
        const transaction = adminClient.transaction()
        ids.forEach(id => {
            transaction.delete(id)
            transaction.delete(`drafts.${id}`)
        })
        await transaction.commit()
        revalidatePath('/admin/portfolio')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete projects:", error)
        return { success: false, error: error.message }
    }
}

export async function duplicateProject(id: string) {
    try {
        const sourceProject = await getProjectById(id)
        if (!sourceProject) return { success: false, error: "Source project not found" }

        const newDoc: any = {
            _type: 'project',
            title: sourceProject.title,
            category: sourceProject.category,
            description: sourceProject.description,
            tags: sourceProject.tags,
            mainImage: sourceProject.mainImage?._id ? {
                _type: 'image',
                asset: { _type: 'reference', _ref: sourceProject.mainImage._id }
            } : undefined,
            caseStudy: sourceProject.caseStudy ? {
                title: sourceProject.caseStudy.title,
                beforeImage: sourceProject.caseStudy.beforeImage?._id ? {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: sourceProject.caseStudy.beforeImage._id }
                } : undefined,
                afterImage: sourceProject.caseStudy.afterImage?._id ? {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: sourceProject.caseStudy.afterImage._id }
                } : undefined,
                testimonial: sourceProject.caseStudy.testimonial,
                results: sourceProject.caseStudy.results?.map((res: any) => ({
                    _key: Math.random().toString(36).substring(2, 9),
                    icon: res.icon,
                    value: res.value,
                    label: res.label
                }))
            } : undefined,
            seo: sourceProject.seo
        }

        if (typeof newDoc.title === 'string') {
            newDoc.title = `${newDoc.title} (Copy)`
        } else if (newDoc.title && typeof newDoc.title === 'object') {
            Object.keys(newDoc.title).forEach(lang => {
                if (typeof newDoc.title[lang] === 'string') {
                    newDoc.title[lang] = `${newDoc.title[lang]} (Copy)`
                }
            })
        }

        const result = await adminClient.create(newDoc)
        revalidatePath('/admin/portfolio')
        return { success: true, id: result._id }
    } catch (error: any) {
        console.error("Failed to duplicate project:", error)
        return { success: false, error: error.message || "Failed to duplicate project" }
    }
}

