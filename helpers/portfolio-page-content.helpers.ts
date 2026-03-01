import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { PortfolioPageContentData } from "@/types/form.types";

export const PORTFOLIO_PAGE_CONTENT_QUERY = defineQuery(`*[_type == "portfolioPageContent"][0] {
  "hero": {
    "title": hero.title,
    "subtitle": hero.subtitle,
    "description": hero.description
  },
  "portfolioList": {
    "projects": portfolioList.projects[]->{
      _id,
      "title": title,
      "slug": slug.current,
      "category": category,
      "image": mainImage.asset->{
        _id,
        url,
        "altText": altText
      },
      "description": description
    }
  },
  "cta": {
    "sectionHeading": {
      "eyebrow": cta.sectionHeading.eyebrow,
      "title": cta.sectionHeading.title,
      "description": cta.sectionHeading.description
    },
    "form": cta.formReference->{
      _id,
      name,
      "submitButtonText": submitButtonText,
      "successMessage": successMessage,
      fields[]{
        fieldType,
        fieldName,
        "label": label,
        "placeholder": placeholder,
        required,
        validation,
        options[]{
          "label": label,
          value
        }
      }
    }
  },
  seo
}`);

export async function getPortfolioPageContent() {
  try {
    const { data } = await sanityFetch({
      query: PORTFOLIO_PAGE_CONTENT_QUERY,
      perspective: "published"
    });
    return data as PortfolioPageContentData;
  } catch (error) {
    console.error("Failed to fetch portfolio page content:", error);
    return null;
  }
}
