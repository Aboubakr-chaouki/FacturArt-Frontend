import React from "react"
import { Link, useLocation } from "react-router-dom"
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbList, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const LABELS: Record<string, string> = {
    dashboard:     "Tableau de bord",
    factures:      "Factures",
    devis:         "Devis",
    clients:       "Clients",
    interventions: "Interventions",
    stats:         "Statistiques",
    settings:      "Paramètres",
    support:       "Support",
    nouveau:       "Nouveau",
    avoirs:        "Avoirs",
    profile:       "Profil",
    company:       "Entreprise",
    billing:       "Facturation",
}

export function BreadcrumbsNav({
                                   className = "",
                                   showOnMobile = false,
                               }: Readonly<{
    className?: string
    showOnMobile?: boolean
}>) {
    const { pathname } = useLocation()
    const segments = pathname.split("/").filter(Boolean)

    if (segments.length === 0) return null

    return (
        <Breadcrumb className={`${showOnMobile ? "" : "hidden lg:flex"} ${className}`.trim()}>
            <BreadcrumbList>
                {segments.map((seg, i) => {
                    const href  = "/" + segments.slice(0, i + 1).join("/")
                    const label = LABELS[seg] ?? seg
                    const isLast = i === segments.length - 1

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to={href} className={isLast ? "text-foreground font-medium" : ""}>
                                        {label}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}