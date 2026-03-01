"use client"
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useSession } from "@/context/SessionContext";
import { Roles } from "@/types/auth.types";
import { usePermissions } from "@/hooks/usePermissions";
import { roleLabels } from "@/constants/admin.constants";


interface PermissionItemProps {
    label: string;
    enabled: boolean;
    index: number;
}

export function PermissionItem({ label, enabled, index }: PermissionItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
            className="flex items-center gap-3 py-1.5"
        >
            <div
                className={cn(
                    "flex items-center justify-center h-5 w-5 rounded-full transition-all duration-300",
                    enabled
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground/50"
                )}
            >
                {enabled ? (
                    <Check className="h-3 w-3" />
                ) : (
                    <X className="h-3 w-3" />
                )}
            </div>
            <span className={cn(
                "text-sm transition-colors duration-300",
                enabled ? "text-foreground" : "text-muted-foreground"
            )}>
                {label}
            </span>
        </motion.div>
    );
}

export function PermissionsCard() {
    const permissions = usePermissions()
    const { session } = useSession()
    const roleLabel = roleLabels[session.user.role as Roles]

    const permissionGroups = [
        { title: "Users", perms: permissions.users },
        { title: "SEO", perms: permissions.seo },
        { title: "Content", perms: permissions.content },
    ];

    let itemIndex = 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Card>
                <CardHeader className="border-b border-border/50">
                    <CardTitle>Your Permissions</CardTitle>
                    <CardDescription>
                        Based on your role: <span className="text-primary font-medium">{roleLabel}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid gap-8 sm:grid-cols-3">
                        {permissionGroups.map((group) => (
                            <div key={group.title} className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                    {group.title}
                                </h4>
                                <div className="space-y-1">
                                    <PermissionItem label="Manage" enabled={group.perms.manage} index={itemIndex++} />
                                    <PermissionItem label="Read" enabled={group.perms.read} index={itemIndex++} />
                                    <PermissionItem label="Write" enabled={group.perms.write} index={itemIndex++} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
