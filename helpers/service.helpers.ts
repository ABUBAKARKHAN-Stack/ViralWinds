import { sanityFetch } from "@/sanity/lib/live";
import { ServiceCTA, ServiceData, ServiceLightWeight } from "@/types/services.types";

const SERVICE_QUERY = `{
  "title": title,
  "subtitle": subtitle,
  "description": description,
  "slug": slug.current,
  heroImage{
    "alt": alt,
    "source": asset._ref
  },

  // Intro Section
  "introTagLine": introTagLine,
  "introTitle": introTitle,
  "introContent": introContent,

  // Role Section
  "roleTitle": roleTitle,
  "roleContent": roleContent[],

  // How We Help Section
  "howWeHelpSection": {
    "eyebrow": howWeHelpSection.eyebrow,
    "title": howWeHelpSection.title,
    "description": howWeHelpSection.description
  },

  "howWeHelpPoints": howWeHelpPoints[]{
    "title": title,
    "description": description
  },

  // Overview & Items
  "overviewSection": {
    "eyebrow": overviewSection.eyebrow,
    "title": overviewSection.title,
    "description": overviewSection.description
  },
  "items": items[],

  // Process Section
  "processSection": {
    "eyebrow": processSection.eyebrow,
    "title": processSection.title,
    "description": processSection.description
  },
  "process": process[]{
    step,
    "title": title,
    "desc": desc
  },

  // Areas Section
  "areasSection": {
    "eyebrow": areasSection.eyebrow,
    "title": areasSection.title,
    "description": areasSection.description
  },
  "areas": areas[]{
    "region": region,
    "locations": locations[],
    featured,
    clients,
    flag
  },

  // Industries Section
  "industriesSection": {
    "eyebrow": industriesSection.eyebrow,
    "title": industriesSection.title,
    "description": industriesSection.description
  },
  "industries": industries[]{
    "name": name,
    "description": description
  },

  // Benefits
   "benifitsSection": {
    "eyebrow": benifitsSection.eyebrow,
    "title": benifitsSection.title,
    "description": benifitsSection.description
  },
  "benefits": benefits[],

  // Why Choose Us
   "whyChooseUsSection": {
    "eyebrow": whyChooseUsSection.eyebrow,
    "title": whyChooseUsSection.title,
    "description": whyChooseUsSection.description
  },
  "whyChooseUsPoints": whyChooseUsPoints[]{
    "title": title,
    "description": description
  },

  // Case Studies
  "caseStudiesSection": {
    "eyebrow": caseStudiesSection.eyebrow,
    "title": caseStudiesSection.title,
    "description": caseStudiesSection.description
  },
  "caseStudies": caseStudies[]{
    "title": title,
    "problem": problem,
    "solution": solution,
    "result": result
  },

  // FAQs
  "faqsSection": {
    "eyebrow": faqsSection.eyebrow,
    "title": faqsSection.title,
    "description": faqsSection.description
  },
  "faqs": faqs[]{
    "question": question,
    "answer": answer
  },

  // Blogs Section
  "blogsSection": {
    "eyebrow": blogsSection.eyebrow,
    "title": blogsSection.title,
    "description": blogsSection.description
  },
  "blogs": blogs[]->{
    "title": title,
    "description": description,
    "slug": slug.current,
    "mainImage": {
      "alt": mainImage.alt,
      "source": mainImage.asset._ref
    },
    "categories": categories[]->title,
    publishedAt,
    readTime
  },
  "blogsButtonText": blogsButtonText,
  "blogsButtonUrl": blogsButtonUrl,

  // Other Services
  "otherServicesSection": otherServicesSection,
  "otherServices": otherServices[]->{
    "title": title,
    "description": description,
    "slug": slug.current,
    "heroImageUrl": heroImage.asset->url
  },
  "otherServicesButtonText": otherServicesButtonText,
  "otherServicesButtonUrl": otherServicesButtonUrl,

  // SEO
  seo,

}`;

const SERVICE_QUERY_LIGHT_WEIGHT = `{
  "title": title,
  "slug": slug.current,
  "items": items[],
}`

const SERVICE_SEO_QUERY = `{
  "slug": slug.current,

  heroImage{
    "alt": heroImageAlt,
    "source": asset._ref
  },
  "seo": seo{
    "metaTitle": metaTitle,
    "metaDescription": metaDescription,
    "focusKeyword": focusKeyword,
    "relatedKeywords": relatedKeywords[],
    "schemas": schemas
  }
}`;

const SERVICE_CTA_QUERY = `{
  "badgeText": ctaBadgeText,
  "title": ctaTitle,
  "description":ctaDescription,
  "buttonText": ctaButtonText,
  "url": ctaButtonUrl,
}`;

const getServicesForSSG = async () => {
  try {
    const { data } = await sanityFetch({
      query: `*[_type == "service"]{ "slug": slug.current }`,
      perspective: "published"
    })
    const services = data as { slug: string }[];
    return services ?? []
  } catch (error) {
    console.log("Sanity Error :: ", error);
    throw error;
  }
}


const getService = async (
  slug: string
) => {
  try {
    const { data } = await sanityFetch({
      query: `*[_type == "service" && slug.current == $slug][0] ${SERVICE_QUERY}`,
      params: {
        slug
      },
      perspective: "published"
    })
    const service = data as ServiceData;
    return service ?? null
  } catch (error) {
    console.log("Sanity Error :: ", error);
    throw error;
  }

}

const getServiceSeo = async (
  slug: string
) => {
  try {
    const { data } = await sanityFetch({
      query: `*[_type == "service" && slug.current == $slug][0] ${SERVICE_SEO_QUERY}`,
      params: {
        slug
      },
      perspective: "published"
    })
    const seo = data;
    return seo ?? null
  } catch (error) {
    console.log("Sanity Error :: ", error);
    throw error;
  }

}

const getServicesCTA = async () => {
  try {
    const { data } = await sanityFetch({
      query: `*[_type == "serviceCta"][0] ${SERVICE_CTA_QUERY}`,
      perspective: "published"
    })
    const cta = data as ServiceCTA;
    return cta ?? null
  } catch (error) {
    console.log("Sanity Error :: ", error);
    throw error;
  }

}

export {
  getServicesForSSG,
  getService,
  getServiceSeo,
  getServicesCTA
}