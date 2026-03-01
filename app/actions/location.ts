'use server'

import { adminClient } from "@/sanity/lib/admin-client"
import { sanityFetch } from "@/sanity/lib/live"
import { revalidatePath } from "next/cache"

export async function getLocations() {
    try {
        const query = `*[_type == "location"] | order(title asc) {
            _id,
            title
        }`
        const { data } = await sanityFetch({ query })
        return data || []
    } catch (error) {
        console.error("Failed to fetch locations:", error)
        return []
    }
}

export async function getLocationById(id: string) {
    try {
        const query = `*[_type == "location" && _id == $id][0] {
            _id,
            title
        }`
        const { data } = await sanityFetch({ query, params: { id } })
        return data
    } catch (error) {
        console.error("Failed to fetch location:", error)
        return null
    }
}

export async function createLocation(data: { title: string }) {
    try {
        const doc = {
            _type: 'location',
            title: data.title,
            slug: {
                _type: 'slug',
                current: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }
        }

        await adminClient.create(doc)
        revalidatePath('/admin/blogs/locations')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to create location:", error)
        return { success: false, error: error.message }
    }
}

export async function updateLocation(id: string, data: { title: string }) {
    try {
        const doc = {
            title: data.title,
            slug: {
                _type: 'slug',
                current: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }
        }

        await adminClient.patch(id).set(doc).commit()
        revalidatePath('/admin/blogs/locations')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update location:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteLocation(id: string) {
    try {
        await adminClient.delete(id)
        revalidatePath('/admin/blogs/locations')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete location:", error)
        return { success: false, error: error.message }
    }
}
