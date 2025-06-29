import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { createUserParams } from "../types/users";

export const registerUserService = async ({
  name,
  email,
  emailVerified = false,
  password,
  phoneNumber,
  identification,
  role 
}: createUserParams) => {
  if (!name || !email || !phoneNumber || !password) {
    throw new Error("Campos requeridos faltantes");
  }

  const existingUser = await prisma.users.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$executeRaw`
      CALL sp_createuser(
        ${name}, 
        ${email}, 
        ${emailVerified}, 
        ${hashedPassword}, 
        ${phoneNumber}, 
        ${identification}, 
        ${role})`;

    const newUser = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailverified: true,
        phonenumber: true,
        identification: true,
        role: true
      },
    });
  
    return newUser;
};
