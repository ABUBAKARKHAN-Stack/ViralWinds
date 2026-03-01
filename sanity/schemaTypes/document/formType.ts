import { defineField, defineType } from 'sanity';

export const formType = defineType({
    name: 'form',
    title: 'Forms',
    type: 'document',
    icon: () => '📝',
    fields: [
        defineField({
            name: 'name',
            title: 'Form Name',
            type: 'string',
            description: 'Internal name for this form',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Internal description of what this form is for'
        }),
        defineField({
            name: 'fields',
            title: 'Form Fields',
            type: 'array',
            validation: Rule => Rule.required().min(1),
            of: [{
                type: 'object',
                fields: [
                    defineField({
                        name: 'fieldType',
                        title: 'Field Type',
                        type: 'string',
                        options: {
                            list: [
                                { title: 'Text', value: 'text' },
                                { title: 'Email', value: 'email' },
                                { title: 'Phone', value: 'tel' },
                                { title: 'Number', value: 'number' },
                                { title: 'Textarea', value: 'textarea' },
                                { title: 'Select', value: 'select' },
                                { title: 'Checkbox', value: 'checkbox' },
                                { title: 'Radio', value: 'radio' }
                            ]
                        },
                        validation: Rule => Rule.required()
                    }),
                    defineField({
                        name: 'fieldName',
                        title: 'Field Name/ID',
                        type: 'string',
                        description: 'Unique identifier for this field (e.g., "email", "phone")',
                        validation: Rule => Rule.required().regex(/^[a-z][a-zA-Z0-9]*$/, {
                            name: 'camelCase',
                            invert: false
                        }).error('Must be camelCase (e.g., firstName, emailAddress)')
                    }),
                    defineField({
                        name: 'label',
                        title: 'Label',
                        type: 'string',
                        validation: Rule => Rule.required()
                    }),
                    defineField({
                        name: 'placeholder',
                        title: 'Placeholder',
                        type: 'string'
                    }),
                    defineField({
                        name: 'required',
                        title: 'Required',
                        type: 'boolean',
                        initialValue: false
                    }),
                    defineField({
                        name: 'validation',
                        title: 'Validation Rules',
                        type: 'object',
                        fields: [
                            defineField({
                                name: 'minLength',
                                title: 'Minimum Length',
                                type: 'number'
                            }),
                            defineField({
                                name: 'maxLength',
                                title: 'Maximum Length',
                                type: 'number'
                            }),
                            defineField({
                                name: 'pattern',
                                title: 'Pattern (Regex)',
                                type: 'string',
                                description: 'Regular expression for validation'
                            }),
                            defineField({
                                name: 'errorMessage',
                                title: 'Error Message',
                                type: 'string',
                                description: 'Custom error message when validation fails'
                            })
                        ]
                    }),
                    defineField({
                        name: 'options',
                        title: 'Options (for Select/Radio)',
                        type: 'array',
                        description: 'Only used for select and radio field types',
                        of: [{
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'label',
                                    title: 'Option Label',
                                    type: 'string',
                                    validation: Rule => Rule.required()
                                }),
                                defineField({
                                    name: 'value',
                                    title: 'Option Value',
                                    type: 'string',
                                    validation: Rule => Rule.required()
                                })
                            ],
                            preview: {
                                select: {
                                    label: 'label',
                                    value: 'value'
                                },
                                prepare({ label, value }) {
                                    return {
                                        title: label || 'Untitled Option',
                                        subtitle: value
                                    }
                                }
                            }
                        }]
                    })
                ],
                preview: {
                    select: {
                        label: 'label',
                        fieldType: 'fieldType',
                        required: 'required'
                    },
                    prepare({ label, fieldType, required }) {
                        return {
                            title: label || 'Untitled Field',
                            subtitle: `${fieldType}${required ? ' (Required)' : ''}`
                        }
                    }
                }
            }]
        }),
        defineField({
            name: 'submitButtonText',
            title: 'Submit Button Text',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'successMessage',
            title: 'Success Message',
            type: 'text',
            description: 'Message shown after successful submission',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'redirectUrl',
            title: 'Redirect URL (Optional)',
            type: 'string',
            description: 'Enter a relative path (e.g., /thanks) or a full URL (e.g., https://example.com) to redirect after submission'
        })
    ],
    preview: {
        select: {
            name: 'name',
            fieldsCount: 'fields'
        },
        prepare({ name, fieldsCount }) {
            const count = Array.isArray(fieldsCount) ? fieldsCount.length : 0;
            return {
                title: name || 'Untitled Form',
                subtitle: `${count} field${count !== 1 ? 's' : ''}`
            }
        }
    }
});
