import { getIconByName } from "@/lib/icon-mapper"
import React from "react"

interface Result {
    icon: string
    value: string
    label: string
}

interface CaseStudyResultsProps {
    results: Result[]
}

export const CaseStudyResults: React.FC<CaseStudyResultsProps> = ({ results }) => {
    if (!results || results.length === 0) return null

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-y border-border my-16">
            {results.map((result, index) => {
                const IconComponent = getIconByName(result.icon)
                return (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className="p-3 bg-accent/10 rounded-xl mb-4">
                            <IconComponent className="h-6 w-6 text-accent" />
                        </div>
                        <span className="text-3xl font-display font-bold mb-1">{result.value}</span>
                        <span className="text-sm text-muted-foreground uppercase tracking-widest">{result.label}</span>
                    </div>
                )
            })}
        </div>
    )
}
