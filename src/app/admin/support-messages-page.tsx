import { useEffect, useState } from 'react';
import { useAdmin, SupportMessage } from '@/hooks/admin/use-admin';
import { DeleteConfirmModal } from '@/components/delete-confirm-modal';
import { useAppToast } from '@/hooks/common/use-app-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, Mail, MessageSquare, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminSupportMessagesPage = () => {
  const { fetchMessages, markMessageAsRead, deleteMessage } = useAdmin();
  const { success, error } = useAppToast();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markMessageAsRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      if (selectedMessage?.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null);
      }
      success("Message marqué comme lu");
    } catch {
      error("Erreur lors de la mise à jour");
    }
  };

  const handleOpenMessage = (msg: SupportMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    if (!msg.isRead) {
      handleMarkAsRead(msg.id);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    
    try {
      await deleteMessage(deleteModal.id);
      setMessages(messages.filter(m => m.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null });
      if (selectedMessage?.id === deleteModal.id) {
          setIsModalOpen(false);
      }
      success("Message supprimé avec succès");
    } catch {
      error("Erreur lors de la suppression");
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
            <Clock className="h-8 w-8" />
            <p>Chargement des messages...</p>
        </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages Support</h1>
          <p className="text-muted-foreground">Gérez les demandes d'assistance des artisans.</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="bg-primary/10 rounded-3xl text-primary border-primary/20">
                {messages.filter(m => !m.isRead).length} Non lus
            </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Statut</TableHead>
                <TableHead>Expéditeur</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          Aucun message de support pour le moment.
                      </TableCell>
                  </TableRow>
              ) : (
                  messages.map((msg) => (
                    <TableRow 
                      key={msg.id} 
                      className={`cursor-pointer transition-colors ${msg.isRead ? 'opacity-60 hover:bg-muted/50' : 'bg-primary/5 hover:bg-primary/10'}`}
                      onClick={() => handleOpenMessage(msg)}
                    >
                      <TableCell>
                        {msg.isRead ? (
                          <Badge variant="secondary" className="rounded-full">Lu</Badge>
                        ) : (
                          <Badge variant="default" className="rounded-full">Nouveau</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{msg.senderName}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {msg.senderEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              {msg.subject}
                          </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate" title={msg.content}>
                        {msg.content}
                      </TableCell>
                      <TableCell>
                          {new Date(msg.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        {!msg.isRead && (
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => handleMarkAsRead(msg.id)}
                            title="Marquer comme lu"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => handleDelete(msg.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
                <Badge variant={selectedMessage?.isRead ? "secondary" : "default"} className="rounded-full">
                    {selectedMessage?.isRead ? "Déjà traité" : "Nouveau message"}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedMessage && new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
            </div>
            <DialogTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {selectedMessage?.subject}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex flex-col gap-4 bg-muted/50 p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">{selectedMessage?.senderName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {selectedMessage?.senderEmail}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Message</p>
                <div className="bg-muted/30 p-4 rounded-lg border shadow-sm min-h-[150px] whitespace-pre-wrap text-foreground">
                    {selectedMessage?.content}
                </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Fermer</Button>
            <Button 
                variant="destructive" 
                className="gap-2"
                onClick={() => {
                    if (selectedMessage) {
                        handleDelete(selectedMessage.id);
                    }
                }}
            >
                <Trash2 className="h-4 w-4" />
                Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title="Supprimer le message"
        description="Voulez-vous vraiment supprimer ce message de support"
        itemName={messages.find(m => m.id === deleteModal.id)?.subject || ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default AdminSupportMessagesPage;
