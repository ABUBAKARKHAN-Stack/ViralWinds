import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

export const LANDING_PAGE_CONTENT_QUERY = defineQuery(`
  *[_type == "landingPageContent"][0] {

    "hero": {
      "badge": hero.badge,
      "headingLines": hero.headingLines[]{
        "text": text,
        style
      },
      "descriptionParagraphs": hero.descriptionParagraphs[]{
        "text": text
      },
      "ctaButtons": hero.ctaButtons[]{
        "text": text,
        "url": url,
        variant
      },
      "featuredServices": hero.featuredServices[]->{
        "title": title,
        "slug":slug.current
      }
    },
   
    "portfolioPreview": {
      "sectionHeading": {
        "eyebrow": portfolioPreview.sectionHeading.eyebrow,
        "title": portfolioPreview.sectionHeading.title,
        "description": portfolioPreview.sectionHeading.description
      },
      "featuredProjects": portfolioPreview.featuredProjects[]->{
        title,
        "slug":slug.current,
        category,
        "mainImage": mainImage.asset->{
          "source":_id,
          "alt":altText
        }
      },
      "buttonText": portfolioPreview.buttonText,
      "buttonUrl": portfolioPreview.buttonUrl
    },

    "aboutPreview": {
      "sectionHeading": {
        "eyebrow": aboutPreview.sectionHeading.eyebrow,
        "title": aboutPreview.sectionHeading.title,
        "description": aboutPreview.sectionHeading.description
      },
      "leftDescriptions": aboutPreview.leftDescriptions[]{"text": text},
      "rightDescriptions": aboutPreview.rightDescriptions[]{"text": text},
      "ctaText": aboutPreview.ctaText,
      "ctaUrl": aboutPreview.ctaUrl
    },

    "blogPreview": {
      "sectionHeading": {
        "eyebrow": blogPreview.sectionHeading.eyebrow,
        "title": blogPreview.sectionHeading.title,
        "description": blogPreview.sectionHeading.description
      },
      "featuredBlogs": blogPreview.featuredBlogs[]->{
        "title": title,
        "description": description,
        "slug": slug.current,
        "mainImage": mainImage.asset->{
          "alt": altText,
          "source": _id
        },
        "categories": categories[]->title,
        publishedAt,
        readTime
      },
      "buttonText": blogPreview.buttonText,
      "buttonUrl": blogPreview.buttonUrl
    },

    "serviceHighlightsMarquee": {
      "highlights": serviceHighlightsMarquee.highlights[]{
        "text": text
      }
    },

    "trustedByBrands": {
      "sectionHeading": {
        "eyebrow": trustedByBrands.sectionHeading.eyebrow,
        "title": trustedByBrands.sectionHeading.title,
        "description": trustedByBrands.sectionHeading.description
      },
      "brandLogos": trustedByBrands.brandLogos[]{
        "asset": asset->{
          _id,
          url,
          "altText": altText
        },
      }
    },

    "caseStudiesPreview": {
      "sectionHeading": {
        "eyebrow": caseStudiesPreview.sectionHeading.eyebrow,
        "title": caseStudiesPreview.sectionHeading.title,
        "description": caseStudiesPreview.sectionHeading.description
      },
        
      "featuredCaseStudies": caseStudiesPreview.featuredCaseStudies[]->{
        "title": caseStudy.title,
        "slug": slug.current,
        "category": category,
        "beforeImage": caseStudy.beforeImage.asset->{
          _id,
          "altText": altText
        },
        "afterImage": caseStudy.afterImage.asset->{
          _id,
          "altText": altText
        },
        "testimonial": caseStudy.testimonial,
        "results": caseStudy.results[]{
          icon,
          label,
          value
        }
      },
      "buttonText": caseStudiesPreview.buttonText,
      "buttonUrl": caseStudiesPreview.buttonUrl
    },

    "areasWeServe": {
      "sectionHeading": {
        "eyebrow": areasWeServe.sectionHeading.eyebrow,
        "title": areasWeServe.sectionHeading.title,
        "description": areasWeServe.sectionHeading.description
      },
      "areas": areasWeServe.areas[]{
        "region": region,
        "locations": locations[],
        featured,
        clients,
        flag
      }
    },
    
    "testimonials": {
      "sectionHeading": {
        "eyebrow": testimonials.sectionHeading.eyebrow,
        "title": testimonials.sectionHeading.title,
        "description": testimonials.sectionHeading.description
      },
      "testimonials": testimonials.testimonials[]{
        "quote": quote,
        "author": author,
        "role": role,
        "company": company,
        "avatar": avatar.asset->{
          _id,
          url,
          "altText": altText
        }
      }
    },

    seo
  }
`);

export async function getLandingPageContent() {

  try {
    const { data } = await sanityFetch({
      query: LANDING_PAGE_CONTENT_QUERY,
      perspective: "published"
    });

    return data as any;
  } catch (error) {
    console.error("Failed to fetch landing page content:", error);
    throw error;
  }
}
