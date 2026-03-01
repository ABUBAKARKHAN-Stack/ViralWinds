import { sanityFetch } from "@/sanity/lib/live";

export async function getGlobalSections() {
  const query = `*[_type == "globalSections" && _id == "globalSections"][0]{
    stats {
      since {
        value,
        label
      },
      projectsDelivered {
        value,
        label,
        suffix
      },
      yearsExperience {
        value,
        label,
        suffix
      },
      clientSatisfaction {
        value,
        label,
        suffix
      }
    },
    servicesPreview {
      sectionHeading {
        eyebrow,
        title,
        description
      },
      featuredServices[]-> {
        _id,
        title,
        "slug": slug.current,
        description,
         "heroImage": {
      "alt":heroImage.heroImageAlt,
      "source": heroImage.asset._ref
    },
    "items": items[],
  
      },
      buttonText,
      buttonUrl
    },
    whyChooseUs {
      sectionHeading {
        eyebrow,
        title,
        description
      },
      benefits[] {
        _key,
        title,
        description,
        iconName
      }
    },
    ourApproach {
      sectionHeading {
        eyebrow,
        title,
        description
      },
      steps[] {
        _key,
        title,
        description,
        featured,
        iconName
      }
    },
    industriesWeServe {
      sectionHeading {
        eyebrow,
        title,
        description
      },
      industries[] {
        _key,
        name,
        description,
        iconName
      }
    },
    faqs {
      sectionHeading {
        eyebrow,
        title,
        description
      },
      faqItems[] {
        _key,
        question,
        answer
      },
      buttonText,
      buttonUrl
    },
    leadership {
      sectionHeading {
        eyebrow,
        title,
        description
      },
      founder {
        name,
        role,
        "image": image.asset-> {
          url,
          _id,
          altText
        },
        socialLinks[] {
          _key,
          label,
          iconName,
          url
        }
      },
      agencyStructure[] {
        _key,
        title,
        description,
        featured,
        iconName
      }
    },
    cta {
      badge,
      heading,
      description,
      benefits[] {
        _key,
        text
      },
      "formId": formId->_id
    }
  }`;

  try {
    const { data } = await sanityFetch({ query });
    return data;
  } catch (error) {
    console.error("Error fetching global sections:", error);
    return null;
  }
}
