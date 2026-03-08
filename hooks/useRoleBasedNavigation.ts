import {
    FileText,
    Globe,
    Image,
    Layers,
    LayoutDashboard,
    Briefcase,
    FolderOpen,
    Wrench,
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

export const useRoleBasedNavigation = (): NavigationGroup[] => {
    // Single Admin Navigation
    return [
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
            ]
        },
    ];
};
