import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useSupport = () => {
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    senderName: "",
    senderEmail: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFormData(prev => ({
          ...prev,
          senderName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          senderEmail: user.email || ""
        }));
        setIsLogged(true);
      } catch (e) {
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/support/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        toast.success("Votre message a bien été envoyé !");
        setFormData(prev => ({ ...prev, subject: "", content: "" }));
      } else {
        toast.error("Une erreur est survenue lors de l'envoi.");
      }
    } catch (error) {
      toast.error("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const resetSuccess = () => setSuccess(false);

  return {
    formData,
    setFormData,
    loading,
    success,
    isLogged,
    handleSubmit,
    resetSuccess
  };
}; 
