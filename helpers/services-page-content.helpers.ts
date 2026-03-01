import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

export const SERVICES_PAGE_CONTENT_QUERY = defineQuery(`*[_type == "servicesPageContent"][0] {
  "hero": {
    "title": hero.title,
    "subtitle": hero.subtitle,
    "description": hero.description
  },
  "intro": {
    "badgeText": intro.badgeText,
    "heading": intro.heading,
    "headingAccent": intro.headingAccent,
    "description": intro.description
  },
  "process": {
    "sectionHeading": {
      "eyebrow": process.sectionHeading.eyebrow,
      "title": process.sectionHeading.title,
      "description": process.sectionHeading.description
    },
    "steps": process.steps[]{
      "title": title,
      "description": description,
      "duration": duration,
      iconName
    }
  },
  "whyChooseUs": {
    "sectionHeading": {
      "eyebrow": whyChooseUs.sectionHeading.eyebrow,
      "title": whyChooseUs.sectionHeading.title,
      "description": whyChooseUs.sectionHeading.description
    },
    "guaranteePoints": whyChooseUs.guaranteePoints[],
    "benefits": whyChooseUs.benefits[]{
      "title": title,
      "description": description,
      iconName
    }
  },

   "serviceBlogs": {
    "sectionHeading": {
      "eyebrow": serviceBlogs.sectionHeading.eyebrow,
      "title": serviceBlogs.sectionHeading.title,
      "description": serviceBlogs.sectionHeading.description
    },
    "blogs": serviceBlogs.blogs[]->{
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
    "buttonText": serviceBlogs.buttonText,
    "buttonUrl": serviceBlogs.buttonUrl
  },

  "servicesList": {
    "sectionHeading": {
      "eyebrow": servicesList.sectionHeading.eyebrow,
      "title": servicesList.sectionHeading.title,
      "description": servicesList.sectionHeading.description
    },
    "services": servicesList.services[]->{
    "title": title,
    "description": description,
    "slug": slug.current,
    "heroImage": {
      "alt":heroImage.heroImageAlt,
      "source": heroImage.asset._ref
    },
    "items": items[],
  },
    "buttonText": servicesList.buttonText,
    "buttonUrl": servicesList.buttonUrl
  },

  

  seo

 

}`);

export async function getServicesPageContent() {
  try {
    const { data } = await sanityFetch({
      query: SERVICES_PAGE_CONTENT_QUERY,
      perspective: "published"
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch services page content:", error);
    throw error;
  }
}
