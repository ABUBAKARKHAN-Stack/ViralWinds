"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, CheckCircle, XCircle, Ban } from "lucide-react";
import { Roles } from "@/types/auth.types";
import UsersTableSkeleton from "./UsersTableSkeleton";
import UsersError from "./UsersError";
import { roleLabels } from "@/constants/admin.constants";
import { useAdminUsers, useBanUser, useDeleteUser, useUnbanUser } from "@/hooks/useAdminUser";
import { Skeleton } from "@/components/ui/skeleton";
import ChangeUserRoleModal from "./ChangeRoleDialog";
import { useSession } from "@/context/SessionContext";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { errorToast, successToast } from "@/lib/toastNotifications";
import { UserStatusBadge } from "../../ui/user-status-badge";
import { EditUserModal } from "./EditUserModal";




const UsersTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: users, isLoading, isError } = useAdminUsers();
    const deleteUser = useDeleteUser();
    const banUser = useBanUser();
    const unbanUser = useUnbanUser();
    const { session } = useSession();

    const filteredUsers = (users ?? []).filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const showEmptyState = !isLoading && filteredUsers.length === 0;

    const handleUserDelete = (userId: string, userName: string) => {
        const confirmed = confirm(
            `Are you sure you want to remove ${userName}? This action cannot be undone.`
        );
        if (!confirmed) return;
        deleteUser.mutate(userId);
    };

    const handleBanToggle = async (userId: string, currentStatus: boolean, userName: string) => {
        if (session?.user.id === userId) {
            toast.error("You cannot ban/unban yourself");
            return;
        }

        try {
            if (currentStatus) {
                //* User is currently banned, so unban them
                await unbanUser.mutateAsync(userId);
                successToast(`${userName} has been unbanned`);
            } else {
                //* User is currently active, so ban them
                const confirmed = confirm(
                    `Are you sure you want to ban ${userName}? They will not be able to log in.`
                );
                if (!confirmed) return;

                await banUser.mutateAsync(userId);
                successToast(`${userName} has been banned`);
            }
        } catch (error) {
            errorToast(`Failed to ${currentStatus ? 'unban' : 'ban'} user`);
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                            {isLoading ? (
                                <Skeleton className="w-20 h-3" />
                            ) : (
                                <>
                                    {users?.length} users in total
                                    {users && (
                                        <span className="ml-2 text-muted-foreground">
                                            ({users.filter(u => u.banned).length} banned)
                                        </span>
                                    )}
                                </>
                            )}
                        </CardDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search users by name or email"
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isError ? (
                            <UsersError />
                        ) : isLoading ? (
                            <UsersTableSkeleton />
                        ) : showEmptyState ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Search className="h-8 w-8" />
                                        <p className="font-medium">No users found</p>
                                        <p className="text-sm">Try a different name or email.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => {
                                const isCurrentUser = session?.user.id === user.id;
                                const isUserBanned = user.banned || false;
                                const isBanning = banUser.isPending && banUser.variables === user.id;
                                const isUnbanning = unbanUser.isPending && unbanUser.variables === user.id;
                                const isToggleLoading = isBanning || isUnbanning;

                                return (
                                    <TableRow key={user.id} className={isUserBanned ? "bg-muted/50" : ""}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className={isUserBanned ? "opacity-50" : ""}>
                                                        {user.name.split(" ").map((n) => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={isUserBanned ? "opacity-70" : ""}>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={isUserBanned ? "opacity-70" : ""}
                                            >
                                                {roleLabels[user.role as Roles]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <UserStatusBadge isBanned={isUserBanned} />
                                        </TableCell>
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center">
                                                            <Switch
                                                                checked={!isUserBanned}
                                                                disabled={isCurrentUser || isToggleLoading}
                                                                onCheckedChange={() =>
                                                                    handleBanToggle(user.id, isUserBanned, user.name)
                                                                }
                                                                className={isToggleLoading ? "opacity-50 cursor-not-allowed" : ""}
                                                            />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {isCurrentUser ? (
                                                            "You cannot change your own status"
                                                        ) : isUserBanned ? (
                                                            "Click to unban user"
                                                        ) : (
                                                            "Click to ban user"
                                                        )}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={isToggleLoading}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Link href={`/users/${user.id}`} className="w-full">
                                                            View Profile
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    {/* Only show Change Role if it's NOT the logged-in user */}
                                                    {!isCurrentUser && (
                                                        <ChangeUserRoleModal
                                                            currentRole={user.role as Roles}
                                                            userId={user.id}
                                                            userBanned={isUserBanned}
                                                        >
                                                            <DropdownMenuItem
                                                                onSelect={(e) => e.preventDefault()}
                                                                disabled={isToggleLoading}
                                                            >
                                                                Change Role
                                                            </DropdownMenuItem>
                                                        </ChangeUserRoleModal>
                                                    )}

                                                    {/* Only show Edit User if NOT logged-in user */}
                                                    {!isCurrentUser && (
                                                        <EditUserModal
                                                            user={user}
                                                            userBanned={isUserBanned}

                                                            onOpenChange={setIsEditModalOpen}
                                                            open={isEditModalOpen}
                                                        >
                                                            <DropdownMenuItem
                                                                disabled={isToggleLoading}
                                                                onSelect={(e) => e.preventDefault()}

                                                            >
                                                                Edit User
                                                            </DropdownMenuItem>
                                                        </EditUserModal>
                                                    )}

                                                    <DropdownMenuSeparator />

                                                    {/* Ban/Unban action */}
                                                    {!isCurrentUser && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleBanToggle(user.id, isUserBanned, user.name)
                                                            }
                                                            disabled={isToggleLoading}
                                                            className={isUserBanned ? "text-green-600" : "text-destructive"}
                                                        >
                                                            {isUserBanned ? "Unban User" : "Ban User"}
                                                        </DropdownMenuItem>
                                                    )}

                                                    {/* Optional: prevent self-delete */}
                                                    {!isCurrentUser && (
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleUserDelete(user.id, user.name)}
                                                            disabled={isToggleLoading}
                                                        >
                                                            Remove User
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                {/* Ban/Unban status summary */}
                {users && users.filter(u => u.banned).length > 0 && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Ban className="h-4 w-4" />
                            <span>
                                <strong>{users.filter(u => u.banned).length} user(s)</strong> are currently banned and cannot access the system.
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default UsersTable;
