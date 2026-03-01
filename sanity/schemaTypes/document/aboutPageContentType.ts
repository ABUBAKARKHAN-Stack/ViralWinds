import { InfoOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const aboutPageContentType = defineType({
    name: 'aboutPageContent',
    title: 'About Page Content',
    type: 'document',
    icon: InfoOutlineIcon,
    fields: [
        // HERO SECTION
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Title', type: 'localizedString' }),
                defineField({ name: 'subtitle', title: 'Subtitle', type: 'localizedString' }),
                defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
            ]
        }),
        // INTRO SECTION
        defineField({
            name: 'intro',
            title: 'Intro Section',
            type: 'object',
            fields: [
                defineField({ name: 'badge', title: 'Badge', type: 'localizedString' }),
                defineField({ name: 'heading', title: 'Heading', type: 'localizedString' }),
                defineField({ name: 'description1', title: 'Description 1', type: 'localizedText' }),
                defineField({ name: 'description2', title: 'Description 2', type: 'localizedText' }),
                defineField({ name: 'quote', title: 'Quote', type: 'localizedString' }),
                defineField({
                    name: 'mainImage',
                    title: 'Main Image',
                    type: 'image',
                    options: { hotspot: true }
                }),
            ]
        }),
        // MISSION & VISION SECTION
        defineField({
            name: 'missionVision',
            title: 'Mission & Vision Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading'
                }),
                // Mission
                defineField({
                    name: 'mission',
                    title: 'Mission',
                    type: 'object',
                    fields: [
                        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'localizedString' }),
                        defineField({ name: 'title', title: 'Title', type: 'localizedString' }),
                        defineField({ name: 'description1', title: 'Main Description', type: 'localizedText' }),
                        defineField({ name: 'description2', title: 'Secondary Description', type: 'localizedText' }),
                        defineField({
                            name: 'keyPoints',
                            title: 'Key Points',
                            type: 'array',
                            of: [{ type: 'localizedString' }]
                        }),
                    ]
                }),
                // Vision
                defineField({
                    name: 'vision',
                    title: 'Vision',
                    type: 'object',
                    fields: [
                        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'localizedString' }),
                        defineField({ name: 'title', title: 'Title', type: 'localizedString' }),
                        defineField({ name: 'description1', title: 'Main Description', type: 'localizedText' }),
                        defineField({ name: 'description2', title: 'Secondary Description', type: 'localizedText' }),
                        defineField({
                            name: 'keyPoints',
                            title: 'Key Points',
                            type: 'array',
                            of: [{ type: 'localizedString' }]
                        }),
                    ]
                }),
            ]
        }),
        // PHILOSOPHY SECTION
        defineField({
            name: 'philosophy',
            title: 'Philosophy Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading'
                }),
                defineField({
                    name: 'quoteBlock',
                    title: 'Quote Block',
                    type: 'localizedText'
                }),
                defineField({
                    name: 'description1',
                    title: 'Description Paragraph 1',
                    type: 'localizedText'
                }),
                defineField({
                    name: 'description2',
                    title: 'Description Paragraph 2',
                    type: 'localizedText'
                }),
                defineField({
                    name: 'steps',
                    title: 'Process Steps',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'label', title: 'Label', type: 'localizedString' }),
                                defineField({ name: 'iconName', title: 'Icon Name', type: 'string' }),
                            ]
                        }
                    ]
                }),
            ]
        }),
        // GLOBAL REACH SECTION
        defineField({
            name: 'globalReach',
            title: 'Global Reach Section',
            type: 'object',
            fields: [
                defineField({ name: 'badge', title: 'Badge', type: 'localizedString' }),
                defineField({ name: 'heading', title: 'Heading', type: 'localizedString' }),
                defineField({ name: 'description1', title: 'Description 1', type: 'localizedText' }),
                defineField({ name: 'description2', title: 'Description 2', type: 'localizedText' }),
                defineField({
                    name: 'regions',
                    title: 'Regions',
                    type: 'array',
                    of: [{ type: 'localizedString' }]
                }),
                defineField({
                    name: 'stats',
                    title: 'Stats',
                    type: 'array',
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({ name: 'value', title: 'Value', type: 'string' }),
                            defineField({ name: 'label', title: 'Label', type: 'localizedString' }),
                        ]
                    }]
                }),
            ]
        }),
        // CULTURE SECTION
        defineField({
            name: 'culture',
            title: 'Culture Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading'
                }),
                defineField({
                    name: 'values',
                    title: 'Cultural Values',
                    type: 'array',
                    of: [{
                        type: 'object',
                        fields: [
                            defineField({ name: 'title', title: 'Title', type: 'localizedString' }),
                            defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
                            defineField({ name: 'iconName', title: 'Icon Name', type: 'string' }),
                        ]
                    }]
                }),
                defineField({ name: 'quote', title: 'Culture Quote', type: 'localizedString' }),
                defineField({ name: 'quoteHighlight', title: 'Quote Highlight', type: 'localizedString' }),
            ]
        }),
        // SEO SECTION
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
            description: 'Custom SEO settings for this page'
        }),
    ]
})
