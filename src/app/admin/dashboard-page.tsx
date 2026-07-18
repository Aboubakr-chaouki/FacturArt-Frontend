import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin, AdminStats } from '@/hooks/admin/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, FileSpreadsheet, TrendingUp, UserPlus, Calendar, MessageSquare, LucideIcon } from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  link?: string;
}

const AdminDashboardPage = () => {
  const { fetchStats } = useAdmin();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
            <TrendingUp className="h-8 w-8" />
            <p>Chargement du tableau de bord...</p>
        </div>
    </div>
  );

  const statCards: StatCard[] = [
    {
      title: "Artisans Inscrits",
      value: stats?.totalUsers || 0,
      description: "Total des comptes artisans",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/admin/utilisateurs"
    },
    {
      title: "Nouveaux Inscrits",
      value: stats?.newUsersThisMonth || 0,
      description: "Inscriptions ce mois-ci",
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Chiffre d'Affaires Global",
      value: `${(stats?.totalRevenue || 0).toLocaleString()}€`,
      description: "Total facturé sur la plateforme",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
        title: "Volume du Mois",
        value: `${(stats?.invoicesThisMonth || 0).toLocaleString()}€`,
        description: "Facturation ce mois-ci",
        icon: Calendar,
        color: "text-orange-600",
        bgColor: "bg-orange-100"
      },
    {
      title: "Total Factures",
      value: stats?.totalInvoices || 0,
      description: "Générées par les artisans",
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Total Devis",
      value: stats?.totalQuotes || 0,
      description: "Créés sur la plateforme",
      icon: FileSpreadsheet,
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    },
    {
      title: "Messages Support",
      value: stats?.totalSupportMessages || 0,
      description: stats?.unreadSupportMessages ? `${stats.unreadSupportMessages} non lus` : "Toutes les demandes traitées",
      icon: MessageSquare,
      color: stats?.unreadSupportMessages ? "text-red-600" : "text-slate-600",
      bgColor: stats?.unreadSupportMessages ? "bg-red-50" : "bg-slate-100",
      link: "/admin/support"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Admin</h1>
        <p className="text-muted-foreground">Vue d'ensemble de l'activité de la plateforme FacturArt.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => {
          const CardWrapper = card.link ? Link : 'div';
          return (
            <CardWrapper key={index} to={card.link || ""} className={card.link ? "block hover:opacity-90 transition-opacity" : ""}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`${card.bgColor} p-2 rounded-full`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
