import { Router } from "express";
import {
  registerUser,
  getUserById,
  updateUser,
  updatePassword,
  updateUserImage,
  editProfile,
  addFavorite,
  removeFavorite,
  checkIsFavorite,
  getUserFavorites,
  getUsers,
  deleteUser,
} from "../controllers/users";

export const usersRoutes = () =>
  Router()
    .post("/register", registerUser)
    .get("/admin/staff", getUsers) // Admin: get all staff
    .get("/getUsers", getUsers)
    .get("/getUser", getUserById)
    .put("/updateUser", updateUser)
    .put("/updatePassword", updatePassword)
    .put("/updateUserImage", updateUserImage)
    .put("/profile/edit", editProfile) // Auth required: Edit logged-in user profile
    .post("/addFavorite", addFavorite)
    .delete("/removeFavorite", removeFavorite)
    .get("/checkIsFavorite/:userId/:productId", checkIsFavorite)
    .get("/getUserFavorites/:userId", getUserFavorites)
    // DELETE - Eliminar usuario (soft delete)
    .delete("/:id", deleteUser);
