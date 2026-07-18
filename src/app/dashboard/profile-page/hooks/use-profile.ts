import React, { useState, useEffect } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileFormSchema, type ProfileFormValues } from "@/lib/configs/schemas-zod/form/profile-form-schema"
import { User } from "@/lib/configs/interface/user"
import { usersApi } from "@/api/users/users.api"
import { BASE_URL } from "@/api/api.config"
import { AxiosError } from "axios"
import { useAppToast } from "@/hooks/common/use-app-toast"
import { useNavigate } from "react-router-dom"
import { useDocumentSettings } from "@/hooks/use-document-settings"

export interface UseProfileReturn {
    form: UseFormReturn<ProfileFormValues>;
    loading: boolean;
    saving: boolean;
    logoPreview: string | null;
    logoFile: File | undefined;
    exonerationTva: boolean;
    formeJuridique: ProfileFormValues["formeJuridique"];
    isAutoEntrepreneur: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    onDeleteAccount: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [logoFile, setLogoFile] = useState<File | undefined>()
    const toast = useAppToast()
    const navigate = useNavigate()
    const { refreshUserData } = useDocumentSettings()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        shouldUnregister: false,
        defaultValues: {
            exonerationTva: false,
        }
    })

    const { reset, watch } = form

    const exonerationTva = watch("exonerationTva")
    const formeJuridique = watch("formeJuridique")
    const isAutoEntrepreneur = formeJuridique === "Auto-entrepreneur"

    useEffect(() => {
        async function loadProfile() {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')

                // Vérification du token
                if (!token) {
                    const cachedUser = localStorage.getItem('user')
                    if (cachedUser) {
                        const user = JSON.parse(cachedUser)
                        populateForm(user)
                    } else {
                        toast.error("Session expirée", "Veuillez vous reconnecter.")
                        navigate('/login')
                    }
                    return
                }

                const user = await usersApi.getMe()

                populateForm(user)
                localStorage.setItem('user', JSON.stringify(user))

            } catch (error) {
                const err = error as AxiosError

                if (err.response?.status === 403 || err.response?.status === 401) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    toast.error("Session expirée", "Veuillez vous reconnecter.")
                    navigate('/login')
                } else {
                    // Fallback: charger depuis localStorage si l'API échoue
                    const cachedUser = localStorage.getItem('user')
                    if (cachedUser) {
                        populateForm(JSON.parse(cachedUser))
                        toast.warning("Données en cache", "Les informations affichées sont les dernières enregistrées.")
                    } else {
                        toast.error("Erreur", "Impossible de charger votre profil. Veuillez réessayer.")
                    }
                }
            } finally {
                setLoading(false)
            }
        }

        function populateForm(user: User) {
            const formData: ProfileFormValues = {
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                nomCommercial: user.nomCommercial || "",
                formeJuridique: user.formeJuridique as ProfileFormValues["formeJuridique"],
                siret: user.siret || "",
                codeApe: user.codeApe || "",
                numeroTva: user.numeroTva || "",
                adresseSiege: user.adresseSiege || "",
                telephonePro: user.telephonePro || "",
                emailPro: user.emailPro || "",
                iban: user.iban || "",
                rcs: user.rcs || "",
                capital: user.capital || "",
                exonerationTva: !!user.exonerationTva,
                documentTemplate: user.documentTemplate || "CLASSIC",
                primaryColor: user.primaryColor || "#0D3D2E",
                secondaryColor: user.secondaryColor || "#2ECC8E",
            }

            reset(formData)

            if (user.logo && typeof user.logo === 'string') {
                setLogoPreview(user.logo.startsWith('http') ? user.logo : `${BASE_URL}${user.logo}`)
            }
        }

        loadProfile()
    }, [reset, toast, navigate])

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    const onSubmit = async (data: ProfileFormValues) => {
        setSaving(true)
        try {
            const updatedUser = await usersApi.updateProfile(data, logoFile)
            localStorage.setItem('user', JSON.stringify(updatedUser))
            
            if (updatedUser.logo && typeof updatedUser.logo === 'string') {
                setLogoPreview(updatedUser.logo.startsWith('http') ? updatedUser.logo : `${BASE_URL}${updatedUser.logo}`)
            }
            
            // Rafraîchir les données utilisateur dans les documents settings pour mettre à jour le logo dans les factures/devis
            await refreshUserData()

            toast.success("Profil mis à jour", "Vos informations ont été enregistrées avec succès.")
        } catch (error) {
            const err = error as AxiosError
            if (err.response?.status === 403 || err.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                toast.error("Session expirée", "Veuillez vous reconnecter.")
                navigate('/login')
            } else {
                toast.error("Erreur", "Une erreur est survenue lors de la mise à jour.")
            }
        } finally {
            setSaving(false)
        }
    }

    const onDeleteAccount = async () => {
        try {
            setSaving(true)
            
            // 1. Télécharger l'archive PDF
            toast.info("Génération de l'archive", "Veuillez patienter pendant que nous préparons votre récapitulatif...")
            const blob = await usersApi.downloadArchive()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'recapitulatif_cloture_facturart.pdf')
            document.body.appendChild(link)
            link.click()
            link.remove()
            
            // 2. Supprimer le compte
            await usersApi.deleteMe()
            
            // 3. Nettoyer et rediriger
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            toast.success("Compte supprimé", "Votre compte et vos données ont été supprimés. L'archive a été téléchargée.")
            navigate('/')
        } catch (error) {
            toast.error("Erreur", "Impossible de supprimer votre compte. Veuillez réessayer.")
        } finally {
            setSaving(false)
        }
    }

    return {
        form,
        loading,
        saving,
        logoPreview,
        logoFile,
        exonerationTva,
        formeJuridique,
        isAutoEntrepreneur,
        onFileChange,
        onSubmit: form.handleSubmit(onSubmit),
        onDeleteAccount
    }
}
