import {
  addProductToCartService,
  getCartService,
  removeCartItemService,
  updateCartItemService,
  clearCartService,
} from "../services/cart";
import { NextFunction, Request, Response } from "express";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.query.user_id as string;
    if (!user_id) {
      res.status(400).json({ error: "user_id es requerido" });
      return;
    }

    const cart = await getCartService(user_id);
    res.status(200).json(cart);
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

    // Validaciones
    if (!user_id || !product_id || !quantity || !color_code || !size) {
      res.status(400).json({
        error:
          "Todos los campos son requeridos: user_id, product_id, quantity, color_code, size",
      });
      return;
    }

    if (quantity <= 0) {
      res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
      return;
    }

    const updatedCart = await addProductToCartService(
      user_id.toString(),
      parseInt(product_id),
      color_code,
      size,
      parseInt(quantity)
    );

    res.status(201).json({
      success: true,
      message: "Producto agregado al carrito exitosamente",
      cart: updatedCart,
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

    if (
      !user_id ||
      !product_id ||
      quantity === undefined ||
      !color_code ||
      !size
    ) {
      res.status(400).json({
        error:
          "Todos los campos son requeridos: user_id, product_id, quantity, color_code, size",
      });
      return;
    }

    if (quantity < 0) {
      res.status(400).json({ error: "La cantidad no puede ser negativa" });
      return;
    }

    const updatedCart = await updateCartItemService(
      user_id.toString(),
      parseInt(product_id),
      parseInt(quantity),
      color_code,
      size
    );

    res.status(200).json({
      success: true,
      message:
        quantity === 0
          ? "Producto eliminado del carrito"
          : "Cantidad actualizada exitosamente",
      cart: updatedCart,
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

    if (!user_id || !product_id || !color_code || !size) {
      res.status(400).json({
        error:
          "Todos los campos son requeridos: user_id, product_id, color_code, size",
      });
      return;
    }

    const updatedCart = await removeCartItemService(
      user_id.toString(),
      parseInt(product_id),
      color_code,
      size
    );

    res.status(200).json({
      success: true,
      message: "Producto eliminado del carrito exitosamente",
      cart: updatedCart,
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

    if (!user_id) {
      res.status(400).json({ error: "user_id es requerido" });
      return;
    }

    const emptyCart = await clearCartService(user_id.toString());

    res.status(200).json({
      success: true,
      message: "Carrito limpiado exitosamente",
      cart: emptyCart,
    });
  } catch (err) {
    next(err);
  }
};
