"use client"

import { ArrowRight, FileText, Layers, Search, Users, Briefcase, Settings } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';


const QuickActions = () => {
    const permissions = usePermissions();

    const quickActions = [
        { title: "Manage Portfolio", description: "Portfolio projects", icon: Layers, href: "/admin/portfolio", show: permissions.content.manage },
        { title: "Manage Services", description: "Service offerings", icon: Briefcase, href: "/admin/services", show: permissions.content.manage },
        { title: "Site Settings", description: "Global configuration", icon: Settings, href: "/admin/site-settings", show: permissions.seo.read },
        { title: "Manage Users", description: "Team members", icon: Users, href: "/admin/users", show: permissions.users.manage },
    ].filter(a => a.show);


    return (
        quickActions.length > 0 && (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Quick Actions</h2>
                    <Badge variant="secondary">{quickActions.length} available</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {quickActions.map((action) => (
                        <Card key={action.title} className="group  hover:border-accent  hover:shadow-md transition-all cursor-pointer">
                            <Link href={action.href}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <action.icon className="h-8 w-8 text-accent" />
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <CardTitle className="text-lg">{action.title}</CardTitle>
                                    <CardDescription>{action.description}</CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        )
    )
}

export default QuickActions
