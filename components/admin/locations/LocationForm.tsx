"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createLocation, updateLocation } from "@/app/actions/location"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Spinner } from "@/components/ui/spinner"

const locationSchema = z.object({
    title: z.string().min(1, "Title is required"),
})

type LocationValues = z.infer<typeof locationSchema>

interface LocationFormProps {
    initialData?: any
}

export function LocationForm({ initialData }: LocationFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const isEditing = !!initialData?._id

    const form = useForm<LocationValues>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            title: initialData?.title || "",
        }
    })

    async function onSubmit(values: LocationValues) {
        setIsLoading(true)
        try {
            const result = isEditing
                ? await updateLocation(initialData._id, values)
                : await createLocation(values)

            if (result.success) {
                successToast(`Location ${isEditing ? 'updated' : 'created'} successfully`)
                router.push('/admin/blogs/locations')
                router.refresh()
            } else {
                errorToast(result.error || "Failed to save location")
            }
        } catch (error) {
            errorToast("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon" className="rounded-full">
                            <Link href="/admin/blogs/locations">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">{isEditing ? "Edit Location" : "New Location"}</h1>
                            <p className="text-muted-foreground text-xs">{isEditing ? "Update location details" : "Add a new location"}</p>
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                        Save
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Location Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City/Country Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Dubai" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
