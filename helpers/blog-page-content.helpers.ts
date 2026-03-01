import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { BlogPageContentData } from "@/types/blog.types";

export const BLOG_PAGE_CONTENT_QUERY = defineQuery(`*[_type == "blogPageContent"][0] {
  "hero": {
    "title": hero.title,
    "subtitle": hero.subtitle,
    "description": hero.description
  },
  "blogList": {
    "posts": blogList.posts[]->{
      _id,
      "title": title,
      "slug": slug.current,
      "description": description,
      "categories": categories[]->title,
      author,
      "date": _createdAt,
      "image": mainImage.asset->{
        _id,
        url,
        "altText": altText
      },
      "readTime": readTime,
      "tags": tags,
      "featured": featured,
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

export async function getBlogPageContent() {
  try {
    const { data } = await sanityFetch({
      query: BLOG_PAGE_CONTENT_QUERY,
      perspective: "published"
    });
    return data as BlogPageContentData;
  } catch (error) {
    console.error("Failed to fetch blog page content:", error);
    return null;
  }
}
