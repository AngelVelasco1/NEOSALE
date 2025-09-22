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