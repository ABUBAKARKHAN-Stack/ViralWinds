"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Upload,
    Trash2,
    Grid2X2,
    List,
    Search,
    X,
    CheckCircle2,
    Loader2,
    Image as ImageIcon,
    Check,
    Edit,
    Download
} from "lucide-react"
import Image from "next/image"
import { uploadMultipleImages, getMediaAssets, deleteMediaAsset, deleteMultipleMediaAssets } from "@/app/actions/mediaActions"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { AltTextEditor } from "./AltTextEditor"
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

interface MediaAsset {
    _id: string
    url: string
    originalFilename?: string
    size: number
    _createdAt: string
    altText?: any
    caption?: any
    metadata?: {
        dimensions: {
            width: number
            height: number
        }
    }
}

export function MediaLibrary() {
    const [assets, setAssets] = useState<MediaAsset[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isBulkDeleting, setIsBulkDeleting] = useState(false)
    const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadAssets()
    }, [])

    async function loadAssets() {
        setIsLoading(true)
        const result = await getMediaAssets()
        if (result.success) {
            setAssets(result.assets)
        } else {
            errorToast(result.error || "Failed to load media")
        }
        setIsLoading(false)
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        const oversizedFiles = files.filter(file => file.size > 1024 * 1024)
        if (oversizedFiles.length > 0) {
            errorToast(`Some files exceed 1MB and were skipped.`)
        }

        const validFiles = files.filter(file => file.size <= 1024 * 1024)
        if (validFiles.length === 0) {
            if (fileInputRef.current) fileInputRef.current.value = ""
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        validFiles.forEach(file => formData.append('files', file))

        const result = await uploadMultipleImages(formData)
        if (result.success) {
            successToast(`Successfully uploaded ${files.length} images`)
            loadAssets()
        } else {
            errorToast(result.error || "Upload failed")
        }
        setIsUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    async function handleDelete(id: string) {
        const result = await deleteMediaAsset(id)
        if (result.success) {
            successToast("Asset deleted")
            setAssets(prev => prev.filter(a => a._id !== id))
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
        } else {
            errorToast(result.error || "Delete failed")
        }
    }

    async function handleBulkDelete() {
        if (selectedIds.length === 0) return

        setIsBulkDeleting(true)
        const result = await deleteMultipleMediaAssets(selectedIds)

        if (result.success) {
            const deletedCount = result.deletedCount ?? 0
            const skippedCount = result.skippedCount ?? 0

            if (deletedCount > 0) {
                successToast(`${deletedCount} asset(s) deleted successfully.`)
                // Only remove IDs that were actually deleted
                const deletedIds = result.deletedIds || []
                setAssets(prev => prev.filter(a => !deletedIds.includes(a._id)))
                setSelectedIds(prev => prev.filter(id => !deletedIds.includes(id)))
            }

            if (skippedCount > 0) {
                errorToast(`${skippedCount} asset(s) were skipped because they are in use.`)
            }
        } else {
            errorToast(result.error || "Bulk delete failed")
        }
        setIsBulkDeleting(false)
    }

    function toggleSelection(id: string) {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        )
    }

    function toggleAll() {
        if (selectedIds.length === filteredAssets.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredAssets.map(a => a._id))
        }
    }

    const filteredAssets = assets.filter(asset =>
        asset.originalFilename?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    function formatBytes(bytes: number) {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    async function handleDownload(url: string, filename?: string) {
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = blobUrl
            link.download = filename || 'image'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up the blob URL
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            errorToast("Failed to download image")
            console.error("Download error:", error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search media..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {viewMode === "grid" && filteredAssets.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border mr-2">
                            <Checkbox
                                id="select-all-grid"
                                checked={selectedIds.length === filteredAssets.length && filteredAssets.length > 0}
                                onCheckedChange={toggleAll}
                            />
                            <label htmlFor="select-all-grid" className="text-xs font-medium cursor-pointer select-none">
                                Select All
                            </label>
                        </div>
                    )}

                    <div className="flex bg-muted rounded-md p-1 border">
                        <Button
                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid2X2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleUpload}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        Upload
                    </Button>
                </div>
            </div>

            {selectedIds.length > 0 && (
                <div className="sticky top-4 z-20 flex items-center justify-between bg-background/80 backdrop-blur-md border border-primary/20 shadow-lg rounded-xl p-3 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-4 pl-2">
                        <span className="text-sm font-semibold text-primary">
                            {selectedIds.length} items selected
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => setSelectedIds([])}
                        >
                            Deselect all
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="h-8">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Selected
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete {selectedIds.length} Assets?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove the selected assets from the library.
                                        This action cannot be undone and may cause broken links if these images are in use.
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

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : filteredAssets.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No media found</p>
                    <p className="text-sm text-muted-foreground">Upload some images to get started</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredAssets.map((asset) => (
                        <Card
                            key={asset._id}
                            className={cn(
                                "group relative aspect-square overflow-hidden bg-muted transition-all duration-300",
                                selectedIds.includes(asset._id)
                                    ? "ring-2 ring-primary ring-offset-2 scale-[0.98] shadow-md"
                                    : "hover:shadow-lg hover:scale-[1.02]"
                            )}
                            onClick={() => selectedIds.length > 0 && toggleSelection(asset._id)}
                        >
                            <Image
                                src={asset.url}
                                alt={asset.originalFilename || "Media"}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, 16vw"
                            />

                            {/* Alt Text Status Badge */}
                            <div
                                className={cn(
                                    "absolute top-2 left-2 z-10 transition-opacity duration-200",
                                    selectedIds.includes(asset._id) ? "opacity-0" : "opacity-100"
                                )}
                            >
                                {asset.altText && typeof asset.altText === 'string' ? (
                                    <div className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        ALT
                                    </div>
                                ) : (
                                    <div className="bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                        NO ALT
                                    </div>
                                )}
                            </div>

                            {/* Checkbox overlay */}
                            <div
                                className={cn(
                                    "absolute top-2 right-2 z-10 transition-opacity duration-200",
                                    selectedIds.includes(asset._id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Checkbox
                                    checked={selectedIds.includes(asset._id)}
                                    onCheckedChange={() => toggleSelection(asset._id)}
                                    className="bg-background/80 backdrop-blur-sm border-primary/50"
                                />
                            </div>

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-8 w-8"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Media?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently remove this asset from the library.
                                                If it's used in any services, it might cause broken links.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(asset._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Button
                                    size="icon"
                                    variant="default"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setEditingAsset(asset)
                                    }}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDownload(asset.url, asset.originalFilename)
                                    }}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8"
                                    onClick={(e) => e.stopPropagation()}
                                    asChild
                                >
                                    <a href={asset.url} target="_blank" rel="noopener noreferrer">
                                        <Upload className="h-4 w-4 rotate-180" />
                                    </a>
                                </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {(typeof asset.altText === 'string' ? asset.altText : null) || asset.originalFilename || "No description"}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="border rounded-md overflow-hidden bg-background">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3 text-left w-10">
                                    <Checkbox
                                        checked={selectedIds.length === filteredAssets.length && filteredAssets.length > 0}
                                        onCheckedChange={toggleAll}
                                    />
                                </th>
                                <th className="p-3 text-left font-medium">Preview</th>
                                <th className="p-3 text-left font-medium">Name</th>
                                <th className="p-3 text-left font-medium">Alt Text</th>
                                <th className="p-3 text-left font-medium">Size</th>
                                <th className="p-3 text-left font-medium">Date</th>
                                <th className="p-3 text-right font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredAssets.map(asset => (
                                <tr
                                    key={asset._id}
                                    className={cn(
                                        "hover:bg-muted/50 transition-colors cursor-pointer",
                                        selectedIds.includes(asset._id) ? "bg-primary/5" : ""
                                    )}
                                    onClick={() => toggleSelection(asset._id)}
                                >
                                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedIds.includes(asset._id)}
                                            onCheckedChange={() => toggleSelection(asset._id)}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <div className="relative h-12 w-20 rounded border overflow-hidden">
                                            <Image src={asset.url} alt="" fill className="object-cover" />
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium truncate max-w-xs">{asset.originalFilename}</td>
                                    <td className="p-3">
                                        <div className="flex flex-col gap-2">
                                            {/* Overall Status */}
                                            {asset.altText && typeof asset.altText === 'string' ? (
                                                <div className="bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 w-fit">
                                                    <Check className="h-3 w-3" />
                                                    Has Alt Text
                                                </div>
                                            ) : (
                                                <div className="bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-semibold px-2 py-1 rounded-md w-fit">
                                                    Missing Alt Text
                                                </div>
                                            )}

                                        </div>
                                    </td>
                                    <td className="p-3 text-muted-foreground">{formatBytes(asset.size)}</td>
                                    <td className="p-3 text-muted-foreground">{new Date(asset._createdAt).toLocaleDateString()}</td>
                                    <td className="p-3 text-right flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8"
                                            onClick={() => setEditingAsset(asset)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8"
                                            onClick={() => handleDownload(asset.url, asset.originalFilename)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() => handleDelete(asset._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Alt Text Editor Modal */}
            {editingAsset && (
                <AltTextEditor
                    isOpen={!!editingAsset}
                    onClose={() => setEditingAsset(null)}
                    asset={editingAsset}
                    onUpdate={loadAssets}
                />
            )}
        </div>
    )
}
