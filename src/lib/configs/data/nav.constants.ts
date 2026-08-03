export const NAV_LINKS = [
    { label: "Modules",         href: "/home#modules"         },
    { label: "Fonctionnalités", href: "/home#fonctionnalites" },
    { label: "FAQ",             href: "/home#faq"             },
] as const;

export const FOOTER_COLS = [
    {
        title: "Modules",
        links: [
            { label: "Authentification", href: "/home#modules"         },
            { label: "Clients",          href: "/home#modules"         },
            { label: "Devis & Factures", href: "/home#modules"         },
            { label: "Communication",    href: "/home#modules"         },
            { label: "Tableau de bord",  href: "/home#modules"         },
            { label: "Archivage PDF",    href: "/home#modules"         },
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