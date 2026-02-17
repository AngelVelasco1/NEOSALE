import { NextFunction, Request, Response } from "express";
import {
  registerUserService,
  getUserByIdService,
  updateUserService,
  updatePasswordService,
  updateUserImageService,
  editProfileService,
  addFavoriteService,
  removeFavoriteService,
  checkIsFavoriteService,
  getUserFavoritesService,
  getUsersService,
  deleteUserService,
} from "../services/users.js";

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
      acceptTerms,
      acceptPrivacy,
    } = req.body;

    const result = await registerUserService({
      name,
      email,
      email_verified,
      password,
      phone_number,
      identification,
      role,
      acceptTerms,
      acceptPrivacy,
    });

    res.status(201).json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const minOrders = req.query.minOrders
      ? parseInt(req.query.minOrders as string)
      : undefined;
    const maxOrders = req.query.maxOrders
      ? parseInt(req.query.maxOrders as string)
      : undefined;
    const minSpent = req.query.minSpent
      ? parseFloat(req.query.minSpent as string)
      : undefined;
    const maxSpent = req.query.maxSpent
      ? parseFloat(req.query.maxSpent as string)
      : undefined;
    const sortBy = req.query.sortBy as string;
    const sortOrder = req.query.sortOrder as string;

    const users = await getUsersService(
      page,
      limit,
      search,
      status,
      minOrders,
      maxOrders,
      minSpent,
      maxSpent,
      sortBy,
      sortOrder
    );
    res.json(users);
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
    const { id, name, email, email_verified, phone_number, phoneNumber, identification } =
      req.body;

    const updatedUser = await updateUserService({
      id,
      name,
      email,
      email_verified,
      phone_number: phone_number || phoneNumber, // Accept both formats
      identification,
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, newPassword } = req.body;

    const result = await updatePasswordService({ id, newPassword });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, image } = req.body;

    const result = await updateUserImageService({ id, image });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, productId } = req.body;

    const result = await addFavoriteService(userId, productId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, productId } = req.body;

    const result = await removeFavoriteService(userId, productId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const checkIsFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId ? Number(req.params.userId) : undefined;
    const productId = req.params.productId
      ? Number(req.params.productId)
      : undefined;

    if (!userId || !productId) {
      res.status(400).json({ success: false, message: "userId and productId are required" });
      return;
    }

    const isFavorite = await checkIsFavoriteService(userId, productId);
    res.json({ isFavorite });
  } catch (error) {
    next(error);
  }
};

export const getUserFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId ? Number(req.params.userId) : undefined;

    if (!userId) {
      res.status(400).json({ success: false, message: "userId is required" });
      return;
    }

    const favorites = await getUserFavoritesService(userId);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete user (soft delete)
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id);
    await deleteUserService(userId);

    res.status(200).json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

export const editProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const { name, phone, image, currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - User ID not found",
      });
    }

    const result = await editProfileService({
      userId,
      name,
      phone,
      image,
      currentPassword,
      newPassword,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};
