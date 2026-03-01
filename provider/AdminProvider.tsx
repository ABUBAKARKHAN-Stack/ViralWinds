"use client"
import { SidebarProvider } from '@/components/ui/sidebar'
import { SessionProvider } from '@/context/SessionContext'
import { Session } from '@/lib/auth'
import { queryClient } from '@/lib/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import  { ReactNode } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "./admin.css"

type Props = {
    children: ReactNode
    session: Session
}

export const AdminProvider = ({
    children,
    session
}: Props) => {
    return (
        <QueryClientProvider
            client={queryClient}
        >
            <SidebarProvider>
                <SessionProvider session={session}>
                    {children}
                </SessionProvider>
            </SidebarProvider>
            <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
    )
}

export default AdminProvider