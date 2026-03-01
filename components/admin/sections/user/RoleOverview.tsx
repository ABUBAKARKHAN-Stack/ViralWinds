"use client"
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Roles } from '@/types/auth.types';
import { roleDescriptions, roleLabels, } from '@/constants/admin.constants'
import { useAdminUsers } from '@/hooks/useAdminUser';
import { Skeleton } from '@/components/ui/skeleton';

const RoleOverview = () => {
    const {
        data: users,
        isLoading
    } = useAdminUsers();

    return (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            {(Object.keys(roleLabels) as Roles[]).map((role) => {
                const count = users?.filter((u) => u.role === role).length;
                return (
                    <Card key={role}>
                        <CardHeader className="pb-2">
                            <CardDescription>{roleLabels[role]}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {
                                    isLoading ?
                                        <Skeleton className='size-8  mb-2' />
                                        :
                                        count
                                }

                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {roleDescriptions[role]}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}

export default RoleOverview
