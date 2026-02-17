import { prisma } from "../lib/prisma.js";
import { 
  ValidationError, 
  NotFoundError, 
  ForbiddenError,
  handlePrismaError 
} from "../errors/errorsClass.js";

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
  // Validación ANTES del try-catch
  if (!user_id || user_id <= 0) {
    throw new ValidationError("ID de usuario inválido");
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
    console.error(`[getUserAddressesService] Error al obtener direcciones del usuario ${user_id}:`, error);
    throw handlePrismaError(error);
  }
};

export const getAddressByIdService = async (
  address_id: number,
  user_id: number
): Promise<Address> => {
  // Validación ANTES del try-catch
  if (!address_id || address_id <= 0) {
    throw new ValidationError("ID de dirección inválido");
  }
  if (!user_id || user_id <= 0) {
    throw new ValidationError("ID de usuario inválido");
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
      throw new NotFoundError("Dirección no encontrada o no pertenece al usuario");
    }

    return address;
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error(`[getAddressByIdService] Error al obtener dirección ${address_id}:`, error);
    throw handlePrismaError(error);
  }
};

export const getDefaultAddressService = async (
  user_id: number
): Promise<Address | null> => {
  // Validación ANTES del try-catch
  if (!user_id || user_id <= 0) {
    throw new ValidationError("ID de usuario inválido");
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
    console.error(`[getDefaultAddressService] Error al obtener dirección predeterminada del usuario ${user_id}:`, error);
    throw handlePrismaError(error);
  }
};

export const createAddressService = async (
  user_id: number,
  addressData: CreateAddressData
): Promise<Address> => {
  // Validación ANTES del try-catch
  if (!user_id || user_id <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  const { address, country, city, department, is_default = false } = addressData;

  if (!address || !address.trim()) {
    throw new ValidationError("La dirección es obligatoria");
  }
  if (!country || !country.trim()) {
    throw new ValidationError("El país es obligatorio");
  }
  if (!city || !city.trim()) {
    throw new ValidationError("La ciudad es obligatoria");
  }
  if (!department || !department.trim()) {
    throw new ValidationError("El departamento es obligatorio");
  }

  try {
    return await prisma.$transaction(async (ts) => {
      const result = await ts.$queryRaw<[{ p_new_id: number }]>`
        SELECT fn_create_address(
          ${address.trim()}::TEXT,
          ${country.trim()}::TEXT,
          ${city.trim()}::TEXT,
          ${department.trim()}::TEXT,
          ${user_id}::INT,
          ${is_default}::BOOLEAN
        ) as p_new_id`;

      const newAddressId = result[0]?.p_new_id;
      if (!newAddressId) {
        throw new Error("No se recibió ID de la nueva dirección");
      }

      const newAddress = await ts.addresses.findFirst({
        where: {
          id: newAddressId,
          user_id,
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
        throw new Error("No se pudo recuperar la dirección creada");
      }

      return newAddress;
    });
  } catch (error: any) {
    console.error(`[createAddressService] Error al crear dirección para usuario ${user_id}:`, error);
    throw handlePrismaError(error);
  }
};

export const updateAddressService = async (
  address_id: number,
  user_id: number,
  updateData: UpdateAddressData
): Promise<Address> => {
  // Validación ANTES del try-catch
  if (!address_id || address_id <= 0) {
    throw new ValidationError("ID de dirección inválido");
  }
  if (!user_id || user_id <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  // Validar que al menos un campo para actualizar sea proporcionado
  if (Object.keys(updateData).length === 0) {
    throw new ValidationError("Debe proporcionar al menos un campo para actualizar");
  }

  try {
    return await prisma.$transaction(async (tx: any) => {
      const existingAddress = await tx.addresses.findFirst({
        where: {
          id: address_id,
          user_id,
        },
      });

      if (!existingAddress) {
        throw new ForbiddenError("Dirección no encontrada o no tienes permisos para modificarla");
      }

      const updatedAddress = await tx.addresses.update({
        where: { id: address_id },
        data: {
          ...(updateData.address && { address: updateData.address.trim() }),
          ...(updateData.country && { country: updateData.country.trim() }),
          ...(updateData.city && { city: updateData.city.trim() }),
          ...(updateData.department && { department: updateData.department.trim() }),
          ...(updateData.is_default !== undefined && {
            is_default: updateData.is_default,
          }),
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

      return updatedAddress;
    });
  } catch (error: any) {
    if (error instanceof ForbiddenError) {
      throw error;
    }
    console.error(`[updateAddressService] Error al actualizar dirección ${address_id}:`, error);
    throw handlePrismaError(error);
  }
};

export const deleteAddressService = async (
  address_id: number,
  user_id: number
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!address_id || address_id <= 0) {
    throw new ValidationError("ID de dirección inválido");
  }
  if (!user_id || user_id <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  try {
    await prisma.$executeRaw`
      CALL sp_delete_address(
        ${address_id}::INT,
        ${user_id}::INT
      )
    `;
  } catch (error: any) {
    console.error(`[deleteAddressService] Error al eliminar dirección ${address_id}:`, error);
    throw handlePrismaError(error);
  }
};

export const setDefaultAddressService = async (
  address_id: number,
  user_id: number
): Promise<Address> => {
  // Validación ANTES del try-catch
  if (!address_id || address_id <= 0) {
    throw new ValidationError("ID de dirección inválido");
  }
  if (!user_id || user_id <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  try {
    return await prisma.$transaction(async (tx: any) => {
      const existingAddress = await tx.addresses.findFirst({
        where: {
          id: address_id,
          user_id,
        },
      });

      if (!existingAddress) {
        throw new ForbiddenError("Dirección no encontrada o no tienes permisos para modificarla");
      }

      const updatedAddress = await tx.addresses.update({
        where: { id: address_id },
        data: { is_default: true },
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

      return updatedAddress;
    });
  } catch (error: any) {
    if (error instanceof ForbiddenError) {
      throw error;
    }
    console.error(`[setDefaultAddressService] Error al establecer dirección predeterminada ${address_id}:`, error);
    throw handlePrismaError(error);
  }
};
