import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import {
  createUserParams,
  updateUserParams,
  updatePasswordParams,
} from "../types/users";
import { roles_enum } from "@prisma/client";
import { ValidationError } from "../errors/errorsClass";

export const registerUserService = async ({
  name,
  email,
  emailVerified,
  password,
  phoneNumber,
  identification,
  role,
}: createUserParams) => {
  if (!name || !email || !password) {
    throw new ValidationError("Nombre, email y contraseña son obligatorios");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.$executeRaw`
      CALL sp_createuser(
        ${name}, 
        ${email}, 
        ${emailVerified ?? null}, 
        ${hashedPassword}, 
        ${phoneNumber ?? null}, 
        ${identification ?? null}, 
        ${(role as roles_enum) ?? "user"})`;

  const newUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      password: true,
      phonenumber: true,
      identification: true,
      role: true,
    },
  });

  return {
    success: true,
    data: newUser,
    message: "Usuario registrado exitosamente",
  };
};

export const getUserByIdService = async (id: number | undefined) => {
  if (!id) {
    throw new Error("ID de usuario requerido");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      phonenumber: true,
      password: true,
      identification: true,
      role: true,
      addresses: {
        select: {
          id: true,
          address: true,
          city: true,
          country: true,
        },
      },
    },
  });

  return user;
};

export const updateUserService = async ({
  id,
  name,
  email,
  emailVerified,
  phoneNumber,
  identification,
}: updateUserParams) => {
  if (!id || !name || !email) {
    throw new Error("Campos Obligatorios requeridos");
  }

  const idAsInt = Number(id);
  const nullIdentification =
    identification && identification.trim() !== ""
      ? identification.trim()
      : null;

  try {
    // Convertir emailVerified a formato ISO string si existe
    const emailVerifiedString = emailVerified
      ? emailVerified.toISOString()
      : null;

    await prisma.$executeRaw` CALL sp_updateUser(
    ${idAsInt}::int, 
    ${name}::text, 
    ${email}::text, 
    ${emailVerifiedString}::timestamp, 
    ${phoneNumber ?? null}::text, 
    ${nullIdentification}::text
)`;
    const user = await prisma.user.findUnique({
      where: { id: idAsInt },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phonenumber: true,
        identification: true,
      },
    });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  } catch (err) {
    throw new Error("Error al actualizar el usuario: " + err);
  }
};

export const updatePasswordService = async ({
  id,
  newPassword,
}: updatePasswordParams) => {
  if (!id || !newPassword) {
    throw new Error("ID de usuario y nueva contraseña son requeridos");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  try {
    await prisma.$executeRaw`CALL sp_updatePassword(${id}::int, ${hashedPassword}::text)`;
    return { success: true, message: "Contraseña actualizada exitosamente" };
  } catch (error) {
    console.error(error);
    throw new Error("Error al actualizar la contraseña: " + error);
  }
};
