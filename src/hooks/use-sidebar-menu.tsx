import { useLocation } from "react-router-dom"
import { getSidebarMenuList, type Group } from "@/lib/configs/sidebar-menu-list"

export function useSidebarMenu() {
    const { pathname } = useLocation()
    const menuList: Group[] = getSidebarMenuList(pathname)

    const mainMenus = menuList.filter(g =>
        g.groupLabel === "" || g.groupLabel === "Documents" || g.groupLabel === "Gestion" || g.groupLabel === "Administration" || g.groupLabel === "Aide"
    )

    const secondaryMenus = menuList.filter(g => g.groupLabel === "Compte")

    return { menuList, mainMenus, secondaryMenus, currentPath: pathname }
}