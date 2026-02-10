import { Request, Response, NextFunction } from "express";
import {
  getStoreSettingsService,
  updateStoreSettingsService,
  getStoreColorsService,
} from "../services/storeSettings.js";

export const getStoreSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await getStoreSettingsService();

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

export const updateStoreSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await updateStoreSettingsService(req.body);

    res.status(200).json({
      success: true,
      data: settings,
      message: "Store settings updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getStoreColors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const colors = await getStoreColorsService();

    res.status(200).json({
      success: true,
      data: colors,
    });
  } catch (err) {
    next(err);
  }
};
