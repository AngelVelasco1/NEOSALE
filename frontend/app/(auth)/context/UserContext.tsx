"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { getUserById } from "../services/api";

interface UserProfile {
  id: number;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  email_verified: Date | null;
  identification?: string | null;
  role: "user" | "admin";
  password: string | null;
  addresses: string[] | null;
  image?: string | null;
}

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  setSelectedAddress: (addressIndex: string) => void;
  selectedAddress: string | undefined;
  reFetchUserProfile: () => Promise<UserProfile | null>;
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserProfile =
    useCallback(async (): Promise<UserProfile | null> => {
      try {
        setIsLoading(true);

        if (session?.user?.id) {
          const data = await getUserById(Number(session.user.id));
          setUserProfile(data);
          return data;
        } else if (status !== 'loading') {
          setUserProfile(null);
          return null;
        }

        return null;
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUserProfile(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [session?.user?.id, status]);

  useEffect(() => {
    if (!mounted) return;

    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    fetchUserProfile();
  }, [mounted, fetchUserProfile, status]);

  const defaultValue: UserContextType = {
    userProfile: null,
    isLoading: true,
    setSelectedAddress: () => { },
    selectedAddress: undefined,
    reFetchUserProfile: async () => null,
  };

  if (!mounted) {
    return (
      <UserContext.Provider value={defaultValue}>
        {children}
      </UserContext.Provider>
    );
  }

  const value: UserContextType = {
    userProfile,
    isLoading,
    setSelectedAddress,
    selectedAddress,
    reFetchUserProfile: fetchUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
