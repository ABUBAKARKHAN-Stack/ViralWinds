'use server'

import { adminClient } from "@/sanity/lib/admin-client"
import { sanityFetch } from "@/sanity/lib/live"
import { menuSchema, MenuValues } from "@/lib/validations/menu"
import { revalidatePath } from "next/cache"

export async function getMenus() {
    try {
        const query = `*[_type == "menu"] | order(_createdAt desc) {
            _id,
            title,
            "slug": slug.current,
            location,
            "itemCount": count(items)
        }`
        const { data } = await sanityFetch({ query })
        return data || []
    } catch (error) {
        console.error("Failed to fetch menus:", error)
        return []
    }
}

export async function getMenuById(id: string) {
    try {
        const query = `*[_type == "menu" && _id == $id][0] {
            ...,
            "slug": slug.current,
            items[] {
                ...,
                "label": coalesce(label.en, label),
                "description": coalesce(description.en, description),
                "url": coalesce(url.en, url),
                children[] {
                    ...,
                    "label": coalesce(label.en, label),
                    "description": coalesce(description.en, description),
                    "url": coalesce(url.en, url),
                    children[] {
                        ...,
                        "label": coalesce(label.en, label),
                        "description": coalesce(description.en, description),
                        "url": coalesce(url.en, url)
                    }
                }
            }
        }`
        const { data } = await sanityFetch({ query, params: { id } })
        return data
    } catch (error) {
        console.error("Failed to fetch menu:", error)
        return null
    }
}

export async function createMenu(data: MenuValues) {
    try {
        const validated = menuSchema.parse(data)

        const doc = {
            _type: 'menu',
            title: validated.title,
            slug: {
                _type: 'slug',
                current: validated.slug.current
            },
            location: validated.location,
            items: validated.items
        }

        const result = await adminClient.create(doc)
        revalidatePath('/admin/menus')
        return { success: true, id: result._id }
    } catch (error: any) {
        console.error("Failed to create menu:", error)
        return { success: false, error: error.message }
    }
}

export async function updateMenu(id: string, data: MenuValues) {
    try {
        const validated = menuSchema.parse(data)

        const doc = {
            title: validated.title,
            slug: {
                _type: 'slug',
                current: validated.slug.current
            },
            location: validated.location,
            items: validated.items
        }

        await adminClient.patch(id).set(doc).commit()

        // Auto-delete drafts to keep Sanity Studio in sync
        try {
            await adminClient.delete(`drafts.${id}`)
        } catch (e) {
            // Ignore if draft doesn't exist
        }

        revalidatePath('/admin/menus')
        revalidatePath(`/admin/menus/${id}`)
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update menu:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteMenu(id: string) {
    try {
        await adminClient.delete(id)
        revalidatePath('/admin/menus')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete menu:", error)
        return { success: false, error: error.message }
    }
}

export async function getLinkableContent() {
    try {
        const servicesQuery = `*[_type == "service"] { _id, "title": coalesce(title.en, title) }`

        const [services] = await Promise.all([
            sanityFetch({ query: servicesQuery })
        ])

        const pages = [
            { _id: 'landingPageContent', _type: 'landingPageContent', title: 'Home' },
            { _id: 'aboutPageContent', _type: 'aboutPageContent', title: 'About' },
            { _id: 'servicesPageContent', _type: 'servicesPageContent', title: 'Services' },
            { _id: 'portfolioPageContent', _type: 'portfolioPageContent', title: 'Portfolio' },
            { _id: 'contactPageContent', _type: 'contactPageContent', title: 'Contact' }
        ]

        return {
            services: services.data || [],
            pages: pages
        }
    } catch (error) {
        console.error("Failed to fetch linkable content:", error)
        return { services: [], pages: [] }
    }
}
