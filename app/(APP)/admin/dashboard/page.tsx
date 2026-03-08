import {
    DashboardWelcome,
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


        </div>
    );
}
