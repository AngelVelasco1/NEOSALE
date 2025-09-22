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
  email_verified,
  password,
  phone_number,
  identification,
  role,
}: createUserParams) => {
  if (!name || !email || !password) {
    throw new ValidationError("Nombre, email y contraseña son obligatorios");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.$executeRaw`
      CALL sp_create_user(
        ${name}, 
        ${email}, 
        ${email_verified ?? null}, 
        ${hashedPassword}, 
        ${phone_number ?? null}, 
        ${identification ?? null}, 
        ${(role as roles_enum) ?? "user"})`;

  const newUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      email_verified: true,
      password: true,
      phone_number: true,
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
      email_verified: true,
      phone_number: true,
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
  email_verified,
  phone_number,
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

  const emailVerifiedString = email_verified
    ? email_verified.toISOString()
    : null;

  await prisma.$executeRaw` CALL sp_update_user(
    ${idAsInt}::int, 
    ${name}::text, 
    ${email}::text, 
    ${emailVerifiedString}::timestamp, 
    ${phone_number ?? null}::text, 
    ${nullIdentification}::text
)`;
  const user = await prisma.user.findUnique({
    where: { id: idAsInt },
    select: {
      id: true,
      name: true,
      email: true,
      email_verified: true,
      phone_number: true,
      identification: true,
    },
  });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  return user;
};

export const updatePasswordService = async ({
  id,
  newPassword,
}: updatePasswordParams) => {
  if (!id || !newPassword) {
    throw new Error("ID de usuario y nueva contraseña son requeridos");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.$executeRaw`CALL sp_update_password(${id}::int, ${hashedPassword}::text)`;
  return { success: true, message: "Contraseña actualizada exitosamente" };
};

export const addFavoriteService = async (userId: number, productId: number) => {
  if (!userId || !productId) {
    throw new Error("ID de usuario y ID de producto son requeridos");
  }

  await prisma.$executeRaw`SELECT fn_add_favorite(${userId}::int, ${productId}::int)`;
  return { success: true, message: "Producto agregado a favoritos" };
};
