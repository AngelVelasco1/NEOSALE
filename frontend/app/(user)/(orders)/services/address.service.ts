import { api } from '@/config/api';

// Interfaces para la dirección
export interface Address {
  id?: number;
  user_id?: number;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: 'shipping' | 'billing' | 'both';
  is_default: boolean;
  additional_info?: string;
}

// Obtener todas las direcciones del usuario
export const getUserAddressesApi = async (): Promise<Address[]> => {
  const { data } = await api.get('/api/users/addresses');
  return data;
};

// Obtener dirección por ID
export const getAddressByIdApi = async (addressId: number): Promise<Address> => {
  const { data } = await api.get(`/api/users/addresses/${addressId}`);
  return data;
};

// Crear nueva dirección
export const createAddressApi = async (address: Address): Promise<Address> => {
  const { data } = await api.post('/api/users/addresses', address);
  return data;
};

// Actualizar dirección existente
export const updateAddressApi = async (addressId: number, addressData: Partial<Address>): Promise<Address> => {
  const { data } = await api.put(`/api/users/addresses/${addressId}`, addressData);
  return data;
};

// Eliminar dirección
export const deleteAddressApi = async (addressId: number): Promise<void> => {
  await api.delete(`/api/users/addresses/${addressId}`);
};

// Establecer dirección como predeterminada
export const setDefaultAddressApi = async (addressId: number): Promise<Address> => {
  const { data } = await api.put(`/api/users/addresses/${addressId}/set-default`);
  return data;
};
