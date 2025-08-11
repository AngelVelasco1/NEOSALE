import { addProductToCartService, getCartService, deleteProductFromCartService } from "../services/cart";
import { NextFunction, Request, Response } from "express";

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = Number(req.query.user_id);    
        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({ error: 'user_id es requerido' });
        }
        
        const cart = await getCartService(user_id);
        res.status(200).json(cart);
    } catch(err) {
        next(err)
    }
}

export const addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, product_id, quantity, color_code, size } = req.body;
  try {
    const product = await addProductToCartService(user_id, product_id, quantity, color_code, size);
    res.status(201).json(product);
  } catch (err) {
    next(err)
  }
};

export const deleteProductFromCart = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, product_id, color_code, size } = req.body;
  try {
    await deleteProductFromCartService(user_id, product_id, color_code, size);
    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (err) {
    next(err)
  }
}
