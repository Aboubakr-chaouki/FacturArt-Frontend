import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import {
    SidebarGroup, SidebarGroupContent,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
                                 items,
                                 ...props
                             }: {
    items: {
        href:     string
        label:    string
        active:   boolean
        icon:     LucideIcon
        submenus: { href: string; label: string; active: boolean }[]
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map(item => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild size="sm" tooltip={item.label} isActive={item.active}>
                                <Link to={item.href}>
                                    <item.icon className="size-4" />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}