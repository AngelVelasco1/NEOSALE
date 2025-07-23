"use client";

import { useUser } from '@/app/(auth)/context/UserContext';
import { useMounted } from './useMounted';

export function useUserSafe() {
  const mounted = useMounted();
  const userContext = useUser();

  // Durante la hidratación, retornar valores seguros
  if (!mounted) {
    return {
      userProfile: null,
      isLoading: true,
      setSelectedAddress: () => {},
      selectedAddress: undefined,
      reFetchUserProfile: async () => null,
    };
  }

  return userContext;
}