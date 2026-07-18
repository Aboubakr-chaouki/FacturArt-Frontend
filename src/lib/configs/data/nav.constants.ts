export const NAV_LINKS = [
    { label: "Modules",         href: "#modules"         },
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "FAQ",             href: "#faq"             },
] as const;

export const FOOTER_COLS = [
    {
        title: "Modules",
        links: [
            { label: "Authentification", href: "#modules"         },
            { label: "Clients",          href: "#modules"         },
            { label: "Devis & Factures", href: "#modules"         },
            { label: "Communication",    href: "#modules"         },
            { label: "Tableau de bord",  href: "#modules"         },
            { label: "Archivage PDF",    href: "#modules"         },
        ],
    },
    {
        title: "Ressources",
        links: [
            { label: "Mentions légales",             href: "/legal"   },
            { label: "Politique de confidentialité", href: "/privacy" },
        ],
    },

] as const;

export const TRUST_BADGES = ["RGPD ✓", "HTTPS ✓", "🇫🇷 France"] as const;