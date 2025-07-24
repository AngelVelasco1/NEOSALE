import { NextFunction, Request, Response } from "express";
import {
  registerUserService,
  getUserByIdService,
  updateUserService,
  updatePasswordService,
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
      emailVerified,
      password,
      phoneNumber,
      identification,
      role,
    } = req.body;

    const result = await registerUserService({
      name,
      email,
      emailVerified,
      password,
      phoneNumber,
      identification,
      role,
    });

    res.status(201).json(result);
  } catch (error: any) {
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
    const { id, name, email, emailVerified, phoneNumber, identification } = req.body;

    const updatedUser = await updateUserService({
      id,
      name,
      email,
      emailVerified,
      phoneNumber,
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
