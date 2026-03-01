import { defineField, defineType } from "sanity";
import { MenuIcon } from "@sanity/icons";

export const menuType = defineType({
    name: 'menu',
    title: 'Menu',
    type: 'document',
    icon: MenuIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Internal title for this menu (e.g. Navigation)',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title' },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'location',
            title: 'Menu Location',
            type: 'string',
            options: {
                list: [
                    { title: 'Header (Navbar)', value: 'header' },
                    { title: 'Footer', value: 'footer' }
                ],
                layout: 'radio'
            },
            initialValue: 'header',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'items',
            title: 'Menu Items',
            type: 'array',
            of: [{ type: 'menuItem' }],
            validation: Rule => Rule.required().min(1)
        })
    ],
    preview: {
        select: {
            title: 'title',
            items: 'items'
        },
        prepare({ title, items }) {
            return {
                title: title || 'Untitled Menu',
                subtitle: `${items?.length || 0} top-level item(s)`
            };
        }
    }
});
