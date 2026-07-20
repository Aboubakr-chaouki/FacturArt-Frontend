import { LoginForm } from "@/app/login-page/components/login-form";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSearchParams } from "react-router-dom";

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const isConfirmed = searchParams.get("confirmed") === "true";

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4 py-24">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue</h1>
                        {isConfirmed ? (
                            <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
                                Votre email a été confirmé ! Vous pouvez maintenant vous connecter.
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Connectez-vous à votre espace artisan.</p>
                        )}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <LoginForm />
                    </div>
                    <p className="text-center text-[11px] text-gray-400 mt-6 leading-relaxed">
                        En vous connectant, vous acceptez nos{" "}
                        <a href="/legal" className="underline hover:text-gray-600">CGU</a> et notre{" "}
                        <a href="/privacy" className="underline hover:text-gray-600">politique de confidentialité</a>.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}