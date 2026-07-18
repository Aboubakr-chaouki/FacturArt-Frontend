import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import {
    Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup, SidebarGroupLabel, SidebarMenu,
    SidebarMenuAction, SidebarMenuButton, SidebarMenuItem,
    SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Submenu = { href: string; label: string; active: boolean }

export function NavMain({
                            groupLabel,
                            items,
                        }: Readonly<{
    groupLabel: string
    items: {
        href:     string
        label:    string
        active:   boolean
        icon:     LucideIcon
        submenus: Submenu[]
    }[]
}>) {
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <SidebarGroup>
            {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map(item => (
                    <SidebarMenuItem key={item.label}>
                        {/* Mode icône avec sous-menus → dropdown à droite */}
                        {isCollapsed && item.submenus?.length ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton asChild tooltip={item.label} isActive={item.active}>
                                        <button type="button">
                                            <item.icon className="size-4" />
                                            <span>{item.label}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-fit p-0">
                                    <div className="py-1">
                                        <div className="mb-1 border-b px-3 py-2 text-sm font-medium">{item.label}</div>
                                        {item.submenus.map(sub => (
                                            <Link key={sub.label} to={sub.href}
                                                  className="flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : isCollapsed ? (
                            /* Mode icône sans sous-menus */
                            <SidebarMenuButton asChild tooltip={item.label} isActive={item.active}>
                                <Link to={item.href}>
                                    <item.icon className="size-4" />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        ) : (
                            /* Mode étendu */
                            <>
                                <SidebarMenuButton asChild tooltip={item.label} isActive={item.active}>
                                    <Link to={item.href}>
                                        <item.icon className="size-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                                {item.submenus?.length ? (
                                    <Collapsible defaultOpen={item.active}>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                <ChevronRight className="size-4" />
                                                <span className="sr-only">Toggle</span>
                                            </SidebarMenuAction>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.submenus.map(sub => (
                                                    <SidebarMenuSubItem key={sub.label}>
                                                        <SidebarMenuSubButton asChild isActive={sub.active}>
                                                            <Link to={sub.href}>{sub.label}</Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : null}
                            </>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}