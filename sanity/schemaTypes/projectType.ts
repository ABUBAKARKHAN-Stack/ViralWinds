import { CaseIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const projectType = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    icon: CaseIcon,
    fields: [
        defineField({
            name: 'title',
            type: 'localizedString',
            title: 'Project Title',
            validation: (Rule) => Rule.required(),

        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            type: 'localizedString',
            title: 'Short Category',
            description: 'e.g., Brand, Digital, UI/UX (Single word preferred for cards)',
            validation: (Rule) => Rule.required(),

        }),
        defineField({
            name: 'description',
            type: 'localizedText',
            title: 'Short Description',
            description: 'Short summary for the project listing cards.',
            validation: (Rule) => Rule.required(),

        }),
        defineField({
            name: 'mainImage',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                })
            ],
            validation: (Rule) => Rule.required(),

        }),
        defineField({
            name: 'tags',
            type: 'localizedArray',
            title: 'Tags',
            validation: (Rule) => Rule.required(),

        }),

        defineField({
            name: 'caseStudy',
            type: 'object',
            title: 'Case Study Details',
            options: {
                collapsible: true,
                collapsed: false,
            },
            validation: (Rule) => Rule.required(),

            fields: [
                defineField({
                    name: 'title',
                    type: 'localizedString',
                    title: 'Case Study Title',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'beforeImage',
                    type: 'image',
                    title: 'Before Image',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'afterImage',
                    type: 'image',
                    title: 'After Image',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'testimonial',
                    type: 'localizedText',
                    title: 'Client Testimonial',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'results',
                    type: 'array',
                    title: 'Project Results/Stats',
                    of: [
                        defineArrayMember({
                            type: 'object',
                            name: 'result',
                            fields: [
                                defineField({
                                    name: 'icon',
                                    type: 'string',
                                    title: 'Icon Name',
                                    description: 'Used by IconSelect in the dashboard.',
                                    validation: (Rule) => Rule.required(),
                                }),
                                defineField({
                                    name: 'value',
                                    type: 'localizedString',
                                    title: 'Result Value (e.g., +340%)',
                                    validation: (Rule) => Rule.required(),
                                }),
                                defineField({
                                    name: 'label',
                                    type: 'localizedString',
                                    title: 'Result Label (e.g., Organic Traffic)',
                                    validation: (Rule) => Rule.required(),
                                }),
                            ],
                            preview: {
                                select: {
                                    title: 'label',
                                    subtitle: 'value',
                                }
                            }
                        })
                    ],
                    validation: (Rule) => Rule.required().min(1),
                }),
            ]
        }),
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
            description: 'Custom SEO settings for this project'
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'category',
            media: 'mainImage',
        },
    },
})
