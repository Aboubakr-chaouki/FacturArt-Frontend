import { useState, useEffect } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Logo.png";
import { NAV_LINKS } from "@/lib/configs/data/nav.constants.ts";
import { colors } from "@/styles/theme";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [open,     setOpen]     = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm" : "bg-transparent"}`}>
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                <a href="/" className="flex items-center gap-2.5">
                    <img src={logo} alt="FacturArt" className="w-8 h-auto" />
                    <span className="font-bold text-[15px] text-gray-900 tracking-tight">
                        Factur<span style={{ color: colors.green }}>Art</span>
                    </span>
                </a>

                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ label, href }) => (
                        <a key={label} href={href}
                           className="px-3.5 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
                            {label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="rounded-full" asChild>
                        <a href="/login">Connexion</a>
                    </Button>
                    <Button size="sm" className="rounded-full gap-1.5 text-white" style={{ background: colors.dark }} asChild>
                        <a href="/register">Commencer <ArrowRight className="w-3.5 h-3.5" /></a>
                    </Button>
                </div>

                <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {open && (
                <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">
                    {NAV_LINKS.map(({ label, href }) => (
                        <a key={label} href={href} onClick={() => setOpen(false)}
                           className="block px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                            {label}
                        </a>
                    ))}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <Button variant="outline" size="sm" className="flex-1 rounded-full" asChild>
                            <a href="/login">Connexion</a>
                        </Button>
                        <Button size="sm" className="flex-1 rounded-full text-white" style={{ background: colors.dark }} asChild>
                            <a href="/register">Commencer</a>
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}