import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const landingPageContentType = defineType({
    name: 'landingPageContent',
    title: 'Landing Page Content',
    type: 'document',
    icon: HomeIcon,

    fields: [
        // HERO SECTION
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            validation: Rule => Rule.required(),
            fields: [
                defineField({
                    name: 'badge',
                    title: 'Badge Text',
                    type: 'localizedString',
                    description: 'e.g., "Trusted by 3,000+ Businesses"',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'headingLines',
                    title: 'Heading Lines',
                    type: 'array',
                    description: 'Maximum 3 lines for the main heading',
                    validation: Rule => Rule.required().max(3).min(1),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'text',
                                title: 'Line Text',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'style',
                                title: 'Text Style',
                                type: 'string',
                                options: {
                                    list: [
                                        { title: 'Normal', value: 'normal' },
                                        { title: 'Stroke (Outline)', value: 'stroke' },
                                        { title: 'Gradient', value: 'gradient' }
                                    ]
                                },
                                initialValue: 'normal',
                                validation: Rule => Rule.required()
                            })
                        ],
                        preview: {
                            select: {
                                text: 'text.en',
                                style: 'style'
                            },
                            prepare({ text, style }) {
                                return {
                                    title: text || 'Untitled Line',
                                    subtitle: `Style: ${style}`
                                }
                            }
                        }
                    }]
                }),
                defineField({
                    name: 'descriptionParagraphs',
                    title: 'Description Paragraphs',
                    type: 'array',
                    description: 'Maximum 5 paragraphs',
                    validation: Rule => Rule.required().max(5).min(1),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'text',
                                title: 'Paragraph Text',
                                type: 'localizedText',
                                validation: Rule => Rule.required()
                            })
                        ],
                        preview: {
                            select: {
                                text: 'text.en'
                            },
                            prepare({ text }) {
                                const preview = text ? text.substring(0, 60) + '...' : 'Empty paragraph'
                                return {
                                    title: preview
                                }
                            }
                        }
                    }]
                }),
                defineField({
                    name: 'ctaButtons',
                    title: 'CTA Buttons',
                    type: 'array',
                    description: 'Exactly 2 CTA buttons',
                    validation: Rule => Rule.required().length(2),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'text',
                                title: 'Button Text',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'url',
                                title: 'Button URL',
                                type: 'localizedUrl',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'variant',
                                title: 'Button Style',
                                type: 'string',
                                options: {
                                    list: [
                                        { title: 'Primary (Filled)', value: 'primary' },
                                        { title: 'Secondary (Outline)', value: 'secondary' }
                                    ]
                                },
                                initialValue: 'primary',
                                validation: Rule => Rule.required()
                            })
                        ],
                        preview: {
                            select: {
                                text: 'text.en',
                                variant: 'variant'
                            },
                            prepare({ text, variant }) {
                                return {
                                    title: text || 'Untitled Button',
                                    subtitle: variant === 'primary' ? 'Primary Button' : 'Secondary Button'
                                }
                            }
                        }
                    }]
                }),
                defineField({
                    name: 'featuredServices',
                    title: 'Featured Services',
                    type: 'array',
                    description: 'Select services to highlight in the hero section (Max 8)',
                    of: [{ type: 'reference', to: [{ type: 'service' }] }],
                    validation: Rule => Rule.max(8)
                }),
            ]
        }),



        // PORTFOLIO PREVIEW SECTION
        defineField({
            name: 'portfolioPreview',
            title: 'Portfolio Preview Section',
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
                    name: 'featuredProjects',
                    title: 'Featured Projects',
                    type: 'array',
                    description: 'Select projects to display in the portfolio section (Max 8)',
                    of: [{ type: 'reference', to: [{ type: 'project' }] }],
                    validation: Rule => Rule.max(8)
                }),
                defineField({
                    name: 'buttonText',
                    title: 'Button Text',
                    type: 'localizedString'
                }),
                defineField({
                    name: 'buttonUrl',
                    title: 'Button URL',
                    type: 'string',
                    description: 'Enter a relative path (e.g., /portfolio) or a full URL (e.g., https://example.com)'
                })
            ]
        }),

        // ABOUT PREVIEW SECTION
        defineField({
            name: 'aboutPreview',
            title: 'About Preview Section',
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
                    name: 'leftDescriptions',
                    title: 'Left Side Descriptions',
                    type: 'array',
                    description: 'Exactly 2 paragraphs for the left side',
                    validation: Rule => Rule.required().min(2).max(2),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'text',
                                title: 'Paragraph Text',
                                type: 'localizedText',
                                validation: Rule => Rule.required()
                            })
                        ]
                    }]
                }),
                defineField({
                    name: 'rightDescriptions',
                    title: 'Right Side Descriptions',
                    type: 'array',
                    description: 'Exactly 2 paragraphs for the right side',
                    validation: Rule => Rule.required().min(2).max(2),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'text',
                                title: 'Paragraph Text',
                                type: 'localizedText',
                                validation: Rule => Rule.required()
                            })
                        ]
                    }]
                }),
                defineField({
                    name: 'ctaText',
                    title: 'CTA Button Text',
                    type: 'localizedString',
                    validation: Rule => Rule.required()
                }),
                defineField({
                    name: 'ctaUrl',
                    title: 'CTA Button URL',
                    type: 'string',
                    description: 'Enter a relative path (e.g., /about) or a full URL (e.g., https://example.com)',
                    validation: Rule => Rule.required()
                })
            ]
        }),







        // SERVICE HIGHLIGHTS MARQUEE SECTION
        defineField({
            name: 'serviceHighlightsMarquee',
            title: 'Service Highlights Marquee',
            type: 'object',
            validation: Rule => Rule.required(),
            fields: [
                defineField({
                    name: 'highlights',
                    title: 'Highlighted Services',
                    type: 'array',
                    description: 'Services to display in the marquee',
                    validation: Rule => Rule.required().min(1),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'text',
                                title: 'Service Text',
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
                                    title: text || 'Untitled Service'
                                }
                            }
                        }
                    }]
                })
            ]
        }),

        // TRUSTED BY BRANDS SECTION
        defineField({
            name: 'trustedByBrands',
            title: 'Trusted By Brands Section',
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
                    name: 'brandLogos',
                    title: 'Brand Logos',
                    type: 'array',
                    description: 'Upload brand logos (bulk upload supported)',
                    validation: Rule => Rule.required().min(1),
                    of: [{
                        type: 'image',
                        options: {
                            hotspot: true
                        }
                    }]
                })
            ]
        }),


        // CASE STUDIES PREVIEW SECTION
        defineField({
            name: 'caseStudiesPreview',
            title: 'Case Studies Preview Section',
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
                    name: 'featuredCaseStudies',
                    title: 'Featured Case Studies',
                    type: 'array',
                    description: 'Select case studies to display in the case studies section (Max 8)',
                    of: [{ type: 'reference', to: [{ type: 'project' }] }],
                    validation: Rule => Rule.max(8)
                }),
                defineField({
                    name: 'buttonText',
                    title: 'Button Text',
                    type: 'localizedString'
                }),
                defineField({
                    name: 'buttonUrl',
                    title: 'Button URL',
                    type: 'string',
                    description: 'Enter a relative path (e.g., /portfolio) or a full URL (e.g., https://example.com)'
                })
            ]
        }),

        // AREAS WE SERVE SECTION
        defineField({
            name: 'areasWeServe',
            title: 'Areas We Serve Section',
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
                    name: 'areas',
                    title: 'Regions',
                    type: 'array',
                    validation: Rule => Rule.required().min(1),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'region',
                                title: 'Region Name',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'locations',
                                title: 'Locations/Cities',
                                type: 'array',
                                description: 'List of cities or locations in this region',
                                of: [{ type: 'localizedString' }],
                                validation: Rule => Rule.min(1)
                            }),
                            defineField({
                                name: 'featured',
                                title: 'Featured Region',
                                type: 'boolean',
                                description: 'Mark this region as featured',
                                initialValue: false
                            }),
                            defineField({
                                name: 'clients',
                                title: 'Number of Clients',
                                type: 'number',
                                description: 'Total clients served in this region',
                                validation: Rule => Rule.min(0)
                            }),
                            defineField({
                                name: 'flag',
                                title: 'Flag Emoji',
                                type: 'string',
                                description: 'Country/region flag emoji (e.g., 🇺🇸, 🇬🇧, 🇵🇰)',
                                validation: Rule => Rule.max(10)
                            })
                        ],
                        preview: {
                            select: {
                                region: 'region.en',
                                flag: 'flag',
                                featured: 'featured',
                                clients: 'clients'
                            },
                            prepare({ region, flag, featured, clients }) {
                                return {
                                    title: `${flag || '🌍'} ${region || 'Untitled Region'}`,
                                    subtitle: `${featured ? '⭐ Featured • ' : ''}${clients || 0} clients`
                                }
                            }
                        }
                    }]
                })
            ]
        }),


        // TESTIMONIALS SECTION
        defineField({
            name: 'testimonials',
            title: 'Testimonials Section',
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
                    name: 'testimonials',
                    title: 'Testimonials',
                    type: 'array',
                    validation: Rule => Rule.required().min(1),
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'quote',
                                title: 'Quote',
                                type: 'localizedText',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'author',
                                title: 'Author Name',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'role',
                                title: 'Author Role',
                                type: 'localizedString',
                                validation: Rule => Rule.required()
                            }),
                            defineField({
                                name: 'company',
                                title: 'Company',
                                type: 'localizedString'
                            }),
                            defineField({
                                name: 'avatar',
                                title: 'Avatar Image',
                                type: 'image'
                            })
                        ],
                        preview: {
                            select: {
                                author: 'author.en',
                                role: 'role.en',
                                media: 'avatar'
                            },
                            prepare({ author, role, media }) {
                                return {
                                    title: author || 'Untitled Testimonial',
                                    subtitle: role,
                                    media
                                }
                            }
                        }
                    }]
                })
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
                title: 'Landing Page Content',
                subtitle: 'Manage all landing page sections'
            }
        }
    }
});
