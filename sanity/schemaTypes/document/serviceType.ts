import { defineField, defineType } from "sanity";

export const serviceType = defineType({
    name: 'service',
    type: 'document',
    title: 'Service',
    fields: [

        defineField({
            name: 'title',
            type: 'localizedString',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'description',
            type: 'localizedText',
            validation: Rule => Rule.required()
        }),


        defineField({
            name: 'heroImage',
            type: 'image',
            title: 'Hero Image',
            validation: Rule => Rule.required(),
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'heroImageAlt',
                    type: 'localizedString',
                    title: 'Alternative text',
                    validation: Rule => Rule.required(),
                })
            ]
        }),

        defineField({
            name: 'items',
            type: 'array',
            of: [{ type: 'localizedString' }],
            validation: Rule => Rule.min(1)
        }),

        defineField({
            name: 'seo',
            type: 'seo',
            validation: Rule => Rule.required()
        }),
    ],

    preview: {
        select: {
            title: 'title',
            media: 'heroImage',
        },
        prepare({ title, media, }) {
            return {
                title: title || 'Untitled Service',
                media,
            };
        },
    },

});
