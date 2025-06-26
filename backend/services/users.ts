import { prisma } from "../lib/prisma";

export const registerUserService = async (
  name: string,
  email: string,
  password: string,
  phoneNumber: string,
  emailVerified?: boolean,
  identification?: string
) => {
  if (!name || !email)
    throw new Error("Parámetros inválidos");

  let user = await prisma.users.findUnique({
    where: { 
        email,
     },
  });

  if (user) {
    return {
        error: "El usuario ya existe",
    };
  }
    let newUser = await prisma.$executeRawUnsafe(`CALL sp_createUser(${name}, ${email}, ${emailVerified}, ${password}, ${phoneNumber}, ${identification})`);
    return {
        message: "Usuario registrado exitosamente",
        user: newUser,
    }
};
