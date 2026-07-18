import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 font-serif">Politique de Confidentialité</h1>
                    
                    <div className="prose prose-slate max-w-none space-y-8 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
                            <p>
                                Chez FacturArt, nous accordons une importance primordiale à la protection de vos données personnelles. 
                                Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons 
                                les informations que vous nous transmettez lors de l'utilisation de notre plateforme de gestion pour artisans.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Collecte des données</h2>
                            <p>
                                Nous collectons les informations nécessaires à la fourniture de nos services, notamment :
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Informations de compte : Nom, prénom, adresse email, mot de passe.</li>
                                <li>Informations professionnelles : Nom de l'entreprise, SIRET, adresse, logo.</li>
                                <li>Données de gestion : Informations sur vos clients, devis et factures créés sur la plateforme.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Utilisation des données</h2>
                            <p>
                                Vos données sont utilisées exclusivement pour :
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>La gestion de votre compte et l'accès aux services.</li>
                                <li>La génération et le stockage de vos documents (devis, factures).</li>
                                <li>Le support technique et la communication concernant votre compte.</li>
                                <li>L'amélioration constante de notre application.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Stockage et Sécurité</h2>
                            <p>
                                FacturArt est une application hébergée en France. Nous mettons en œuvre des mesures de sécurité 
                                techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, 
                                modification, divulgation ou destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Partage des données</h2>
                            <p>
                                Nous ne vendons, ne louons et ne partageons pas vos données personnelles avec des tiers à des fins marketing. 
                                Vos données ne sont accessibles qu'aux employés autorisés de FacturArt dans le cadre strict du support 
                                et de la maintenance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Vos droits</h2>
                            <p>
                                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, 
                                de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits 
                                directement depuis votre compte ou en contactant notre support.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contact</h2>
                            <p>
                                Pour toute question concernant cette politique, vous pouvez nous contacter via la page de support 
                                ou par email à : support@facturart.com
                            </p>
                        </section>

                        <p className="text-sm pt-10 border-t border-gray-100 italic">
                            Dernière mise à jour : 10 mai 2026
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
