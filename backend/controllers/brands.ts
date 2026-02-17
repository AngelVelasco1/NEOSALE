import { Request, Response, NextFunction } from "express";
import {
  getAllBrandsService,
  getBrandByIdService,
  getBrandByNameService,
} from "../services/brands.js";

export const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await getAllBrandsService();
    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (err) {
    next(err);
  }
};

export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const brand = await getBrandByIdService(id);
    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (err) {
    next(err);
  }
};

export const getBrandByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.params;
    const brand = await getBrandByNameService(name);
    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (err) {
    next(err);
  }
};
