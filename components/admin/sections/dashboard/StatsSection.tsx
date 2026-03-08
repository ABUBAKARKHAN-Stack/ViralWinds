"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from '@/context/SessionContext'
import { Layers, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { client } from '@/sanity/lib/client'
import { Skeleton } from '@/components/ui/skeleton'

type StatsData = {
  projects: number;
  services: number;
}

const StatsSection = () => {
  const { session } = useSession()
  const [stats, setStats] = useState<StatsData | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const queries = [
          { key: "projects", query: `count(*[_type == "project"])` },
          { key: "services", query: `count(*[_type == "service"])` }
        ]

        const results = await Promise.all(
          queries.map(q => client.fetch<number>(q.query))
        )

        setStats({

          projects: results[0],
          services: results[1]
        })
      } catch (error) {
        console.error("Error fetching generic stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Role</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{session?.user?.role}</div>
          <p className="text-xs text-muted-foreground">
            Full access
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolios</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats ? (
            <>
              <div className="text-2xl font-bold">{stats.projects}</div>
              <p className="text-xs text-muted-foreground">Live projects listed</p>
            </>
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-28" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats ? (
            <>
              <div className="text-2xl font-bold">{stats.services}</div>
              <p className="text-xs text-muted-foreground">Active service offerings</p>
            </>
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-28" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsSection
