import { Plus, FileText, Database } from "lucide-react"
import Link from "next/link"
import { getForms } from "@/app/actions/formActions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FormsClient } from "@/components/admin/form/FormsClient"

export default async function FormsPage() {
    const result = await getForms()
    const forms = result.success ? result.data : []

    const totalFields = forms.reduce((acc: number, form: any) => acc + (form.fields?.length || 0), 0)

    return (
        <div className="space-y-6 container mx-auto pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Forms Management</h1>
                    <p className="text-muted-foreground text-sm">Create, edit and manage dynamic forms for your website.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button asChild className="flex-1 sm:flex-none h-11 px-6 shadow-sm">
                        <Link href="/admin/forms/add">
                            <Plus className="mr-2 h-5 w-5" /> Create New Form
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card shadow-sm border overflow-hidden">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Forms</span>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-black text-foreground leading-none">{forms.length}</span>
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card shadow-sm border overflow-hidden">
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Fields</span>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-black text-foreground leading-none">{totalFields}</span>
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Database className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <FormsClient forms={forms} />
        </div>
    )
}
