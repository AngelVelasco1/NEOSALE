
import { Request, Response } from 'express';
import { registerUserService } from '../services/users';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber, emailVerified, identification } = req.body;
        const result = await registerUserService(name, email, password, phoneNumber, emailVerified, identification);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};