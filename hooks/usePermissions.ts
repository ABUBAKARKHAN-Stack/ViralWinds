import { rolePermissions } from "@/constants/admin.constants";
import { useSession } from "@/context/SessionContext";
import { Permissions, Roles } from "@/types/auth.types";

export function usePermissions(): Permissions {
    const { session } = useSession();
    if (!session) return rolePermissions.user;
    return rolePermissions[session.user.role as Roles];
}
