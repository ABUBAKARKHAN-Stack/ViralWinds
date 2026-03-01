'use server'

import { adminClient } from "@/sanity/lib/admin-client"

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get('file') as File
        if (!file) {
            throw new Error("No file provided")
        }

        if (file.size > 1024 * 1024) {
            throw new Error("File size exceeds 1MB limit")
        }

        const buffer = await file.arrayBuffer()
        const asset = await adminClient.assets.upload('image', Buffer.from(buffer), {
            filename: file.name,
            contentType: file.type,
        })

        return {
            success: true,
            asset: {
                _type: 'reference',
                _ref: asset._id,
                url: asset.url
            }
        }
    } catch (error: any) {
        console.error("Image upload failed:", error)
        return { success: false, error: error.message }
    }
}
