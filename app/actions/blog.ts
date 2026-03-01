'use server'

import { adminClient } from "@/sanity/lib/admin-client"
import { revalidatePath } from "next/cache"
import { blogPostSchema, BlogPostValues } from "@/lib/validations/blog"

export async function getDashboardPosts() {
    try {
        const query = `*[_type == "post"] | order(_updatedAt desc) {
            _id,
            title,  
            description,
            "slug": select(
                slug.current != null => slug.current,
                _id
            ),
            featured,
            publishedAt,
            author,
            "locations": coalesce(locations[]->title, []),
            "service": service->{title},
            "mainImage": coalesce(mainImage.asset->url, mainImage.url, null),
            readTime,
            _updatedAt
        }`

        const data = await adminClient.fetch(query, {}, {
            perspective: "raw",
            useCdn: false
        })

        const postMap = new Map<string, any>()

        data.forEach((post: any) => {
            const isDraft = post._id.startsWith('drafts.')
            const baseId = post._id.replace(/^(drafts\.)+/, '');
            const slugString = typeof post.slug === 'string' ? post.slug : post.slug?.current || baseId

            if (!postMap.has(baseId)) {
                postMap.set(baseId, {
                    ...post,
                    _id: baseId,
                    _originalId: post._id,
                    slug: slugString,
                    status: isDraft ? 'Draft' : 'Published'
                })
            } else {
                const existing = postMap.get(baseId)
                if (isDraft) {
                    postMap.set(baseId, {
                        ...post,
                        _id: baseId,
                        _originalId: baseId,
                        slug: slugString,
                        status: 'Draft',
                        hasPublished: true
                    })
                } else {
                    postMap.set(baseId, {
                        ...existing,
                        status: 'Draft',
                        hasPublished: true
                    })
                }
            }
        })

        return Array.from(postMap.values())
    } catch (error) {
        console.error("Failed to fetch dashboard posts:", error)
        return []
    }
}

export async function getPostById(id: string) {
    try {
        const query = `*[_type == "post" && (_id == $id || _id == "drafts." + $id)] | order(_updatedAt desc)[0] {
            _id,
            _type,
            title,
            description,
            featured,
            "slug": { "current": slug.current },
            readTime,
            author,
            tags,
            "locations": coalesce(locations[]._ref, []),
            "service": service._ref,
            "categories": coalesce(categories[]._ref, []),
            publishedAt,
            "mainImage": select(
                mainImage.asset != null => {
                    "asset": mainImage.asset,
                    "url": mainImage.asset->url,
                    "_id": mainImage.asset->._id
                },
                null
            ),
            body,
            seo
        }`
        const result = await adminClient.fetch(query, { id }, {
            perspective: "raw",
            useCdn: false
        })


        return result
    } catch (error) {
        console.error("Failed to fetch post:", error)
        return null
    }
}

export async function getPostForView(id: string) {
    try {
        const baseId = id.replace(/^(drafts\.)+/, '');
        const query = `*[_type == "post" && (_id == $baseId || _id == "drafts." + $baseId)] {
            ...,
            "slug": slug.current,
            "locations": locations[]->title,
            "service": service->title,
            "categories": categories[]->title,
            "mainImageUrl": mainImage.asset->url
        }`
        const results = await adminClient.fetch(query, { baseId }, {
            perspective: "raw",
            useCdn: false
        })

        const draft = results.find((s: any) => s._id.startsWith('drafts.'));
        const published = results.find((s: any) => !s._id.startsWith('drafts.'));

        if (!draft && !published) return null;

        const latest = draft || published;

        // Safely extract title and description (handling potential localization objects)
        const getVal = (val: any) => typeof val === 'string' ? val : (val?.en || val?.ar || (val && typeof val === 'object' ? Object.values(val)[0] : null));

        return {
            ...latest,
            _id: baseId,
            displayTitle: getVal(latest.title) || "Untitled Post",
            displayDescription: getVal(latest.description) || "",
            status: draft ? 'Draft' : 'Published',
            hasPublished: !!published
        }
    } catch (error) {
        console.error("Failed to fetch post for view:", error)
        return null
    }
}

export async function getBlogFormOptions() {
    try {
        const servicesQuery = `*[_type == "service"] { _id, title }`
        const categoriesQuery = `*[_type == "category"] { _id, title }`
        const locationsQuery = `*[_type == "location"] { _id, title }`

        const [services, categories, locations] = await Promise.all([
            adminClient.fetch(servicesQuery),
            adminClient.fetch(categoriesQuery),
            adminClient.fetch(locationsQuery)
        ])

        return {
            services: services || [],
            categories: categories || [],
            locations: locations || []
        }
    } catch (error) {
        console.error("Failed to fetch form options:", error)
        return { services: [], categories: [], locations: [] }
    }
}

