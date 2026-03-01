"use client"

import { useState } from "react"
import { Search, Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { errorToast } from "@/lib/toastNotifications"
import { UseFormReturn } from "react-hook-form"

interface ReferenceItem {
    _id: string
    title: any
}

interface ReferenceSelectorProps {
    form: UseFormReturn<any>
    fieldName: string
    items: ReferenceItem[]
    label: string
    max?: number
    placeholder?: string
}

export function ReferenceSelector({
    form,
    fieldName,
    items,
    label,
    max = 8,
    placeholder = "Search..."
}: ReferenceSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const getDisplayTitle = (title: any) => {
        if (typeof title === 'string') return title;
        if (typeof title === 'object' && title !== null) {
            return title.en || title.english || Object.values(title)[0] || "Untitled";
        }
        return "Untitled";
    }

    const filteredItems = items.filter(item =>
        getDisplayTitle(item.title).toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedIds = form.watch(fieldName) || []

    const toggleItem = (id: string) => {
        const current = [...selectedIds]
        const index = current.indexOf(id)
        if (index > -1) {
            current.splice(index, 1)
        } else {
            if (current.length >= max) {
                errorToast(`Maximum ${max} items allowed`)
                return
            }
            current.push(id)
        }
        form.setValue(fieldName, current, { shouldValidate: true })
    }

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const current = [...selectedIds]
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= current.length) return

        const temp = current[index]
        current[index] = current[newIndex]
        current[newIndex] = temp
        form.setValue(fieldName, current, { shouldValidate: true })
    }

    return (
        <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">{label} (Max {max})</h3>
                <Badge variant="outline">{selectedIds.length} / {max} Selected</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={placeholder}
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="border rounded-md p-4 h-[300px] overflow-y-auto space-y-2 bg-muted/10">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                                <AlertCircle className="h-6 w-6 mb-2" />
                                <p className="text-sm">No items available</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                                <Search className="h-6 w-6 mb-2" />
                                <p className="text-sm">No matches found</p>
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <div key={item._id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors border bg-background">
                                    <Checkbox
                                        id={`ref-${item._id}`}
                                        checked={selectedIds.includes(item._id)}
                                        onCheckedChange={() => toggleItem(item._id)}
                                        disabled={!selectedIds.includes(item._id) && selectedIds.length >= max}
                                    />
                                    <label htmlFor={`ref-${item._id}`} className="text-sm font-medium flex-1 cursor-pointer">
                                        {getDisplayTitle(item.title)}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Display Order</h4>
                    <div className="border rounded-md p-4 h-[300px] overflow-y-auto space-y-2 bg-muted/5">
                        {selectedIds.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-8">
                                <CheckCircle2 className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-xs">No items selected yet.</p>
                            </div>
                        ) : (
                            selectedIds.map((id: string, index: number) => {
                                const item = items.find(i => i._id === id)
                                const displayTitle = item ? getDisplayTitle(item.title) : "Unknown Item";
                                return (
                                    <div key={id} className="flex items-center gap-2 p-3 bg-background border rounded-lg shadow-sm">
                                        <span className="text-xs font-bold text-muted-foreground w-6">#{index + 1}</span>
                                        <span className="flex-1 text-sm font-medium truncate">{displayTitle}</span>
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                disabled={index === 0}
                                                onClick={() => moveItem(index, 'up')}
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                disabled={index === selectedIds.length - 1}
                                                onClick={() => moveItem(index, 'down')}
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive"
                                                onClick={() => toggleItem(id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
