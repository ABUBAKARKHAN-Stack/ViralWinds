"use client"

import { useState } from "react"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getIconByName, getAllIconNames } from "@/lib/icon-mapper"
import { ControllerRenderProps } from "react-hook-form"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

type IconOption = {
    value: string
    label: string
    category: string
}

// Generate icon options from all available icons
const allIcons: IconOption[] = getAllIconNames().map(name => {
    const label = name.replace(/([A-Z])/g, ' $1').trim()

    let category = "Other"
    if (['MessageSquare', 'Lightbulb', 'Palette', 'Code', 'Rocket', 'HeartHandshake'].includes(name)) category = "Process"
    else if (['Target', 'Users', 'TrendingUp', 'Zap', 'Shield', 'Award'].includes(name)) category = "Goals"
    else if (['Mail', 'Phone', 'Send', 'Share2', 'MessageCircle', 'Bell'].includes(name)) category = "Communication"
    else if (['Youtube', 'Github', 'Linkedin', 'Twitter', 'Facebook', 'Instagram', 'Dribbble', 'Globe', 'Link', 'ExternalLink'].includes(name)) category = "Social"
    else if (['Briefcase', 'DollarSign', 'TrendingDown', 'PieChart', 'BarChart3', 'LineChart'].includes(name)) category = "Business"
    else if (['Pen', 'Brush', 'Layers', 'Layout', 'Figma', 'Image'].includes(name)) category = "Design"
    else if (['Terminal', 'Database', 'Server', 'Cloud', 'Cpu', 'HardDrive'].includes(name)) category = "Tech"
    else if (['Home', 'Settings', 'Search', 'Filter', 'Menu', 'Grid'].includes(name)) category = "UI"
    else if (['Play', 'Pause', 'Download', 'Upload', 'RefreshCw', 'Save'].includes(name)) category = "Actions"
    else if (['CheckCircle2', 'XCircle', 'AlertCircle', 'Info', 'HelpCircle', 'Clock'].includes(name)) category = "Status"
    else if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ChevronRight', 'ChevronLeft'].includes(name)) category = "Arrows"
    else if (['File', 'FileText', 'Folder', 'FolderOpen', 'Paperclip', 'BookOpen'].includes(name)) category = "Files"
    else if (['ShoppingCart', 'ShoppingBag', 'CreditCard', 'Tag', 'Package', 'Gift'].includes(name)) category = "Commerce"
    else if (['Video', 'Music', 'Headphones', 'Camera', 'Film', 'Mic'].includes(name)) category = "Media"

    return { value: name, label, category }
})

const processRecommended = ['MessageSquare', 'Lightbulb', 'Palette', 'Code', 'Rocket', 'HeartHandshake']
const benefitRecommended = ['Target', 'Users', 'TrendingUp', 'Zap', 'Shield', 'Award']
const stepRecommended = ['Lightbulb', 'Rocket', 'CheckCircle2', 'Settings', 'Users', 'TrendingUp']
const industryRecommended = ['Briefcase', 'ShoppingCart', 'Stethoscope', 'GraduationCap', 'Home', 'Cpu']
const teamRecommended = ['Palette', 'Code', 'Megaphone', 'Users', 'BarChart', 'Rocket']
const socialRecommended = ['Youtube', 'Github', 'Linkedin', 'Twitter', 'Facebook', 'Instagram', 'Mail', 'Globe', 'ExternalLink']

type IconSelectProps = {
    field: ControllerRenderProps<any, any>
    type: "process" | "benefit" | "step" | "industry" | "team" | "social"
    label?: string
}

export function IconSelect({ field, type, label = "Icon" }: IconSelectProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const recommended =
        type === "process" ? processRecommended :
            type === "benefit" ? benefitRecommended :
                type === "step" ? stepRecommended :
                    type === "industry" ? industryRecommended :
                        type === "social" ? socialRecommended :
                            teamRecommended

    // Filter icons based on search
    const filteredIcons = allIcons.filter(icon =>
        icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Show recommended first if no search
    const displayIcons = searchQuery
        ? filteredIcons
        : [
            ...filteredIcons.filter(icon => recommended.includes(icon.value)),
            ...filteredIcons.filter(icon => !recommended.includes(icon.value))
        ]

    const selectedIcon = allIcons.find(i => i.value === field.value)
    const SelectedIconComponent = field.value ? getIconByName(field.value) : null

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="space-y-2">
                {/* Selected Icon Display */}
                {field.value && (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                        {SelectedIconComponent && <SelectedIconComponent className="h-5 w-5 text-accent" />}
                        <span className="text-sm font-medium flex-1">{selectedIcon?.label}</span>
                        <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Search icons..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setIsOpen(true)
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="pl-9"
                    />
                </div>

                {/* Icon Grid */}
                {isOpen && (
                    <div className="border rounded-md p-3 bg-card max-h-[300px] overflow-y-auto">
                        {!searchQuery && (
                            <div className="mb-2">
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Recommended</p>
                            </div>
                        )}

                        <div className="grid grid-cols-6 gap-2">
                            {displayIcons.map((icon) => {
                                const Icon = getIconByName(icon.value)
                                const isSelected = field.value === icon.value
                                const isRecommended = recommended.includes(icon.value)

                                return (
                                    <button
                                        key={icon.value}
                                        type="button"
                                        onClick={() => {
                                            field.onChange(icon.value)
                                            setIsOpen(false)
                                            setSearchQuery("")
                                        }}
                                        className={cn(
                                            "flex flex-col items-center gap-1 p-2 rounded-md border transition-all hover:bg-accent/10 hover:border-accent",
                                            isSelected && "bg-accent/20 border-accent",
                                            isRecommended && !searchQuery && "border-accent/50"
                                        )}
                                        title={icon.label}
                                    >
                                        <Icon className={cn(
                                            "h-5 w-5",
                                            isSelected ? "text-accent" : "text-muted-foreground"
                                        )} />
                                        <span className="text-[10px] text-center leading-tight truncate w-full">
                                            {icon.label.split(' ').slice(0, 2).join(' ')}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {filteredIcons.length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                No icons found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>
            <FormMessage />
        </FormItem>
    )
}
