import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function LegalNoticePage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 font-serif">Mentions Légales</h1>
                    
                    <div className="prose prose-slate max-w-none space-y-8 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Éditeur du site</h2>
                            <p>
                                Le site FacturArt est édité par :
                                <br /><br />
                                <strong>FacturArt SAS</strong>
                                <br />
                                Capital social : 1 000 €
                                <br />
                                Siège social : 123 Rue de la Création, 75001 Paris
                                <br />
                                RCS Paris B 123 456 789
                                <br />
                                Email : contact@facturart.com
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Directeur de la publication</h2>
                            <p>
                                Le directeur de la publication est Monsieur Aboubakar Chaouki, en sa qualité de Président.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Hébergement</h2>
                            <p>
                                Le site est hébergé par :
                                <br /><br />
                                <strong>OVH Cloud</strong>
                                <br />
                                2 rue Kellermann, 59100 Roubaix, France
                                <br />
                                Site web : www.ovhcloud.com
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Propriété intellectuelle</h2>
                            <p>
                                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                                les documents téléchargeables et les représentations iconographiques et photographiques.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Utilisation du service</h2>
                            <p>
                                FacturArt est un service SaaS destiné aux professionnels. L'utilisation du service implique 
                                l'acceptation pleine et entière des conditions générales d'utilisation.
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
