import { useEffect, useState } from "react"
import { dashboardApi, DashboardStats } from "@/api/dashboard/dashboard.api"

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const now = new Date();
                const month = now.getMonth() + 1;
                const year = now.getFullYear();
                const data = await dashboardApi.getStats(month, year);
                setStats(data);
            } catch (err) {
                setError("Impossible de charger les statistiques du dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const revenueChartData = (stats?.revenueEvolution || []).map((item) => ({
        month: item.month || "",
        revenue: Math.round(Number(item.amount || 0))
    }));

    const topClientsChartData = (stats?.topClients || []).map((client) => ({
        name: (client.name || "").substring(0, 15),
        value: Math.round(Number(client.totalAmount || 0))
    }));

    const monthlyRevenue = Math.round(Number(stats?.monthlyRevenue || 0));
    const unpaidAmount = Math.round(Number(stats?.unpaidAmount || 0));
    const revenueGrowth = Number(stats?.revenueGrowth || 0);
    const conversionRate = Number(stats?.conversionRate || 0);

    return {
        stats,
        loading,
        error,
        isModalOpen,
        setIsModalOpen,
        revenueChartData,
        topClientsChartData,
        monthlyRevenue,
        unpaidAmount,
        revenueGrowth,
        conversionRate
    };
}
