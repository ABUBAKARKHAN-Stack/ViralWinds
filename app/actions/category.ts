'use server'

import { adminClient } from "@/sanity/lib/admin-client"
import { sanityFetch } from "@/sanity/lib/live"
import { revalidatePath } from "next/cache"

export async function getCategories() {
    try {
        const query = `*[_type == "category"] | order(title asc) {
            _id,
            title,
            description
        }`
        const { data } = await sanityFetch({ query })
        return data || []
    } catch (error) {
        console.error("Failed to fetch categories:", error)
        return []
    }
}

export async function getCategoryById(id: string) {
    try {
        const query = `*[_type == "category" && _id == $id][0] {
            _id,
            title,
            description
        }`
        const { data } = await sanityFetch({ query, params: { id } })
        return data
    } catch (error) {
        console.error("Failed to fetch category:", error)
        return null
    }
}

export async function createCategory(data: { title: string; description?: string }) {
    try {
        const doc = {
            _type: 'category',
            title: data.title,
            description: data.description,
            slug: {
                _type: 'slug',
                current: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'untitled'
            }
        }

        await adminClient.create(doc)
        revalidatePath('/admin/blogs/categories')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to create category:", error)
        return { success: false, error: error.message }
    }
}

export async function updateCategory(id: string, data: { title: string; description?: string }) {
    try {
        const doc = {
            title: data.title,
            description: data.description,
            slug: {
                _type: 'slug',
                current: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'untitled'
            }
        }

        await adminClient.patch(id).set(doc).commit()
        revalidatePath('/admin/blogs/categories')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update category:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteCategory(id: string) {
    try {
        await adminClient.delete(id)
        revalidatePath('/admin/blogs/categories')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete category:", error)
        return { success: false, error: error.message }
    }
}
