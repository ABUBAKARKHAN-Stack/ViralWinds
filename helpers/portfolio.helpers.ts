import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

// Query for single project with full content
const PROJECT_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0] {
  _id,
  "title": title,
  "slug": slug.current,
  "category": category,
  "description": description,
  "tags": tags,
  "mainImage": mainImage.asset->{
    "source": _id,
    "alt": altText
  },
  "gallery": gallery[] {
    "url": asset->url,
    "alt": alt
  },
  "caseStudy": {
    "title": caseStudy.title,
    "category": caseStudy.category,
    "beforeImage": {
      "url": caseStudy.beforeImage.asset->url,
      "alt": "Before"
    },
    "afterImage": {
      "url": caseStudy.afterImage.asset->url,
      "alt": "After"
    },
    "testimonial": caseStudy.testimonial,
    "results": caseStudy.results[] {
      "icon": icon,
      "value": value,
      "label": label
    },
    "slug": caseStudy.slug.current
  }
}`);

// Query for all project slugs
const PROJECT_SLUGS_QUERY = defineQuery(`*[_type == "project"] {
  "slug": slug.current
}`);


export async function getProject(slug: string) {
  try {
    const { data } = await sanityFetch({
      query: PROJECT_QUERY,
      params: { slug },
      perspective: "published"
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

export async function getProjectSlugs() {
  try {
    const { data } = await sanityFetch({
      query: PROJECT_SLUGS_QUERY,
      perspective: "published"
    });
    return data as { slug: string }[];
  } catch (error) {
    console.error("Failed to fetch project slugs:", error);
    return [];
  }
}
