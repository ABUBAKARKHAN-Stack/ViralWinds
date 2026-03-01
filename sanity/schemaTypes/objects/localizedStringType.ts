import { defineType } from "sanity";

export const localizedString = defineType({
  name: 'localizedString',
  title: 'String',
  type: 'string',
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Text',
  type: 'text',
})

export const localizedArray = defineType({
  name: 'localizedArray',
  title: 'Array',
  type: 'array',
  of: [{ type: 'string' }],
})
