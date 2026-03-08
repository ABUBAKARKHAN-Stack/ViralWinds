import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";

export const menuItemType = defineType({
    name: 'menuItem',
    title: 'Menu Item',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            type: 'localizedString',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'description',
            title: 'Description (Optional)',
            type: 'localizedString',
            initialValue: ""
        }),
        defineField({
            name: 'type',
            title: 'Link Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Reference (Service/Page)', value: 'reference' },
                    { title: 'Custom URL', value: 'custom' },
                ],
                layout: 'radio'
            },
            initialValue: 'reference',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'reference',
            title: 'Reference',
            type: 'reference',
            to: [
                { type: 'service' },
                { type: 'page' },
                { type: 'landingPageContent' },
                { type: 'aboutPageContent' },
                { type: 'servicesPageContent' },
                { type: 'portfolioPageContent' },
                { type: 'contactPageContent' }
            ],
            hidden: ({ parent }) => parent?.type !== 'reference'
        }),
        defineField({
            name: 'url',
            title: 'Custom URL',
            type: 'localizedString',
            description: 'Enter a full URL or a relative path (e.g. /about)',
            hidden: ({ parent }) => parent?.type !== 'custom'
        }),
        defineField({
            name: 'children',
            title: 'Sub-menu Items',
            type: 'array',
            of: [{ type: 'menuItem' }]
        })
    ],
    preview: {
        select: {
            label: 'label',
            type: 'type',
            refType: 'reference._type',
            serviceTitle: 'reference.title',
            pageTitle: 'reference.title',
            landingTitle: 'reference.title', // Fallback for various types
        },
        prepare({ label, type, refType, serviceTitle, pageTitle }) {
            let refInfo = 'Custom URL';

            if (type === 'reference') {
                const titles: Record<string, string> = {
                    'landingPageContent': 'Home',
                    'aboutPageContent': 'About',
                    'servicesPageContent': 'Services',
                    'portfolioPageContent': 'Portfolio',
                    'contactPageContent': 'Contact'
                };

                const typeLabel = titles[refType] || refType || 'Unknown';
                refInfo = `Link to: ${serviceTitle || pageTitle || typeLabel}`;
            }

            // Extract string from label if it's a localized object
            const displayLabel = typeof label === 'object'
                ? label.en || label.ar || label.ur || label.es || 'Untitled'
                : label;

            return {
                title: displayLabel || "Untitled Menu Item",
                subtitle: refInfo,
                icon: LinkIcon
            };
        }
    }
});
