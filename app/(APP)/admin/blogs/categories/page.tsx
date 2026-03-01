import { Button } from "@/components/ui/button"
import { getCategories, deleteCategory } from "@/app/actions/category"
import Link from "next/link"
import { Plus, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryActions } from "@/components/admin/categories/CategoryActions"

export default async function CategoriesPage() {
    const categories = await getCategories()
    return (
        <div className="container mx-auto pb-10 max-w-5xl">
            <div className="flex items-center justify-between py-6">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-muted-foreground">Manage your blog categories.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/blogs/categories/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Category
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                        No categories found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category: any) => (
                                    <TableRow key={category._id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-muted-foreground" />
                                            {category.title || "Untitled"}
                                        </TableCell>
                                        <TableCell>{category?.description || "-"}</TableCell>
                                        <TableCell>
                                            <CategoryActions id={category._id} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
