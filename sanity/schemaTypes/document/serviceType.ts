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
            name: 'subtitle',
            type: 'localizedString',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'description',
            type: 'localizedText',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
            validation: Rule => Rule.required()
        }),

        // Hero
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

        // Intro Section

        defineField({
            name: 'introTagLine',
            type: 'localizedString',
            validation: Rule => Rule
                .required()
        }),

        defineField({
            name: 'introTitle',
            type: 'localizedString',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'introContent',
            type: 'localizedText',
            validation: Rule => Rule.required()
        }),

        // Role Section
        defineField({
            name: 'roleTitle',
            type: 'localizedString',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'roleContent',
            type: 'array',
            of: [{ type: 'localizedText' }],
            validation: Rule => Rule.min(1).error('At least one role description is required')
        }),

        //* How We Help Section
        defineField({
            name: 'howWeHelpSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'howWeHelpPoints',
            type: 'array',
            validation: Rule => Rule.min(1).error('Add at least one help point'),
            of: [{
                type: 'object',
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
                ],
            }],
        }),

        //* Overview & Items
        defineField({
            name: 'overviewSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),


        defineField({
            name: 'items',
            type: 'array',
            of: [{ type: 'localizedString' }],
            validation: Rule => Rule.min(1)
        }),


        //* Process

        defineField({
            name: 'processSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'process',
            type: 'array',
            validation: Rule => Rule.min(1),
            of: [{
                type: 'object',
                fields: [
                    defineField({
                        name: 'step',
                        type: 'string',
                        validation: Rule => Rule.required()
                    }),
                    defineField({
                        name: 'title',
                        type: 'localizedString',
                        validation: Rule => Rule.required()
                    }),
                    defineField({
                        name: 'desc',
                        type: 'localizedText',
                        validation: Rule => Rule.required()
                    }),
                ],
            }],
        }),

        //* Areas

        defineField({
            name: 'areasSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'areas',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({ name: 'region', type: 'localizedString', validation: Rule => Rule.required() }),
                    defineField({
                        name: 'locations',
                        type: 'array',
                        of: [{ type: 'localizedString' }],
                        validation: Rule => Rule.min(1)
                    }),
                    defineField({ name: 'featured', type: 'boolean' }),
                    defineField({
                        name: 'clients',
                        type: 'string',
                        validation: Rule => Rule.required()
                    }),
                    defineField({ name: 'flag', type: 'string' }),
                ],
            }],
        }),


        //* Industries
        defineField({
            name: 'industriesSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'industries',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({
                        name: 'name',
                        type: 'localizedString',
                        validation: Rule => Rule.required()
                    }),
                    defineField({
                        name: 'description',
                        type: 'localizedText',
                        validation: Rule => Rule.required()
                    }),
                ],
            }],
        }),

        //* Benefits

        defineField({
            name: 'benifitsSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'benefits',
            type: 'array',
            of: [{ type: 'localizedString' }],
            validation: Rule => Rule.min(1)
        }),

        //* Why Choose Us

        defineField({
            name: 'whyChooseUsSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'whyChooseUsPoints',
            type: 'array',
            validation: Rule => Rule.min(1),
            of: [{
                type: 'object',
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
                ],
            }],
        }),


        //* Case Studies

        defineField({
            name: 'caseStudiesSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'caseStudies',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({ name: 'title', type: 'localizedString', validation: Rule => Rule.required() }),
                    defineField({ name: 'problem', type: 'localizedText', validation: Rule => Rule.required() }),
                    defineField({ name: 'solution', type: 'localizedText', validation: Rule => Rule.required() }),
                    defineField({ name: 'result', type: 'localizedText', validation: Rule => Rule.required() }),
                ],
            }],
        }),


        //* FAQs

        defineField({
            name: 'faqsSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'faqs',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({ name: 'question', type: 'localizedString', validation: Rule => Rule.required() }),
                    defineField({ name: 'answer', type: 'localizedText', validation: Rule => Rule.required() }),
                ],
            }],
        }),

        //* Blogs
        defineField({
            name: 'blogsSection',
            type: 'sectionHeading',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'blogs',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'post' }] }],
            title: 'Curated Blogs'
        }),
        defineField({
            name: 'blogsButtonText',
            type: 'localizedString',
            title: 'Blogs Section Button Text'
        }),
        defineField({
            name: 'blogsButtonUrl',
            type: 'string',
            title: 'Blogs Section Button URL'
        }),

        //* Other Services
        defineField({
            name: 'otherServicesSection',
            type: 'sectionHeading',
            title: 'Other Services Section Heading'
        }),

        defineField({
            name: 'otherServices',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'service' }] }],
            title: 'Curated Other Services'
        }),

        defineField({
            name: 'otherServicesButtonText',
            type: 'localizedString',
            title: 'Other Services Section Button Text'
        }),

        defineField({
            name: 'otherServicesButtonUrl',
            type: 'string',
            title: 'Other Services Section Button URL'
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
            subtitle: 'subtitle',
            media: 'heroImage',
        },
        prepare({ title, subtitle, media, }) {
            return {
                title: title || 'Untitled Service',
                subtitle,
                media,
            };
        },
    },

});
