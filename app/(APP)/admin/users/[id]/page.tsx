"use client"
import { useParams } from "next/navigation";
import { useAdminUser } from "@/hooks/useAdminUser";
import {
    UserDetails,
    UserDetailsError,
    UserDetailsSkeleton
} from "@/components/admin/sections/user/";

export default function UserProfilePage() {
    const { id }: { id: string } = useParams();
    const { data: user, isLoading, isError, refetch } = useAdminUser(id);

    if (isLoading) {
        return <UserDetailsSkeleton />;
    }

    if (isError || !user) {
        return <UserDetailsError onRetry={() => refetch()} />;
    }

    return <UserDetails user={user} />;
}