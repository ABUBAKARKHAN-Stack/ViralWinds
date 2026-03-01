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
import { Trash2, Eye, Edit as EditIcon, Search, Loader2, LayoutGrid, Copy } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { deleteProject, deleteProjects, duplicateProject } from "@/app/actions/project"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface ProjectItem {
    _id: string
    title: string
    slug: string
    category?: string
    mainImage?: string
    _updatedAt: string
    status: 'Draft' | 'Published'
    hasPublished?: boolean
}

interface PortfolioClientProps {
    projects: ProjectItem[]
}

export function PortfolioClient({ projects }: PortfolioClientProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isBulkDeleting, setIsBulkDeleting] = useState(false)
    const [isDuplicating, setIsDuplicating] = useState<string | null>(null)
    const router = useRouter()

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const title = project.title?.toLowerCase() || ""
            const query = searchQuery.toLowerCase()
            return title.includes(query)
        })
    }, [projects, searchQuery])

    async function handleDelete(id: string, title: string) {
        setIsDeleting(id)
        try {
            const result = await deleteProject(id)
            if (result.success) {
                successToast(`Project "${title}" deleted successfully!`)
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
            const result = await deleteProjects(selectedIds)
            if (result.success) {
                successToast(`${selectedIds.length} projects deleted successfully!`)
                setSelectedIds([])
                router.refresh()
            } else {
                errorToast(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error(error)
            errorToast("An unexpected error occurred during bulk deletion.")
        } finally {
            setIsBulkDeleting(false)
        }
    }

    async function handleDuplicate(id: string) {
        setIsDuplicating(id)
        try {
            const result = await duplicateProject(id)
            if (result.success) {
                successToast("Project duplicated successfully!")
                router.push(`/admin/portfolio/edit/${result.id}`)
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
        if (selectedIds.length === filteredProjects.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredProjects.map(p => p._id))
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 w-full max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 w-full sm:w-auto p-2 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-top-1">
                        <span className="text-xs font-medium px-2 border-r mr-1">
                            {selectedIds.length} selected
                        </span>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8"
                                    disabled={isBulkDeleting}
                                >
                                    {isBulkDeleting ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-2" />
                                    )}
                                    Delete Selected
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete {selectedIds.length} selected projects. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleBulkDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete {selectedIds.length} Projects
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={selectedIds.length === filteredProjects.length && filteredProjects.length > 0}
                                    onCheckedChange={toggleAll}
                                />
                            </TableHead>
                            <TableHead className="w-[80px]">Preview</TableHead>
                            <TableHead className="min-w-[200px]">Project Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden sm:table-cell">Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <LayoutGrid className="h-8 w-8 opacity-20" />
                                        <span>No projects found.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProjects.map((project) => (
                                <TableRow
                                    key={project._id}
                                    className={cn(
                                        "group transition-colors hover:bg-muted/30 cursor-pointer",
                                        selectedIds.includes(project._id) ? "bg-primary/5" : ""
                                    )}
                                    onClick={() => toggleSelection(project._id)}
                                >
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedIds.includes(project._id)}
                                            onCheckedChange={() => toggleSelection(project._id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative h-12 w-20 rounded-lg border overflow-hidden bg-muted shrink-0">
                                            {project.mainImage ? (
                                                <Image
                                                    src={project.mainImage}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <LayoutGrid className="h-4 w-4 opacity-20" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-sm line-clamp-1">{project.title || "Untitled Project"}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={project.status === 'Published' ? "default" : "outline"}
                                            className={cn(
                                                "text-[10px] py-0 px-2 h-5 font-medium border shadow-none",
                                                project.status === 'Draft' && "bg-yellow-50 text-yellow-700 border-yellow-200",
                                                project.status === 'Published' && "bg-green-50 text-green-700 border-green-200 shadow-none border"
                                            )}
                                        >
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                                        {new Date(project._updatedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Details">
                                                <Link href={`/admin/portfolio/${project._id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>

                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit Project">
                                                <Link href={`/admin/portfolio/edit/${project._id}`}>
                                                    <EditIcon className="h-4 w-4" />
                                                </Link>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 "
                                                onClick={() => handleDuplicate(project._id)}
                                                disabled={isDuplicating === project._id}
                                                title="Duplicate Project"
                                            >
                                                {isDuplicating === project._id ? (
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
                                                        disabled={isDeleting === project._id}
                                                    >
                                                        {isDeleting === project._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete "{project.title || 'this project'}".
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(project._id, project.title || 'Untitled')}
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
