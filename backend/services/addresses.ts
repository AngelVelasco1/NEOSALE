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

export const getUserAddressesService = async (
  user_id: number
): Promise<Address[]> => {
  if (!user_id) {
    throw new Error("ID de usuario requerido");
  }

  try {
    const addresses = await prisma.addresses.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        address: true,
        country: true,
        city: true,
        department: true,
        is_default: true,
        created_at: true,
      },
    });

    return addresses;
  } catch (error: any) {
    console.error("Error al obtener las direcciones del usuario:", error);
    throw new Error(
      error.message || "Error al obtener las direcciones del usuario"
    );
  }
};

export const getAddressByIdService = async (
  address_id: number,
  user_id: number
): Promise<Address> => {
  if (!address_id || !user_id) {
    throw new Error("ID de dirección y usuario requeridos");
  }

  try {
    const address = await prisma.addresses.findFirst({
      where: { id: address_id, user_id },
      select: {
        id: true,
        address: true,
        country: true,
        city: true,
        department: true,
        is_default: true,
        created_at: true,
      },
    });

    if (!address) {
      throw new Error("Dirección no encontrada o no pertenece al usuario");
    }

    return address;
  } catch (error: any) {
    console.error("Error al obtener la dirección:", error);
    throw new Error(error.message || "Error al obtener la dirección");
  }
};

export const getDefaultAddressService = async (
  user_id: number
): Promise<Address | null> => {
  if (!user_id) {
    throw new Error("ID de usuario requerido");
  }

  try {
    const defaultAddress = await prisma.addresses.findFirst({
      where: {
        user_id,
        is_default: true,
      },
      select: {
        id: true,
        address: true,
        country: true,
        city: true,
        department: true,
        is_default: true,
        created_at: true,
      },
    });

    return defaultAddress;
  } catch (error: any) {
    console.error("Error getting default address:", error);
    return null;
  }
};

export const createAddressService = async (
  user_id: number,
  addressData: CreateAddressData
): Promise<Address> => {
  if (!user_id) {
    throw new Error("ID de usuario requerido");
  }

  const {
    address,
    country,
    city,
    department,
    is_default = false,
  } = addressData;

  if (!address || !country || !city || !department) {
    throw new Error("Todos los campos de la dirección son obligatorios");
  }

  try {
    return await prisma.$transaction(async (ts) => {
      const result = await ts.$queryRaw<[{ fn_create_address: number }]>`
        SELECT * FROM fn_create_address(
          ${address}::TEXT,
          ${country}::TEXT,
          ${city}::TEXT,
          ${department}::TEXT,
          ${user_id}::INT,
          ${is_default}::BOOLEAN
        )`;

      const newAddressId = result[0].fn_create_address;
      if (!newAddressId) {
        throw new Error("Error al crear la dirección");
      }

      const newAddress = await ts.addresses.findFirst({
        where: {
          id: newAddressId,
          user_id: user_id,
        },
        select: {
          id: true,
          address: true,
          country: true,
          city: true,
          department: true,
          is_default: true,
          created_at: true,
        },
      });
      if (!newAddress) {
        throw new Error("Error al obtener la nueva dirección");
      }

      return newAddress;
    });
  } catch (error: any) {
    console.error("Error creando dirección:", error);
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
    return await prisma.$transaction(async (ts) => {
      await ts.$executeRaw`CALL sp_update_address(
        ${address_id}::INT,
        ${updateData.address}::TEXT,
        ${updateData.country}::TEXT,
        ${updateData.city}::TEXT,
        ${updateData.department}::TEXT,
        ${
          updateData.is_default !== undefined ? updateData.is_default : null
        }::BOOLEAN,
        ${user_id}::INT
      )`;

      const updatedAddress = await ts.addresses.findFirst({
        where: {
          id: address_id,
          user_id: user_id,
        },
        select: {
          id: true,
          address: true,
          country: true,
          city: true,
          department: true,
          is_default: true,
          created_at: true,
        },
      });

      if (!updatedAddress) {
        throw new Error("Dirección no encontrada después de la actualización");
      }
      return updatedAddress;
    });
  } catch (error: any) {
    console.error("Error actualizando dirección:", error);
    throw new Error(error.message || "Error al actualizar la dirección");
  }
};

export const deleteAddressService = async (
  address_id: number,
  user_id: number
): Promise<void> => {
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
    console.error("Error al eliminar dirección:", error);
    throw new Error(error.message || "Error al eliminar la dirección");
  }
};

export const setDefaultAddressService = async (
  address_id: number,
  user_id: number
): Promise<Address> => {
  if (!address_id || !user_id) {
    throw new Error("ID de dirección y usuario requeridos");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        CALL sp_set_default_address(
          ${address_id}::INT,
          ${user_id}::INT
        )
      `;

      const updatedAddress = await tx.addresses.findFirst({
        where: {
          id: address_id,
          user_id: user_id,
        },
        select: {
          id: true,
          address: true,
          country: true,
          city: true,
          department: true,
          is_default: true,
          created_at: true,
        },
      });
      if (!updatedAddress) {
        throw new Error(
          "Dirección no encontrada después de establecer como predeterminada"
        );
      }

      return updatedAddress;
    });
  } catch (error: any) {
    console.error("Error setting default address:", error);
    throw new Error(
      error.message || "Error al establecer dirección predeterminada"
    );
  }
};
