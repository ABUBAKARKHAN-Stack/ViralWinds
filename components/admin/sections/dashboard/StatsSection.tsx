"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { roleLabels } from '@/constants/admin.constants'
import {  useSession } from '@/context/SessionContext'
import { usePermissions } from '@/hooks/usePermissions'
import { Roles } from '@/types/auth.types'
import { FileText, Layers, Users } from 'lucide-react'

const StatsSection = () => {
  const permissions = usePermissions()
  const { session } = useSession()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Role</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{roleLabels[session.user.role as Roles]}</div>
          <p className="text-xs text-muted-foreground">
            {permissions.content.manage ? "Full access" : permissions.content.write ? "Can edit content" : "View only"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">8 published, 4 drafts</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sections</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">7 reusable components</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsSection
