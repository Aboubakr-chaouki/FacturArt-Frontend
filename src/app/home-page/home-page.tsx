import { useState } from "react"
import { ArrowRight, CheckCircle2, ChevronDown, Star } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import {
    MODULES, FEATURES, EXTRAS, STEPS,
    HERO_STATS, FAQS,
} from "@/lib/configs/data/home.constants"
import { colors } from "@/styles/theme"


/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
    return (
        <section className="bg-white py-24 px-6">
            <div className="max-w-xl mx-auto text-center">
                <h1 className="font-erif font-bold tracking-tight leading-[1.1] text-[clamp(32px,6vw,62px)] text-gray-900 mb-6">
                    Fini la paperasse.<br />
                    <span className="text-[var(--c-green)]">Concentrez-vous sur votre métier.</span>
                </h1>

                <p className="text-[clamp(15px,2vw,18px)] text-gray-500 leading-relaxed mb-11">
                    FacturArt centralise vos devis, factures, clients et relances email dans une seule application simple et professionnelle — accessible partout.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap mb-11">
                    <a href="/register"
                       className="inline-flex items-center justify-center gap-2 bg-[var(--c-dark)] text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] no-underline whitespace-nowrap">
                        Commencer gratuitement <ArrowRight size={16} />
                    </a>
                    <a href="#modules"
                       className="inline-flex items-center justify-center gap-2 text-[var(--c-dark)] border border-gray-200 px-7 py-3.5 rounded-xl font-semibold text-[15px] no-underline whitespace-nowrap">
                        Voir les modules
                    </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 flex-wrap">
                    {["Sans carte bancaire", "Hébergé en France 🇫🇷"].map(t => (
                        <div key={t} className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-[var(--c-green)]" />
                            <span className="text-sm text-gray-500">{t}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-3xl mx-auto mt-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {HERO_STATS.map(({ n, label }) => (
                        <div key={label} className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-200">
                            <p className="font-serif font-bold tracking-tight text-gray-900 text-[clamp(22px,4vw,32px)] mb-1">{n}</p>
                            <p className="text-xs text-gray-500 leading-snug">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ─── Modules ────────────────────────────────────────────────────────────── */
function Modules() {
    return (
        <section id="modules" className="py-24 px-6 bg-gray-50 border-t border-gray-200">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[11px] font-bold text-[var(--c-green)] uppercase tracking-[0.14em] mb-2">6 modules intégrés</p>
                    <h2 className="font-serif font-bold tracking-tight text-[clamp(24px,4vw,44px)] leading-[1.15] text-gray-900 mb-4">
                        Tout ce dont un artisan a besoin,<br />sans jongler entre plusieurs outils
                    </h2>
                    <p className="text-[17px] text-gray-500 max-w-lg mx-auto leading-relaxed">
                        Chaque module couvre un besoin réel du quotidien, de la gestion client jusqu'à l'encaissement.
                    </p>
                </div>

                <div className="flex flex-col gap-16">
                    {MODULES.map(({ Icon, color, title, tagline, desc, points }, idx) => (
                        <div key={title} className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center ${idx % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                            {/* Visual card */}
                            <div className="bg-white rounded-3xl p-9 border border-gray-200 md:[direction:ltr]">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                                     style={{ background: `${color}18` }}>
                                    <Icon size={22} style={{ color }} />
                                </div>
                                <p className="font-serif font-bold text-gray-900 text-[19px] mb-1">{title}</p>
                                <p className="text-sm font-semibold mb-4" style={{ color }}>{tagline}</p>
                                <div className="flex flex-col gap-2.5">
                                    {points.map(pt => (
                                        <div key={pt} className="flex items-start gap-2.5">
                                            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--c-green)]" />
                                            <span className="text-[13px] text-gray-700 leading-snug">{pt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Text */}
                            <div className="md:[direction:ltr]">
                                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4"
                                     style={{ background: `${color}12` }}>
                                    <Icon size={11} style={{ color }} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>{title}</span>
                                </div>
                                <h3 className="font-serif font-bold tracking-tight text-gray-900 text-[clamp(18px,2.5vw,30px)] leading-tight mb-3">
                                    {tagline}
                                </h3>
                                <p className="text-[15px] text-gray-500 leading-relaxed">{desc}</p>
                                <a href="/register"
                                   className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[var(--c-dark)] no-underline">
                                    Essayer gratuitement <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ─── Features ───────────────────────────────────────────────────────────── */
function Features() {
    return (
        <section id="fonctionnalites" className="py-24 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[11px] font-bold text-[var(--c-green)] uppercase tracking-[0.14em] mb-2">Fonctionnalités</p>
                    <h2 className="font-serif font-bold tracking-tight text-[clamp(24px,4vw,44px)] leading-[1.15] text-gray-900 mb-4">
                        Pensé pour le terrain,<br />pas seulement pour le bureau
                    </h2>
                    <p className="text-[17px] text-gray-500 max-w-lg mx-auto leading-relaxed">
                        Utilisable depuis un smartphone sur un chantier autant que depuis un ordinateur au bureau.
                    </p>
                </div>

                {/* Feature cards — 3 col → 2 → 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                    {FEATURES.map(({ Icon, title, desc }) => (
                        <div key={title} className="p-7 rounded-2xl border border-gray-200 bg-gray-50">
                            <Icon size={20} className="mb-3.5 text-[var(--c-green)]" />
                            <h3 className="text-[15px] font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Extras — 2 col → 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    {EXTRAS.map(({ Icon, title, desc }) => (
                        <div key={title} className="p-6 rounded-2xl border border-gray-200 bg-white flex gap-3 items-start">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[var(--c-green)]/10">
                                <Icon size={15} className="text-[var(--c-green)]" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-gray-900 mb-1">{title}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ─── How it works ───────────────────────────────────────────────────────── */
function HowItWorks() {
    return (
        <section className="py-24 px-6 bg-gray-50 border-t border-gray-200">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[11px] font-bold text-[var(--c-green)] uppercase tracking-[0.14em] mb-2">Comment ça marche</p>
                    <h2 className="font-serif font-bold tracking-tight text-[clamp(24px,4vw,44px)] leading-[1.15] text-gray-900">
                        Du premier devis au paiement<br />en 4 étapes simples
                    </h2>
                </div>

                {/* Steps — 4 → 2 → 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STEPS.map(({ n, title, desc }) => (
                        <div key={n} className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--c-dark)] flex items-center justify-center mx-auto mb-5">
                                <span className="font-serif font-bold text-base text-[var(--c-green)]">{n}</span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-14">
                    <a href="/register"
                       className="inline-flex items-center gap-2 bg-[var(--c-dark)] text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] no-underline">
                        Commencer maintenant <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    )
}

/* ─── FAQ ────────────────────────────────────────────────────────────────── */
function Faq() {
    const [open, setOpen] = useState<number | null>(null)
    return (
        <section id="faq" className="py-24 px-6 bg-gray-50 border-t border-gray-200">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[11px] font-bold text-[var(--c-green)] uppercase tracking-[0.14em] mb-2">FAQ</p>
                    <h2 className="font-serif font-bold tracking-tight text-[clamp(24px,4vw,44px)] text-gray-900">
                        Questions fréquentes
                    </h2>
                </div>

                <div className="flex flex-col gap-2">
                    {FAQS.map(({ q, a }, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <button
                                className="w-full flex justify-between items-center px-6 py-5 bg-transparent border-none cursor-pointer text-left"
                                onClick={() => setOpen(open === i ? null : i)}
                            >
                                <span className="text-[15px] font-semibold text-gray-900 pr-4">{q}</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                                />
                            </button>
                            {open === i && (
                                <div className="px-6 pb-5">
                                    <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ─── CTA ────────────────────────────────────────────────────────────────── */
function Cta() {
    return (
        <section className="py-24 px-6 bg-[var(--c-dark)]">
            <div className="max-w-lg mx-auto text-center">
                <div className="flex justify-center gap-1 mb-7">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="fill-[var(--c-green)] text-[var(--c-green)]" />
                    ))}
                </div>
                <h2 className="font-serif font-bold tracking-tight text-[clamp(26px,5vw,50px)] text-white leading-[1.1] mb-5">
                    Prêt à simplifier<br />votre gestion ?
                </h2>
                <p className="text-[17px] text-white/40 leading-relaxed mb-11">
                    Rejoignez les artisans qui ont repris le contrôle de leur activité. Commencez gratuitement, sans carte bancaire.
                </p>
                <a href="/register"
                   className="inline-flex items-center gap-2 bg-[var(--c-green)] text-white px-8 py-3.5 rounded-xl font-semibold text-base no-underline">
                    Créer mon compte gratuit <ArrowRight size={17} />
                </a>
                <p className="text-xs text-white/20 mt-5">
                    Sans carte bancaire · Sans engagement · Hébergé en France 🇫🇷
                </p>
            </div>
        </section>
    )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function HomePage() {
    return (
        // On expose les couleurs de thème en CSS vars — seul style={} du fichier
        <div style={{ "--c-dark": colors.dark, "--c-green": colors.green } as React.CSSProperties}>
            <Header />
            <main>
                <Hero />
                <Modules />
                <Features />
                <HowItWorks />
                <Faq />
                <Cta />
            </main>
            <Footer />
        </div>
    )
}