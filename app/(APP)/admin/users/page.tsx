import Unauthorized from "@/components/admin/sections/Unauthorized";
import { AddUserDialog, RoleOverview, UsersTable } from "@/components/admin/sections/user";
import { rolePermissions } from "@/constants/admin.constants";
import { getServerSession } from "@/helpers/getServerSession";
import { Roles } from "@/types/auth.types";


export default async function UsersPage() {
    const session = await getServerSession()

    if (session) {
        const permission = rolePermissions[session.user.role as Roles]
        if (!permission.users.manage) return <Unauthorized
            requiredRole="Admin"
        />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage team members and their role-based permissions.
                    </p>
                </div>
                <AddUserDialog />
            </div>

            {/* Role Overview */}
            <RoleOverview />

            <UsersTable />
        </div>
    );
}
