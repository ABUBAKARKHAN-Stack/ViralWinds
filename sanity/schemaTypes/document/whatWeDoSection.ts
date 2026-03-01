import { defineField, defineType } from "sanity";

export const whatWeDoSectionType = defineType({
    name: 'whatWeDoSection',
    type: 'document',
    title: 'What We Do Section',
    fields: [
        defineField({ name: 'title', type: 'localizedString' }),
        defineField({ name: 'description', type: 'localizedText' }),
        defineField({
            name: 'items',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({ name: 'icon', type: 'image' }),
                    defineField({ name: 'title', type: 'localizedString' }),
                    defineField({ name: 'description', type: 'localizedText' }),
                ]
            }]
        }),
    ],
});