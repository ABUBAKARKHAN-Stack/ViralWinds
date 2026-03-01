import { Action, Resource } from "@/constants/permissions";

export enum Roles {
    ADMIN = "admin",
    SEO_EXECUTIVE = "seo_executive",
    SEO_MANAGER = "seo_manager",
    CONTENT_WRITER = "content_writer",
    USER = "user"
}


export type Permissions = {
    [key in Resource]: {
        [action in Action]: boolean
    }
}

export type LoadingStates = "change_role" | "delete_user" | "add_user" | "logout" | "list_users" | "idle"

export type ErrorStates = "list_user" | "idle"
