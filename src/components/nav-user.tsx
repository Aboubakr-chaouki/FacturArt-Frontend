import { useEffect } from "react"
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authApi } from "@/api/auth/auth.api"
import { BASE_URL } from "@/api/api.config"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar"

const getUserFromStorage = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
    return null;
}

function NavUser() {
    const { state }    = useSidebar()
    const navigate     = useNavigate()
    const { pathname } = useLocation()
    const isCollapsed  = state === "collapsed"

    const user = getUserFromStorage() || {
        firstName: "Utilisateur",
        lastName: "",
        email: "",
        nomCommercial: "Mon Entreprise",
        logo: undefined,
    };

    const logoUrl = (() => {
        const logo = user.logo;
        if (!logo) return undefined;
        if (logo instanceof File) return URL.createObjectURL(logo);
        let url = logo;
        if (typeof logo === 'string') {
            if (logo.startsWith('http')) {
                url = logo;
            } else if (logo.startsWith('/uploads')) {
                url = `${BASE_URL}${logo}`;
            }
        }
        if (url && typeof url === 'string' && url.includes('localhost:8080')) {
            url = url.replace('localhost:8080', '127.0.0.1:8080');
        }
        return url;
    })();

    useEffect(() => {
        if (logoUrl) {
        }
    }, [logoUrl]);

    const displayName = user.nomCommercial || "Mon Entreprise";
    const initials = (user.nomCommercial?.[0] || "U").toUpperCase();

    const handleLogout = () => {
        authApi.logout();
        navigate("/login");
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            tooltip={displayName}
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="size-8 rounded-lg">
                                {logoUrl && (
                                    <AvatarImage
                                        src={logoUrl}
                                        alt={displayName}
                                        className="rounded-lg object-cover"
                                    />
                                )}
                                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{displayName}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </>
                            )}
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isCollapsed ? "right" : "top"}
                        align={isCollapsed ? "end" : "center"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-8 rounded-lg">
                                    {logoUrl && (
                                        <AvatarImage
                                            src={logoUrl}
                                            alt={displayName}
                                            className="rounded-lg object-cover"
                                        />
                                    )}
                                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{displayName}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => navigate(user.role === 'ROLE_ADMIN' ? "/admin" : "/profile")}
                                className={pathname === "/admin" || pathname === "/profile" ? "bg-accent" : ""}
                            >
                                <BadgeCheck className="mr-2 size-4" />
                                {user.role === 'ROLE_ADMIN' ? "Tableau de bord" : "Mon profil"}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-500 focus:text-red-500 cursor-pointer"
                        >
                            <LogOut className="size-4" />
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default NavUser
