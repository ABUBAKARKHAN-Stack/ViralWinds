"use client"
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import { FC, ReactNode } from 'react'

type Props = {
    children: ReactNode
}

const RootProvider: FC<Props> = ({
    children
}) => {


    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="mohsin-desings-theme" disableTransitionOnChange>
            <Toaster />
            {children}
        </ThemeProvider>
    )
}

export default RootProvider