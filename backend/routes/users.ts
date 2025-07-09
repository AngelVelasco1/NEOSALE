import { Router } from 'express';
import { registerUser, getUserById, updateUser } from '../controllers/users';

export const usersRoutes = () => {
    const app = Router();
    app.post("/register", registerUser)
    app.get("/getUser", getUserById)
    app.put("/updateUser", updateUser)
    return app;
}