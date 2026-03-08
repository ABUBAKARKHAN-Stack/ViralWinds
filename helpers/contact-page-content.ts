import { sanityFetch } from "@/sanity/lib/live"

export async function getContactPageContent() {
    try {
        const query = `*[_type == "contactPageContent"][0] {
            ...,
            contactForm {
                ...,
            },
            faqs {
                ...
            },
            seo {
                ...
            }
        }`

        const { data } = await sanityFetch({ query })
        return data
    } catch (error) {
        console.error("Failed to fetch contact page content:", error)
        return null
    }
}