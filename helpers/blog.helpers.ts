import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

// Query for single blog post with full content
const BLOG_POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  "title": title,
  "description": description,
  "slug": slug.current,
  "author": author,
  "readTime": readTime,
  "publishedAt": publishedAt,
  "tags": tags,
  "categories": categories[]->title,
  "mainImage": {
    "url": mainImage.asset->url,
    "altText": mainImage.alt,
    "_id": mainImage.asset->_id
  },
  "body": body,
  "seo": seo{
    "schemas": schemas
  }
}`);

// Query for all blog post slugs (for static generation)
const BLOG_SLUGS_QUERY = defineQuery(`*[_type == "post"] {
  "slug": slug.current
}`);

const BLOG_SEO_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  "slug": slug.current,

  "mainImage": mainImage.asset->{
    "alt": altText,
    "source": _id
  },
  "seo": seo{
    "metaTitle": metaTitle,
    "metaDescription": metaDescription,
    "focusKeyword": focusKeyword,
    "relatedKeywords": relatedKeywords[],
    "schemas": schemas
  }
}`);

export async function getBlogPost(slug: string) {
  try {
    const { data } = await sanityFetch({
      query: BLOG_POST_QUERY,
      params: { slug },
      perspective: "published"
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

export async function getBlogSlugs() {
  try {
    const { data } = await sanityFetch({
      query: BLOG_SLUGS_QUERY,
      perspective: "published"
    });
    return data as { slug: string }[];
  } catch (error) {
    console.error("Failed to fetch blog slugs:", error);
    return [];
  }
}

export const getBlogPostSeo = async (
  slug: string
) => {
  try {
    const { data } = await sanityFetch({
      query: BLOG_SEO_QUERY,
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
