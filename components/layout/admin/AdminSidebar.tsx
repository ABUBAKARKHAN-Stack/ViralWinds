"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRoleBasedNavigation } from "@/hooks/useRoleBasedNavigation";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";



export function AppSidebar() {
    const {
        session,
        loading,
        logout
    } = useSession();

    const pathname = usePathname()

    if (!session) return null;

    const user = session.user;
    const navigationGroups = useRoleBasedNavigation()
    const userInitial = user?.name?.charAt(0).toUpperCase() || "A";

    const handleLogout = async () => await logout()

    const logoutLoading = loading === "logout";

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border h-16 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
                        {userInitial}
                    </div>
                    <div>
                        <h2 className="font-semibold text-sidebar-foreground">Dashboard</h2>
                        <p className="text-xs text-muted-foreground">Manage your content</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {navigationGroups.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive = pathname === item.url;
                                    const hasSubItems = item.subItems && item.subItems.length > 0;

                                    if (hasSubItems) {
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <Accordion
                                                    type="single"
                                                    collapsible
                                                    defaultValue={item.isOpenByDefault ? item.title : undefined}
                                                    className="w-full"
                                                >
                                                    <AccordionItem value={item.title} className="border-none">
                                                        <AccordionTrigger asChild>
                                                            <SidebarMenuButton
                                                                isActive={isActive || item.subItems?.some(sub => pathname === sub.url)}
                                                                className="w-full justify-start gap-2 hover:[text-decoration:none] items-center group/item"
                                                            >
                                                                <item.icon className="h-4 w-4 shrink-0" />
                                                                <span className="flex-1 text-left">{item.title}</span>
                                                                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/item:rotate-90 ml-auto" />
                                                            </SidebarMenuButton>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-0 overflow-visible">
                                                            <SidebarMenuSub>
                                                                {item.subItems?.map((sub) => (
                                                                    <SidebarMenuSubItem key={sub.title}>
                                                                        <SidebarMenuSubButton
                                                                            asChild
                                                                            isActive={pathname === sub.url}
                                                                        >
                                                                            <Link href={sub.url}>
                                                                                <span>{sub.title}</span>
                                                                            </Link>
                                                                        </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                ))}
                                                            </SidebarMenuSub>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            </SidebarMenuItem>
                                        );
                                    }

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.title}
                                            >
                                                <Link href={item.url}>
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image ?? ""} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Button
                        variant={"destructive"}
                        className="size-8"
                        onClick={handleLogout}
                        disabled={logoutLoading}
                    >
                        {logoutLoading ? <Spinner /> : <LogOut />}
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
