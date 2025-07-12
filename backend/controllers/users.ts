import { Request, Response } from 'express';
import { registerUserService, getUserByIdService, updateUserService, updatePasswordService } from '../services/users';

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

    //  básica
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Campos requeridos: name, email, password"
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

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.query.id ? Number(req.query.id) : undefined;


    const user = await getUserByIdService(userId);
    console.log('User fetched:', user);



    res.json(user);
  } catch (error: any) {
    console.error('Error in getUserById:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const {
      id,
      name,
      email,
      emailVerified,
      phoneNumber,
      identification,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario requerido"
      });
    }

    const updatedUser = await updateUserService({
      id,
      name,
      email,
      emailVerified,
      phoneNumber,
      identification,
    });

    res.json(updatedUser);
  } catch (error: any) {
    console.error('Error in updateUser:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
}

export const updatePassword = async(req: Request, res: Response) => {
  try {
    const { id, newPassword } = req.body
    if (!id || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario y nueva contraseña son requeridos"
      });
    }
    const result = await updatePasswordService({id, newPassword})
    res.json(result); 
  } catch (err) {
    console.error('Error in updatePassword:', err);
    res.status(500).json({
      success: false,
      message: err || "Error interno del servidor"
    });
  }

}