export async function createPost(data: BlogPostValues, id?: string) {
    try {
        const validated = blogPostSchema.parse(data)

        const doc = {
            _type: 'post',
            _id: id,
            title: validated.title,
            description: validated.description,
            featured: validated.featured,
            slug: {
                _type: 'slug',
                current: validated.slug.current
            },
            readTime: validated.readTime,
            author: validated.author,
            tags: validated.tags.map((t: string) => t.trim()).filter(Boolean),
            locations: (validated.locations && validated.locations.length > 0)
                ? validated.locations.map(locId => ({ _type: 'reference', _ref: locId, _key: locId }))
                : [],
            publishedAt: validated.publishedAt,
            service: (validated.service && validated.service !== 'none') ? { _type: 'reference', _ref: validated.service } : undefined,
            categories: (validated.categories && validated.categories.length > 0)
                ? validated.categories.map(catId => ({ _type: 'reference', _ref: catId, _key: catId }))
                : [],
            mainImage: validated.mainImage?._id ? {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: validated.mainImage._id
                }
            } : undefined,
            body: validated.body,
            seo: validated.seo
        }

        if (id) {
            const docWithId = { ...doc, _id: id }
            const result = await adminClient.createOrReplace(docWithId)
            await adminClient.delete(`drafts.${id}`).catch(() => { })
            revalidatePath('/admin/blogs')
            return { success: true, id: result._id }
        } else {
            const result = await adminClient.create(doc)
            revalidatePath('/admin/blogs')
            return { success: true, id: result._id }
        }
    } catch (error: any) {
        console.error("Failed to create post:", error)
        return { success: false, error: error.message }
    }
}

export async function updatePost(id: string, data: BlogPostValues) {
    try {
        const validated = blogPostSchema.parse(data)

        const toSet: any = {
            title: validated.title,
            description: validated.description,
            featured: validated.featured,
            slug: {
                _type: 'slug',
                current: validated.slug.current
            },
            readTime: validated.readTime,
            author: validated.author,
            tags: validated.tags.map((t: string) => t.trim()).filter(Boolean),
            publishedAt: validated.publishedAt,
            categories: (validated.categories && validated.categories.length > 0)
                ? validated.categories.map(catId => ({ _type: 'reference', _ref: catId, _key: catId }))
                : [],
            locations: (validated.locations && validated.locations.length > 0)
                ? validated.locations.map(locId => ({ _type: 'reference', _ref: locId, _key: locId }))
                : [],
            body: validated.body,
            seo: validated.seo
        }

        const toUnset = []

        if (!(validated.locations && validated.locations.length > 0)) {
            toUnset.push('locations')
        }

        if (validated.service && validated.service !== 'none') {
            toSet.service = { _type: 'reference', _ref: validated.service }
        } else {
            toUnset.push('service')
        }

        if (validated.mainImage?._id) {
            toSet.mainImage = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: validated.mainImage._id
                }
            }
        } else {
            toUnset.push('mainImage')
        }

        const patch = adminClient.patch(id).set(toSet)
        if (toUnset.length > 0) patch.unset(toUnset)
        await patch.commit()

        await adminClient.delete(`drafts.${id}`).catch(() => { })

        revalidatePath('/admin/blogs')
        revalidatePath(`/admin/blogs/${id}`)
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update post:", error)
        return { success: false, error: error.message }
    }
}

export async function deletePost(id: string) {
    try {
        await adminClient.delete(id)
        await adminClient.delete(`drafts.${id}`).catch(() => { })

        revalidatePath('/admin/blogs')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete post:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteMultiplePosts(ids: string[]) {
    try {
        const transactions = ids.flatMap(id => [
            adminClient.delete(id),
            adminClient.delete(`drafts.${id}`).catch(() => { })
        ])
        await Promise.all(transactions)
        revalidatePath('/admin/blogs')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete multiple posts:", error)
        return { success: false, error: error.message }
    }
}

export async function duplicatePost(id: string) {
    try {
        const sourcePost = await getPostById(id)
        if (!sourcePost) return { success: false, error: "Source post not found" }

        const newDoc = {
            _type: 'post',
            title: `${sourcePost.title} (Copy)`,
            description: sourcePost.description,
            featured: sourcePost.featured,
            //* Slug is intentionally omitted due to slug generation issue
            readTime: sourcePost.readTime,
            author: sourcePost.author,
            tags: sourcePost.tags,
            locations: sourcePost.locations?.map((ref: string) => ({ _type: 'reference', _ref: ref, _key: ref })),
            service: sourcePost.service ? { _type: 'reference', _ref: sourcePost.service } : undefined,
            categories: sourcePost.categories?.map((ref: string) => ({ _type: 'reference', _ref: ref, _key: ref })),
            publishedAt: new Date().toISOString(),
            mainImage: sourcePost.mainImage?.asset ? {
                _type: 'image',
                asset: { _type: 'reference', _ref: sourcePost.mainImage._id }
            } : undefined,
            body: sourcePost.body,
            seo: sourcePost.seo
        }

        const result = await adminClient.create(newDoc)
        revalidatePath('/admin/blogs')
        return { success: true, id: result._id }
    } catch (error: any) {
        console.error("Failed to duplicate post:", error)
        return { success: false, error: error.message || "Failed to duplicate post" }
    }
}
