export const Resources = {
    SEO: "seo",
    CONTENT: "content",
    USERS: "users",
} as const

export type Resource = typeof Resources[keyof typeof Resources]

export const Actions = {
    READ: "read",
    WRITE: "write",
    MANAGE: "manage"
} as const


export type Action = typeof Actions[keyof typeof Actions]