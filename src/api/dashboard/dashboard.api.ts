import api from "../api.config";
import { Invoice } from "../../lib/configs/interface/invoice";

export interface DashboardStats {
  monthlyRevenue: number;
  revenueGrowth: number;
  pendingQuotesCount: number;
  quotesValidatedThisMonth: number;
  unpaidAmount: number;
  unpaidInvoicesCount: number;
  conversionRate: number;
  revenueEvolution: { month: string; amount: number }[];
  topClients: { name: string; totalAmount: number }[];
  recentInvoices: Invoice[];
}

export const dashboardApi = {
  getStats: async (month?: number, year?: number): Promise<DashboardStats> => {
    const params = new URLSearchParams();
    if (month !== undefined) params.append('month', month.toString());
    if (year !== undefined) params.append('year', year.toString());
    
    const queryString = params.toString();
    const url = `/dashboard/stats${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<DashboardStats>(url);
    return response.data;
  },
};
