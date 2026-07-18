import { Outlet } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardShellLayout() {
    return (
        <AuthGuard>
            <DashboardLayout>
                <Outlet />
            </DashboardLayout>
        </AuthGuard>
    )
}