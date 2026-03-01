'use server'

import { siteSettingsSchema, SiteSettingsValues } from "@/lib/validations/site-settings"
import { adminClient } from "@/sanity/lib/admin-client"
import { sanityFetch } from "@/sanity/lib/live"

export async function getSiteSettings() {
    try {
        const query = `*[_type == "siteSettings"][0] {
            ...,
            "logo": logo {
                asset,
                "url": asset->url
            },
            "favicon": favicon {
                asset,
                "url": asset->url
            },
            headerMenu,
            footerMenu,
            contactInfo,
            socialLinks,
            seo,
            footerText,
            copyright,
            footerCTA
        }`

        const { data } = await sanityFetch({ query })
        return data
    } catch (error) {
        console.error("Failed to fetch site settings:", error)
        return null
    }
}

export async function updateSiteSettings(data: SiteSettingsValues) {
    try {
        const validatedFields = siteSettingsSchema.parse(data)

        const updateData: any = {
            _type: 'siteSettings',
            _id: 'siteSettings', // Standard ID for site settings singleton
            siteName: validatedFields.siteName,
            tagline: validatedFields.tagline,
            seo: validatedFields.seo,
            copyright: validatedFields.copyright,
            footerText: validatedFields.footerText,
            headerMenu: validatedFields.headerMenu,
            footerMenu: validatedFields.footerMenu,
            contactInfo: validatedFields.contactInfo?.map((item, index) => ({
                ...item,
                _key: item._key || `contact-${index}-${Date.now()}`
            })),
            socialLinks: validatedFields.socialLinks?.map((item, index) => ({
                ...item,
                _key: item._key || `social-${index}-${Date.now()}`
            })),
            footerCTA: validatedFields.footerCTA,
        }

        // Only update logo if we have a valid reference
        if (validatedFields.logo?.asset?._ref) {
            updateData.logo = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: validatedFields.logo.asset._ref,
                }
            }
        }

        // Only update favicon if we have a valid reference
        if (validatedFields.favicon?.asset?._ref) {
            updateData.favicon = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: validatedFields.favicon.asset._ref,
                }
            }
        }

        await adminClient.createOrReplace(updateData)

        // Auto-delete drafts to keep Sanity Studio in sync
        try {
            await adminClient.delete('drafts.siteSettings')
        } catch (e) {
            // Ignore if draft doesn't exist
        }

        return { success: true }
    } catch (error: any) {
        console.error("Failed to update site settings:", error)
        const errorMessage = error.response?.body?.message || error.message || "Failed to update site settings"
        return { success: false, error: errorMessage }
    }
}

export async function getAllMenus() {
    try {
        const query = `*[_type == "menu"] {
            _id,
            title,
            "slug": slug.current,
            location
        }`
        const { data } = await sanityFetch({ query })
        return (data as any[]) || []
    } catch (error) {
        console.error("Failed to fetch menus:", error)
        return []
    }
}
