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

export const removeFavoriteService = async (userId: number, productId: number) => {
  if (!userId || !productId) {
    throw new Error("ID de usuario y ID de producto son requeridos");
  }

  await prisma.$executeRaw`SELECT fn_remove_favorite(${userId}::int, ${productId}::int)`;
  return { success: true, message: "Producto eliminado de favoritos" };
};


export const checkIsFavoriteService = async (userId: number, productId: number) => {
  if (!userId || !productId) {
    throw new Error("ID de usuario y ID de producto son requeridos");
  }

  const isFavorite = await prisma.favorites.findFirst({
    where: {
      user_id: userId,
      product_id: productId
    }
  });
  return isFavorite ? true : false;
};

export const getUserFavoritesService = async (userId: number) => {
  if (!userId) {
    throw new Error("ID de usuario es requerido");
  }

  const favorites = await prisma.favorites.findMany({
    where: { 
      user_id: userId,
      products: {
        active: true // Solo productos activos
      }
    },
    select: {
      id: true,
      product_id: true,
      user_id: true,
      created_at: true,
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          description: true,
          // Obtener la imagen principal del producto
          images: {
            where: {
              is_primary: true
            },
            select: {
              image_url: true,
              color: true,
              color_code: true
            },
            take: 1
          }
        }
      },
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  const transformedFavorites = favorites.map(favorite => ({
    id: favorite.id,
    user_id: favorite.user_id,
    product_id: favorite.product_id,
    created_at: favorite.created_at,
    products: {
      id: favorite.products.id,
      name: favorite.products.name,
      price: favorite.products.price,
      stock: favorite.products.stock,
      description: favorite.products.description,
      // Tomar el color e imagen principal, o valores por defecto
      color: favorite.products.images[0]?.color || 'Sin especificar',
      color_code: favorite.products.images[0]?.color_code || '#000000',
      image_url: favorite.products.images[0]?.image_url || null
    }
  }));

 
  
  return transformedFavorites;
};