import {
    DashboardWelcome,
    PermissionsCard,
    QuickActions,
    StatsSection
} from "@/components/admin/sections/dashboard";

export default function DashboardPage() {

    return (
        <div className="space-y-6">

            {/* Welcome Section */}
            <DashboardWelcome />

            {/* Stats  Cards */}
            <StatsSection />

            {/* Quick Actions */}
            <QuickActions />

            {/* Permissions Overview */}
            <PermissionsCard />


        </div>
    );
}
