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
import { Trash2, Edit as EditIcon, Search, Loader2, Calendar, Copy, Search as SearchIcon, EyeIcon } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { deleteService, deleteMultipleServices, duplicateService } from "@/app/actions/service"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// Define the type for the service data we're fetching
interface Service {
    _id: string
    title: string
    slug: string
    heroImageUrl?: string
    _updatedAt: string
    status: 'Draft' | 'Published'
    hasPublished?: boolean
}

interface ServicesClientProps {
    services: Service[]
}

export function ServicesClient({ services }: ServicesClientProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isBulkDeleting, setIsBulkDeleting] = useState(false)
    const [isDuplicating, setIsDuplicating] = useState<string | null>(null)
    const router = useRouter()

    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const title = service.title?.toLowerCase() || ""
            const slug = service.slug?.toLowerCase() || ""
            const query = searchQuery.toLowerCase()
            return title.includes(query) || slug.includes(query)
        })
    }, [services, searchQuery])

    async function handleDelete(id: string, title: string) {
        setIsDeleting(id)
        try {
            const result = await deleteService(id)
            if (result.success) {
                successToast(`Service "${title}" deleted successfully!`)
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
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

    async function handleBulkDelete() {
        if (selectedIds.length === 0) return
        setIsBulkDeleting(true)
        try {
            const result = await deleteMultipleServices(selectedIds)
            if (result.success) {
                successToast(`${selectedIds.length} services deleted successfully!`)
                setSelectedIds([])
                router.refresh()
            } else {
                errorToast(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error(error)
            errorToast("An unexpected error occurred.")
        } finally {
            setIsBulkDeleting(false)
        }
    }

    async function handleDuplicate(id: string) {
        setIsDuplicating(id)
        try {
            const result = await duplicateService(id)
            if (result.success) {
                successToast("Service duplicated successfully!")
                router.push(`/admin/services/edit/${result.id}`)
                router.refresh()
            } else {
                errorToast(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error(error)
            errorToast("An unexpected error occurred during duplication.")
        } finally {
            setIsDuplicating(null)
        }
    }

    function toggleSelection(id: string) {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        )
    }

    function toggleAll() {
        if (selectedIds.length === filteredServices.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredServices.map(s => s._id))
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search services..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {selectedIds.length > 0 && (
                <div className="sticky top-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-background/80 backdrop-blur-md border border-primary/20 shadow-lg rounded-xl p-3 gap-3 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-4 pl-2">
                        <span className="text-sm font-semibold text-primary whitespace-nowrap">
                            {selectedIds.length} selected
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2"
                            onClick={() => setSelectedIds([])}
                        >
                            Deselect
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end px-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="h-8 w-full sm:w-auto">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete {selectedIds.length} Services?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove the selected services.
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleBulkDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={isBulkDeleting}
                                    >
                                        {isBulkDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                        Confirm Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm custom-scrollbar">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={selectedIds.length === filteredServices.length && filteredServices.length > 0}
                                    onCheckedChange={toggleAll}
                                />
                            </TableHead>
                            <TableHead className="w-[80px]">Preview</TableHead>
                            <TableHead className="min-w-[200px]">Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Slug</TableHead>
                            <TableHead className="hidden sm:table-cell">Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredServices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <SearchIcon className="h-8 w-8 opacity-20" />
                                        <span>No services found matching your search.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredServices.map((service) => (
                                <TableRow
                                    key={service._id}
                                    className={cn(
                                        "group transition-colors hover:bg-muted/30 cursor-pointer",
                                        selectedIds.includes(service._id) ? "bg-primary/5" : ""
                                    )}
                                    onClick={() => toggleSelection(service._id)}
                                >
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedIds.includes(service._id)}
                                            onCheckedChange={() => toggleSelection(service._id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative h-12 w-20 rounded-lg border overflow-hidden bg-muted shrink-0">
                                            {service.heroImageUrl ? (
                                                <Image
                                                    src={service.heroImageUrl}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Image src="/assets/logo.webp" alt="logo" width={20} height={20} className="opacity-20 dark:invert-0 invert" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm truncate max-w-[200px]">
                                                    {service.title || "Untitled Service"}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={service.status === 'Published' ? "default" : "outline"}
                                            className={cn(
                                                "text-[10px] py-0 px-2 h-5 font-medium border shadow-none",
                                                service.status === 'Draft' && "bg-yellow-50 text-yellow-700 border-yellow-200",
                                                service.status === 'Published' && "bg-green-50 text-green-700 border-green-200 shadow-none border"
                                            )}
                                        >
                                            {service.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground font-mono text-xs">
                                        {service.slug || "Slug is missing"}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(service._updatedAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View">
                                                <Link href={`/admin/services/${service._id}`}>
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit">
                                                <Link href={`/admin/services/edit/${service._id}`}>
                                                    <EditIcon className="h-4 w-4" />
                                                </Link>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleDuplicate(service._id)}
                                                disabled={isDuplicating === service._id}
                                                title="Duplicate"
                                            >
                                                {isDuplicating === service._id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        disabled={isDeleting === service._id}
                                                    >
                                                        {isDeleting === service._id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete the service "{service.title || 'Untitled'}".
                                                            This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(service._id, service.title || 'Untitled')}
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
