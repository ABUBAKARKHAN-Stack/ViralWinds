"use client"

import { useState, useEffect } from "react"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { uploadImage } from "@/app/actions/uploadImage"
import { cn } from "@/lib/utils"
import { errorToast, successToast } from "@/lib/toastNotifications"

import { MediaPicker } from "@/components/admin/media/MediaPicker"

interface ImageUploadProps {
    value?: {
        url?: string
        _id?: string
        asset?: {
            _ref?: string
            url?: string;
        }
        altText?: any;
    }
    onChange: (value: any) => void
    label: React.ReactNode | string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(value?.url || value?.asset?.url || null)
    const [isDragging, setIsDragging] = useState(false)

    // Sync preview with value changes
    useEffect(() => {
        if (value?.url) {
            setPreview(value.url)
        } else if (value?.asset?.url) {
            setPreview(value.asset.url)
        } else if (!value) {
            setPreview(null)
        }
    }, [value])

    async function uploadFile(file: File) {
        if (!file.type.startsWith('image/')) {
            errorToast('Please upload an image file')
            return
        }

        if (file.size > 1024 * 1024) {
            errorToast('Image size must be less than 1MB')
            return
        }

        setIsUploading(true)
        try {
            // Create local preview immediately
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)

            // Prepare FormData for the server action
            const formData = new FormData()
            formData.append('file', file)

            // Upload to Sanity via server action
            const result = await uploadImage(formData)

            if (result.success && result.asset) {
                // Update form value with raw asset info
                onChange({
                    _id: result.asset._ref,
                    url: result.asset.url,
                })
                successToast('Image uploaded and saved to media library!')
            } else {
                throw new Error(result.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Upload failed:', error)
            errorToast('Failed to upload image')
            setPreview(null)
        } finally {
            setIsUploading(false)
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            await uploadFile(file)
        }
    }

    function handleDragEnter(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    function handleDragLeave(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
    }

    async function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            await uploadFile(file)
        }
    }

    function handleRemove() {
        setPreview(null)
        onChange(undefined)
    }

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <div className="space-y-4">
                    {preview ? (
                        <div className="relative w-full h-64 border rounded-md overflow-hidden group">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain bg-muted"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleRemove}
                                    disabled={isUploading}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Remove
                                </Button>
                                <MediaPicker
                                    onSelect={(asset) => {
                                        onChange({ _id: asset._id, url: asset.url })
                                        setPreview(asset.url)
                                    }}
                                    trigger={
                                        <Button type="button" variant="secondary" size="sm">
                                            <ImageIcon className="h-4 w-4 mr-2" />
                                            Change
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-md p-10 text-center transition-colors cursor-pointer hover:border-primary/50",
                                isDragging && "border-primary bg-primary/5",
                                isUploading && "opacity-50 cursor-not-allowed"
                            )}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className={cn(
                                    "p-3 rounded-full mb-2",
                                    isDragging ? "bg-primary/10" : "bg-muted"
                                )}>
                                    {isDragging ? (
                                        <ImageIcon className="h-6 w-6 text-primary" />
                                    ) : (
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {isDragging ? "Drop image here" : "Drag and drop or click to upload"}
                                    </p>
                                    <p className="text-xs text-muted-foreground italic">
                                        Supports JPG, PNG, WEBP (Max 5MB)
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                        className="hidden"
                                        id={`file-upload-${label}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
                                        disabled={isUploading}
                                    >
                                        Upload New
                                    </Button>
                                    <div className="text-xs font-semibold uppercase text-muted-foreground italic">OR</div>
                                    <MediaPicker
                                        onSelect={(asset) => {
                                            onChange({ _id: asset._id, url: asset.url })
                                            setPreview(asset.url)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {isUploading && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing upload...</span>
                        </div>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    )
}
