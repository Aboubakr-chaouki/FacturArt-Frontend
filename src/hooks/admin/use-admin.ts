import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface AdminStats {
  totalUsers: number;
  totalInvoices: number;
  totalQuotes: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  invoicesThisMonth: number;
  totalSupportMessages: number;
  unreadSupportMessages: number;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  nomCommercial?: string;
  createdAt: string;
}

export interface SupportMessage {
  id: number;
  subject: string;
  content: string;
  senderEmail: string;
  senderName: string;
  isRead: boolean;
  createdAt: string;
  userId?: number;
}

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async (): Promise<AdminStats> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des stats');
    return res.json();
  }, []);

  const fetchUsers = useCallback(async (): Promise<UserResponse[]> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
    return res.json();
  }, []);

  const deleteUser = useCallback(async (userId: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression');
  }, []);

  const updateUserRole = useCallback(async (userId: number, role: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role?role=${role}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour du rôle');
    return res.json();
  }, []);

  const fetchMessages = useCallback(async (): Promise<SupportMessage[]> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/support/admin/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des messages');
    return res.json();
  }, []);

  const markMessageAsRead = useCallback(async (messageId: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/support/admin/messages/${messageId}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur lors du marquage comme lu');
  }, []);

  const deleteMessage = useCallback(async (messageId: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/support/admin/messages/${messageId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression du message');
  }, []);

  return {
    fetchStats,
    fetchUsers,
    deleteUser,
    updateUserRole,
    fetchMessages,
    markMessageAsRead,
    deleteMessage,
    loading,
    setLoading
  };
};
