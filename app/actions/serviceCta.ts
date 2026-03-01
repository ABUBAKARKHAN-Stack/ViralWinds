'use server'

import { serviceCtaFormSchema, ServiceCtaValues } from "@/lib/validations/service-cta"
import { adminClient } from "@/sanity/lib/admin-client"
import { sanityFetch } from "@/sanity/lib/live"

const SERVICE_CTA_ID = 'serviceCta'

export async function getServiceCta() {
    try {
        const query = `*[_type == "serviceCta"][0]`
        const { data } = await sanityFetch({ query })
        return data
    } catch (error) {
        console.error("Failed to fetch service cta:", error)
        return null
    }
}

export async function updateServiceCta(data: ServiceCtaValues) {
    try {
        const validatedFields = serviceCtaFormSchema.parse(data)

        const updateData: any = {
            _type: 'serviceCta',
            _id: SERVICE_CTA_ID,
            ctaBadgeText: validatedFields.ctaBadgeText,
            ctaTitle: validatedFields.ctaTitle,
            ctaDescription: validatedFields.ctaDescription,
            ctaButtonText: validatedFields.ctaButtonText,
        }

        if (validatedFields.ctaButtonUrl) {
            updateData.ctaButtonUrl = validatedFields.ctaButtonUrl;
        }

        await adminClient.createOrReplace(updateData)

        return { success: true }

    } catch (error: any) {
        console.error("Failed to update service cta:", error)
        const errorMessage = error.response?.body?.message || error.message || "Failed to update settings"
        return {
            success: false,
            error: errorMessage
        }
    }
}
