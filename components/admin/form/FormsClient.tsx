"use client"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Edit as EditIcon, Search, Loader2, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { deleteForm } from "@/app/actions/formActions"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Form {
    _id: string
    _createdAt: string
    name: string
    description?: string
    fields?: any[]
}

interface FormsClientProps {
    forms: Form[]
}

export function FormsClient({ forms }: FormsClientProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const filteredForms = useMemo(() => {
        return forms.filter(form => {
            const name = form.name?.toLowerCase() || ""
            const description = form.description?.toLowerCase() || ""
            const query = searchQuery.toLowerCase()
            return name.includes(query) || description.includes(query)
        })
    }, [forms, searchQuery])

    async function handleDelete(id: string, name: string) {
        setIsDeleting(id)
        try {
            const result = await deleteForm(id)
            if (result.success) {
                successToast(`Form "${name}" deleted successfully!`)
                router.refresh()
            } else {
                errorToast(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error(error)
            errorToast("An unexpected error occurred.")
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search forms..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="min-w-[200px]">Form Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead>Fields</TableHead>
                            <TableHead className="hidden sm:table-cell">Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredForms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 opacity-20" />
                                        <span>No forms found matching your search.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredForms.map((form) => (
                                <TableRow
                                    key={form._id}
                                    className="group transition-colors hover:bg-muted/30"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <span className="font-semibold text-sm line-clamp-1">{form.name || "Untitled Form"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell max-w-[300px]">
                                        <span className="text-muted-foreground text-xs line-clamp-1">{form.description || "--"}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                                            {form.fields?.length || 0} Fields
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(form._createdAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit Form">
                                                <Link href={`/admin/forms/edit/${form._id}`}>
                                                    <EditIcon className="h-4 w-4" />
                                                </Link>
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        disabled={isDeleting === form._id}
                                                    >
                                                        {isDeleting === form._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete the form "{form.name || 'Untitled'}".
                                                            This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(form._id, form.name || 'Untitled')}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
