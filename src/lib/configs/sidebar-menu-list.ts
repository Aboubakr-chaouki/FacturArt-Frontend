import {
    LayoutDashboard, FileText, ReceiptEuro,
    Users, User, BookUser, Palette,
    type LucideIcon,
} from "lucide-react"

export type Submenu = {
    href:   string
    label:  string
    active: boolean
}

export type Menu = {
    href:     string
    label:    string
    active:   boolean
    icon:     LucideIcon
    submenus: Submenu[]
}

export type Group = {
    groupLabel: string
    menus:      Menu[]
}

export function getSidebarMenuList(pathname: string): Group[] {
    const userStr = localStorage.getItem("user")
    const user = userStr ? JSON.parse(userStr) : null
    const isAdmin = user?.role === "ROLE_ADMIN"

    const groups: Group[] = []
    
    if (isAdmin) {
        // Menu restreint pour l'administrateur
        groups.push(
            {
                groupLabel: "",
                menus: [
                    {
                        href:     "/admin",
                        label:    "Tableau de bord",
                        active:   pathname === "/admin",
                        icon:     LayoutDashboard,
                        submenus: [],
                    },
                ],
            },
            {
                groupLabel: "Administration",
                menus: [
                    {
                        href: "/admin/utilisateurs",
                        label: "Artisans",
                        active: pathname === "/admin/utilisateurs",
                        icon: Users,
                        submenus: [],
                    },
                ],
            },
            {
                groupLabel: "Aide",
                menus: [
                    {
                        href:     "/admin/support",
                        label:    "Messages Support",
                        active:   pathname === "/admin/support",
                        icon:     BookUser,
                        submenus: [],
                    },
                ],
            }
        )
        return groups
    }

    // Menu complet pour les artisans (ROLE_USER)
    groups.push(
        {
            groupLabel: "",
            menus: [
                {
                    href:     "/dashboard",
                    label:    "Tableau de bord",
                    active:   pathname === "/dashboard",
                    icon:     LayoutDashboard,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Documents",
            menus: [
                {
                    href:   "/factures",
                    label:  "Factures",
                    active: pathname === "/factures",
                    icon:   ReceiptEuro,
                    submenus: [],
                },
                {
                    href:   "/devis",
                    label:  "Devis",
                    active: pathname === "/devis",
                    icon:   FileText,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Gestion",
            menus: [
                {
                    href:     "/clients",
                    label:    "Clients",
                    active:   pathname === "/clients",
                    icon:     Users,
                    submenus: [],
                },
                {
                    href:     "/personnalisation",
                    label:    "Personnalisation",
                    active:   pathname === "/personnalisation",
                    icon:     Palette,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Compte",
            menus: [
                {
                    href:   "/profile",
                    label:  "Mon profil",
                    active: pathname === "/profile",
                    icon:   User,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Aide",
            menus: [
                {
                    href:     "/support",
                    label:    "Support",
                    active:   pathname === "/support",
                    icon:     BookUser,
                    submenus: [],
                },
            ],
        },
    )

    return groups
}