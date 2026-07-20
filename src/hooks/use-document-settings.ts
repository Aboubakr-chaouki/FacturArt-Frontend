import { useState, useEffect, useCallback, useMemo } from "react";
import { DocumentSettings, DEFAULT_DOCUMENT_SETTINGS } from "@/lib/configs/document-settings";
import { User } from "@/lib/configs/interface/user";
import { usersApi } from "@/api/users/users.api";

export function useDocumentSettings() {
  const [localSettings, setLocalSettings] = useState<Partial<DocumentSettings>>(() => {
    if (typeof window === "undefined") return {};
    
    const saved = localStorage.getItem("invoiceSettings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fonction pour recharger les données utilisateur fraîches du serveur
  const refreshUserData = useCallback(async (force = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const freshUser = await usersApi.getMe();
      
      // On compare avant de mettre à jour pour éviter des re-renders inutiles
      const currentCached = localStorage.getItem("user");
      const freshUserStr = JSON.stringify(freshUser);
      
      if (force || currentCached !== freshUserStr) {
        setUser(freshUser);
        localStorage.setItem("user", freshUserStr);
        
        // Mettre à jour aussi les réglages locaux pour synchroniser les préfixes
        const currentLocal = localStorage.getItem("invoiceSettings");
        const parsed = currentLocal ? JSON.parse(currentLocal) : {};
        
        const updatedLocal = {
          ...parsed,
          invoicePrefix: freshUser.invoicePrefix || parsed.invoicePrefix,
          quotePrefix: freshUser.quotePrefix || parsed.quotePrefix,
          primaryColor: freshUser.primaryColor || parsed.primaryColor,
          secondaryColor: freshUser.secondaryColor || parsed.secondaryColor,
          template: freshUser.documentTemplate?.toLowerCase() || parsed.template,
        };

        const updatedLocalStr = JSON.stringify(updatedLocal);
        if (currentLocal !== updatedLocalStr) {
          localStorage.setItem("invoiceSettings", updatedLocalStr);
          setLocalSettings(updatedLocal);
        }
        
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
    }
  }, []);

  // Écouter les changements dans le localStorage (pour synchronisation entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "invoiceSettings" && e.newValue) {
        setLocalSettings(JSON.parse(e.newValue));
      } else if (e.key === "user" && e.newValue) {
        try {
          const newUser = JSON.parse(e.newValue);
          setUser(newUser);
          setRefreshTrigger(prev => prev + 1);
        } catch (e) {
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Retirer user des dépendances

  // Fusion dynamique des réglages
  const settings = useMemo(() => {
    let merged = { ...DEFAULT_DOCUMENT_SETTINGS };
    
    // 1. Priorité aux infos du profil utilisateur (Données réelles)
    if (user) {
      merged = {
        ...merged,
        companyName: user.nomCommercial || merged.companyName,
        companyAddress: user.adresseSiege || merged.companyAddress,
        companyPhone: user.telephonePro || merged.companyPhone,
        companyEmail: user.emailPro || user.email || merged.companyEmail,
        siret: user.siret || merged.siret,
        tvaIntra: user.numeroTva || merged.tvaIntra,
        legalForm: user.formeJuridique || merged.legalForm,
        rcs: user.rcs || merged.rcs,
        capital: user.capital || merged.capital,
        logoUrl: (typeof user.logo === 'string' ? user.logo : merged.logoUrl) || merged.logoUrl,
        primaryColor: user.primaryColor || merged.primaryColor,
        secondaryColor: user.secondaryColor || merged.secondaryColor,
        invoicePrefix: user.invoicePrefix || merged.invoicePrefix,
        quotePrefix: user.quotePrefix || merged.quotePrefix,
        template: user.documentTemplate?.toLowerCase() || merged.template,
      };
    }

    // 2. Fusion avec les préférences de personnalisation locales (Surcharges explicites)
    // On ne prend les réglages locaux que s'ils ne sont pas vides et ne correspondent pas déjà à l'utilisateur
    const activeLocalSettings = Object.fromEntries(
      Object.entries(localSettings).filter(([key, v]) => {
        if (v === "" || v === undefined || v === null) return false;
        
        // Liste des champs qui doivent TOUJOURS venir du profil utilisateur s'il est présent
        const profileFields = [
          "companyName", "companyAddress", "companyPhone", "companyEmail", 
          "siret", "tvaIntra", "legalForm", "rcs", "capital", "logoUrl"
        ];
        
        if (user && profileFields.includes(key)) return false;
        
        // Si la valeur locale est identique à celle de l'utilisateur, on n'a pas besoin de surcharger
        if (key === "invoicePrefix" && v === user?.invoicePrefix) return false;
        if (key === "quotePrefix" && v === user?.quotePrefix) return false;
        if (key === "primaryColor" && v === user?.primaryColor) return false;
        if (key === "secondaryColor" && v === user?.secondaryColor) return false;
        
        return true;
      })
    );

    return { ...merged, ...activeLocalSettings };
  }, [user, localSettings, refreshTrigger]);

  const saveSettings = useCallback((newSettings: Partial<DocumentSettings>) => {
    setLocalSettings((prev) => {
      const merged = { ...(prev || {}), ...(newSettings || {}) } as Partial<DocumentSettings>;
      try {
        localStorage.setItem("invoiceSettings", JSON.stringify(merged));
      } catch (e) {
      }
      return merged;
    });
  }, []);

  return { 
    settings, 
    setSettings: setLocalSettings, 
    saveSettings,
    user,
    refreshUserData
  };
}
