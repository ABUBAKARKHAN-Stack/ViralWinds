import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const servicesPageContentType = defineType({
    name: 'servicesPageContent',
    title: 'Services Page Content',
    type: 'document',
    icon: DocumentTextIcon,

    fields: [
        // HERO SECTION
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            validation: Rule => Rule.required(),
            fields: [
                defineField({
                    name: 'title',
                    title: 'Title',
                    type: 'localizedString',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'subtitle',
                    title: 'Subtitle',
                    type: 'localizedString',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'description',
                    title: 'Description',
                    type: 'localizedText',
                    validation: Rule => Rule.required()
                }),
            ]
        }),

        // INTRO SECTION
        defineField({
            name: 'intro',
            title: 'Introduction Section',
            type: 'object',
            validation: Rule => Rule.required(),
            fields: [
                defineField({
                    name: 'badgeText',
                    title: 'Badge Text',
                    type: 'localizedString',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'heading',
                    title: 'Main Heading',
                    type: 'localizedString',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'headingAccent',
                    title: 'Heading Accent (Highlighted Text)',
                    type: 'localizedString',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'description',
                    title: 'Description',
                    type: 'localizedText',
                    validation: Rule => Rule.required()
                }),
            ]
        }),

        // PROCESS SECTION
        defineField({
            name: 'process',
            title: 'Process Section',
            type: 'object',
            validation: Rule => Rule.required(),
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'steps',
                    title: 'Process Steps',
                    type: 'array',
                    validation: Rule => Rule.min(1).required(),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'title',
                                title: 'Step Title',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'description',
                                title: 'Step Description',
                                type: 'localizedText',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'duration',
                                title: 'Duration/Timeline',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'iconName',
                                title: 'Icon Name',
                                type: 'string',
                                description: 'Lucide icon name (e.g., MessageSquare, Lightbulb, Palette, Code, Rocket, HeartHandshake)',
                                validation: Rule => Rule.required()
                            }),
                        ],
                        preview: {
                            select: {
                                title: 'title.en',
                                duration: 'duration.en',
                                icon: 'iconName'
                            },
                            prepare({ title, duration, icon }) {
                                return {
                                    title: title || 'Untitled Step',
                                    subtitle: `${duration || ''} • Icon: ${icon || 'None'}`
                                }
                            }
                        }
                    }]
                }),
            ]
        }),

        // WHY CHOOSE US SECTION
        defineField({
            name: 'whyChooseUs',
            title: 'Why Choose Us Section',
            type: 'object',
            validation: Rule => Rule.required(),
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'object',
                    validation: Rule => Rule.required(),
                    fields: [
                        defineField({
                            name: 'eyebrow',
                            title: 'Eyebrow Text',
                            type: 'localizedString',
                            validation: Rule => Rule.required()
                        }),
                        defineField({
                            name: 'title',
                            title: 'Title',
                            type: 'localizedString',
                            validation: Rule => Rule.required()
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'localizedText',
                            validation: Rule => Rule.required()
                        }),
                    ]
                }),
                defineField({
                    name: 'guaranteePoints',
                    title: 'Guarantee Points',
                    type: 'array',
                    description: 'List of guarantee/promise statements',
                    validation: Rule => Rule.min(1).required(),
                    of: [{ type: 'localizedString' }]
                }),
                defineField({
                    name: 'benefits',
                    title: 'Benefits Cards',
                    type: 'array',
                    validation: Rule => Rule.min(1).required(),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'title',
                                title: 'Benefit Title',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'description',
                                title: 'Benefit Description',
                                type: 'localizedText',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'iconName',
                                title: 'Icon Name',
                                type: 'string',
                                description: 'Lucide icon name (e.g., Target, Users, TrendingUp)',
                                validation: Rule => Rule.required()
                            }),
                        ],
                        preview: {
                            select: {
                                title: 'title.en',
                                icon: 'iconName'
                            },
                            prepare({ title, icon }) {
                                return {
                                    title: title || 'Untitled Benefit',
                                    subtitle: `Icon: ${icon || 'None'}`
                                }
                            }
                        }
                    }]
                }),
            ]
        }),



        // SERVICES LIST SECTION
        defineField({
            name: 'servicesList',
            title: 'Services List Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'services',
                    title: 'Select Services',
                    type: 'array',
                    description: 'Select services to display in this section',
                    of: [{ type: 'reference', to: [{ type: 'service' }] }],
                    validation: Rule => Rule.max(12)
                }),

            ]
        }),

        // SEO SECTION
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
            description: 'Custom SEO settings for this page'
        }),
    ],

    preview: {
        prepare() {
            return {
                title: 'Services Page Content',
                subtitle: 'Manage all services page sections'
            }
        }
    }
});
