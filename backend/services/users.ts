import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import {
  createUserParams,
  updateUserParams,
  updatePasswordParams,
} from "../types/users";
import { roles_enum } from "@prisma/client";
import { ValidationError } from "../errors/errorsClass";
import { 
  validateRegisterInput, 
  validateUpdateUserInput,
  sanitizeHTML 
} from "../lib/security";

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

  // Validar inputs para prevenir SQL injection y XSS
  const validation = validateRegisterInput({
    name,
    email,
    password,
    phone_number: phone_number || undefined,
    identification: identification || undefined,
  });

  if (!validation.isValid) {
    throw new ValidationError(validation.errors.join(', '));
  }

  // Sanitizar nombre (remover cualquier HTML si lo hubiera)
  const safeName = sanitizeHTML(name.trim());
  const safeEmail = email.trim().toLowerCase();

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.$executeRaw`
      CALL sp_create_user(
        ${safeName}, 
        ${safeEmail}, 
        ${email_verified ?? null}, 
        ${hashedPassword}, 
        ${phone_number ?? null}, 
        ${identification ?? null}, 
        ${(role as roles_enum) ?? "user"})`;

  const newUser = await prisma.user.findUnique({
    where: { email: safeEmail },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      password: true,
      phoneNumber: true,
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

export const getUsersService = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  minOrders?: number,
  maxOrders?: number,
  minSpent?: number,
  maxSpent?: number,
  sortBy?: string,
  sortOrder?: string
) => {
  const skip = (page - 1) * limit;

  // Construir filtro de búsqueda
  const where = search
    ? {
        role: "user" as roles_enum,
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : { role: "user" as roles_enum };

  // Agregar filtro de estado si se proporciona
  if (status && status !== "all") {
    (where as any).active = status === "true";
  }

  // Obtener usuarios con paginación
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        active: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            created_at: true,
            status: true,
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  // Calcular estadísticas de órdenes para cada usuario
  let usersWithStats = users.map((user) => {
    const completedOrders = user.orders.filter(
      (order) => order.status === "delivered" || order.status === "paid"
    );
    const totalSpent = completedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const avgSpent =
      completedOrders.length > 0 ? totalSpent / completedOrders.length : 0;
    const lastOrder = user.orders.length > 0 ? user.orders[0] : null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phoneNumber,
      image: user.image,
      active: user.active,
      created_at: user.createdAt,
      total_orders: user.orders.length,
      total_spent: totalSpent,
      average_spent: avgSpent,
      last_order_date: lastOrder?.created_at || null,
    };
  });

  // Aplicar filtros de rangos después de calcular estadísticas
  if (minOrders !== undefined) {
    usersWithStats = usersWithStats.filter(
      (user) => user.total_orders >= minOrders
    );
  }
  if (maxOrders !== undefined) {
    usersWithStats = usersWithStats.filter(
      (user) => user.total_orders <= maxOrders
    );
  }
  if (minSpent !== undefined) {
    usersWithStats = usersWithStats.filter(
      (user) => user.total_spent >= minSpent
    );
  }
  if (maxSpent !== undefined) {
    usersWithStats = usersWithStats.filter(
      (user) => user.total_spent <= maxSpent
    );
  }

  // Aplicar ordenamiento
  if (sortBy && sortOrder) {
    usersWithStats.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      // Manejar valores nulos
      if (aValue === null)
        aValue =
          sortOrder === "asc"
            ? Number.MIN_SAFE_INTEGER
            : Number.MAX_SAFE_INTEGER;
      if (bValue === null)
        bValue =
          sortOrder === "asc"
            ? Number.MIN_SAFE_INTEGER
            : Number.MAX_SAFE_INTEGER;

      // Comparar valores
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : bValue > aValue
        ? 1
        : -1;
    });
  }

  // Recalcular el total después del filtrado
  const filteredTotal = usersWithStats.length;

  return {
    data: usersWithStats,
    pagination: {
      total: filteredTotal,
      page,
      limit,
      totalPages: Math.ceil(filteredTotal / limit),
    },
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
      phoneNumber: true,
      password: true,
      identification: true,
      role: true,
      image: true,
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
    throw new ValidationError("Campos Obligatorios requeridos");
  }

  // Validar inputs para prevenir SQL injection y XSS
  const validation = validateUpdateUserInput({
    name,
    email,
    phone_number: phone_number || undefined,
    identification: identification || undefined,
  });

  if (!validation.isValid) {
    throw new ValidationError(validation.errors.join(', '));
  }

  // Sanitizar inputs
  const safeName = sanitizeHTML(name.trim());
  const safeEmail = email.trim().toLowerCase();

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
    ${safeName}::text, 
    ${safeEmail}::text, 
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
      emailVerified: true,
      phoneNumber: true,
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

export const updateUserImageService = async ({
  id,
  image,
}: {
  id: number;
  image: string;
}) => {
  if (!id || !image) {
    throw new Error("ID de usuario e imagen son requeridos");
  }

  const user = await prisma.user.update({
    where: { id },
    data: { image },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return {
    success: true,
    data: user,
    message: "Imagen de perfil actualizada exitosamente",
  };
};

export const addFavoriteService = async (userId: number, productId: number) => {
  if (!userId || !productId) {
    throw new Error("ID de usuario y ID de producto son requeridos");
  }

  await prisma.$executeRaw`SELECT fn_add_favorite(${userId}::int, ${productId}::int)`;
  return { success: true, message: "Producto agregado a favoritos" };
};

export const removeFavoriteService = async (
  userId: number,
  productId: number
) => {
  if (!userId || !productId) {
    throw new Error("ID de usuario y ID de producto son requeridos");
  }

  await prisma.$executeRaw`SELECT fn_remove_favorite(${userId}::int, ${productId}::int)`;
  return { success: true, message: "Producto eliminado de favoritos" };
};

export const checkIsFavoriteService = async (
  userId: number,
  productId: number
) => {
  if (!userId || !productId) {
    throw new Error("ID de usuario y ID de producto son requeridos");
  }

  const isFavorite = await prisma.favorites.findFirst({
    where: {
      user_id: userId,
      product_id: productId,
    },
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
        active: true,
      },
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
          images: {
            where: {
              is_primary: true,
            },
            select: {
              image_url: true,
              color: true,
              color_code: true,
            },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const transformedFavorites = favorites.map((favorite) => ({
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
      color: favorite.products.images[0]?.color || "Sin especificar",
      color_code: favorite.products.images[0]?.color_code || "#000000",
      image_url: favorite.products.images[0]?.image_url || null,
    },
  }));

  return transformedFavorites;
};
