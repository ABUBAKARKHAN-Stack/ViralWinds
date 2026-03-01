import { MediaLibrary } from "@/components/admin/media/MediaLibrary"

export default function MediaPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
                <p className="text-muted-foreground">
                    Manage your images and assets. Upload multiple files at once.
                </p>
            </div>

            <MediaLibrary />
        </div>
    )
}
