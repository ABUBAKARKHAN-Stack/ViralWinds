import { z } from "zod";

// Define the base schema first for recursion
const baseMenuItemSchema = z.object({
    _key: z.string().optional(),
    label: z.string().min(1, "Label is required"),
    description: z.string().optional().nullable(),
    type: z.enum(['reference', 'custom', 'header']),
    reference: z.object({
        _type: z.string().optional().default('reference'),
        _ref: z.string().optional().nullable(),
    }).optional().nullable(),
    url: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
    if (data.type === 'custom' && (!data.url || data.url.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "URL is required for custom links",
            path: ['url'],
        });
    }
    if (data.type === 'reference' && !data.reference?._ref) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a reference",
            path: ['reference', '_ref'],
        });
    }
});

// Define the recursive type
export type MenuItemValue = z.infer<typeof baseMenuItemSchema> & {
    children?: MenuItemValue[];
};

// Create the recursive schema
export const menuItemSchema: z.ZodType<MenuItemValue> = baseMenuItemSchema.extend({
    children: z.lazy(() => z.array(menuItemSchema).optional().default([])),
});

export const menuSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.object({
        current: z.string().min(1, "Slug is required"),
    }),
    location: z.enum(['header', 'footer']).default('header'),
    items: z.array(menuItemSchema).min(1, "At least one item is required"),
});

export type MenuValues = z.infer<typeof menuSchema>;
