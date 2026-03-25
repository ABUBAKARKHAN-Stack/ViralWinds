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

export interface ServiceType {
  title: string;
  description: string;
  heroImage: {
    alt: string;
    source: string;
  };
  items: string[];
};

export interface ServiceCTA {
  badgeText: string;
  title: string;
  description: string;
  url: string;
  buttonText: string
}
