import { prisma } from "../lib/prisma";

export interface Address {
  id: number;
  address: string;
  country: string;
  city: string;
  department: string;
  is_default: boolean;
  created_at: Date;
}

export interface CreateAddressData {
  address: string;
  country: string;
  city: string;
  department: string;
  is_default?: boolean;
}

export interface UpdateAddressData {
  address?: string;
  country?: string;
  city?: string;
  department?: string;
  is_default?: boolean;
}

export const getUserAddressesService = async (user_id: number): Promise<Address[]> => {
  if (!user_id) {
    throw new Error("ID de usuario requerido");
  }

  try {
    const addresses = await prisma.$queryRaw<Address[]>`
      SELECT * FROM sp_get_user_addresses(${user_id}::INT)
    `;

    return addresses;
  } catch (error: any) {
    console.error('Error getting user addresses:', error);
    throw new Error(error.message || "Error al obtener las direcciones del usuario");
  }
};

export const getAddressByIdService = async (address_id: number, user_id: number): Promise<Address> => {
  if (!address_id || !user_id) {
    throw new Error("ID de dirección y usuario requeridos");
  }

  try {
    const result = await prisma.$queryRaw<Address[]>`
      SELECT * FROM sp_get_address_by_id(${address_id}::INT, ${user_id}::INT)
    `;

    if (!result || result.length === 0) {
      throw new Error("Dirección no encontrada o no pertenece al usuario");
    }

    return result[0];
  } catch (error: any) {
    console.error('Error getting address by id:', error);
    throw new Error(error.message || "Error al obtener la dirección");
  }
};

export const createAddressService = async (user_id: number, addressData: CreateAddressData): Promise<Address> => {
  if (!user_id) {
    throw new Error("ID de usuario requerido");
  }

  const { address, country, city, department, is_default = false } = addressData;

  // Validar campos requeridos
  if (!address || !country || !city || !department) {
    throw new Error("Todos los campos obligatorios deben estar completos");
  }

  try {
    // Llamar a la función para crear la dirección
    const result = await prisma.$queryRaw<[{ sp_create_address: number }]>`
      SELECT sp_create_address(
        ${address}::TEXT,
        ${country}::TEXT,
        ${city}::TEXT,
        ${department}::TEXT,
        ${user_id}::INT,
        ${is_default}::BOOLEAN
      )
    `;

    const newAddressId = result[0].sp_create_address;

    if (!newAddressId) {
      throw new Error("Error al crear la dirección");
    }

    // Obtener la dirección creada
    const newAddress = await getAddressByIdService(newAddressId, user_id);
    return newAddress;

  } catch (error: any) {
    console.error('Error creating address:', error);
    throw new Error(error.message || "Error al crear la dirección");
  }
};

export const updateAddressService = async (
  address_id: number, 
  user_id: number, 
  updateData: UpdateAddressData
): Promise<Address> => {
  if (!address_id || !user_id) {
    throw new Error("ID de dirección y usuario requeridos");
  }

  try {
    // Llamar al procedure para actualizar
    await prisma.$executeRaw`
      CALL sp_update_address(
        ${address_id}::INT,
        ${updateData.address || null}::TEXT,
        ${updateData.country || null}::TEXT,
        ${updateData.city || null}::TEXT,
        ${updateData.department || null}::TEXT,
        ${updateData.is_default !== undefined ? updateData.is_default : null}::BOOLEAN,
        ${user_id}::INT
      )
    `;

    // Obtener la dirección actualizada
    const updatedAddress = await getAddressByIdService(address_id, user_id);
    return updatedAddress;

  } catch (error: any) {
    console.error('Error updating address:', error);
    throw new Error(error.message || "Error al actualizar la dirección");
  }
};

export const deleteAddressService = async (address_id: number, user_id: number): Promise<void> => {
  if (!address_id || !user_id) {
    throw new Error("ID de dirección y usuario requeridos");
  }

  try {
    await prisma.$executeRaw`
      CALL sp_delete_address(
        ${address_id}::INT,
        ${user_id}::INT
      )
    `;

  } catch (error: any) {
    console.error('Error deleting address:', error);
    throw new Error(error.message || "Error al eliminar la dirección");
  }
};

export const setDefaultAddressService = async (address_id: number, user_id: number): Promise<Address> => {
  if (!address_id || !user_id) {
    throw new Error("ID de dirección y usuario requeridos");
  }

  try {
    await prisma.$executeRaw`
      CALL sp_set_default_address(
        ${address_id}::INT,
        ${user_id}::INT
      )
    `;

    const updatedAddress = await getAddressByIdService(address_id, user_id);
    return updatedAddress;

  } catch (error: any) {
    console.error('Error setting default address:', error);
    throw new Error(error.message || "Error al establecer dirección predeterminada");
  }
};

export const getDefaultAddressService = async (user_id: number): Promise<Address | null> => {
  if (!user_id) {
    throw new Error("ID de usuario requerido");
  }

  try {
    // con procedure
    /*
    const result = await prisma.$queryRaw<Address[]>`
      SELECT * FROM sp_get_default_address(${user_id}::INT)
    `;
    return result.length > 0 ? result[0] : null;
    */

    // Usar el servicio 
    const addresses = await getUserAddressesService(user_id);
    return addresses.find(addr => addr.is_default) || null;

  } catch (error: any) {
    console.error('Error getting default address:', error);
    // No lanzar error, devolver null si no se encuentra
    return null;
  }
}