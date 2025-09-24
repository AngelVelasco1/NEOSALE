import { NextFunction, Request, Response } from "express";
import {
  registerUserService,
  getUserByIdService,
  updateUserService,
  updatePasswordService,
  addFavoriteService,
  removeFavoriteService,
  checkIsFavoriteService,
  getUserFavoritesService
} from "../services/users";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      email,
      email_verified,
      password,
      phone_number,
      identification,
      role,
    } = req.body;

    const result = await registerUserService({
      name,
      email,
      email_verified,
      password,
      phone_number,
      identification,
      role,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.query.id ? Number(req.query.id) : undefined;

    const user = await getUserByIdService(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name, email, email_verified, phone_number, identification } = req.body;

    const updatedUser = await updateUserService({
      id,
      name,
      email,
      email_verified,
      phone_number,
      identification,
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, newPassword } = req.body;

    const result = await updatePasswordService({ id, newPassword });
    res.json(result);
  } catch (error) {
    next(error)
  }
};

export const addFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productId } = req.body;

    const result = await addFavoriteService(userId, productId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productId } = req.body;

    const result = await removeFavoriteService(userId, productId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export const checkIsFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId ? Number(req.params.userId) : undefined;
    const productId = req.params.productId ? Number(req.params.productId) : undefined;

    const isFavorite = await checkIsFavoriteService(userId, productId);
    res.json({ isFavorite });
  } catch (error) {
    next(error);
  }
}

export const getUserFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId ? Number(req.params.userId) : undefined;

    const favorites = await getUserFavoritesService(userId);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
}