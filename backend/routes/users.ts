import { Router } from 'express';
import { registerUser } from '../controllers/users';

export const usersRoutes = () => {
    const app = Router();
    app.post("/register", registerUser)
    return app;
}