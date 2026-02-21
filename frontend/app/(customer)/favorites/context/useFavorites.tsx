"use client";

import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  getUserFavoritesApi,
  type Favorite,
} from "../services/favoritesApi";

interface FavoritesContextType {
  favoritesCount: number;
  refreshFavoritesCount: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [favoritesCount, setFavoritesCount] = useState(0);
  
  const userId = session?.user?.id ? parseInt(session.user.id) : undefined;

  const refreshFavoritesCount = async () => {
    if (status === "loading") return;

    if (!userId) {
      setFavoritesCount(0);
      return;
    }

    try {
      const favoritesData = await getUserFavoritesApi(userId);
      setFavoritesCount(favoritesData?.length || 0);
    } catch (error) {
      
      setFavoritesCount(0);
    }
  };

  useEffect(() => {
    refreshFavoritesCount();
  }, [userId, status]);

  return (
    <FavoritesContext.Provider
      value={{
        favoritesCount,
        refreshFavoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
