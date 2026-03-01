"use client"


import { Control } from "react-hook-form"
import { FormInput } from "./FormInput"

interface SectionHeadingInputProps {
    control: Control<any>
    name: string
    label: string
}

export function SectionHeadingInput({ control, name, label }: SectionHeadingInputProps) {
    return (
        <div className="space-y-4 border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg">{label}</h3>
            <FormInput
                control={control}
                name={`${name}.eyebrow`}
                label="Eyebrow (Optional)"
            />
            <FormInput
                control={control}
                name={`${name}.title`}
                label="Section Title"
            />
            <FormInput
                control={control}
                name={`${name}.description`}
                label="Section Description (Optional)"
                isTextarea
            />
        </div>
    )
}
