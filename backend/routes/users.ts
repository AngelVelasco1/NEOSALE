import { Router } from 'express';
import { registerUser } from '../controllers/users';

export const usersRoutes = () => {
    const app = Router();
    app.get("/register", registerUser)
    return app;
}