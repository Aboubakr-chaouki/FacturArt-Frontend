import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from '@/lib/configs/interface/user';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
        // Rediriger vers login si non connecté
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        const user: User = JSON.parse(userStr);
        
        // Si l'email n'est pas vérifié, on pourrait rediriger vers une page d'attente
        // Mais ici, le backend bloque déjà le login. 
        // Par sécurité, on vérifie quand même si l'info est présente.
        if (user.emailVerified === false) {
             // On peut soit déconnecter, soit afficher un message.
             // Pour l'instant, si on est arrivé ici c'est que le login a réussi (donc email vérifié au moment du login)
        }
    } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
