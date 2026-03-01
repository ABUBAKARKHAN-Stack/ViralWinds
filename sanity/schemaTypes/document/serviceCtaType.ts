import { defineType, defineField } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export const serviceCtaType = defineType({
    name: 'serviceCta',
    title: 'Service (CTA)',
    type: 'document',
    icon: RocketIcon,

    fields: [
        defineField({
            name: 'ctaBadgeText',
            type: 'localizedString',
            title: 'CTA Badge Text Line',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'ctaTitle',
            type: 'localizedString',
            title: 'CTA Title',
            validation: Rule => Rule.required()

        }),
        defineField({
            name: 'ctaDescription',
            type: 'localizedText',
            title: 'CTA Description',
            validation: Rule => Rule.required()

        }),
        defineField({
            name: 'ctaButtonText',
            type: 'localizedString',
            title: 'CTA Button Text',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'ctaButtonUrl',
            type: 'localizedUrl',
            title: 'CTA Button URL',
        }),
    ],

    preview: {
        select: {
            title: 'ctaTitle.en',
            description: 'ctaDescription.en',
        },
        prepare({ title, description, }) {
            return {
                title,
                description,
            };
        },
    },

})
