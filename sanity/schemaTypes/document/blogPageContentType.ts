import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const blogPageContentType = defineType({
    name: 'blogPageContent',
    title: 'Blog Page Content',
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

        // BLOG LIST SECTION
        defineField({
            name: 'blogList',
            title: 'Blog List Section',
            type: 'object',
            validation: Rule => Rule.required(),
            fields: [
                defineField({
                    name: 'posts',
                    title: 'Selected Blogs',
                    type: 'array',
                    description: 'Manually select and order blogs for the blog page',
                    validation: Rule => Rule.required().min(1),
                    of: [{
                        type: 'reference',
                        to: [{ type: 'post' }]
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
                title: 'Blog Page Content',
                subtitle: 'Manage all blog page sections'
            }
        }
    }
});
