import { Router } from "express";
import {
  registerUser,
  getUserById,
  updateUser,
  updatePassword,
  addFavorite,
  removeFavorite,
  checkIsFavorite,
  getUserFavorites,
  getUsers,
} from "../controllers/users";

export const usersRoutes = () =>
  Router()
    .post("/register", registerUser)
    .get("/getUsers", getUsers)
    .get("/getUser", getUserById)
    .put("/updateUser", updateUser)
    .put("/updatePassword", updatePassword)
    .post("/addFavorite", addFavorite)
    .delete("/removeFavorite", removeFavorite)
    .get("/checkIsFavorite/:userId/:productId", checkIsFavorite)
    .get("/getUserFavorites/:userId", getUserFavorites);
