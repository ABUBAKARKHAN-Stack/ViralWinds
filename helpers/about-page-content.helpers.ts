import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

export const ABOUT_PAGE_CONTENT_QUERY = defineQuery(`*[_type == "aboutPageContent"][0] {
  "hero": {
    "title": hero.title,
    "subtitle": hero.subtitle,
    "description": hero.description
  },
  "intro": {
    "badge": intro.badge,
    "heading": intro.heading,
    "description1": intro.description1,
    "description2": intro.description2,
    "quote": intro.quote,
    "mainImage": intro.mainImage.asset->{
      _id,
      url,
      "altText": altText
    },
    "sinceYear": intro.sinceYear
  },
  "missionVision": {
    "sectionHeading": {
      "eyebrow": missionVision.sectionHeading.eyebrow,
      "title": missionVision.sectionHeading.title,
      "description": missionVision.sectionHeading.description
    },
    "mission": {
      "eyebrow": missionVision.mission.eyebrow,
      "title": missionVision.mission.title,
      "description1": missionVision.mission.description1,
      "description2": missionVision.mission.description2,
      "keyPoints": missionVision.mission.keyPoints[]
    },
    "vision": {
      "eyebrow": missionVision.vision.eyebrow,
      "title": missionVision.vision.title,
      "description1": missionVision.vision.description1,
      "description2": missionVision.vision.description2,
      "keyPoints": missionVision.vision.keyPoints[]
    }
  },
  "philosophy": {
    "sectionHeading": {
      "eyebrow": philosophy.sectionHeading.eyebrow,
      "title": philosophy.sectionHeading.title,
      "description": philosophy.sectionHeading.description
    },
    "quoteBlock": philosophy.quoteBlock,
    "description1": philosophy.description1,
    "description2": philosophy.description2,
    "steps": philosophy.steps[]{
      "label": label,
      "iconName": iconName
    }
  },
  "globalReach": {
    "badge": globalReach.badge,
    "heading": globalReach.heading,
    "description1": globalReach.description1,
    "description2": globalReach.description2,
    "regions": globalReach.regions[],
    "stats": globalReach.stats[]{
      "value": value,
      "label": label
    }
  },
  "culture": {
    "sectionHeading": {
      "eyebrow": culture.sectionHeading.eyebrow,
      "title": culture.sectionHeading.title,
      "description": culture.sectionHeading.description
    },
    "values": culture.values[]{
      "title": title,
      "description": description,
      iconName
    },
    "quote": culture.quote,
    "quoteHighlight": culture.quoteHighlight
  },
  seo
}`);

export async function getAboutPageContent() {
  try {
    const { data } = await sanityFetch({
      query: ABOUT_PAGE_CONTENT_QUERY,
      perspective: "published"
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch about page content:", error);
    throw error;
  }
}
