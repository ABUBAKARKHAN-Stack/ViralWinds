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
import { Trash2, Eye, Edit as EditIcon, Search, Loader2, Calendar, User, Clock, Copy } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { deletePost, deleteMultiplePosts, duplicatePost } from "@/app/actions/blog"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
    _id: string
    title: string
    slug: string
    publishedAt?: string
    author?: string
    location?: string
    service?: { title: string }
    mainImage?: string
    _updatedAt: string
    readTime?: number
    status: 'Draft' | 'Published'
    featured?: boolean
}

interface BlogsClientProps {
    posts: BlogPost[]
}

export function BlogsClient({ posts }: BlogsClientProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isDuplicating, setIsDuplicating] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isBulkDeleting, setIsBulkDeleting] = useState(false)
    const router = useRouter()

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const title = post.title?.toLowerCase() || ""
            const author = post.author?.toLowerCase() || ""
            const query = searchQuery.toLowerCase()
            return title.includes(query) || author.includes(query)
        })
    }, [posts, searchQuery])

    async function handleDuplicate(id: string) {
        setIsDuplicating(id)
        try {
            const result = await duplicatePost(id)
            if (result.success) {
                successToast("Post duplicated successfully!")
                router.push(`/admin/blogs/edit/${result.id}`)
                router.refresh()
            } else {
                errorToast(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error(error)
            errorToast("An unexpected error occurred.")
        } finally {
            setIsDuplicating(null)
        }
    }

    async function handleDelete(id: string, title: string) {
        setIsDeleting(id)
        try {
            const result = await deletePost(id)
            if (result.success) {
                successToast(`Post "${title}" deleted successfully!`)
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
            const result = await deleteMultiplePosts(selectedIds)
            if (result.success) {
                successToast(`${selectedIds.length} posts deleted successfully!`)
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

    function toggleSelection(id: string) {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        )
    }

    function toggleAll() {
        if (selectedIds.length === filteredPosts.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredPosts.map(p => p._id))
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search posts..."
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
                                    <AlertDialogTitle>Delete {selectedIds.length} Posts?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove the selected blog posts and their drafts.
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
                                    checked={selectedIds.length === filteredPosts.length && filteredPosts.length > 0}
                                    onCheckedChange={toggleAll}
                                />
                            </TableHead>
                            <TableHead className="w-[80px]">Preview</TableHead>
                            <TableHead className="min-w-[200px]">Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Read Time</TableHead>
                            <TableHead className="hidden md:table-cell">Author</TableHead>
                            <TableHead className="hidden sm:table-cell">Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 opacity-20" />
                                        <span>No posts found matching your search.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPosts.map((post) => {
                                return (
                                    <TableRow
                                        key={post._id}
                                        className={cn(
                                            "group transition-colors hover:bg-muted/30 cursor-pointer",
                                            selectedIds.includes(post._id) ? "bg-primary/5" : ""
                                        )}
                                        onClick={() => toggleSelection(post._id)}
                                    >
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedIds.includes(post._id)}
                                                onCheckedChange={() => toggleSelection(post._id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative h-12 w-20 rounded-lg border overflow-hidden bg-muted shrink-0">
                                                {post.mainImage ? (
                                                    <Image
                                                        src={post.mainImage}
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
                                                    <span className="font-semibold text-sm 
                                                    w-full
                                                    truncate max-w-[150px]">{post.title || "Untitled Post"}</span>
                                                    {post.featured && (
                                                        <Badge variant="outline" className="h-4 px-1 text-[8px] uppercase bg-primary/10 text-primary border-primary/20">
                                                            Featured
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={post.status === 'Published' ? "default" : "outline"}
                                                className={cn(
                                                    "text-[10px] py-0 px-2 h-5 font-medium border shadow-none",
                                                    post.status === 'Draft' && "bg-yellow-50 text-yellow-700 border-yellow-200",
                                                    post.status === 'Published' && "bg-green-50 text-green-700 border-green-200 shadow-none border"
                                                )}
                                            >
                                                {post.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{post.readTime ? `${post.readTime} min` : '--'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-2 text-xs">
                                                <User className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-muted-foreground truncate max-w-[100px]">{post.author || 'Unknown'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(post._updatedAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View on Site">
                                                    <Link href={`/admin/blogs/${post._id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>

                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit Post">
                                                    <Link href={`/admin/blogs/edit/${post._id}`}>
                                                        <EditIcon className="h-4 w-4" />
                                                    </Link>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleDuplicate(post._id)}
                                                    disabled={isDuplicating === post._id}
                                                    title="Duplicate Post"
                                                >
                                                    {isDuplicating === post._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            disabled={isDeleting === post._id}
                                                        >
                                                            {isDeleting === post._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete the post "{post.title || 'Untitled'}".
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(post._id, post.title || 'Untitled')}
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
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
