'use server'

import { aboutPageContentSchema, AboutPageContentValues } from "@/lib/validations/about-page-content"
import { adminClient } from "@/sanity/lib/admin-client"
import { sanityFetch } from "@/sanity/lib/live"
import { revalidatePath } from "next/cache"

const ABOUT_PAGE_CONTENT_ID = 'aboutPageContent'

// Ensure the document exists in Sanity
async function ensureDocumentExists() {
    try {
        const existing = await adminClient.getDocument(ABOUT_PAGE_CONTENT_ID)
        if (existing) return existing
    } catch (error: any) {
        if (error.statusCode === 404) {
            console.log('Creating initial aboutPageContent document...')
            const initialDoc = {
                _type: 'aboutPageContent',
                _id: ABOUT_PAGE_CONTENT_ID,
                hero: {
                    title: '',
                    subtitle: '',
                    description: '',
                },
                intro: {
                    badge: '',
                    heading: '',
                    description1: '',
                    description2: '',
                    sinceYear: new Date().getFullYear()
                },
                missionVision: {
                    sectionHeading: {
                        eyebrow: 'What Drives Us',
                        title: 'Our Purpose & Direction'
                    },
                    mission: {
                        eyebrow: 'Purpose',
                        title: 'Our Mission',
                        description1: '',
                        keyPoints: []
                    },
                    vision: {
                        eyebrow: 'Direction',
                        title: 'Our Vision',
                        description1: '',
                        keyPoints: []
                    }
                },
                philosophy: {
                    sectionHeading: {
                        eyebrow: 'Our Philosophy',
                        title: 'Strategy Before Design'
                    },
                    quoteBlock: '',
                    description1: '',
                    description2: '',
                    steps: []
                },
                globalReach: {
                    badge: '',
                    heading: '',
                    description1: '',
                    description2: '',
                    regions: [],
                    stats: []
                },
                culture: {
                    sectionHeading: { title: '' },
                    values: []
                }
            }
            return await adminClient.create(initialDoc)
        }
        throw error
    }
}

export async function getAboutPageContentForAdmin() {
    try {
        await ensureDocumentExists()
        const query = `*[_type == "aboutPageContent"][0]`
        const { data } = await sanityFetch({ query })
        return data
    } catch (error) {
        console.error("Failed to fetch about page content:", error)
        return null
    }
}

export async function updateAboutPageContent(data: AboutPageContentValues) {
    try {
        const validatedFields = aboutPageContentSchema.parse(data)

        const updateData: any = {
            _type: 'aboutPageContent',
            _id: ABOUT_PAGE_CONTENT_ID,
            hero: validatedFields.hero,
            intro: validatedFields.intro,
            missionVision: validatedFields.missionVision,
            philosophy: validatedFields.philosophy,
            globalReach: validatedFields.globalReach,
            culture: validatedFields.culture,
            seo: validatedFields.seo
        }

        await adminClient.createOrReplace(updateData)
        revalidatePath('/admin/about/page-content')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update about page content:", error)
        const errorMessage = error.response?.body?.message || error.message || "Failed to update content"
        return { success: false, error: errorMessage }
    }
}

export async function saveAboutPageDraft(data: Partial<AboutPageContentValues>) {
    try {
        const updateData: any = {
            ...data,
            _type: 'aboutPageContent',
            _id: `drafts.${ABOUT_PAGE_CONTENT_ID}`,
        }
        await adminClient.createOrReplace(updateData)
        return { success: true }
    } catch (error: any) {
        console.error("Failed to save draft:", error)
        return { success: false, error: error.message || "Failed to save draft" }
    }
}

export async function getAboutPageDraft() {
    try {
        const draft = await adminClient.getDocument(`drafts.${ABOUT_PAGE_CONTENT_ID}`)
        return draft
    } catch (error: any) {
        if (error.statusCode === 404) return null
        console.error("Failed to fetch draft:", error)
        return null
    }
}

export async function discardAboutPageDraft() {
    try {
        await adminClient.delete(`drafts.${ABOUT_PAGE_CONTENT_ID}`)
        revalidatePath('/admin/about/page-content')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to discard draft:", error)
        return { success: false, error: error.message || "Failed to discard draft" }
    }
}
