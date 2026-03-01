"use client"

import { Button } from "@/components/ui/button"
import { deleteLocation } from "@/app/actions/location"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { errorToast, successToast } from "@/lib/toastNotifications"

interface LocationActionsProps {
    id: string
}

export function LocationActions({ id }: LocationActionsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this location?")) {
            startTransition(async () => {
                const result = await deleteLocation(id)
                if (result.success) {
                    successToast("Location deleted")
                    router.refresh()
                } else {
                    errorToast(result.error || "Failed to delete")
                }
            })
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link href={`/admin/blogs/locations/${id}`}>
                    <Pencil className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={handleDelete} disabled={isPending}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
