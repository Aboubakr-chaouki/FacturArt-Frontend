import { RegisterForm } from "@/app/register-page/components/register-form";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4 py-24">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Créez votre compte</h1>
                        <p className="text-sm text-gray-500">Gratuit, sans carte bancaire. Prêt en 2 minutes.</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <RegisterForm />
                    </div>
                    <p className="text-center text-[11px] text-gray-400 mt-6">
                        Gratuit · Sans engagement · Hébergé en France 🇫🇷
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}