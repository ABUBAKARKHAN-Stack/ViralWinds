import { defineType } from "sanity";

export const localizedUrl = defineType({
    name: 'localizedUrl',
    title: 'URL',
    type: 'string',
    description: 'Enter a relative path (e.g., /contact) or a full URL (e.g., https://google.com)'
})
