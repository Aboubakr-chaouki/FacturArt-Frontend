import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SupportFormProps {
  formData: {
    subject: string;
    content: string;
    senderName: string;
    senderEmail: string;
  };
  setFormData: (data: any) => void;
  loading: boolean;
  success: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  resetSuccess: () => void;
}

export const SupportForm = ({
  formData,
  setFormData,
  loading,
  success,
  handleSubmit,
  resetSuccess
}: SupportFormProps) => {
  if (success) {
    return (
      <div className="bg-green-50 text-green-700 p-6 rounded-lg mb-4 border border-green-100 flex flex-col items-center text-center gap-3">
        <CheckCircle className="size-12 text-green-500" />
        <div>
          <p className="font-semibold text-lg">Message envoyé !</p>
          <p className="text-sm opacity-90">Nous vous répondrons dans les plus brefs délais sur votre adresse email.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetSuccess} className="mt-2">
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Votre Nom</label>
          <Input
            required
            value={formData.senderName}
            onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            placeholder="Jean Dupont"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Votre Email</label>
          <Input
            required
            type="email"
            value={formData.senderEmail}
            onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
            placeholder="jean@exemple.com"
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Sujet</label>
        <Input
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Problème avec une facture"
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Message</label>
        <Textarea
          required
          rows={5}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Détaillez votre demande ici..."
          className="rounded-xl resize-none"
        />
      </div>
      <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
        {loading ? "Envoi en cours..." : <><Send className="mr-2 h-4 w-4" /> Envoyer la demande</>}
      </Button>
    </form>
  );
}; 
