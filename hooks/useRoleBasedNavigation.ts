import { Roles } from "@/types/auth.types";
import {
    FileText,
    Globe,
    Image,
    Layers,
    LayoutDashboard,
    Search,
    User,
    Users,
    Briefcase,
    FolderOpen,
    Wrench,
    Inbox,
    Menu as MenuIcon,
} from "lucide-react";

export interface NavigationItem {
    title: string;
    url: string;
    icon: any;
    subItems?: {
        title: string;
        url: string;
    }[];
    isOpenByDefault?: boolean;
}

export interface NavigationGroup {
    label: string;
    items: NavigationItem[];
}

export const useRoleBasedNavigation = (role: Roles): NavigationGroup[] => {
    const baseNavigationItems: NavigationGroup[] = [
        {
            label: "Navigation",
            items: [
                { title: "Website", url: "/", icon: Globe },
                { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
            ]
        },
        {
            label: "Content Management",
            items: [
                {
                    title: "Pages",
                    url: "/admin/pages",
                    icon: FileText,
                    isOpenByDefault: true,
                    subItems: [
                        { title: "Landing Page Content", url: "/admin/landing/page-content" },
                        { title: "About Page Content", url: "/admin/about/page-content" },
                        { title: "Services Page Content", url: "/admin/services/page-content" },
                        { title: "Portfolio Page Content", url: "/admin/portfolio/page-content" },
                        { title: "Contact Page Content", url: "/admin/contact/page-content" },
                    ]
                }
            ]
        }
    ];

    const adminNavigation: NavigationGroup[] = [
        {
            label: "Navigation",
            items: [
                { title: "Website", url: "/", icon: Globe },
                { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
            ]
        },
        {
            label: "Content Management",
            items: [
                {
                    title: "Pages",
                    url: "/admin/pages",
                    icon: FileText,
                    isOpenByDefault: true,
                    subItems: [
                        { title: "Landing Page Content", url: "/admin/landing/page-content" },
                        { title: "About Page Content", url: "/admin/about/page-content" },
                        { title: "Services Page Content", url: "/admin/services/page-content" },
                        { title: "Portfolio Page Content", url: "/admin/portfolio/page-content" },
                        { title: "Contact Page Content", url: "/admin/contact/page-content" },
                    ]
                },
                { title: "Services", url: "/admin/services", icon: Briefcase },
                { title: "Portfolio", url: "/admin/portfolio", icon: Image },
                { title: "Global Sections", url: "/admin/global-sections", icon: Layers },
                { title: "Menus", url: "/admin/menus", icon: MenuIcon },
            ]
        },
        {
            label: "Media Management",
            items: [
                { title: "Media", url: "/admin/media", icon: FolderOpen },
            ]
        },
        {
            label: "Settings",
            items: [
                { title: "Services Settings", url: "/admin/services/settings", icon: Wrench },
                { title: "Site Settings", url: "/admin/site-settings", icon: Wrench },
                { title: "Users", url: "/admin/users", icon: Users },
                { title: "Profile", url: "/admin/profile", icon: User },
            ]
        },
    ];

    const contentWriterNavigation: NavigationGroup[] = [
        {
            label: "Navigation",
            items: [
                { title: "Website", url: "/", icon: Globe },
                { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
            ]
        },
        {
            label: "Content Management",
            items: [
                {
                    title: "Pages",
                    url: "/admin/pages",
                    icon: FileText,
                    isOpenByDefault: true,
                    subItems: [
                        { title: "Landing Page Content", url: "/admin/landing/page-content" },
                        { title: "About Page Content", url: "/admin/about/page-content" },
                        { title: "Services Page Content", url: "/admin/services/page-content" },
                        { title: "Portfolio Page Content", url: "/admin/portfolio/page-content" },
                        { title: "Contact Page Content", url: "/admin/contact/page-content" },
                    ]
                },
                { title: "Services", url: "/admin/services", icon: Briefcase },
                { title: "Portfolio", url: "/admin/portfolio", icon: Image },
                { title: "Global Sections", url: "/admin/global-sections", icon: Layers },
                { title: "Media", url: "/admin/media", icon: FolderOpen },
            ]
        },
        {
            label: "Account",
            items: [
                { title: "Profile", url: "/admin/profile", icon: User },
            ]
        },
    ];

    const seoNavigation: NavigationGroup[] = [
        {
            label: "Navigation",
            items: [
                { title: "Website", url: "/", icon: Globe },
                { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
            ]
        },
        {
            label: "Content Management",
            items: [
                {
                    title: "Pages",
                    url: "/admin/pages",
                    icon: FileText,
                    isOpenByDefault: true,
                    subItems: [
                        { title: "Landing Page Content", url: "/admin/landing/page-content" },
                        { title: "About Page Content", url: "/admin/about/page-content" },
                        { title: "Services Page Content", url: "/admin/services/page-content" },
                        { title: "Portfolio Page Content", url: "/admin/portfolio/page-content" },
                        { title: "Contact Page Content", url: "/admin/contact/page-content" },
                    ]
                }
            ]
        },
        {
            label: "SEO",
            items: [
                { title: "SEO", url: "/admin/seo", icon: Search },
            ]
        },
        {
            label: "Account",
            items: [
                { title: "Profile", url: "/admin/profile", icon: User },
            ]
        },
    ];

    const userNavigation: NavigationGroup[] = [
        {
            label: "Navigation",
            items: [
                { title: "Website", url: "/", icon: Globe },
                { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
            ]
        },
        {
            label: "Content",
            items: [
                {
                    title: "Pages",
                    url: "/admin/pages",
                    icon: FileText,
                    isOpenByDefault: true,
                    subItems: [
                        { title: "Landing Page Content", url: "/admin/landing/page-content" },
                        { title: "About Page Content", url: "/admin/about/page-content" },
                        { title: "Services Page Content", url: "/admin/services/page-content" },
                        { title: "Portfolio Page Content", url: "/admin/portfolio/page-content" },
                        { title: "Contact Page Content", url: "/admin/contact/page-content" },
                    ]
                },
                { title: "Services", url: "/admin/services", icon: Briefcase },
                { title: "Portfolio", url: "/admin/portfolio", icon: Image },
            ]
        },
    ];


    switch (role) {
        case Roles.ADMIN:
            return adminNavigation;

        case Roles.CONTENT_WRITER:
            return contentWriterNavigation;

        case Roles.SEO_MANAGER:
        case Roles.SEO_EXECUTIVE:
            return seoNavigation;

        case Roles.USER:
            return userNavigation;

        default:
            return baseNavigationItems;
    }
};
