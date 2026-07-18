import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {loginFormSchema, LoginFormValues} from "@/lib/configs/schemas-zod/form/login-form-schema.ts";
import { authApi } from "@/api/auth/auth.api";
import { ROUTES } from "@/lib/configs/routes";
import { useAppToast } from "@/hooks/common/use-app-toast";

export function useLoginForm() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const toast = useAppToast();

    const form = useForm<LoginFormValues>({
        resolver:      zodResolver(loginFormSchema),
        defaultValues: { email: "", password: "", remember: false },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setServerError(null);
        try {
            const trimmedData = {
                ...data,
                email: data.email.trim().toLowerCase()
            };
            const response = await authApi.login(trimmedData);
            const user = response.user;
            toast.success(`Bienvenue, ${user.firstName || 'Utilisateur'} !`, "Vous êtes maintenant connecté.");
            
            if (user.role === 'ROLE_ADMIN') {
                navigate(ROUTES.admin.dashboard, { replace: true });
            } else {
                navigate(ROUTES.dashboard, { replace: true });
            }
        } catch (error: unknown) {
            let msg = "Une erreur est survenue lors de la connexion.";
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                msg = axiosError.response?.data?.message || "Email ou mot de passe incorrect.";
            }
            setServerError(msg);
            toast.error("Échec de connexion", msg);
        }
    };

    return {
        form,
        serverError,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting: form.formState.isSubmitting,
    };
}