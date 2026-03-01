"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Calendar, Shield, Edit, Globe, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { UserWithRole } from "better-auth/plugins";
import { usePermissions } from "@/hooks/usePermissions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { roleLabels, rolePermissions, roleDescriptions } from "@/constants/admin.constants";
import { Roles } from "@/types/auth.types";
import { EditUserModal } from "./EditUserModal";
import { PermissionItem } from "../dashboard/PermissionsCard";
import { UserStatusBadge } from "../../ui/user-status-badge";
import { Separator } from "@/components/ui/separator";

const roleColors: Record<string, string> = {
    admin: "bg-destructive/10 text-destructive border-destructive/20",
    seo_manager: "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-300",
    seo_executive: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300",
    content_writer: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-300",
    user: "bg-gray-500/10 text-gray-700 border-gray-500/20 dark:text-gray-300",
};

interface UserDetailsProps {
    user: UserWithRole;
}

const UserDetails = ({ user }: UserDetailsProps) => {
    const permissions = usePermissions();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();

    const permissionsByRole = rolePermissions[user.role as Roles];
    const isUserBanned = user.banned || false;

    const permissionGroups = [
        { title: "Users", perms: permissionsByRole.users },
        { title: "SEO", perms: permissionsByRole.seo },
        { title: "Content", perms: permissionsByRole.content },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.push("/users")}
                    className="w-fit"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Button>
                {permissions.users.write && (
                    <div className="flex items-center gap-3">
                        <UserStatusBadge isBanned={isUserBanned} />
                        <Button
                            onClick={() => setIsEditModalOpen(true)}
                            size="sm"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Header Card */}
            <Card className="overflow-hidden">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="relative">
                            <Avatar className="size-24">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
                                    {user.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            {isUserBanned && (
                                <div className="absolute inset-0 b flex items-center justify-center bg-destructive/75 backdrop-blur rounded-full">
                                    <XCircle className="h-8 w-8 text-destructive-foreground" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                        {user.name}
                                    </h1>
                                    <Badge
                                        className={`${roleColors[user.role as Roles]} border px-3 py-1`}
                                    >
                                        {roleLabels[user.role as Roles]}
                                    </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
                                    {roleDescriptions[user.role as Roles]}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="p-2 bg-background rounded-md">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="p-2 bg-background rounded-md">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Created</p>
                                        <p className="font-medium">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="p-2 bg-background rounded-md">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Status</p>
                                        <p className={`font-medium ${isUserBanned ? 'text-destructive' : 'text-green-600'}`}>
                                            {isUserBanned ? 'Banned' : 'Active'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permissions Section */}
            <Card>
                <CardHeader className="border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Role Permissions</CardTitle>
                            <CardDescription>
                                Based on user role: {roleLabels[user.role as Roles]}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="grid gap-8 sm:grid-cols-3">

                        {permissionGroups.map((group, itemIndex) => (
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

                    {isUserBanned && (
                        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                                <div>
                                    <p className="font-medium text-destructive">User is Banned</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        This user account has been banned and cannot access the system.
                                        Edit the user to unban them.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit User Modal */}
            <EditUserModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                user={user}
                userBanned={isUserBanned}

            />
        </div>
    );
};

export default UserDetails;
