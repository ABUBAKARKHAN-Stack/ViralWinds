'use server'

import { blogPageContentSchema, BlogPageContentValues } from "@/lib/validations/blog-page-content"
import { adminClient } from "@/sanity/lib/admin-client"
import { sanityFetch } from "@/sanity/lib/live"
import { revalidatePath } from "next/cache"

const BLOG_PAGE_CONTENT_ID = 'blogPageContent'

export async function getBlogPageContentForAdmin() {
    try {
        const query = `*[_type == "blogPageContent"][0] {
            ...,
            blogList {
                ...,
                "posts": posts[]._ref
            },
            cta {
                ...,
                "formReference": formReference._ref
            }
        }`
        const { data } = await sanityFetch({ query })
        return data
    } catch (error) {
        console.error("Failed to fetch blog page content:", error)
        return null
    }
}

export async function getFormOptions() {
    try {
        const query = `*[_type == "form"]{ _id, name }`
        const { data } = await sanityFetch({ query })
        return data as { _id: string, name: string }[]
    } catch (error) {
        console.error("Failed to fetch form options:", error)
        return []
    }
}

export async function getBlogPageDraft() {
    try {
        const draft = await adminClient.getDocument(`drafts.${BLOG_PAGE_CONTENT_ID}`)
        if (draft) {
            if (draft.blogList && Array.isArray(draft.blogList.posts)) {
                draft.blogList.posts = draft.blogList.posts.map((p: any) => p._ref || p)
            }
            if (draft.cta && draft.cta.formReference) {
                draft.cta.formReference = draft.cta.formReference._ref || draft.cta.formReference
            }
        }
        return draft
    } catch (error: any) {
        if (error.statusCode === 404) return null
        console.error("Failed to fetch blog draft:", error)
        return null
    }
}

export async function updateBlogPageContent(data: BlogPageContentValues) {
    try {
        const validatedFields = blogPageContentSchema.parse(data)

        const updateData: any = {
            _type: 'blogPageContent',
            _id: BLOG_PAGE_CONTENT_ID,
            hero: validatedFields.hero,
            blogList: {
                posts: validatedFields.blogList.posts.map(id => ({
                    _type: 'reference',
                    _ref: id,
                    _key: id
                })),
            },
            cta: validatedFields.cta ? {
                sectionHeading: validatedFields.cta.sectionHeading,
                formReference: validatedFields.cta.formReference ? {
                    _type: 'reference',
                    _ref: validatedFields.cta.formReference
                } : undefined
            } : undefined,
            seo: validatedFields.seo
        }

        await adminClient.createOrReplace(updateData)
        await adminClient.delete(`drafts.${BLOG_PAGE_CONTENT_ID}`).catch(() => { })
        revalidatePath('/admin/blogs/page-content')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update blog page content:", error)
        return { success: false, error: error.message || "Failed to update content" }
    }
}

export async function saveBlogPageDraft(data: Partial<BlogPageContentValues>) {
    try {
        const updateData: any = {
            ...data,
            _type: 'blogPageContent',
            _id: `drafts.${BLOG_PAGE_CONTENT_ID}`,
        }

        if (data.blogList?.posts) {
            updateData.blogList.posts = data.blogList.posts.map(id => ({
                _type: 'reference',
                _ref: id,
                _key: id
            }))
        }

        if (data.cta?.formReference) {
            updateData.cta.formReference = {
                _type: 'reference',
                _ref: data.cta.formReference
            }
        }

        await adminClient.createOrReplace(updateData)
        return { success: true }
    } catch (error: any) {
        console.error("Failed to save blog draft:", error)
        return { success: false, error: error.message || "Failed to save draft" }
    }
}

export async function discardBlogPageDraft() {
    try {
        await adminClient.delete(`drafts.${BLOG_PAGE_CONTENT_ID}`)
        revalidatePath('/admin/blogs/page-content')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to discard blog draft:", error)
        return { success: false, error: error.message || "Failed to discard draft" }
    }
}

export async function getBlogFormOptions() {
    try {
        const query = `*[_type == "post"] { _id, title }`
        const posts = await adminClient.fetch(query)
        return posts || []
    } catch (error) {
        console.error("Failed to fetch blog form options:", error)
        return []
    }
}
