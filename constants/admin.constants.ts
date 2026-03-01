import { Permissions, Roles } from "@/types/auth.types";

export const rolePermissions: Record<Roles, Permissions> = {
    admin: {
        users: { manage: true, read: true, write: true },
        seo: { manage: true, read: true, write: true },
        content: { manage: true, read: true, write: true },
    },
    seo_manager: {
        users: { manage: false, read: true, write: false },
        seo: { manage: true, read: true, write: true },
        content: { manage: false, read: true, write: false },
    },
    seo_executive: {
        users: { manage: false, read: false, write: false },
        seo: { manage: false, read: true, write: true },
        content: { manage: false, read: true, write: false },
    },
    content_writer: {
        users: { manage: false, read: false, write: false },
        seo: { manage: false, read: true, write: false },
        content: { manage: false, read: true, write: true },
    },
    user: {
        users: { manage: false, read: false, write: false },
        seo: { manage: false, read: false, write: false },
        content: { manage: false, read: true, write: false },
    },
};


export const roleLabels: Record<Roles, string> = {
    admin: "Admin",
    seo_manager: "SEO Manager",
    seo_executive: "SEO Executive",
    content_writer: "Content Writer",
    user: "Viewer",
};

export const roleDescriptions: Record<Roles, string> = {
    admin: "Full control over all features",
    seo_manager: "All SEO fields access",
    seo_executive: "Meta Title & Description only",
    content_writer: "Content editing, draft only",
    user: "View-only access",
};

export const AdminUserKeys = {
    all: ['admin-users'],
    single: (id: string) => ['admin-users', id],
};