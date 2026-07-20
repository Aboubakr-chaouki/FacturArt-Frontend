import React, { useState } from "react"
import { Controller } from "react-hook-form"
import { Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, Check, Building2, User } from "lucide-react"
import { Button }    from "@/components/ui/button"
import { Input }     from "@/components/ui/input"
import { Label }     from "@/components/ui/label"
import { Checkbox }  from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useRegisterForm } from "@/app/register-page/hooks/use-register-form"
import { STATUS_JURIDIQUE } from "@/lib/configs/enums/status-juridique.enums"
import { ROUTES } from "@/lib/configs/routes"
import { MailCheck } from "lucide-react"

const G = { dark: "#0D3D2E", green: "#2ECC8E", light: "#E1F5EE" }

// ─── Password field ───────────────────────────────────────────────────────────
function PasswordField({ value, onChange, error, autoComplete, placeholder = "••••••••", onBlur, name, ref }: {
    value: string
    onChange: (v: string) => void
    error?: string
    autoComplete: string
    placeholder?: string
    onBlur?: () => void
    name?: string
    ref?: React.Ref<HTMLInputElement>
}) {
    const [show, setShow] = useState(false)
    return (
        <div className="space-y-1.5">
            <div className="relative">
                <Input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                    className={`h-11 pr-10 ${error ? "border-red-400" : ""}`}
                    autoComplete={autoComplete}
                />
                <button type="button" onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

// ─── Indicateur d'étapes ──────────────────────────────────────────────────────
function StepIndicator({ current }: { current: 1 | 2 }) {
    return (
        <div className="flex items-center gap-3 mb-8">
            {[
                { n: 1, label: "Compte", icon: User },
                { n: 2, label: "Entreprise", icon: Building2 },
            ].map(({ n, label, icon: Icon }, i) => (
                <div key={n} className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                             style={{
                                 background: current >= n ? G.dark : "#E5E7EB",
                                 color:      current >= n ? "white" : "#9CA3AF",
                             }}>
                            {current > n ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-medium" style={{ color: current >= n ? G.dark : "#9CA3AF" }}>
                            {label}
                        </span>
                    </div>
                    {i < 1 && (
                        <div className="flex-1 h-px mx-2" style={{ background: current > 1 ? G.dark : "#E5E7EB" }} />
                    )}
                </div>
            ))}
        </div>
    )
}

// ─── Étape 1 — Informations personnelles ─────────────────────────────────────
function Step1({ form1, onStep1Submit, isSubmitting1, serverError }: {
    form1: ReturnType<typeof useRegisterForm>["form1"]
    onStep1Submit: () => void
    isSubmitting1: boolean
    serverError: string | null
}) {
    const { register, control, formState: { errors } } = form1

    return (
        <form onSubmit={onStep1Submit} className="space-y-4">
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">Prénom *</Label>
                    <Input id="firstName" placeholder="Jean" className={`h-11 ${errors.firstName ? "border-red-400" : ""}`}
                           autoComplete="given-name" {...register("firstName")} />
                    {errors.firstName && <p className="text-xs text-red-500">{String(errors.firstName.message)}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Nom *</Label>
                    <Input id="lastName" placeholder="Dupont" className={`h-11 ${errors.lastName ? "border-red-400" : ""}`}
                           autoComplete="family-name" {...register("lastName")} />
                    {errors.lastName && <p className="text-xs text-red-500">{String(errors.lastName.message)}</p>}
                </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse email *</Label>
                <Input id="email" type="email" placeholder="jean.dupont@gmail.com"
                       className={`h-11 ${errors.email ? "border-red-400" : ""}`}
                       autoComplete="email" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{String(errors.email.message)}</p>}
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Mot de passe *</Label>
                <Controller name="password" control={control}
                            render={({ field }) => (
                                <PasswordField {...field}
                                               error={String(errors.password?.message || "")} autoComplete="new-password" />
                            )} />
                <p className="text-xs text-gray-400">8 caractères minimum</p>
            </div>

            {/* Confirmation */}
            <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Confirmer le mot de passe *</Label>
                <Controller name="confirm" control={control}
                            render={({ field }) => (
                                <PasswordField {...field}
                                               error={String(errors.confirm?.message || "")} autoComplete="new-password" />
                            )} />
            </div>

            {/* CGU */}
            <div className="space-y-1.5 pt-1">
                <div className="flex items-start gap-2.5">
                    <Controller name="accepted" control={control}
                                render={({ field }) => (
                                    <Checkbox id="accepted" checked={field.value} className="mt-0.5"
                                              onCheckedChange={v => field.onChange(!!v)} />
                                )} />
                    <Label htmlFor="accepted" className="text-sm text-gray-500 font-normal leading-relaxed cursor-pointer">
                        J'accepte les{" "}
                        <a href="/legal" className="underline font-medium" style={{ color: G.dark }}>conditions d'utilisation</a>
                        {" "}et la{" "}
                        <a href="/privacy" className="underline font-medium" style={{ color: G.dark }}>politique de confidentialité</a>.
                    </Label>
                </div>
                {errors.accepted && <p className="text-xs text-red-500">{String(errors.accepted.message)}</p>}
            </div>

            {serverError && (
                <div className="flex items-center gap-2.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
                </div>
            )}

            <Button type="submit" className="w-full h-11 font-semibold text-white gap-2"
                    style={{ background: G.dark }} disabled={isSubmitting1}>
                {isSubmitting1
                    ? <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>Vérification…
                      </span>
                    : <span className="flex items-center gap-2">
                        Continuer vers l'entreprise <ArrowRight className="w-4 h-4" />
                      </span>
                }
            </Button>

            <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-400">Déjà un compte ?</span>
                <Separator className="flex-1" />
            </div>

            <Button variant="outline" className="w-full h-11 font-medium" asChild>
                <a href={ROUTES.login}>Se connecter</a>
            </Button>
        </form>
    )
}

// ─── Étape 2 — Informations entreprise ───────────────────────────────────────
function Step2({ form2, onStep2Submit, isSubmitting2, serverError, goBack }: {
    form2: ReturnType<typeof useRegisterForm>["form2"]
    onStep2Submit: () => void
    isSubmitting2: boolean
    serverError: string | null
    goBack: () => void
}) {
    const { register, control, watch, formState: { errors } } = form2
    const isAutoEntrepreneur = watch("formeJuridique") === "Auto-entrepreneur"

    return (
        <form onSubmit={onStep2Submit} className="space-y-4">

            {/* Nom commercial */}
            <div className="space-y-1.5">
                <Label htmlFor="nomCommercial" className="text-sm font-medium text-gray-700">
                    Nom commercial / Raison sociale *
                </Label>
                <Input id="nomCommercial" placeholder="Électricité Dupont"
                       className={`h-11 ${errors.nomCommercial ? "border-red-400" : ""}`}
                       {...register("nomCommercial")} />
                {errors.nomCommercial && <p className="text-xs text-red-500">{String(errors.nomCommercial.message)}</p>}
                <p className="text-xs text-gray-400">Apparaît sur vos devis et factures</p>
            </div>

            {/* Forme juridique */}
            <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Forme juridique *</Label>
                <Controller name="formeJuridique" control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className={`h-11 ${errors.formeJuridique ? "border-red-400" : ""}`}>
                                        <SelectValue placeholder="Sélectionnez votre statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_JURIDIQUE.map(f => (
                                            <SelectItem key={f} value={f}>{f}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )} />
                {errors.formeJuridique && <p className="text-xs text-red-500">{String(errors.formeJuridique.message)}</p>}
            </div>

            {/* SIRET + Code APE */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="siret" className="text-sm font-medium text-gray-700">SIRET *</Label>
                    <Input id="siret" placeholder="12345678901234" maxLength={14}
                           className={`h-11 ${errors.siret ? "border-red-400" : ""}`}
                           {...register("siret")} />
                    {errors.siret && <p className="text-xs text-red-500">{String(errors.siret.message)}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="codeApe" className="text-sm font-medium text-gray-700">
                        Code APE <span className="text-gray-400 font-normal">(facultatif)</span>
                    </Label>
                    <Input id="codeApe" placeholder="4321A" maxLength={10} className="h-11"
                           {...register("codeApe")} />
                </div>
            </div>

            {/* N° TVA — masqué si auto-entrepreneur */}
            {!isAutoEntrepreneur && (
                <div className="space-y-1.5">
                    <Label htmlFor="numeroTva" className="text-sm font-medium text-gray-700">
                        N° TVA intracommunautaire <span className="text-gray-400 font-normal">(facultatif)</span>
                    </Label>
                    <Input id="numeroTva" placeholder="FR12345678901" maxLength={20} className="h-11"
                           {...register("numeroTva")} />
                </div>
            )}

            {/* Exonération TVA — auto si auto-entrepreneur */}
            <div className="space-y-1.5">
                <div className="flex items-start gap-2.5 rounded-lg border p-3"
                     style={{ background: isAutoEntrepreneur ? "#F0FDF4" : "transparent" }}>
                    <Controller name="exonerationTva" control={control}
                                render={({ field }) => (
                                    <Checkbox id="exonerationTva" checked={field.value}
                                              onCheckedChange={v => field.onChange(!!v)}
                                              className="mt-0.5" />
                                )} />
                    <div>
                        <Label htmlFor="exonerationTva" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Exonéré de TVA
                        </Label>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Mention "TVA non applicable, art. 293B du CGI" sur vos documents
                        </p>
                    </div>
                </div>
            </div>

            {/* Adresse siège */}
            <div className="space-y-1.5">
                <Label htmlFor="adresseSiege" className="text-sm font-medium text-gray-700">
                    Adresse du siège social *
                </Label>
                <Input id="adresseSiege" placeholder="123 Rue de la Paix, 75001 Paris"
                       className={`h-11 ${errors.adresseSiege ? "border-red-400" : ""}`}
                       {...register("adresseSiege")} />
                {errors.adresseSiege && <p className="text-xs text-red-500">{String(errors.adresseSiege.message)}</p>}
            </div>

            {/* Téléphone + Email pro */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="telephonePro" className="text-sm font-medium text-gray-700">
                        Téléphone professionnel *
                    </Label>
                    <Input id="telephonePro" placeholder="0601020304"
                           className={`h-11 ${errors.telephonePro ? "border-red-400" : ""}`}
                           {...register("telephonePro")} />
                    {errors.telephonePro && <p className="text-xs text-red-500">{String(errors.telephonePro.message)}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="emailPro" className="text-sm font-medium text-gray-700">
                        Email professionnel <span className="text-gray-400 font-normal">(facultatif)</span>
                    </Label>
                    <Input id="emailPro" type="email" placeholder="contact@monentreprise.fr"
                           className="h-11" {...register("emailPro")} />
                    {errors.emailPro && <p className="text-xs text-red-500">{String(errors.emailPro.message)}</p>}
                </div>
            </div>

            {/* Logo */}
            <div className="space-y-1.5">
                <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
                    Logo de l'entreprise <span className="text-gray-400 font-normal">(facultatif)</span>
                </Label>
                <Input id="logo" type="file" accept="image/*"
                       className={`h-11 ${errors.logo ? "border-red-400" : ""}`}
                       {...register("logo")} />
                {errors.logo && <p className="text-xs text-red-500">{String(errors.logo.message)}</p>}
            </div>

            {/* IBAN */}
            <div className="space-y-1.5">
                <Label htmlFor="iban" className="text-sm font-medium text-gray-700">
                    IBAN <span className="text-gray-400 font-normal">(facultatif)</span>
                </Label>
                <Input id="iban" placeholder="FR76 1234 5678 9012 3456 7890 123"
                       className={`h-11 ${errors.iban ? "border-red-400" : ""}`}
                       {...register("iban")} />
                {errors.iban && <p className="text-xs text-red-500">{String(errors.iban.message)}</p>}
            </div>

            {serverError && (
                <div className="flex items-center gap-2.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
                </div>
            )}

            <div className="flex gap-3">
                <Button type="button" variant="outline" className="h-11 gap-2" onClick={goBack}>
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Button>
                <Button type="submit" className="flex-1 h-11 font-semibold text-white gap-2"
                        style={{ background: G.dark }} disabled={isSubmitting2}>
                    {isSubmitting2
                        ? <span className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                            </svg>Création…
                          </span>
                        : <span className="flex items-center gap-2">
                            Créer mon compte <ArrowRight className="w-4 h-4" />
                          </span>
                    }
                </Button>
            </div>
        </form>
    )
}

// ─── Étape de Confirmation ──────────────────────────────────────────────────
function StepConfirm({ email, onConfirm, isSubmitting, error }: {
    email: string
    onConfirm: (code: string) => void
    isSubmitting: boolean
    error: string | null
}) {
    const [code, setCode] = useState("")

    return (
        <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <MailCheck className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold" style={{ color: G.dark }}>Vérifiez votre boîte mail</h2>
                <p className="text-gray-600 max-w-sm mx-auto">
                    Nous avons envoyé un code de confirmation à <br/>
                    <span className="font-semibold text-gray-900">{email}</span>
                </p>
            </div>

            <div className="space-y-4 max-w-[280px] mx-auto">
                <div className="space-y-1.5 text-left">
                    <Label htmlFor="code" className="text-sm font-medium text-gray-700">Code de confirmation</Label>
                    <Input 
                        id="code" 
                        placeholder="000000" 
                        className="h-12 text-center text-2xl tracking-[10px] font-bold"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                )}

                <Button 
                    onClick={() => onConfirm(code)} 
                    className="w-full h-11 font-semibold text-white"
                    style={{ background: G.dark }}
                    disabled={isSubmitting || code.length !== 6}
                >
                    {isSubmitting ? "Vérification..." : "Confirmer mon compte"}
                </Button>
            </div>
            
            <p className="text-sm text-gray-500">
                Vous n'avez pas reçu l'email ? <br/>
                <button className="font-medium underline mt-1" style={{ color: G.dark }}>Renvoyer le code</button>
            </p>
        </div>
    )
}

// ─── Composant principal ──────────────────────────────────────────────────────
export function RegisterForm() {
    const {
        step, form1, form2, serverError, isSuccess,
        isSubmittingConfirm, confirmError,
        onStep1Submit, onStep2Submit, onConfirmSubmit, goBack,
        isSubmitting1, isSubmitting2,
    } = useRegisterForm()

    if (isSuccess) {
        return (
            <StepConfirm 
                email={form1.getValues("email")}
                onConfirm={onConfirmSubmit}
                isSubmitting={isSubmittingConfirm}
                error={confirmError}
            />
        )
    }

    return (
        <>
            <StepIndicator current={step} />

            {step === 1 ? (
                <Step1
                    form1={form1}
                    onStep1Submit={onStep1Submit}
                    isSubmitting1={isSubmitting1}
                    serverError={serverError}
                />
            ) : (
                <Step2
                    form2={form2}
                    onStep2Submit={onStep2Submit}
                    isSubmitting2={isSubmitting2}
                    serverError={serverError}
                    goBack={goBack}
                />
            )}
        </>
    )
}