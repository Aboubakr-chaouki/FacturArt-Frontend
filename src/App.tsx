import { useRoutes } from "react-router-dom"
import routes from "@/routes"
import CookieBanner from "@/components/layout/cookie-banner"

export default function App() {
    const children = useRoutes(routes)
    return (
        <>
            {children}
            <CookieBanner />
        </>
    )
}