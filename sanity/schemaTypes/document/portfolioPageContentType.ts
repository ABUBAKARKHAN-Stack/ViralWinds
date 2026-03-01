import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons";

export const portfolioPageContentType = defineType({
    name: 'portfolioPageContent',
    title: 'Portfolio Page Content',
    type: 'document',
    icon: CaseIcon,

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

        // PORTFOLIO LIST SECTION
        defineField({
            name: 'portfolioList',
            title: 'Portfolio List Section',
            type: 'object',
            validation: Rule => Rule.required(),
            fields: [
                defineField({
                    name: 'projects',
                    title: 'Selected Projects',
                    type: 'array',
                    description: 'Manually select and order projects for the portfolio page',
                    validation: Rule => Rule.required().min(1),
                    of: [{
                        type: 'reference',
                        to: [{ type: 'project' }]
                    }]
                }),
            ]
        }),
        // CTA SECTION
        defineField({
            name: 'cta',
            title: 'Call to Action Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'sectionHeading',
                    title: 'Section Heading',
                    type: 'sectionHeading',
                }),
                defineField({
                    name: 'formReference',
                    title: 'Select Form',
                    type: 'reference',
                    to: [{ type: 'form' }],
                    description: 'Select a custom form to display in this CTA section'
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
                title: 'Portfolio Page Content',
                subtitle: 'Manage all portfolio page sections'
            }
        }
    }
});
