import { defineType, defineField } from "sanity";

export const sectionHeadingType = defineType({
    name: "sectionHeading",
    title: "Section Heading",
    type: "object",
    fields: [
        defineField({
            name: 'eyebrow',
            type: 'localizedString',
            validation: Rule => Rule.optional()
        }),
        defineField({
            name: 'title',
            type: 'localizedString',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'description',
            type: 'localizedText',
            validation: Rule => Rule.optional(),

        }),
    ]
})