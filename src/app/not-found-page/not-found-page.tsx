import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/configs/routes";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="text-8xl font-black mb-4" style={{ color: "#E1F5EE" }}>404</p>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
                <p className="text-sm text-gray-400 mb-8">Cette page n'existe pas ou a été déplacée.</p>
                <Button className="gap-2 text-white rounded-full" style={{ background: "#0D3D2E" }} asChild>
                    <a href={ROUTES.home}>
                        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
                    </a>
                </Button>
            </div>
        </div>
    );
}