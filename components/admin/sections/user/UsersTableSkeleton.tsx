import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

const UsersTableSkeleton = () => {
    return (
        Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="pointer-events-none">
                {/* User column */}
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    </div>
                </TableCell>

                {/* Role column */}
                <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>

                {/* Status column */}
                <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>

                {/* Active (Switch) column */}
                <TableCell>
                    <Skeleton className="h-6 w-11 rounded-full" />
                </TableCell>

                {/* Actions column */}
                <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                </TableCell>
            </TableRow>
        ))
    )
}

export default UsersTableSkeleton
