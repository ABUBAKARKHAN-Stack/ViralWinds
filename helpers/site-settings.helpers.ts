import { sanityFetch } from "@/sanity/lib/live";

const SITE_SETTINGS_QUERY = `{
  "siteName": siteName,
  "tagline": tagline,
  "logo": logo.asset->{
    _id,
    url,
    "altText": altText
  },
  "favicon": favicon.asset->{
    _id,
    url,
    "altText": altText
  },
  "seo": {
    "metaTitle": seo.metaTitle,
    "metaDescription": seo.metaDescription,
    "focusKeyword": seo.focusKeyword,
    "relatedKeywords": seo.relatedKeywords[],
    "schemas": seo.schemas
  },
  "social": socialLinks[] {
    label,
    icon,
    url
  },
  "contact": contactInfo[] {
    label,
    value,
    icon
  },
  "footerText": footerText,
  "copyright": copyright,
  "headerMenu": headerMenu-> {
    "title": title,
    "slug": slug.current,
    "items": items[] {
      "label": label,
      "description": description,
      type,
      "url": url,
      "slug": slug,
      "reference": reference-> {
        _type,
        "title": coalesce(title.en, title),
        "slug": slug.current
      },
      "children": children[] {
        "label": label,
        "description": description,
        type,
        "url": url,
        "slug": slug,
        "reference": reference-> {
          _type,
          "title": coalesce(title.en, title),
          "slug": slug.current
        },
        "children": children[] {
          "label": label,
          "description": description,
          type,
          "url": url,
          "slug": slug,
          "reference": reference-> {
            _type,
            "title": coalesce(title.en, title),
            "slug": slug.current
          }
        }
      }
    }
  },
  "footerMenu": footerMenu-> {
    "title": title,
    "slug": slug.current,
    "items": items[] {
      "label": label,
      "description": description,
      type,
      "url": url,
      "slug": slug,
      "reference": reference-> {
        _type,
        "title": coalesce(title.en, title),
        "slug": slug.current
      },
      "children": children[] {
        "label": label,
        "description": description,
        type,
        "url": url,
        "slug": slug,
        "reference": reference-> {
          _type,
          "title": coalesce(title.en, title),
          "slug": slug.current
        },
        "children": children[] {
          "label": label,
          "description": description,
          type,
          "url": url,
          "slug": slug,
          "reference": reference-> {
            _type,
            "title": coalesce(title.en, title),
            "slug": slug.current
          }
        }
      }
    }
  },
  "footerCTA": {
    "eyebrow": footerCTA.eyebrow,
    "headingPrefix": footerCTA.headingPrefix,
    "headingHighlight": footerCTA.headingHighlight,
    "buttonText": footerCTA.buttonText,
    "buttonUrl": footerCTA.buttonUrl
  }
}`;

export type MenuItemData = {
  label: string;
  description?: string;
  type: 'reference' | 'custom';
  url?: string;
  slug?: string;
  reference?: {
    _type: string;
    title: string;
    slug: string;
  };
  children?: MenuItemData[];
};

export type MenuData = {
  title: string;
  slug: string;
  items: MenuItemData[];
};

export type SiteSettingsData = {
  siteName: string;
  tagline: string;
  logo?: {
    url: string;
    _id: string;
    altText?: string;
  };
  favicon?: {
    url: string;
    _id: string;
    altText?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword?: string;
    relatedKeywords?: string[];
    schemas?: string[];
  };
  social: {
    label: string;
    icon: string;
    url: string;
  }[];
  contact: {
    label: string;
    value: string;
    icon: string;
  }[];
  footerText: string;
  copyright: string;
  headerMenu?: MenuData;
  footerMenu?: MenuData;
  footerCTA?: {
    eyebrow?: string;
    headingPrefix?: string;
    headingHighlight?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
};

export const getSiteSettings = async () => {
  try {
    const { data } = await sanityFetch({
      query: `*[_type == "siteSettings"][0] ${SITE_SETTINGS_QUERY}`,
      perspective: "published"
    })
    const settings = data as SiteSettingsData;
    return settings ?? null
  } catch (error) {
    console.log("Sanity Error :: ", error);
    return null;
  }
};
