import { defineField, defineType } from 'sanity';

export const contactSubmissionType = defineType({
    name: 'contactSubmission',
    title: 'Contact Submissions',
    type: 'document',
    icon: () => '📧',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: Rule => Rule.required().email()
        }),
        defineField({
            name: 'subject',
            title: 'Subject',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'message',
            title: 'Message',
            type: 'text',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'New', value: 'new' },
                    { title: 'Read', value: 'read' },
                    { title: 'Replied', value: 'replied' },
                    { title: 'Archived', value: 'archived' }
                ],
                layout: 'radio'
            },
            initialValue: 'new',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
            validation: Rule => Rule.required()
        })
    ],
    preview: {
        select: {
            name: 'name',
            email: 'email',
            subject: 'subject',
            status: 'status',
            submittedAt: 'submittedAt'
        },
        prepare({ name, email, subject, status, submittedAt }) {
            const date = submittedAt ? new Date(submittedAt).toLocaleDateString() : 'Unknown date';
            const statusEmoji = status === 'new' ? '🆕' : status === 'read' ? '👁️' : status === 'replied' ? '✅' : '📦';

            return {
                title: `${statusEmoji} ${name} - ${subject}`,
                subtitle: `${email} • ${date}`
            }
        }
    },
    orderings: [
        {
            title: 'Newest First',
            name: 'newestFirst',
            by: [{ field: 'submittedAt', direction: 'desc' }]
        },
        {
            title: 'Oldest First',
            name: 'oldestFirst',
            by: [{ field: 'submittedAt', direction: 'asc' }]
        },
        {
            title: 'Status',
            name: 'status',
            by: [{ field: 'status', direction: 'asc' }, { field: 'submittedAt', direction: 'desc' }]
        }
    ]
});
