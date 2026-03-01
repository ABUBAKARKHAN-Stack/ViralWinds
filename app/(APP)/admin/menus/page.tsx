import { Plus, ListTree, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { getMenus } from "@/app/actions/menus"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MenusClient } from "@/components/admin/menus/MenusClient"

export default async function MenusPage() {
    const menus = await getMenus()

    const totalItems = menus.reduce((acc: number, menu: any) => acc + (menu.itemCount || 0), 0)

    return (
        <div className="space-y-6 container mx-auto pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Menu Management</h1>
                    <p className="text-muted-foreground text-sm">Create and manage your website's navigation menus.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button asChild className="flex-1 sm:flex-none h-11 px-6 shadow-sm">
                        <Link href="/admin/menus/new">
                            <Plus className="mr-2 h-5 w-5" /> Create New Menu
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card shadow-sm border overflow-hidden">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Menus</span>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-black text-foreground leading-none">{menus.length}</span>
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <ListTree className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card shadow-sm border overflow-hidden">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Items</span>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-black text-foreground leading-none">{totalItems}</span>
                            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <LinkIcon className="h-4 w-4 text-indigo-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <MenusClient menus={menus} />
        </div>
    )
}
