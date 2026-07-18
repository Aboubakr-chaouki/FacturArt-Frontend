export const ROUTES = {
    home:             "/",
    login:            "/login",
    register:         "/register",
    dashboard:        "/dashboard",
    clients:          "/clients",
    devis:            "/devis",
    devisNouveau:     "/devis/nouveau",
    factures:         "/factures",
    facturesNouveau:  "/factures/nouveau",
    settings:         "/personnalisation",
    profile:          "/profile",
    support:          "/support",
    admin: {
        dashboard: "/admin",
        users: "/admin/utilisateurs",
    },
    notFound:         "*",
} as const;