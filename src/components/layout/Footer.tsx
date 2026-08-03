import logo from "@/assets/Logo.png";
import { Link } from "react-router-dom";
import { FOOTER_COLS, TRUST_BADGES } from "@/lib/configs/data/nav.constants.ts";
import { colors } from "@/styles/theme";

export default function Footer() {
    return (
        <footer className="bg-gray-950 pt-16 pb-8">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">

                    <div>
                        <Link to="/" className="flex items-center gap-2.5 mb-4">
                            <img src={logo} alt="FacturArt" className="w-7 h-auto" />
                            <span className="font-bold text-sm text-white">
                                Factur<span style={{ color: colors.green }}>Art</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
                            La solution de gestion complète pour artisans français.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-5">
                            {TRUST_BADGES.map(b => (
                                <span key={b} className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-gray-800 text-gray-500">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    {FOOTER_COLS.map(col => (
                        <div key={col.title}>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-300 mb-4">
                                {col.title}
                            </p>
                            <ul className="space-y-2.5">
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        {link.href.startsWith("#") || link.href.includes("#") ? (
                                            <a href={link.href} className="text-sm text-gray-500 hover:text-gray-200 transition-colors">
                                                {link.label}
                                            </a>
                                        ) : (
                                            <Link to={link.href} className="text-sm text-gray-500 hover:text-gray-200 transition-colors">
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-sm text-gray-600">© {new Date().getFullYear()} FacturArt — Tous droits réservés</p>
                    <div className="flex items-center gap-5">
                        <Link to="/legal"   className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Mentions légales</Link>
                        <Link to="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}