import {
  addProductToCartService,
  getCartService,
  removeCartItemService,
  updateCartItemService,
  clearCartService
} from "../services/cart.js";
import { NextFunction, Request, Response } from "express";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.query.user_id as string;
    if (!user_id) {
      return res.status(400).json({ 
        success: false, 
        message: "user_id is required",
        code: "VALIDATION_ERROR"
      });
    }

    const cart = await getCartService(user_id);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

export const addProductToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, product_id, quantity, color_code, size } = req.body;

    const updatedCart = await addProductToCartService(
      user_id.toString(),
      parseInt(product_id),
      color_code,
      size,
      parseInt(quantity)
    );

    res.status(201).json({
      success: true,
      data: updatedCart,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, product_id, quantity, color_code, size } = req.body;

    const updatedCart = await updateCartItemService(
      user_id.toString(),
      parseInt(product_id),
      parseInt(quantity),
      color_code,
      size
    );

    res.status(200).json({
      success: true,
      data: updatedCart,
    });
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, product_id, color_code, size } = req.body;

    const updatedCart = await removeCartItemService(
      user_id.toString(),
      parseInt(product_id),
      color_code,
      size
    );

    res.status(200).json({
      success: true,
      data: updatedCart,
    });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.body;

    const emptyCart = await clearCartService(user_id.toString());

    res.status(200).json({
      success: true,
      data: emptyCart,
    });
  } catch (err) {
    next(err);
  }
};
