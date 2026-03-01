import { defineType, defineField } from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      type: 'localizedString',
      title: 'Meta Title',
    }),
    defineField({
      name: 'metaDescription',
      type: 'localizedText',
      title: 'Meta Description',
    }),
    defineField({
      name: 'focusKeyword',
      type: 'localizedString',
      title: 'Focus Keyword',
    }),
    defineField({
      name: 'relatedKeywords',
      type: 'localizedArray',
      title: 'Related Keywords',
    }),
    defineField({
      name: 'schemas',
      type: 'array',
      title: 'Schema Markups (JSON-LD)',
      of: [{ type: 'text', options: { rows: 5 } }],
    }),
  ],
})
