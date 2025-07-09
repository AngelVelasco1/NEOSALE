"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { getUserById } from '../services/api'; // Ajusta la ruta si es necesario

interface UserProfile {
  phonenumber: string | null;
  addresses: string[] | null;

}

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  setSelectedAddress: (addressIndex: string) => void;
  selectedAddress: string | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      setIsLoading(true);
      getUserById(Number(session.user.id))
        .then(user => {
          if (user) {
            setUserProfile({ phonenumber: user.phonenumber, addresses: user.addresses});
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
      setIsLoading(false);
    }
  }, [status]);

  const value = { userProfile, isLoading, setSelectedAddress, selectedAddress };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
