import { SEOType } from "./seo.types";

export interface ServiceProcess {
  step: string;
  title: string;
  desc: string;
}

export interface CaseStudy {
  title: string;
  problem: string;
  solution: string;
  result: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Industry {
  name: string;
  description: string;
}

export interface Areas {
  region: string;
  locations: string[];
  featured: boolean;
  clients: number;
  flag: string;
}

export interface SanityImage {
  alt: string;
  source: string
}

export interface SectionHeadingType {
  eyebrow?: string;
  title: string;
  description?: string
}
export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  focusKeyword?: string;
  relatedKeywords?: string[];
  schemas?: string[];
}

export interface ServiceData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: SanityImage;

  // Intro Section
  introTagLine: string
  introTitle: string;
  introContent: string;

  // Role/Importance Section
  roleTitle: string;
  roleContent: string[];

  // How We Help Section

  howWeHelpSection: SectionHeadingType;
  howWeHelpPoints: { title: string; description: string }[];

  // Overview
  overviewSection: SectionHeadingType;
  items: string[];

  // Benefits/Why Choose Us
  benifitsSection: SectionHeadingType;
  benefits: string[];
  whyChooseUsSection: SectionHeadingType;
  whyChooseUsPoints: { title: string; description: string }[];

  // Process
  processSection: SectionHeadingType;
  process: ServiceProcess[];

  // Industries
  industriesSection: SectionHeadingType
  industries: Industry[];

  // Areas 
  areasSection: SectionHeadingType
  areas: Areas[]

  // Case Studies
  caseStudiesSection: SectionHeadingType;
  caseStudies: CaseStudy[];

  // FAQs
  faqsSection: SectionHeadingType
  faqs: FAQ[];

  // Other Services
  otherServicesSection: SectionHeadingType;
  otherServices: ServiceLightWeight[];
  otherServicesButtonText?: string;
  otherServicesButtonUrl?: string;

  seo: SEOType;
}

export interface ServiceCTA {

  badgeText: string;
  title: string;
  description: string;
  url: string;
  buttonText: string
}

export interface ServiceLightWeight {
  title: string;
  description: string;
  slug: string;
  heroImageUrl?: string;
}