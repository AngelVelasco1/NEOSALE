"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import { getUserById } from "../services/api";

interface Address {
  id: number;
  address: string;
  city: string;
  country: string;
}

interface UserProfile {
  id: number;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  emailVerified: Date | null;
  identification?: string | null;
  role: "user" | "admin";
  password: string | null;
  addresses: Address[];
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
  const lastFetchedId = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserProfile =
    useCallback(async (): Promise<UserProfile | null> => {
      try {
        setIsLoading(true);

        if (session?.user?.id) {
          // Prevent redundant fetches
          if (lastFetchedId.current === session.user.id) {
            setIsLoading(false);
            return userProfile;
          }
          
          const data = await getUserById(Number(session.user.id));
          lastFetchedId.current = session.user.id;
          setUserProfile(data);
          return data;
        } else if (status !== 'loading') {
          lastFetchedId.current = null;
          setUserProfile(null);
          return null;
        }

        return null;
      } catch (err) {
        setUserProfile(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [session?.user?.id, status, userProfile]);

  useEffect(() => {
    if (!mounted) return;

    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    // Only fetch if we haven't fetched for this user yet
    if (session?.user?.id && lastFetchedId.current !== session.user.id) {
      fetchUserProfile();
    } else if (!session?.user?.id && lastFetchedId.current !== null) {
      // User logged out
      lastFetchedId.current = null;
      setUserProfile(null);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [mounted, status, session?.user?.id, fetchUserProfile]);

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
