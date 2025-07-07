"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { getUserById } from '../services/api'; // Ajusta la ruta si es necesario

// 1. Definimos la forma de los datos del usuario que queremos compartir
interface UserProfile {
  phonenumber: string | null;
  // Puedes añadir más datos del usuario aquí si los necesitas en el futuro
  // email: string | null;
  // name: string | null;
}

// 2. Definimos la forma del contexto
interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
}

// 3. Creamos el contexto con un valor por defecto
const UserContext = createContext<UserContextType | undefined>(undefined);

// 4. Creamos el componente Proveedor (Provider)
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      setIsLoading(true);
      getUserById(Number(session.user.id))
        .then(user => {
          if (user) {
            setUserProfile({ phonenumber: user.phonenumber || 'No especificado' });
          }
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          setUserProfile({ phonenumber: 'Error al cargar' });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (status !== 'loading') {
      // Si no hay sesión o la sesión está cargando, terminamos la carga
      setIsLoading(false);
    }
  }, [session, status]);

  const value = { userProfile, isLoading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
