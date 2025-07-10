"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getUserById } from '../services/api'; // Ajusta la ruta si es necesario

interface UserProfile {
  name: string | null;
  email: string | null;
  phonenumber: string | null;
  identification?: string | null;
  password: string | null
  addresses: string[] | null;

}

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  setSelectedAddress: (addressIndex: string) => void;
  selectedAddress: string | undefined;
  reFetchUserProfile: () => UserProfile
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

  const fetchUserProfile = useCallback(async() => {
    try {
      setIsLoading(true);
      if (session?.user?.id) {
        const data = await getUserById(Number(session.user.id));
    
        setUserProfile(data);


      } else if (status !== 'loading') {
        setIsLoading(false);
      }

    } catch (err) {
      console.error(err)
    }
    finally {
      setIsLoading(false)
    }
  }, [session?.user?.id, status])

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile, session?.user?.id])
  const value = { userProfile, isLoading, setSelectedAddress, selectedAddress, reFetchUserProfile: fetchUserProfile};

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
