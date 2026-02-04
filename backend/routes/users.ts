import { Router } from "express";
import {
  registerUser,
  getUserById,
  updateUser,
  updatePassword,
  updateUserImage,
  addFavorite,
  removeFavorite,
  checkIsFavorite,
  getUserFavorites,
  getUsers,
} from "../controllers/users";
import { authLimiter, passwordRecoveryLimiter } from "../middlewares/rateLimiter";

export const usersRoutes = () =>
  Router()
    .post("/register", authLimiter, registerUser)
    .get("/getUsers", getUsers)
    .get("/getUser", getUserById)
    .put("/updateUser", updateUser)
    .put("/updatePassword", passwordRecoveryLimiter, updatePassword)
    .put("/updateUserImage", updateUserImage)
    .post("/addFavorite", addFavorite)
    .delete("/removeFavorite", removeFavorite)
    .get("/checkIsFavorite/:userId/:productId", checkIsFavorite)
    .get("/getUserFavorites/:userId", getUserFavorites);
