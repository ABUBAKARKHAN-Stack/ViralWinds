'use server'

import { portfolioPageContentSchema, PortfolioPageContentValues } from "@/lib/validations/portfolio-page-content"
import { adminClient } from "@/sanity/lib/admin-client"
import { sanityFetch } from "@/sanity/lib/live"
import { revalidatePath } from "next/cache"

const PORTFOLIO_PAGE_CONTENT_ID = 'portfolioPageContent'

export async function getPortfolioPageContentForAdmin() {
    try {
        const query = `*[_type == "portfolioPageContent"][0] {
            ...,
            portfolioList {
                ...,
                "projects": projects[]._ref
            },
            cta {
                ...,
                "formReference": formReference._ref
            }
        }`
        const { data } = await sanityFetch({ query })
        return data
    } catch (error) {
        console.error("Failed to fetch portfolio page content:", error)
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

export async function getPortfolioPageDraft() {
    try {
        const draft = await adminClient.getDocument(`drafts.${PORTFOLIO_PAGE_CONTENT_ID}`)
        if (draft) {
            if (draft.portfolioList && Array.isArray(draft.portfolioList.projects)) {
                draft.portfolioList.projects = draft.portfolioList.projects.map((p: any) => p._ref || p)
            }
            if (draft.cta && draft.cta.formReference) {
                draft.cta.formReference = draft.cta.formReference._ref || draft.cta.formReference
            }
        }
        return draft
    } catch (error: any) {
        if (error.statusCode === 404) return null
        console.error("Failed to fetch portfolio draft:", error)
        return null
    }
}

export async function updatePortfolioPageContent(data: PortfolioPageContentValues) {
    try {
        const validatedFields = portfolioPageContentSchema.parse(data)

        const updateData: any = {
            _type: 'portfolioPageContent',
            _id: PORTFOLIO_PAGE_CONTENT_ID,
            hero: validatedFields.hero,
            portfolioList: {
                projects: validatedFields.portfolioList.projects.map(id => ({
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
        await adminClient.delete(`drafts.${PORTFOLIO_PAGE_CONTENT_ID}`).catch(() => { })
        revalidatePath('/admin/portfolio/page-content')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update portfolio page content:", error)
        return { success: false, error: error.message || "Failed to update content" }
    }
}

export async function savePortfolioPageDraft(data: Partial<PortfolioPageContentValues>) {
    try {
        const updateData: any = {
            ...data,
            _type: 'portfolioPageContent',
            _id: `drafts.${PORTFOLIO_PAGE_CONTENT_ID}`,
        }

        if (data.portfolioList?.projects) {
            updateData.portfolioList.projects = data.portfolioList.projects.map(id => ({
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
        console.error("Failed to save portfolio draft:", error)
        return { success: false, error: error.message || "Failed to save draft" }
    }
}

export async function discardPortfolioPageDraft() {
    try {
        await adminClient.delete(`drafts.${PORTFOLIO_PAGE_CONTENT_ID}`)
        revalidatePath('/admin/portfolio/page-content')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to discard portfolio draft:", error)
        return { success: false, error: error.message || "Failed to discard draft" }
    }
}

export async function getPortfolioFormOptions() {
    try {
        const query = `*[_type == "project"] { _id, title }`
        const projects = await adminClient.fetch(query)
        return projects || []
    } catch (error) {
        console.error("Failed to fetch portfolio form options:", error)
        return []
    }
}
