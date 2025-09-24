import { api } from '@/config/api';

export interface Favorite {
  id?: number;
  userId: number;
  productId: number;
  createdAt?: string;
}

export interface AddFavoriteData {
  userId: number;
  productId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

export const addFavoriteApi = async (favoriteData: AddFavoriteData): Promise<void> => {
  await api.post<ApiResponse<null>>('/api/users/addFavorite', favoriteData);
};

export const removeFavoriteApi = async (favoriteData: AddFavoriteData): Promise<void> => {
  await api.delete<ApiResponse<null>>('/api/users/removeFavorite', { data: favoriteData });
};

export const checkIfFavoriteApi = async (userId: number, productId: number): Promise<boolean> => {
  try {
    const { data } = await api.get(`/api/users/checkIsFavorite/${userId}/${productId}`);
    return data.isFavorite;
  } catch (error: any) {
    if (error.response?.status === 404) return false;
    throw error;
  }
};
