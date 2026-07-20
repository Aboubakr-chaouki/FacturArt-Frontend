import { useState } from "react";
import { Controller } from "react-hook-form";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { Button }    from "@/components/ui/button";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Checkbox }  from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useLoginForm } from "@/app/login-page/hooks/use-login-form";
import { ROUTES } from "@/lib/configs/routes";

const G = { dark: "#0D3D2E", green: "#2ECC8E", light: "#E1F5EE" };

function PasswordField({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
            <div className="relative">
                <Input type={show ? "text" : "password"} placeholder="••••••••"
                       value={value} onChange={e => onChange(e.target.value)}
                       className={`h-11 pr-10 ${error ? "border-red-400" : ""}`}
                       autoComplete="current-password" />
                <button type="button" onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export function LoginForm() {
    const { form, serverError, onSubmit, isSubmitting } = useLoginForm();
    const { register, control, formState: { errors } } = form;

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse email</Label>
                <Input id="email" type="email" placeholder="jean.dupont@gmail.com"
                       className={`h-11 ${errors.email ? "border-red-400" : ""}`}
                       autoComplete="email" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
                    <a href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: G.dark }}>
                        Mot de passe oublié ?
                    </a>
                </div>
                <Controller name="password" control={control}
                            render={({ field }) => (
                                <PasswordField value={field.value} onChange={field.onChange} error={errors.password?.message} />
                            )} />
            </div>

            <div className="flex items-center gap-2.5">
                <Controller name="remember" control={control}
                            render={({ field }) => (
                                <Checkbox id="remember" checked={field.value} onCheckedChange={field.onChange} />
                            )} />
                <Label htmlFor="remember" className="text-sm text-gray-500 font-normal cursor-pointer">
                    Rester connecté pendant 7 jours
                </Label>
            </div>

            {serverError && (
                <div className="flex items-center gap-2.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {serverError}
                </div>
            )}

            <Button type="submit" className="w-full h-11 font-semibold text-white gap-2"
                    style={{ background: G.dark }} disabled={isSubmitting}>
                {isSubmitting
                    ? <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Connexion…</span>
                    : <span className="flex items-center gap-2">Se connecter <ArrowRight className="w-4 h-4" /></span>
                }
            </Button>

            <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-400">Pas encore de compte ?</span>
                <Separator className="flex-1" />
            </div>

            <Button variant="outline" className="w-full h-11 font-medium" asChild>
                <a href={ROUTES.register}>Créer un compte gratuit</a>
            </Button>
        </form>
    );
}