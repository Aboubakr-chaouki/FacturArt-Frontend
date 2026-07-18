import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import NavUser from "@/components/nav-user"
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSidebarMenu } from "@/hooks/use-sidebar-menu"
import logo from "@/assets/Logo.png"

export type AppSidebarProps = React.ComponentProps<typeof Sidebar>

export function AppSidebar({ ...props }: AppSidebarProps) {
    const { mainMenus, secondaryMenus } = useSidebarMenu()
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null
    const user = userStr ? JSON.parse(userStr) : null
    const logoHref = user?.role === "ROLE_ADMIN" ? "/admin" : "/dashboard"

    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarHeader className="border-b py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="FacturArt">
                            <a href={logoHref} className="flex items-center gap-2">
                                <img
                                    src={logo}
                                    alt="FacturArt"
                                    className="size-7 shrink-0 object-contain"
                                />
                                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-bold">
                                        Factur<span className="text-primary">Art</span>
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Gestion artisan
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {mainMenus.map((group, index) => (
                    <NavMain key={"main-" + index} groupLabel={group.groupLabel} items={group.menus} />
                ))}

                {secondaryMenus.length > 0 && secondaryMenus.map((group, index) => (
                    <NavSecondary key={"sec-" + index} items={group.menus} className="mt-auto" />
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}