"use client"

import { useEffect, useState, useMemo } from "react"
import { useFieldArray, Control, UseFormSetValue, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { FormInput } from "@/components/admin/form/FormInput"
import { Trash2, Plus, ArrowUp, ArrowDown, Link as LinkIcon, Layers, ChevronRight, ChevronDown, Hash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MenuItemEditorProps {
    control: Control<any>
    setValue: UseFormSetValue<any>
    name: string
    index: number
    remove: (index: number) => void
    move?: (from: number, to: number) => void
    total?: number
    depth?: number
    linkableContent: {
        services: any[]
        pages: any[]
    },
    errors?: any
    location?: 'header' | 'footer'
}

export function MenuItemEditor({
    control,
    name,
    index,
    remove,
    move,
    total,
    depth = 0,
    linkableContent,
    setValue,
    errors,
    location = 'header'
}: MenuItemEditorProps) {
    const fieldPath = `${name}.${index}`

    const { fields, append, remove: removeChild, move: moveChild } = useFieldArray({
        control,
        name: `${fieldPath}.children`
    })

    const linkType = useWatch({
        control,
        name: `${fieldPath}.type`
    })

    // Enforce 'header' type for Footer Column Headers to bypass link validation (no URL required)
    useEffect(() => {
        if (location === 'footer' && depth === 0 && linkType !== 'header') {
            setValue(`${fieldPath}.type`, 'header', { shouldValidate: true })
        }
    }, [location, depth, linkType, fieldPath, setValue])

    const itemLabel = useWatch({
        control,
        name: `${fieldPath}.label`
    })

    // Watch ALL items to check for existing references across the whole menu
    const allItems = useWatch({
        control,
        name: "items"
    })

    const usedReferenceIds = useMemo(() => {
        const ids = new Set<string>()
        const extractIds = (items: any[]) => {
            if (!items) return
            items.forEach(item => {
                if (item.type === 'reference' && item.reference?._ref) {
                    ids.add(item.reference._ref)
                }
                if (item.children && item.children.length > 0) {
                    extractIds(item.children)
                }
            })
        }
        extractIds(allItems)
        return ids
    }, [allItems])

    const hasError = !!errors?.[index]
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (hasError) setIsOpen(true)
    }, [hasError])

    return (
        <Card className={cn(
            "group border hover:border-primary/30 transition-all duration-300 shadow-sm",
            depth > 0 && "ml-8 border-l-4 border-l-primary/20 bg-muted/10",
            hasError && "border-destructive/50 bg-destructive/5 shadow-[0_0_15px_rgba(239,68,68,0.1)] shadow-destructive/10"
        )}>
            <div className="flex items-center gap-3 p-3 bg-muted/20 border-b group-hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    <div className="flex flex-col gap-1">
                        {move && (
                            <>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 rounded-sm hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                                    onClick={() => move(index, index - 1)}
                                    disabled={index === 0}
                                >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 rounded-sm hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                                    onClick={() => move(index, index + 1)}
                                    disabled={total ? index === total - 1 : true}
                                >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <div className="p-2 bg-background rounded border group-hover:border-primary/30 transition-colors">
                        {location === 'footer' && depth === 0 ? (
                            <Layers className="h-4 w-4 text-primary/60" />
                        ) : (
                            <LinkIcon className="h-4 w-4 text-primary/60" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-tight">
                            {location === 'footer' && depth === 0 ? 'Column Header' : `Level ${depth + 1}`}
                        </span>
                        <h4 className="font-bold text-sm tracking-tight text-foreground/80">
                            {(typeof itemLabel === 'object' ? itemLabel?.en || itemLabel?.ar || itemLabel?.ur || itemLabel?.es || "Untitled Link" : itemLabel) || (location === 'footer' && depth === 0 ? "New Column" : "New Link")}
                            {!isOpen && itemLabel && typeof itemLabel === 'string' && <span className="ml-2 text-xs font-normal text-muted-foreground/50 italic">(Click to edit)</span>}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isOpen && (
                        <div className="animate-in fade-in zoom-in-95 duration-200 flex items-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    append({
                                        label: "",
                                        description: "",
                                        type: "reference",
                                        children: []
                                    })
                                    setIsOpen(true)
                                }}
                                className="h-8 text-[11px] gap-1 hover:bg-primary/10 hover:text-primary"
                            >
                                <Plus className="h-3.5 w-3.5" /> Sub-link
                            </Button>
                            <div className="h-6 w-px bg-border mx-1" />
                        </div>
                    )}
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation()
                            remove(index)
                        }}
                        className="text-destructive hover:bg-destructive h-8 w-8 p-0"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {isOpen && (
                <CardContent className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 border-r pr-6 space-y-4">
                            <FormInput
                                control={control}
                                name={`${fieldPath}.label`}
                                label={location === 'footer' && depth === 0 ? "Column Heading" : "Link Title"}
                                compact
                            />

                            <FormInput
                                control={control}
                                name={`${fieldPath}.description`}
                                label="Description (Optional)"
                                compact
                            />

                            {/* Hide Link Configuration for Footer Top Level Items */}
                            {!(location === 'footer' && depth === 0) && (
                                <>
                                    <FormField
                                        control={control}
                                        name={`${fieldPath}.type`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold italic">Link Destination Type</FormLabel>
                                                <Select
                                                    onValueChange={(val) => {
                                                        field.onChange(val)
                                                        // Reset other field data to prevent validation conflicts
                                                        if (val === 'reference') {
                                                            setValue(`${fieldPath}.url`, "")
                                                        } else {
                                                            setValue(`${fieldPath}.reference`, null)
                                                        }
                                                    }}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-9 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="reference">Reference (Page/Service)</SelectItem>
                                                        <SelectItem value="custom">Custom URL</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                            {/* Only show destination fields if NOT a footer column header */}
                            {!(location === 'footer' && depth === 0) && (
                                linkType === 'reference' ? (
                                    <FormField
                                        control={control}
                                        name={`${fieldPath}.reference._ref`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold italic flex items-center gap-1.5">
                                                    <Layers className="h-3 w-3" /> Select Target Resource
                                                </FormLabel>
                                                <Select onValueChange={(val) => {
                                                    field.onChange(val)
                                                    // Set _type for Sanity reference metadata
                                                    setValue(`${fieldPath}.reference._type`, 'reference')
                                                }} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-10 text-xs">
                                                            <SelectValue placeholder="Search and select a service or page..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="max-h-[300px]">
                                                        {linkableContent.services.length > 0 && (
                                                            <>
                                                                <div className="px-2 py-1.5 text-[10px] font-bold text-primary/60 uppercase tracking-widest bg-primary/5 rounded mb-1">Services</div>
                                                                {linkableContent.services.map(s => (
                                                                    <SelectItem key={s._id} value={s._id} className="pl-6 text-xs">{s.title}</SelectItem>
                                                                ))}
                                                            </>
                                                        )}
                                                        {linkableContent.pages.length > 0 && (
                                                            <>
                                                                <div className="px-2 py-1.5 text-[10px] font-bold text-primary/60 uppercase tracking-widest bg-primary/5 rounded my-1">Pages</div>
                                                                {linkableContent.pages.map(p => (
                                                                    <SelectItem key={p._id} value={p._id} className="pl-6 text-xs">{p.title}</SelectItem>
                                                                ))}
                                                            </>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <FormInput
                                        control={control}
                                        name={`${fieldPath}.url`}
                                        label="External or Relative URL"
                                        compact
                                    />
                                )
                            )}

                            {(location === 'footer' && depth === 0) && (
                                <div className="flex flex-col justify-center h-full p-4 border-2 border-dashed rounded-lg bg-muted/5 text-muted-foreground text-sm text-center italic">
                                    This item acts as a column header in the footer. Use the "Sub-link" button to add the actual links below it.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary/60 flex items-center gap-2">
                                <Hash className="h-3 w-3" /> Sub-menu Structure
                            </h5>

                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mr-1">Quick Add:</span>
                                {linkableContent.pages.filter(p => ["Home", "About", "Services", "Portfolio", "Blog", "Contact"].includes(p.title)).map(p => (
                                    <Button
                                        key={p._id}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={usedReferenceIds.has(p._id)}
                                        className="h-6 text-[9px] px-2 rounded-full border-primary/10 hover:border-primary/30 hover:bg-accent/5 hover:text-accent disabled:opacity-30 disabled:grayscale transition-all"
                                        onClick={() => append({
                                            label: p.title,
                                            type: "reference",
                                            reference: {
                                                _type: "reference",
                                                _ref: p._id
                                            },
                                            children: []
                                        })}
                                    >
                                        <Plus className="h-2.5 w-2.5 mr-1" /> {p.title}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {fields.length > 0 ? (
                            <div className="space-y-3">
                                {fields.map((child, childIndex) => (
                                    <MenuItemEditor
                                        key={child.id}
                                        control={control}
                                        name={`${fieldPath}.children`}
                                        index={childIndex}
                                        remove={removeChild}
                                        move={moveChild}
                                        total={fields.length}
                                        depth={depth + 1}
                                        linkableContent={linkableContent}
                                        setValue={setValue}
                                        errors={errors?.[index]?.children}
                                        location={location}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 border border-dashed rounded-lg bg-muted/20 text-center">
                                <p className="text-[11px] text-muted-foreground italic">No sub-links yet. Use Quick Add or the Sub-link button to add items.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
