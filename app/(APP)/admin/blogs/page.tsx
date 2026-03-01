import { Plus, FileText, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { getDashboardPosts } from "@/app/actions/blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BlogsClient } from "@/components/admin/blogs/BlogsClient"

export default async function BlogsPage() {
    const posts = await getDashboardPosts()

    return (
        <div className="space-y-6 container mx-auto pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog Management</h1>
                    <p className="text-muted-foreground text-sm">Create, edit and manage your insights, case studies and articles.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button asChild className="flex-1 sm:flex-none h-11 px-6 shadow-sm">
                        <Link href="/admin/blogs/new">
                            <Plus className="mr-2 h-5 w-5" /> Create New Post
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card shadow-sm border overflow-hidden">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Posts</span>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-black text-foreground leading-none">{posts.length}</span>
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card shadow-sm border overflow-hidden">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Drafts</span>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-black text-foreground leading-none">{posts.filter(p => p.status === 'Draft').length}</span>
                            <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <LayoutGrid className="h-4 w-4 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card shadow-sm border overflow-hidden">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Published</span>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-black text-foreground leading-none">{posts.filter(p => p.status === 'Published').length}</span>
                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <Plus className="h-4 w-4 text-green-600 rotate-45" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <BlogsClient posts={posts} />
        </div>
    )
}
