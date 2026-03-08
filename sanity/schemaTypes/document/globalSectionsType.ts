import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

export const globalSectionsType = defineType({
    name: 'globalSections',
    title: 'Global Sections',
    type: 'document',
    icon: EarthGlobeIcon,
    fields: [
        // STATS SECTION
        defineField({
            name: 'stats',
            title: 'Stats Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'since',
                    title: 'Since',
                    type: 'object',
                    fields: [
                        defineField({ name: 'value', type: 'string' }),
                        defineField({ name: 'label', type: 'localizedString' }),
                    ]
                }),
                defineField({
                    name: 'projectsDelivered',
                    title: 'Projects Delivered',
                    type: 'object',
                    fields: [
                        defineField({ name: 'value', type: 'string' }),
                        defineField({ name: 'label', type: 'localizedString' }),
                        defineField({
                            name: 'suffix',
                            type: 'string',
                            validation: Rule => Rule.required()
                        })
                    ]
                }),
                defineField({
                    name: 'yearsExperience',
                    title: 'Years Experience',
                    type: 'object',
                    fields: [
                        defineField({ name: 'value', type: 'string' }),
                        defineField({ name: 'label', type: 'localizedString' }),
                        defineField({
                            name: 'suffix',
                            type: 'string',
                            validation: Rule => Rule.required()
                        })
                    ]
                }),
                defineField({
                    name: 'clientSatisfaction',
                    title: 'Client Satisfaction',
                    type: 'object',
                    fields: [
                        defineField({ name: 'value', type: 'string' }),
                        defineField({ name: 'label', type: 'localizedString' }),
                        defineField({
                            name: 'suffix',
                            type: 'string',
                            validation: Rule => Rule.required()
                        })
                    ]
                })
            ]
        }),

        // SERVICES PREVIEW SECTION
        defineField({
            name: 'servicesPreview',
            title: 'Services Preview Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'featuredServices',
                    title: 'Featured Services',
                    type: 'array',
                    description: 'Select services to display in the preview section (Max 8)',
                    of: [{ type: 'reference', to: [{ type: 'service' }] }],
                    validation: Rule => Rule.max(8)
                }),
                defineField({
                    name: 'buttonText',
                    title: 'CTA Button Text (Optional)',
                    type: 'localizedString'
                }),
                defineField({
                    name: 'buttonUrl',
                    title: 'CTA Button URL (Optional)',
                    type: 'localizedString',
                    description: 'Enter a relative path (e.g., /services) or a full URL (e.g., https://example.com)'
                })
            ]
        }),

        // WHY CHOOSE US SECTION
        defineField({
            name: 'whyChooseUs',
            title: 'Why Choose Us Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'benefits',
                    title: 'Benefits',
                    type: 'array',
                    validation: Rule => Rule.required().min(1),
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
                                description: 'Lucide icon name (e.g., Target, Shield, Award)',
                                validation: Rule => Rule.required()
                            })
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
                })
            ]
        }),

        // OUR APPROACH SECTION
        defineField({
            name: 'ourApproach',
            title: 'Our Approach Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'steps',
                    title: 'Approach Steps',
                    type: 'array',
                    validation: Rule => Rule.required().min(1),
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
                                name: 'iconName',
                                title: 'Icon Name',
                                type: 'string',
                                description: 'Lucide icon name',
                                validation: Rule => Rule.required()
                            })
                        ],
                        preview: {
                            select: {
                                title: 'title.en',
                                icon: 'iconName'
                            },
                            prepare({ title, icon }) {
                                return {
                                    title: title || 'Untitled Step',
                                    subtitle: `Icon: ${icon || 'None'}`
                                }
                            }
                        }
                    }]
                })
            ]
        }),

        // INDUSTRIES WE SERVE SECTION
        defineField({
            name: 'industriesWeServe',
            title: 'Industries We Serve Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'industries',
                    title: 'Industries',
                    type: 'array',
                    validation: Rule => Rule.required().min(1),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'name',
                                title: 'Industry Name',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'description',
                                title: 'Industry Description',
                                type: 'localizedText'
                            }),
                            defineField({
                                name: 'iconName',
                                title: 'Icon Name',
                                type: 'string',
                                description: 'Lucide icon name',
                                validation: Rule => Rule.required()
                            })
                        ],
                        preview: {
                            select: {
                                name: 'name.en',
                                icon: 'iconName'
                            },
                            prepare({ name, icon }) {
                                return {
                                    title: name || 'Untitled Industry',
                                    subtitle: `Icon: ${icon || 'None'}`
                                }
                            }
                        }
                    }]
                })
            ]
        }),

        // FAQS SECTION
        defineField({
            name: 'faqs',
            title: 'FAQs Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'faqItems',
                    title: 'FAQ Items',
                    type: 'array',
                    validation: Rule => Rule.required().min(1),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'question',
                                title: 'Question',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'answer',
                                title: 'Answer',
                                type: 'localizedText',
                                validation: Rule => Rule.required()
                            })
                        ],
                        preview: {
                            select: {
                                question: 'question.en'
                            },
                            prepare({ question }) {
                                return {
                                    title: question || 'Untitled Question'
                                }
                            }
                        }
                    }]
                }),
                defineField({
                    name: 'buttonText',
                    title: 'CTA Button Text (Optional)',
                    type: 'localizedString',
                    description: 'Leave empty to use default "Contact us for more" button'
                }),
                defineField({
                    name: 'buttonUrl',
                    title: 'CTA Button URL (Optional)',
                    type: 'localizedString',
                    description: 'Enter a relative path (e.g., /contact) or a full URL (e.g., https://example.com). Leave empty to use default /contact URL'
                })
            ]
        }),

        // LEADERSHIP SECTION
        defineField({
            name: 'leadership',
            title: 'Leadership Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'founder',
                    title: 'Founder Information',
                    type: 'object',
                    validation: Rule => Rule.required(),
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Name',
                            type: 'localizedString',
                            validation: Rule => Rule.required()
                        }),
                        defineField({
                            name: 'role',
                            title: 'Role/Title',
                            type: 'localizedString',
                            validation: Rule => Rule.required()
                        }),
                        defineField({
                            name: 'image',
                            title: 'Profile Image',
                            type: 'image',
                            validation: Rule => Rule.required()
                        }),
                        defineField({
                            name: 'socialLinks',
                            title: 'Social Links',
                            type: 'array',
                            of: [{
                                type: 'object',
                                fields: [
                                    defineField({
                                        name: 'label',
                                        title: 'Platform Label',
                                        type: 'string',
                                        validation: Rule => Rule.required()
                                    }),
                                    defineField({
                                        name: 'iconName',
                                        title: 'Icon Name',
                                        type: 'string',
                                        validation: Rule => Rule.required()
                                    }),
                                    defineField({
                                        name: 'url',
                                        title: 'URL',
                                        type: 'string',
                                        description: 'Enter a relative path (e.g., /contact) or a full URL (e.g., https://example.com)',
                                        validation: Rule => Rule.required()
                                    })
                                ],
                                preview: {
                                    select: {
                                        platform: 'platform',
                                        url: 'url'
                                    },
                                    prepare({ platform, url }) {
                                        return {
                                            title: platform || 'Social Link',
                                            subtitle: url
                                        }
                                    }
                                }
                            }]
                        })
                    ]
                }),
                defineField({
                    name: 'agencyStructure',
                    title: 'Agency Structure',
                    type: 'array',
                    description: 'Teams/departments in the agency',
                    validation: Rule => Rule.required().min(1),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'title',
                                title: 'Team Title',
                                type: 'localizedString',
                                description: 'e.g., Design Team, Development Team',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'description',
                                title: 'Description',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'featured',
                                title: 'Featured Industry',
                                type: 'boolean',
                                description: 'Mark this industry as featured',
                                initialValue: false
                            }),
                            defineField({
                                name: 'iconName',
                                title: 'Icon',
                                type: 'string',
                                description: 'Lucide icon name',
                                validation: Rule => Rule.required()
                            })
                        ],
                        preview: {
                            select: {
                                title: 'title.en',
                                description: 'description.en',
                                icon: 'iconName'
                            },
                            prepare({ title, description, icon }) {
                                return {
                                    title: title || 'Untitled Team',
                                    subtitle: `${icon || 'No icon'} • ${description || 'No description'}`
                                }
                            }
                        }
                    }]
                })
            ]
        }),

        // CTA SECTION
        defineField({
            name: 'cta',
            title: 'CTA Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'badge',
                    title: 'Badge Text',
                    type: 'localizedString',
                    description: 'e.g., "Available for new projects"',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'heading',
                    title: 'Heading',
                    type: 'localizedString',
                    description: 'Main CTA heading',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'description',
                    title: 'Description',
                    type: 'localizedText',
                    description: 'CTA description paragraphs',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'benefits',
                    title: 'Benefits',
                    type: 'array',
                    description: 'List of benefits/features',
                    validation: Rule => Rule.required().min(1).max(5),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'text',
                                title: 'Benefit Text',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            })
                        ],
                        preview: {
                            select: {
                                text: 'text.en'
                            },
                            prepare({ text }) {
                                return {
                                    title: text || 'Untitled Benefit'
                                }
                            }
                        }
                    }]
                }),
            ]
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Global Sections',
                subtitle: 'Manage shared content across pages'
            }
        }
    }
});
