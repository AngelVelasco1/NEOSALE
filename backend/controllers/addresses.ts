import { Request, Response } from "express";
import {
  getUserAddressesService,
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
  getDefaultAddressService,
  CreateAddressData,
  UpdateAddressData
} from "../services/addresses";

// ✅ OBTENER TODAS LAS DIRECCIONES DEL USUARIO
export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const user_id = parseInt(req.query.user_id as string);

    if (!user_id || isNaN(user_id)) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
      return;
    }

    const addresses = await getUserAddressesService(user_id);

    res.status(200).json({
      success: true,
      data: addresses,
      message: "Direcciones obtenidas exitosamente"
    });

  } catch (error: any) {
    console.error("Error getting user addresses:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
};

// ✅ OBTENER UNA DIRECCIÓN ESPECÍFICA
export const getAddressById = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    const address_id = parseInt(req.params.id);

    if (!user_id) {
        res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
        return;
    }

    if (!address_id || isNaN(address_id)) {
      res.status(400).json({
        success: false,
        message: "ID de dirección inválido"
      });
        return;
    }

    const address = await getAddressByIdService(address_id, user_id);

    res.status(200).json({
      success: true,
      data: address,
      message: "Dirección obtenida exitosamente"
    });

  } catch (error: any) {
    console.error("Error getting address:", error);
    const statusCode = error.message.includes("no encontrada") || error.message.includes("no pertenece") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
};

// ✅ CREAR NUEVA DIRECCIÓN
export const createAddress = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
      return;
    }

    const addressData: CreateAddressData = req.body;

    // Validación básica de campos requeridos
    const { address, country, city, department } = addressData;
    if (!address || !country || !city || !department) {
      res.status(400).json({
        success: false,
        message: "Los campos dirección, país, ciudad y departamento son obligatorios"
      });
      return;
    }

    const newAddress = await createAddressService(user_id, addressData);

    res.status(201).json({
      success: true,
      data: newAddress,
      message: "Dirección creada exitosamente"
    });

  } catch (error: any) {
    console.error("Error creating address:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error creando la dirección"
    });
  }
};

// ✅ ACTUALIZAR DIRECCIÓN
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    const address_id = parseInt(req.params.id);

    if (!user_id) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
      return;
    }

    if (!address_id || isNaN(address_id)) {
      res.status(400).json({
        success: false,
        message: "ID de dirección inválido"
      });
      return;
    }

    const updateData: UpdateAddressData = req.body;

    if (!updateData.address && !updateData.country && !updateData.city && 
        !updateData.department && updateData.is_default === undefined) {
      res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un campo para actualizar"
      });
      return;
    }

    const updatedAddress = await updateAddressService(address_id, user_id, updateData);

    res.status(200).json({
      success: true,
      data: updatedAddress,
      message: "Dirección actualizada exitosamente"
    });

  } catch (error: any) {
    console.error("Error updating address:", error);
    const statusCode = error.message.includes("no encontrada") || error.message.includes("no pertenece") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Error actualizando la dirección"
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    const address_id = parseInt(req.params.id);

    if (!user_id) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
      return;
    }

    if (!address_id || isNaN(address_id)) {
      res.status(400).json({
        success: false,
        message: "ID de dirección inválido"
      });
      return;
    }

    await deleteAddressService(address_id, user_id);

    res.status(200).json({
      success: true,
      message: "Dirección eliminada exitosamente"
    });

  } catch (error: any) {
    console.error("Error deleting address:", error);
    const statusCode = error.message.includes("no encontrada") || 
                      error.message.includes("no pertenece") ||
                      error.message.includes("única dirección") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Error eliminando la dirección"
    });
  }
};

// ✅ ESTABLECER DIRECCIÓN COMO DEFAULT
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    const address_id = parseInt(req.params.address_id);

    if (!user_id) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
      return;
    }

    if (!address_id || isNaN(address_id)) {
      res.status(400).json({
        success: false,
        message: "ID de dirección inválido"
      });
    }

    const updatedAddress = await setDefaultAddressService(address_id, user_id);

    res.status(200).json({
      success: true,
      data: updatedAddress,
      message: "Dirección establecida como predeterminada exitosamente"
    });

  } catch (error: any) {
    console.error("Error setting default address:", error);
    const statusCode = error.message.includes("no encontrada") || error.message.includes("no pertenece") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Error estableciendo dirección predeterminada"
    });
  }
};

export const getDefaultAddress = async (req: Request, res: Response) => {
  try {
    const user_id = parseInt(req.query.user_id as string);

    if (!user_id || isNaN(user_id)) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
      return;
    }

    const defaultAddress = await getDefaultAddressService(user_id);

    if (!defaultAddress) {
      res.status(404).json({
        success: false,
        message: "No tienes una dirección predeterminada configurada"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: defaultAddress,
      message: "Dirección predeterminada obtenida exitosamente"
    });

  } catch (error: any) {
    console.error("Error getting default address:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error obteniendo dirección predeterminada"
    });
  }
};