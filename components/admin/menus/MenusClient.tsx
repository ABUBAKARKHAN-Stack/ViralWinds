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
import { Trash2, Edit as EditIcon, Search, Loader2, ListTree, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { deleteMenu } from "@/app/actions/menus"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Menu {
    _id: string
    title: string
    slug: string
    location?: string
    itemCount: number
}

interface MenusClientProps {
    menus: Menu[]
}

export function MenusClient({ menus }: MenusClientProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const filteredMenus = useMemo(() => {
        return menus.filter(menu => {
            const title = menu.title?.toLowerCase() || ""
            const slug = menu.slug?.toLowerCase() || ""
            const query = searchQuery.toLowerCase()
            return title.includes(query) || slug.includes(query)
        })
    }, [menus, searchQuery])

    async function handleDelete(id: string, title: string) {
        setIsDeleting(id)
        try {
            const result = await deleteMenu(id)
            if (result.success) {
                successToast(`Menu "${title}" deleted successfully!`)
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
                        placeholder="Search menus..."
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
                            <TableHead className="min-w-[180px]">Menu Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="hidden md:table-cell">Location</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMenus.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 opacity-20" />
                                        <span>No menus found matching your search.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMenus.map((menu) => (
                                <TableRow
                                    key={menu._id}
                                    className="group transition-colors hover:bg-muted/30"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <ListTree className="h-4 w-4 text-primary" />
                                            <span className="font-semibold text-sm line-clamp-1">{menu.title || "Untitled Menu"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                                            <LinkIcon className="h-3 w-3" />
                                            {menu.slug}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0">
                                            {menu.location || "Custom"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] px-2 h-5 font-medium border-primary/10">
                                            {menu.itemCount} Items
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit Details">
                                                <Link href={`/admin/menus/${menu._id}`}>
                                                    <EditIcon className="h-4 w-4" />
                                                </Link>
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        disabled={isDeleting === menu._id}
                                                    >
                                                        {isDeleting === menu._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete the menu "{menu.title || 'Untitled'}".
                                                            This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(menu._id, menu.title || 'Untitled')}
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
