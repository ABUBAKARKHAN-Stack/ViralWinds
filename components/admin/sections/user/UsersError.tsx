"use client"
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { useAdminUsers } from '@/hooks/useAdminUser'
import { cn } from '@/lib/utils'
import { AlertTriangle, RotateCcw } from 'lucide-react'

const UsersError = () => {
    const {
        refetch,
        isRefetching
    } = useAdminUsers()

    return (
        <TableRow>
            <TableCell colSpan={3} className="py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <p className="font-medium">Failed to load users</p>
                    <p className="text-sm text-muted-foreground">
                        Something went wrong while fetching users.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isRefetching}
                        onClick={async () => await refetch()}
                        className="mt-2"
                    >
                        <RotateCcw className={cn(
                            
                            isRefetching && "animate-spin"
                        )} />
                        {isRefetching ? "Retrying..." : "Retry"}
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

export default UsersError
