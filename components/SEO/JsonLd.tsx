"use client"

import Head from "next/head"
import Script from "next/script"


interface JsonLdProps {
    schemas?: string[]
}

export function JsonLd({ schemas }: JsonLdProps) {
    if (!schemas || schemas.length === 0) return null

    return (
        <>
            {schemas.map((schema, index) => {
                if (!schema) return null

                // Clean up the schema string in case it has extra whitespace or is not valid-looking JSON
                // but generally we trust the input from the admin form.
                let jsonContent = schema.trim()

                // Ensure it looks like JSON
                if (!jsonContent.startsWith('{') && !jsonContent.startsWith('[')) {
                    console.warn(`Invalid JSON-LD detected at index ${index}`)
                    return null
                }

                return (
                    <Script
                        key={`json-ld-${index}`}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: jsonContent }}
                    />
                )
            })}
        </>
    )
}
