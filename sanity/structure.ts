import { WrenchIcon } from 'lucide-react'
import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Services Page Content')
        .id('servicesPageContent')
        .child(
          S.document()
            .schemaType('servicesPageContent')
            .documentId('servicesPageContent')
        ),
      S.listItem()
        .title('Landing Page Content')
        .id('landingPageContent')
        .child(
          S.document()
            .schemaType('landingPageContent')
            .documentId('landingPageContent')
        ),
      S.listItem()
        .title('About Page Content')
        .id('aboutPageContent')
        .child(
          S.document()
            .schemaType('aboutPageContent')
            .documentId('aboutPageContent')
        ),
      S.listItem()
        .title('Portfolio Page Content')
        .id('portfolioPageContent')
        .child(
          S.document()
            .schemaType('portfolioPageContent')
            .documentId('portfolioPageContent')
        ),
      S.listItem()
        .title('Contact Page Content')
        .id('contactPageContent')
        .child(
          S.document()
            .schemaType('contactPageContent')
            .documentId('contactPageContent')
        ),
      S.documentTypeListItem('service').title('Service'),
      S.listItem()
        .title('Service CTA')
        .id('serviceCta')
        .child(
          S.document()
            .schemaType('serviceCta')
            .documentId('serviceCta')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !["service", "serviceCta", "siteSettings", "servicesPageContent", "landingPageContent", "aboutPageContent", "portfolioPageContent", "contactPageContent", "form", "contactSubmission"].includes(item.getId()!),
      ),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .icon(WrenchIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
    ])
