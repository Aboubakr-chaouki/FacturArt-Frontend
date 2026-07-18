import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { colors } from "@/styles/theme";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: colors.green }} />
                
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="flex gap-4 items-start mb-5">
                    <div className="p-2.5 rounded-xl bg-green-50 text-green-600 shrink-0">
                        <Cookie size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Cookies & Confidentialité</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mt-1">
                            Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic. 
                            En continuant, vous acceptez notre <a href="/privacy" className="text-green-600 hover:underline font-medium">politique de confidentialité</a>.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleAccept}
                        className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "#0A1628" }}
                    >
                        Tout accepter
                    </button>
                    <button
                        onClick={handleDecline}
                        className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 text-sm"
                    >
                        Refuser
                    </button>
                </div>
            </div>
        </div>
    );
}
