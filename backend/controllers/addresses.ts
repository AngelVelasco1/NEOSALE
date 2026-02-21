import { Request, Response, NextFunction } from "express";
import {
  getUserAddressesService,
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
  getDefaultAddressService,
  CreateAddressData,
  UpdateAddressData,
} from "../services/addresses.js";

export const getUserAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.query.user_id as string);
    
    if (!user_id || isNaN(user_id)) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
        code: "UNAUTHORIZED",
      });
    }

    const addresses = await getUserAddressesService(user_id);

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAddressById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.query.user_id as string);
    const address_id = parseInt(req.params.address_id);

    if (!user_id || isNaN(user_id)) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
        code: "UNAUTHORIZED",
      });
    }

    const address = await getAddressByIdService(address_id, user_id);

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error: any) {
    next(error);
  }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener user_id del body
    const user_id = parseInt(req.body.user_id);

    if (!user_id || isNaN(user_id)) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
        code: "UNAUTHORIZED",
      });
    }

    const addressData: CreateAddressData = req.body;
    const newAddress = await createAddressService(user_id, addressData);

    res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.body.user_id || (req.query.user_id as string));
    const address_id = parseInt(req.params.address_id);

    if (!user_id || isNaN(user_id)) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
        code: "UNAUTHORIZED",
      });
    }

    const updateData: UpdateAddressData = req.body;
    const updatedAddress = await updateAddressService(
      address_id,
      user_id,
      updateData
    );

    res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (error: any) {
    next(error);
  }
};
export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.query.user_id as string);
    const address_id = parseInt(req.params.address_id);

    if (!user_id || isNaN(user_id)) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
        code: "UNAUTHORIZED",
      });
    }

    await deleteAddressService(address_id, user_id);

    res.status(200).json({
      success: true,
      message: "Dirección eliminada exitosamente",
    });
  } catch (error: any) {
    next(error);
  }
};
 
export const setDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.query.user_id as string);
    const address_id = parseInt(req.params.address_id);

    if (!user_id || isNaN(user_id)) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
        code: "UNAUTHORIZED",
      });
    }

    const updatedAddress = await setDefaultAddressService(address_id, user_id);

    res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = parseInt(req.query.user_id as string);

    if (!user_id || isNaN(user_id)) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
        code: "UNAUTHORIZED",
      });
    }

    const defaultAddress = await getDefaultAddressService(user_id);

    res.status(200).json({
      success: true,
      data: defaultAddress,
    });
  } catch (error: any) {
    next(error);
  }
};
