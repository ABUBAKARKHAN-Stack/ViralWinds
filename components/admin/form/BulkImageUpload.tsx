"use client"

import { useState } from "react"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageIcon, X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { MediaPicker } from "@/components/admin/media/MediaPicker"
import { uploadMultipleImages } from "@/app/actions/mediaActions"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { urlFor } from "@/sanity/lib/image"

interface BulkImageUploadProps {
    value?: any[] // Array of Sanity image references
    onChange: (value: any[]) => void
    label: string
}

export function BulkImageUpload({ value = [], onChange, label }: BulkImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)

    async function handleBulkUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            Array.from(files).forEach(file => {
                formData.append('files', file)
            })

            const result = await uploadMultipleImages(formData)

            if (result.success && result.assets) {
                const newImages = result.assets.map(asset => ({
                    _type: 'image',
                    _key: `image-${Date.now()}-${Math.random()}`,
                    asset: {
                        _type: 'reference',
                        _ref: asset._id
                    }
                }))
                onChange([...value, ...newImages])
                successToast(`${result.assets.length} image(s) uploaded successfully!`)
            } else {
                errorToast(result.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Bulk upload failed:', error)
            errorToast('Failed to upload images')
        } finally {
            setIsUploading(false)
            // Reset input
            e.target.value = ''
        }
    }

    function handleRemove(index: number) {
        const newValue = [...value]
        newValue.splice(index, 1)
        onChange(newValue)
    }

    function getImageUrl(image: any): string | null {
        try {
            // If it has asset reference, use urlFor
            if (image?.asset?._ref || image?.asset?._id) {
                const ref = image.asset._ref || image.asset._id
                return urlFor({ _type: 'image', asset: { _type: 'reference', _ref: ref } }).url()
            }
            // Direct URL
            if (image?.asset?.url) return image.asset.url
            if (image?.url) return image.url
        } catch (error) {
            console.error('Error getting image URL:', error)
        }
        return null
    }

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="space-y-4">
                {/* Image Grid */}
                {value.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {value.map((image, index) => {
                            const url = getImageUrl(image)
                            return (
                                <div key={image._key || index} className="relative group aspect-square border rounded-md overflow-hidden bg-gray-50">
                                    {url ? (
                                        <Image
                                            src={url}
                                            alt={`Brand logo ${index + 1}`}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <ImageIcon className="h-8 w-8" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleRemove(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Upload Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id={`bulk-upload-${label}`}
                        onChange={handleBulkUpload}
                        disabled={isUploading}
                    />
                    <Button
                        type="button"
                        variant="default"
                        className="flex-1"
                        onClick={() => document.getElementById(`bulk-upload-${label}`)?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Multiple Images
                            </>
                        )}
                    </Button>

                    <MediaPicker
                        onSelect={(asset) => {
                            const newImage = {
                                _type: 'image',
                                _key: `image-${Date.now()}-${Math.random()}`,
                                asset: {
                                    _type: 'reference',
                                    _ref: asset._id
                                }
                            }
                            onChange([...value, newImage])
                        }}
                        trigger={
                            <Button type="button" variant="outline" className="flex-1">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Select from Library
                            </Button>
                        }
                    />
                </div>

                <p className="text-xs text-muted-foreground">
                    Upload multiple images at once or select from the media library one at a time.
                </p>
            </div>
            <FormMessage />
        </FormItem>
    )
}
