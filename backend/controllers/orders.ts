import { NextFunction } from "express-serve-static-core";
import {
  createOrderService
} from "../services/orders";
import { Request, Response } from "express";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   
  } catch (err) {
    next(err);
  }
};
