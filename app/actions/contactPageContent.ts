'use server'

import { contactPageContentSchema, ContactPageContentValues } from "@/lib/validations/contact-page-content"
import { adminClient } from "@/sanity/lib/admin-client"
import { sanityFetch } from "@/sanity/lib/live"
import { revalidatePath } from "next/cache"

const CONTACT_PAGE_CONTENT_ID = 'contactPageContent'

// Ensure the document exists in Sanity
async function ensureDocumentExists() {
    try {
        const existing = await adminClient.getDocument(CONTACT_PAGE_CONTENT_ID)
        if (existing) return existing
    } catch (error: any) {
        if (error.statusCode === 404) {
            console.log('Creating initial contactPageContent document...')
            const initialDoc = {
                _type: 'contactPageContent',
                _id: CONTACT_PAGE_CONTENT_ID,
                hero: {
                    title: "Let's talk",
                    description: "Have a project in mind? We'd love to hear about it. Drop us a line and let's create something extraordinary together.",
                },
                contactForm: {
                    formHeading: "Send us a message",
                    formDescription: "Fill out the form below and we'll get back to you within 24 hours.",
                },
                faqs: {
                    sectionHeading: {
                        eyebrow: "FAQs",
                        title: "Frequently Asked Questions",
                        description: "Everything you need to know about working with us. Can't find what you're looking for? Feel free to reach out."
                    },
                    faqItems: []
                }
            }
            return await adminClient.create(initialDoc)
        }
        throw error
    }
}

export async function getContactPageContentForAdmin() {
    try {
        await ensureDocumentExists()
        const query = `*[_type == "contactPageContent"][0]`
        const { data } = await sanityFetch({ query })
        return data
    } catch (error) {
        console.error("Failed to fetch contact page content:", error)
        return null
    }
}

export async function updateContactPageContent(data: ContactPageContentValues) {
    try {
        const validatedFields = contactPageContentSchema.parse(data)

        const updateData: any = {
            _type: 'contactPageContent',
            _id: CONTACT_PAGE_CONTENT_ID,
            hero: validatedFields.hero,
            contactForm: validatedFields.contactForm,
            faqs: validatedFields.faqs,
            seo: validatedFields.seo
        }


        await adminClient.createOrReplace(updateData)
        revalidatePath('/admin/contact/page-content')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update contact page content:", error)
        const errorMessage = error.response?.body?.message || error.message || "Failed to update content"
        return { success: false, error: errorMessage }
    }
}

export async function saveContactPageDraft(data: Partial<ContactPageContentValues>) {
    try {
        const updateData: any = {
            ...data,
            _type: 'contactPageContent',
            _id: `drafts.${CONTACT_PAGE_CONTENT_ID}`,
        }



        await adminClient.createOrReplace(updateData)
        return { success: true }
    } catch (error: any) {
        console.error("Failed to save draft:", error)
        return { success: false, error: error.message || "Failed to save draft" }
    }
}

export async function getContactPageDraft() {
    try {
        const draft = await adminClient.getDocument(`drafts.${CONTACT_PAGE_CONTENT_ID}`)
        return draft
    } catch (error: any) {
        if (error.statusCode === 404) return null
        console.error("Failed to fetch draft:", error)
        return null
    }
}

export async function discardContactPageDraft() {
    try {
        await adminClient.delete(`drafts.${CONTACT_PAGE_CONTENT_ID}`)
        revalidatePath('/admin/contact/page-content')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to discard draft:", error)
        return { success: false, error: error.message || "Failed to discard draft" }
    }
}


