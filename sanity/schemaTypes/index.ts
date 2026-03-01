import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { localizedString, localizedText, localizedArray } from './objects/localizedStringType'
import { seoType } from './objects/seoType'
import { heroSectionType } from './document/heroSection'
import { whatWeDoSectionType } from './document/whatWeDoSection'
import { pageType } from './document/pageType'
import { serviceType } from './document/serviceType'
import { sectionHeadingType } from './objects/sectionHeadingType'
import { serviceCtaType } from './document/serviceCtaType'
import { localizedUrl } from './objects/localizedUrlType'
import { siteSettings } from './document/siteSettingsType'
import { servicesPageContentType } from './document/servicesPageContentType'
import { landingPageContentType } from './document/landingPageContentType'
import { contactSubmissionType } from './document/contactSubmissionType'
import { formType } from './document/formType'
import { aboutPageContentType } from './document/aboutPageContentType'
import { globalSectionsType } from './document/globalSectionsType'
import { portfolioPageContentType } from './document/portfolioPageContentType'
import { blogPageContentType } from './document/blogPageContentType'
import { menuType } from './document/menuType'
import { menuItemType } from './objects/menuItemType'
import { locationType } from './locationType'
import { projectType } from './projectType'
import { imageAssetType } from './imageAssetType'
import { contactPageContentType } from './document/contactPageContentType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    localizedString,
    localizedText,
    localizedArray,
    localizedUrl,
    sectionHeadingType,
    seoType,
    heroSectionType,
    whatWeDoSectionType,
    pageType,
    serviceType,
    serviceCtaType,
    siteSettings,
    servicesPageContentType,
    landingPageContentType,
    contactSubmissionType,
    formType,
    aboutPageContentType,
    globalSectionsType,
    menuType,
    menuItemType,
    locationType,
    projectType,
    contactPageContentType,
    portfolioPageContentType,
    blogPageContentType,
    imageAssetType,
  ],
}


