"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getMediaAssets, uploadMultipleImages } from "@/app/actions/mediaActions"
import { Plus, Search, ImageIcon, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { errorToast } from "@/lib/toastNotifications"

interface MediaAsset {
    _id: string
    url: string
    originalFilename?: string
}

interface MediaPickerProps {
    onSelect: (asset: { _id: string, url: string }) => void
    trigger?: React.ReactNode
}

export function MediaPicker({ onSelect, trigger }: MediaPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [assets, setAssets] = useState<MediaAsset[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            loadAssets()
        }
    }, [isOpen])

    async function loadAssets() {
        setIsLoading(true)
        const result = await getMediaAssets()
        if (result.success) {
            setAssets(result.assets)
        }
        setIsLoading(false)
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 1024 * 1024) {
            errorToast("Image size must be less than 1MB")
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append('files', file)

        const result = await uploadMultipleImages(formData)
        if (result.success && result.assets && result.assets.length > 0) {
            // Auto select the first uploaded image
            const first = result.assets[0]
            onSelect({ _id: first._id, url: first.url })
            setIsOpen(false)
        }
        setIsUploading(false)
    }

    const filteredAssets = assets.filter(asset =>
        asset.originalFilename?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Select from Library
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Select Media</DialogTitle>
                    <DialogDescription>
                        Choose an image from your library or upload a new one.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 flex-1 overflow-hidden flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search media..."
                                className="pl-9 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="picker-upload"
                                onChange={handleUpload}
                                disabled={isUploading}
                            />
                            <Button size="sm" asChild disabled={isUploading}>
                                <label htmlFor="picker-upload" className="cursor-pointer">
                                    {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                                    Upload New
                                </label>
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2">
                        {isLoading ? (
                            <div className="flex h-48 items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredAssets.length === 0 ? (
                            <div className="flex h-48 flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
                                <p className="text-muted-foreground">No media found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {filteredAssets.map((asset) => (
                                    <div
                                        key={asset._id}
                                        className="group relative aspect-square rounded-md overflow-hidden bg-muted cursor-pointer ring-offset-2 ring-primary transition-all hover:ring-2"
                                        onClick={() => {
                                            onSelect({ _id: asset._id, url: asset.url })
                                            setIsOpen(false)
                                        }}
                                    >
                                        <Image
                                            src={asset.url}
                                            alt={asset.originalFilename || ""}
                                            fill
                                            className="object-cover"
                                            sizes="150px"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
