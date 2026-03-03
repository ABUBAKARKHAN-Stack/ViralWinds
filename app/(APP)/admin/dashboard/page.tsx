import {
    DashboardWelcome,
    PermissionsCard,
    QuickActions,
    StatsSection,
    CmsHealthcheck
} from "@/components/admin/sections/dashboard";

export default function DashboardPage() {

    return (
        <div className="space-y-6">

            {/* Welcome Section */}
            <DashboardWelcome />

            {/* CMS Healthcheck */}
            <CmsHealthcheck />

            {/* Stats  Cards */}
            <StatsSection />

            {/* Quick Actions */}
            <QuickActions />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="col-span-full">
                    <PermissionsCard />
                </div>
            </div>


        </div>
    );
}
