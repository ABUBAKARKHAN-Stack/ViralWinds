import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const locationType = defineType({
    name: 'location',
    title: 'Location',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'City/Country Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title',
            },
        }),
    ],
})
