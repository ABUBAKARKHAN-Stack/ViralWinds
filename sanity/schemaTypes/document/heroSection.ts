import { defineField, defineType } from "sanity";

export const heroSectionType = defineType({
    name: 'heroSection',
    type: 'document',
    title: 'Hero Section',
    fields: [
        defineField({ name: 'title', type: 'localizedString' }),
        defineField({ name: 'subtitle', type: 'localizedText' }),
        defineField({
            name: 'image', type: 'image', title: 'Image', fields: [
                defineField({ name: 'alt', type: 'localizedString', title: 'Alt Text' })
            ]
        }),
    ],
});