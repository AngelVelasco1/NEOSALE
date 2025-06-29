import { Request, Response } from 'express';
import { registerUserService } from '../services/users';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email, 
      emailVerified,
      password,
      phoneNumber,
      identification,
      role
    } = req.body;
    console.log(req.body);

    // Validación básica
    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Campos requeridos: name, email, phoneNumber, password" 
      });
    }

    const result = await registerUserService({
      name,
      email,
      emailVerified,
      password,
      phoneNumber,
      identification,
      role
    });

    res.json(result);

  } catch (error: any) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};