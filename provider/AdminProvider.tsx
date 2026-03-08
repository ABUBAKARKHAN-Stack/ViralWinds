"use client"

import { SidebarProvider } from '@/components/ui/sidebar'
import { SessionProvider } from '@/context/SessionContext'
import { Session } from '@/lib/auth'
import { ReactNode } from 'react'
import "./admin.css"

type Props = {
    children: ReactNode
    session?: Session
}

export const AdminProvider = ({
    children,
    session
}: Props) => {
    return (
        <SidebarProvider>
            <SessionProvider session={session || null}>
                {children}
            </SessionProvider>
        </SidebarProvider>
    )
}

export default AdminProvider