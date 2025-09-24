import { Router } from 'express';
import { registerUser, getUserById, updateUser, updatePassword, addFavorite, removeFavorite, checkIsFavorite, getUserFavorites } from '../controllers/users';

export const usersRoutes = () => {
    const app = Router();
    app.post("/register", registerUser)
    app.get("/getUser", getUserById)
    app.put("/updateUser", updateUser)
    app.put("/updatePassword", updatePassword)
    app.post("/addFavorite", addFavorite) 
    app.delete("/removeFavorite", removeFavorite)
    app.get("/checkIsFavorite/:userId/:productId", checkIsFavorite)
    app.get("/getUserFavorites/:userId", getUserFavorites)
    return app;
}