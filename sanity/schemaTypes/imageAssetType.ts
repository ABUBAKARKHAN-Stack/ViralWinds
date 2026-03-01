import { defineField, defineType } from 'sanity'

export const imageAssetType = defineType({
    name: 'sanity.imageAsset',
    title: 'Image',
    type: 'document',
    fields: [
        defineField({
            name: 'altText',
            title: 'Alt Text',
            type: 'localizedString',
            description: 'Alternative text for accessibility and SEO',
        }),
        defineField({
            name: 'caption',
            title: 'Caption',
            type: 'localizedText',
            description: 'Optional image caption',
        }),
    ],
})
