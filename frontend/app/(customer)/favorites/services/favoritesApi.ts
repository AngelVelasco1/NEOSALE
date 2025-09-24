import { api } from '@/config/api';

export interface Favorite {
  id?: number;
  user_id: number;
  product_id: number;
  created_at?: string;
  products: {
    id: number;
    name: string;
    price: number;
    stock: number;
    description?: string;
    color: string;
    color_code: string;
    image_url?: string | null;
  };
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

export const getUserFavoritesApi = async (userId: number): Promise<Favorite[]> => {
  try {
    const { data } = await api.get<{ success: boolean; data: Favorite[]; message: string }>(`/api/users/getUserFavorites/${userId}`);
    return data.data || [];
  } catch (error: any) {
    console.error('Error in getUserFavoritesApi:', error);
    throw error;
  }
};