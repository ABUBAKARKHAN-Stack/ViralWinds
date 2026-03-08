import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const contactPageContentType = defineType({
    name: "contactPageContent",
    title: "Contact Page Content",
    type: "document",
    icon: EnvelopeIcon,

    fields: [
        // HERO SECTION
        defineField({
            name: "hero",
            title: "Hero Section",
            type: "object",
            validation: (Rule) => Rule.required(),
            fields: [
                defineField({
                    name: "title",
                    title: "Title",
                    type: "localizedString",
                    description: 'e.g., "Let\'s talk"',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: "subtitle",
                    title: "Subtitle",
                    type: "localizedString",
                }),
                defineField({
                    name: "description",
                    title: "Description",
                    type: "localizedText",
                    validation: (Rule) => Rule.required(),
                }),
            ],
        }),

        // FAQS SECTION
        defineField({
            name: "faqs",
            title: "FAQs Section",
            type: "object",
            fields: [
                defineField({
                    name: "sectionHeading",
                    title: "Section Heading",
                    type: "sectionHeading",
                }),
                defineField({
                    name: "faqItems",
                    title: "FAQ Items",
                    type: "array",
                    of: [
                        {
                            type: "object",
                            fields: [
                                defineField({
                                    name: "question",
                                    title: "Question",
                                    type: "localizedString",
                                    validation: (Rule) => Rule.required(),
                                }),
                                defineField({
                                    name: "answer",
                                    title: "Answer",
                                    type: "localizedText",
                                    validation: (Rule) => Rule.required(),
                                }),
                            ],
                            preview: {
                                select: {
                                    question: "question",
                                },
                                prepare({ question }) {
                                    return {
                                        title: question || "Untitled Question",
                                    };
                                },
                            },
                        },
                    ],
                }),
            ],
        }),

        // SEO SECTION
        defineField({
            name: "seo",
            title: "SEO Settings",
            type: "seo",
            description: "Custom SEO settings for this page",
        }),
    ],

    preview: {
        prepare() {
            return {
                title: "Contact Page Content",
                subtitle: "Manage hero, form, and FAQs",
            };
        },
    },
});
