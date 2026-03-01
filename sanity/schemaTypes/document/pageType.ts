import { defineField, defineType } from "sanity";

export const pageType = defineType({
    name: 'page',
    type: 'document',
    title: 'Page',
    fields: [
        defineField({ name: 'title', type: 'localizedString' }),
        defineField({
            name: 'sections',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [
                        { type: 'heroSection' },
                        { type: 'whatWeDoSection' },
                    ]
                }
            ]
        }),
        defineField({ name: 'seo', type: 'seo' }),
    ],
    preview: {
        select: {
            title: 'title.en',
            sections: 'sections',
        },
        prepare({ title, sections }) {
            return {
                title: title || 'Untitled Page',
                subtitle: `${sections?.length || 0} section(s)`,
            };
        },
    }
});