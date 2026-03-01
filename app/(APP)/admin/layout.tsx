import { DashboardHeader } from '@/components/admin/sections/dashboard'
import { AppSidebar } from '@/components/layout/admin/AdminSidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import { getServerSession } from '@/helpers/getServerSession'
import AdminProvider from '@/provider/AdminProvider'
import { SanityLive } from '@/sanity/lib/live'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    }
}

const AdminLayout = async ({ children }: { children: ReactNode }) => {

    const session = await getServerSession()


    if (!session) redirect("/")

    return (
        <AdminProvider session={session}>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <SidebarInset className="flex-1">
                    <DashboardHeader />
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </SidebarInset>
            </div>
            <SanityLive />
        </AdminProvider>
    )
}

export default AdminLayout