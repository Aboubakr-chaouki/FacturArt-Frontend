import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import {
    step1Schema, step2Schema,
    Step1Values, Step2Values,
} from "@/lib/configs/schemas-zod/form/register-form-schema"
import { authApi } from "@/api/auth/auth.api"
import { ROUTES } from "@/lib/configs/routes"
import { useAppToast } from "@/hooks/common/use-app-toast"
import { AxiosError } from "axios"

export function useRegisterForm() {
    const navigate = useNavigate()
    const toast = useAppToast()
    const [step, setStep]               = useState<1 | 2>(1)
    const [serverError, setServerError] = useState<string | null>(null)
    const [step1Data, setStep1Data]     = useState<Step1Values | null>(null)
    const [isSuccess, setIsSuccess]     = useState(false)
    const [isSubmittingConfirm, setIsSubmittingConfirm] = useState(false)
    const [confirmError, setConfirmError] = useState<string | null>(null)

    const form1 = useForm<Step1Values>({
        resolver:      zodResolver(step1Schema),
        defaultValues: {
            firstName: "",
            lastName:  "",
            email:     "",
            password:  "",
            confirm:   "",
            accepted:  false,
        },
    })

    const form2 = useForm<Step2Values>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            nomCommercial:  "",
            formeJuridique: "Auto-entrepreneur",
            siret:          "",
            codeApe:        "",
            numeroTva:      "",
            adresseSiege:   "",
            telephonePro:   "",
            emailPro:       "",
            logo:           undefined,
            iban:           "",
            exonerationTva: false,
        },
    })

    const onStep1Submit = form1.handleSubmit(data => {
        setStep1Data(data)
        setStep(2)
    })

    const onStep2Submit = form2.handleSubmit(async data => {
        if (!step1Data) return
        setServerError(null)
        try {
            // Le logo est une FileList ou undefined
            const logoFile = data.logo instanceof FileList && data.logo.length > 0 
                ? data.logo[0] 
                : undefined;

            const payload = { 
                ...step1Data, 
                ...data,
                logo: logoFile
            }
            await authApi.register(payload)
            setIsSuccess(true)
            toast.success("Code envoyé !", `Un code de confirmation a été envoyé à ${payload.email}.`)
        } catch (error) {
            const axiosError = error as AxiosError<{message: string}>;
            const msg = axiosError.response?.data?.message || "Une erreur est survenue lors de l'inscription."
            setServerError(msg)
            toast.error("Erreur", msg)
        }
    })

    const goBack = () => setStep(1)

    const onConfirmSubmit = async (code: string) => {
        setIsSubmittingConfirm(true)
        setConfirmError(null)
        try {
            const email = form1.getValues("email")
            await authApi.confirm(email, code)
            toast.success("Compte confirmé !", "Votre compte a été activé. Vous pouvez maintenant vous connecter.")
            navigate(ROUTES.login + "?confirmed=true")
        } catch (error) {
            const axiosError = error as AxiosError<{message: string}>;
            const msg = axiosError.response?.data?.message || "Code de confirmation invalide."
            setConfirmError(msg)
            toast.error("Code invalide", msg)
        } finally {
            setIsSubmittingConfirm(false)
        }
    }

    return {
        step,
        form1,
        form2,
        serverError,
        isSuccess,
        isSubmittingConfirm,
        confirmError,
        onStep1Submit,
        onStep2Submit,
        onConfirmSubmit,
        goBack,
        isSubmitting1: form1.formState.isSubmitting,
        isSubmitting2: form2.formState.isSubmitting,
    }
}