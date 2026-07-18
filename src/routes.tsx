/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminRoute } from "@/components/admin-route"
import { RouteObject, Navigate } from "react-router-dom"

// Layouts
const DashboardShellLayout = lazy(() => import("@/layouts/dashboard-shell-layout"))

// Pages publiques
const HomePage     = lazy(() => import("@/app/home-page/home-page"))
const LoginPage    = lazy(() => import("@/app/login-page/login-page"))
const RegisterPage = lazy(() => import("@/app/register-page/register-page"))
const NotFoundPage = lazy(() => import("@/app/not-found-page/not-found-page"))

// Pages dashboard
const DashboardPage     = lazy(() => import("@/app/dashboard/dashboard-page"))
const ClientsPage       = lazy(() => import("@/app/dashboard/clients-page/clients-page"))
const FacturesPage      = lazy(() => import("@/app/dashboard/factures-page/factures-page"))
const DevisPage         = lazy(() => import("@/app/dashboard/devis-page/devis-page"))
const ProfilePage       = lazy(() => import("@/app/dashboard/profile-page/profile-page"))
const InvoiceCustomizationPage = lazy(() => import("@/app/dashboard/settings-page/invoice-customization-page"))
const SupportDashboardPage = lazy(() => import("@/app/dashboard/support-page/support-dashboard-page"))
const SupportPage       = lazy(() => import("@/app/support-page/support-page"))
const PublicQuoteView  = lazy(() => import("@/app/public/quotes/PublicQuoteView"))
const PrivacyPolicyPage = lazy(() => import("@/app/public/legal/privacy-policy-page"))
const LegalNoticePage   = lazy(() => import("@/app/public/legal/legal-notice-page"))

// Admin
const AdminDashboardPage = lazy(() => import("@/app/admin/dashboard-page"))
const AdminUsersPage = lazy(() => import("@/app/admin/users-page"))
const AdminSupportPage = lazy(() => import("@/app/admin/support-messages-page"))

const fallback = <div />

const HomePageRedirect = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    let redirectPath = null;

    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.role === 'ROLE_ADMIN') {
                redirectPath = "/admin";
            } else {
                redirectPath = "/dashboard";
            }
        } catch {
            // ignore
        }
    }

    if (redirectPath) {
        return <Navigate to={redirectPath} replace />;
    }

    return <HomePage />;
};

const routes: RouteObject[] = [
    // Pages publiques
    { path: "/",         element: <Navigate to="/home" replace /> },
    { path: "/home",     element: <Suspense fallback={fallback}><HomePageRedirect /></Suspense>     },
    { path: "/login",    element: <Suspense fallback={fallback}><LoginPage /></Suspense>    },
    { path: "/register", element: <Suspense fallback={fallback}><RegisterPage /></Suspense> },
    { path: "/public/quotes/:token", element: <Suspense fallback={fallback}><PublicQuoteView /></Suspense> },
    { path: "/privacy",  element: <Suspense fallback={fallback}><PrivacyPolicyPage /></Suspense> },
    { path: "/legal",    element: <Suspense fallback={fallback}><LegalNoticePage /></Suspense> },

    // Pages dashboard (avec layout)
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <Suspense fallback={fallback}><DashboardShellLayout /></Suspense>,
                children: [
                    { path: "dashboard",        element: <Suspense fallback={fallback}><DashboardPage /></Suspense>     },
                    { path: "clients",          element: <Suspense fallback={fallback}><ClientsPage /></Suspense>       },
                    { path: "factures",         element: <Suspense fallback={fallback}><FacturesPage /></Suspense>      },
                    { path: "factures/nouveau", element: <Suspense fallback={fallback}><FacturesPage /></Suspense>      },
                    { path: "devis",            element: <Suspense fallback={fallback}><DevisPage /></Suspense>         },
                    { path: "devis/nouveau",    element: <Suspense fallback={fallback}><DevisPage /></Suspense>         },
                    { path: "profile",          element: <Suspense fallback={fallback}><ProfilePage /></Suspense>       },
                    { path: "personnalisation", element: <Suspense fallback={fallback}><InvoiceCustomizationPage /></Suspense> },
                    { path: "support",          element: <Suspense fallback={fallback}><SupportDashboardPage /></Suspense> },
                ],
            },
        ],
    },

    // Pages Admin
    {
        path: "/admin",
        element: <AdminRoute />,
        children: [
            {
                element: <Suspense fallback={fallback}><DashboardShellLayout /></Suspense>,
                children: [
                    { path: "", element: <Suspense fallback={fallback}><AdminDashboardPage /></Suspense> },
                    { path: "utilisateurs", element: <Suspense fallback={fallback}><AdminUsersPage /></Suspense> },
                    { path: "support", element: <Suspense fallback={fallback}><AdminSupportPage /></Suspense> },
                ]
            }
        ]
    },

    // Page de Support Publique (pour les non-connectés)
    { path: "/support", element: <Suspense fallback={fallback}><SupportPage /></Suspense> },

    // 404
    { path: "*", element: <Suspense fallback={fallback}><NotFoundPage /></Suspense> },
]

export default routes