"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { updateImageAltText } from "@/app/actions/mediaActions"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Spinner } from "@/components/ui/spinner"

interface AltTextEditorProps {
    isOpen: boolean
    onClose: () => void
    asset: {
        _id: string
        url: string
        originalFilename?: string
        altText?: string
        caption?: string
    }
    onUpdate: () => void
}

export function AltTextEditor({ isOpen, onClose, asset, onUpdate }: AltTextEditorProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        defaultValues: {
            altText: asset.altText || "",
            caption: asset.caption || "",
        }
    })

    async function onSubmit(values: any) {
        if (!values.altText?.trim()) {
            errorToast("Alt text is required for accessibility")
            return
        }

        setIsLoading(true)
        try {
            const result = await updateImageAltText(asset._id, values.altText, values.caption)
            if (result.success) {
                successToast("Alt text updated successfully")
                onUpdate()
                onClose()
            } else {
                errorToast(result.error || "Failed to update alt text")
            }
        } catch (error) {
            errorToast("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Edit Alt Text & Caption</DialogTitle>
                    <DialogDescription>
                        Add accessibility text for: {asset.originalFilename}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <FormField
                            control={form.control}
                            name="altText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alt Text <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Describe the image for screen readers..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="caption"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Caption (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Optional caption for the image..." rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
