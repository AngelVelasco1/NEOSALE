import { Router } from 'express';
import { registerUser, getUserById } from '../controllers/users';

export const usersRoutes = () => {
    const app = Router();
    app.post("/register", registerUser)
    app.get("/getUser", getUserById)
    return app;
}