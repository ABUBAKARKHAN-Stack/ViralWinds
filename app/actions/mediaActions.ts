'use server'

import { adminClient } from "@/sanity/lib/admin-client"

export async function uploadMultipleImages(formData: FormData) {
    try {
        const files = formData.getAll('files') as File[]
        if (!files || files.length === 0) {
            throw new Error("No files provided")
        }

        const oversizedFiles = files.filter(f => f.size > 1024 * 1024)
        if (oversizedFiles.length > 0) {
            throw new Error(`One or more files exceed the 1MB limit`)
        }

        const uploadPromises = files.map(async (file) => {
            const buffer = await file.arrayBuffer()
            const asset = await adminClient.assets.upload('image', Buffer.from(buffer), {
                filename: file.name,
                contentType: file.type,
            })
            return {
                _id: asset._id,
                url: asset.url
            }
        })

        const results = await Promise.all(uploadPromises)

        return {
            success: true,
            assets: results
        }
    } catch (error: any) {
        console.error("Multiple images upload failed:", error)
        return { success: false, error: error.message }
    }
}

export async function getMediaAssets() {
    try {
        const assets = await adminClient.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc) {
            _id,
            url,
            metadata {
                dimensions
            },
            originalFilename,
            size,
            _createdAt,
            altText,
            caption
        }`)
        return { success: true, assets }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteMediaAsset(id: string) {
    try {
        // Check for references first to give a better error message
        const references = await adminClient.fetch(`count(*[references($id)])`, { id })
        if (references > 0) {
            return {
                success: false,
                error: `This image is currently in use by ${references} other document(s) and cannot be deleted.`
            }
        }

        await adminClient.delete(id)
        return { success: true }
    } catch (error: any) {
        console.error("Delete asset failed:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteMultipleMediaAssets(ids: string[]) {
    try {
        const results = {
            deleted: [] as string[],
            skipped: [] as { id: string, reason: string }[],
            error: null as string | null
        }

        // We process them individually or in a more complex query to handle partials
        // Transaction is all or nothing, so for "skip if referenced" we need to be careful
        for (const id of ids) {
            const references = await adminClient.fetch(`count(*[references($id)])`, { id })
            if (references > 0) {
                results.skipped.push({ id, reason: `In use by ${references} document(s)` })
                continue
            }

            try {
                await adminClient.delete(id)
                results.deleted.push(id)
            } catch (err: any) {
                results.skipped.push({ id, reason: err.message })
            }
        }

        return {
            success: results.deleted.length > 0 || results.skipped.length === 0,
            deletedCount: results.deleted.length,
            skippedCount: results.skipped.length,
            deletedIds: results.deleted,
            skippedIds: results.skipped
        }
    } catch (error: any) {
        console.error("Bulk delete failed:", error)
        return { success: false, error: error.message }
    }
}

export async function updateImageAltText(id: string, altText: any, caption?: any) {
    try {
        const updates: any = { altText }
        if (caption !== undefined) {
            updates.caption = caption
        }

        await adminClient.patch(id).set(updates).commit()
        return { success: true }
    } catch (error: any) {
        console.error("Update alt text failed:", error)
        return { success: false, error: error.message }
    }
}
