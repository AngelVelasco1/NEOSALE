import { Router } from 'express';
import { registerUser, getUserById, updateUser, updatePassword, addFavorite } from '../controllers/users';

export const usersRoutes = () => {
    const app = Router();
    app.post("/register", registerUser)
    app.get("/getUser", getUserById)
    app.put("/updateUser", updateUser)
    app.put("/updatePassword", updatePassword)
    app.post("/addFavorite", addFavorite) 
    return app;
}