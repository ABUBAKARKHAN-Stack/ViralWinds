"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteMenu } from "@/app/actions/menus"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

export function MenuDeleteButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this menu? This will also remove it from any assigned site areas.")) return

        setIsDeleting(true)
        try {
            const result = await deleteMenu(id)
            if (result.success) {
                successToast("Menu deleted successfully")
            } else {
                errorToast(result.error || "Failed to delete menu")
            }
        } catch (error) {
            errorToast("An unexpected error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
            {isDeleting ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    )
}
