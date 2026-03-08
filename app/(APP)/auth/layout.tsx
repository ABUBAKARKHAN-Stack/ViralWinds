import { SiteSettingsProvider } from '@/context/SiteSettingsContext'
import { getSiteSettings } from '@/helpers/site-settings.helpers'
import { getAdminSession } from '@/lib/auth'
import PublicProvider from '@/provider/PublicProvider'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'


const AuthLayout = async ({ children }: { children: ReactNode }) => {
    const siteSettings = await getSiteSettings()
    const session = await getAdminSession()

    if (session) return redirect('/admin/dashboard')


    return (
        <SiteSettingsProvider settings={siteSettings}>
            <PublicProvider>
                {children}
            </PublicProvider>
        </SiteSettingsProvider>
    )
}

export default AuthLayout