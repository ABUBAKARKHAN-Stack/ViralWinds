import { sanityFetch } from "@/sanity/lib/live";
import { ServiceCTA, ServiceType } from "@/types/services.types";

const SERVICE_QUERY = `{
  "title": title,
  "description": description,
  heroImage{
    "alt": alt,
    "source": asset._ref
  },

  "items": items[],

  // SEO
  seo,

}`;

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
    const service = data as ServiceType;
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