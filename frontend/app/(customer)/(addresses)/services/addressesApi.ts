import { api } from "@/config/api";

export interface Address {
  id?: number;
  user_id?: number;
  address: string;
  city: string;
  country: string;
  is_default: boolean;
  department: string;
}

export interface CreateAddressData {
  address: string;
  city: string;
  department: string;
  country: string;
  is_default: boolean;
  user_id: number; // Agregar user_id al tipo
}

export interface UpdateAddressData {
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  is_default?: boolean;
  user_id: number; // Agregar user_id al tipo
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

// ✅ OBTENER TODAS LAS DIRECCIONES DEL USUARIO
export const getUserAddresses = async (user_id: number): Promise<Address[]> => {
  const { data } = await api.get<ApiResponse<Address[]>>(
    `/api/addresses/getUserAddresses?user_id=${user_id}`
  );
  return data.data || [];
};

// ✅ OBTENER DIRECCIÓN ESPECÍFICA
export const getAddressById = async (
  address_id: number,
  user_id: number
): Promise<Address> => {
  const { data } = await api.get<ApiResponse<Address>>(
    `/api/addresses/getAddress/${address_id}?user_id=${user_id}`
  );
  return data.data!;
};

// ✅ OBTENER DIRECCIÓN PREDETERMINADA
export const getDefaultAddress = async (
  user_id: number
): Promise<Address | null> => {
  try {
    const { data } = await api.get<ApiResponse<Address>>(
      `/api/addresses/getDefaultAddress?user_id=${user_id}`
    );
    return data.data || null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// ✅ CREAR NUEVA DIRECCIÓN
export const createAddressApi = async (
  addressData: CreateAddressData,
  user_id: number
): Promise<ApiResponse<Address>> => {
  try {
    // Incluir user_id en el cuerpo de la petición
    const dataWithUserId = {
      ...addressData,
      user_id: user_id,
    };

    console.log("🚀 Enviando datos de dirección:", dataWithUserId);

    const { data } = await api.post<ApiResponse<Address>>(
      `/api/addresses/createAddress`,
      dataWithUserId
    );

    console.log("✅ Respuesta del servidor:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error en createAddress:", error);
    console.error("❌ Error response:", error.response?.data);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Error creando dirección",
    };
  }
};

// ✅ ACTUALIZAR DIRECCIÓN
export const updateAddress = async (
  address_id: number,
  updateData: UpdateAddressData,
  user_id: number
): Promise<ApiResponse<Address>> => {
  try {
    // Incluir user_id en el cuerpo de la petición también
    const dataWithUserId = {
      ...updateData,
      user_id: user_id,
    };

    console.log("🚀 Actualizando dirección:", { address_id, dataWithUserId });

    const { data } = await api.put<ApiResponse<Address>>(
      `/api/addresses/updateAddress/${address_id}`,
      dataWithUserId
    );

    console.log("✅ Dirección actualizada:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error en updateAddress:", error);
    console.error("❌ Error response:", error.response?.data);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Error actualizando dirección",
    };
  }
};

// ✅ ELIMINAR DIRECCIÓNÓN COMO PREDETERMINADA
export const deleteAddress = async (
  address_id: number,
  user_id: number
): Promise<void> => {
  await api.delete<ApiResponse<null>>(
    `/api/addresses/deleteAddress/${address_id}?user_id=${user_id}`
  );
};

// ✅ ESTABLECER DIRECCIÓN COMO PREDETERMINADA
export const setDefaultAddress = async (
  address_id: number,
  user_id: number
): Promise<Address> => {
  const { data } = await api.post<ApiResponse<Address>>(
    `/api/addresses/setDefaultAddress/${address_id}?user_id=${user_id}`
  );
  return data.data!;
};

// ✅ OBTENER PRIMERA DIRECCIÓN (PARA CHECKOUT)
export const getFirstAddress = async (
  user_id: number
): Promise<Address | null> => {
  try {
    const addresses = await getUserAddresses(user_id);
    return addresses.length > 0 ? addresses[0] : null;
  } catch {
    return null;
  }
};

export const formatAddress = (address: Address): string => {
  return `${address.address}, ${address.city}, ${address.department}, ${address.country}`;
};
