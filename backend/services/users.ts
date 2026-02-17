import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import {
  createUserParams,
  updateUserParams,
  updatePasswordParams,
} from "../types/users.js";
import { roles_enum } from "../prisma/generated/prisma/client.js";
import {
  ValidationError,
  NotFoundError,
  handlePrismaError,
} from "../errors/errorsClass.js";
import {
  validateRegisterInput,
  validateUpdateUserInput,
  sanitizeHTML,
} from "../lib/security.js";

export const registerUserService = async ({
  name,
  email,
  email_verified,
  password,
  phone_number,
  identification,
  role,
  acceptTerms,
  acceptPrivacy,
}: createUserParams) => {
  // Validación ANTES del try-catch
  if (!name || !name.trim()) {
    throw new ValidationError("Nombre es obligatorio");
  }
  if (!email || !email.trim()) {
    throw new ValidationError("Email es obligatorio");
  }
  if (!password || !password.trim()) {
    throw new ValidationError("Contraseña es obligatoria");
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
    throw new ValidationError(validation.errors.join(", "));
  }

  // Sanitizar nombre (remover cualquier HTML si lo hubiera)
  const safeName = sanitizeHTML(name.trim());
  const safeEmail = email.trim().toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario con los campos de aceptación
    const newUser = await prisma.user.create({
      data: {
        name: safeName,
        email: safeEmail,
        emailVerified: email_verified || null,
        password: hashedPassword,
        phoneNumber: phone_number || null,
        identification: identification || null,
        role: (role as roles_enum) || "user",
        termsAcceptedAt: acceptTerms ? new Date() : null,
        privacyAcceptedAt: acceptPrivacy ? new Date() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phoneNumber: true,
        identification: true,
        role: true,
        termsAcceptedAt: true,
        privacyAcceptedAt: true,
      },
    });

    return {
      success: true,
      data: newUser,
      message: "Usuario registrado exitosamente",
    };
  } catch (error: any) {
    console.error("[registerUserService] Error al registrar usuario:", error);
    throw handlePrismaError(error);
  }
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
  // Validación ANTES del try-catch
  if (!page || page <= 0) {
    throw new ValidationError("Página debe ser mayor a 0");
  }
  if (!limit || limit <= 0) {
    throw new ValidationError("Límite debe ser mayor a 0");
  }

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

  try {
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
  } catch (error: any) {
    console.error(
      "[getUsersService] Error al obtener usuarios (page: " +
        page +
        ", limit: " +
        limit +
        "):",
      error
    );
    throw handlePrismaError(error);
  }
};

export const getUserByIdService = async (id: number | undefined) => {
  // Validación ANTES del try-catch
  if (!id || id <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  try {
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

    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    return user;
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error(`[getUserByIdService] Error al obtener usuario ${id}:`, error);
    throw handlePrismaError(error);
  }
};

export const updateUserService = async ({
  id,
  name,
  email,
  email_verified,
  phone_number,
  identification,
}: updateUserParams) => {
  // Validación ANTES del try-catch
  if (!id || id <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (!name || !name.trim()) {
    throw new ValidationError("Nombre es obligatorio");
  }
  if (!email || !email.trim()) {
    throw new ValidationError("Email es obligatorio");
  }

  // Validar inputs para prevenir SQL injection y XSS
  const validation = validateUpdateUserInput({
    name,
    email,
    phone_number: phone_number || undefined,
    identification: identification || undefined,
  });

  if (!validation.isValid) {
    throw new ValidationError(validation.errors.join(", "));
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

  try {
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
      throw new NotFoundError("Usuario no encontrado después de actualizar");
    }

    return user;
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error(`[updateUserService] Error al actualizar usuario ${id}:`, error);
    throw handlePrismaError(error);
  }
};

export const updatePasswordService = async ({
  id,
  newPassword,
}: updatePasswordParams) => {
  // Validación ANTES del try-catch
  if (!id || id <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (!newPassword || !newPassword.trim()) {
    throw new ValidationError("Nueva contraseña es obligatoria");
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$executeRaw`CALL sp_update_password(${id}::int, ${hashedPassword}::text)`;

    return {
      success: true,
      message: "Contraseña actualizada exitosamente",
    };
  } catch (error: any) {
    console.error(`[updatePasswordService] Error al actualizar contraseña del usuario ${id}:`, error);
    throw handlePrismaError(error);
  }
};

export const updateUserImageService = async ({
  id,
  image,
}: {
  id: number;
  image: string;
}) => {
  // Validación ANTES del try-catch
  if (!id || id <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (!image || !image.trim()) {
    throw new ValidationError("URL de imagen es obligatoria");
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { image: image.trim() },
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
  } catch (error: any) {
    console.error(`[updateUserImageService] Error al actualizar imagen del usuario ${id}:`, error);
    throw handlePrismaError(error);
  }
};

export const addFavoriteService = async (
  userId: number,
  productId: number
) => {
  // Validación ANTES del try-catch
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (!productId || productId <= 0) {
    throw new ValidationError("ID de producto inválido");
  }

  try {
    await prisma.$executeRaw`SELECT fn_add_favorite(${userId}::int, ${productId}::int)`;

    return { success: true, message: "Producto agregado a favoritos" };
  } catch (error: any) {
    console.error(
      `[addFavoriteService] Error al agregar producto ${productId} a favoritos:`,
      error
    );
    throw handlePrismaError(error);
  }
};

export const removeFavoriteService = async (
  userId: number,
  productId: number
) => {
  // Validación ANTES del try-catch
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (!productId || productId <= 0) {
    throw new ValidationError("ID de producto inválido");
  }

  try {
    await prisma.$executeRaw`SELECT fn_remove_favorite(${userId}::int, ${productId}::int)`;

    return { success: true, message: "Producto eliminado de favoritos" };
  } catch (error: any) {
    console.error(
      `[removeFavoriteService] Error al eliminar producto ${productId} de favoritos:`,
      error
    );
    throw handlePrismaError(error);
  }
};

export const checkIsFavoriteService = async (
  userId: number,
  productId: number
) => {
  // Validación ANTES del try-catch
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (!productId || productId <= 0) {
    throw new ValidationError("ID de producto inválido");
  }

  try {
    const isFavorite = await prisma.favorites.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    return isFavorite ? true : false;
  } catch (error: any) {
    console.error(
      `[checkIsFavoriteService] Error al verificar si producto es favorito (usuario: ${userId}, producto: ${productId}):`,
      error
    );
    throw handlePrismaError(error);
  }
};

export const getUserFavoritesService = async (userId: number) => {
  // Validación ANTES del try-catch
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  try {
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
  } catch (error: any) {
    console.error(`[getUserFavoritesService] Error al obtener favoritos del usuario ${userId}:`, error);
    throw handlePrismaError(error);
  }
};

// ✅ DELETE - Eliminar usuario (soft delete)
export const deleteUserService = async (userId: number): Promise<void> => {
  // Validación ANTES del try-catch
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  try {
    // Verificar que el usuario existe
    const existing = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      throw new NotFoundError("Usuario no encontrado");
    }

    // Soft delete: marcar como inactivo
    await prisma.user.update({
      where: { id: userId },
      data: { active: false },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    console.error(`[deleteUserService] Error al eliminar usuario ${userId}:`, error);
    throw handlePrismaError(error);
  }
};

// ============================================
// ADMIN FUNCTIONS - Users/Customers
// ============================================

// PUT - Edit customer
export const editCustomerService = async (
  customerId: number,
  data: {
    name?: string;
    email?: string;
    phone_number?: string;
  }
): Promise<any> => {
  // Validación ANTES del try-catch
  if (!customerId || customerId <= 0) {
    throw new ValidationError("ID de cliente inválido");
  }
  if (Object.keys(data).length === 0) {
    throw new ValidationError("Debe proporcionar al menos un campo para actualizar");
  }
  if (data.email && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new ValidationError("Email inválido");
  }

  try {
    // Verify customer exists and is a user (not admin)
    const existing = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!existing) {
      throw new NotFoundError("Cliente no encontrado");
    }

    if (existing.role !== "user") {
      throw new ValidationError("Solo se pueden editar clientes, no staff/admins");
    }

    // Check for duplicate email (if changing)
    if (data.email) {
      const duplicateEmail = await prisma.user.findFirst({
        where: {
          email: { equals: data.email.trim(), mode: "insensitive" },
          NOT: { id: customerId },
        },
      });

      if (duplicateEmail) {
        throw new ValidationError("Este email ya está en uso");
      }
    }

    // Check for duplicate phone (if provided)
    if (data.phone_number) {
      const duplicatePhone = await prisma.user.findFirst({
        where: {
          phone_number: data.phone_number,
          NOT: { id: customerId },
        },
      });

      if (duplicatePhone) {
        throw new ValidationError("Este teléfono ya está en uso");
      }
    }

    // Update customer
    const updated = await prisma.user.update({
      where: { id: customerId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.email && { email: data.email.trim() }),
        ...(data.phone_number && { phoneNumber: data.phone_number }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        active: true,
        createdAt: true,
      },
    });

    return updated;
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(`[editCustomerService] Error al editar cliente ${customerId}:`, error);
    throw handlePrismaError(error);
  }
};

// DELETE - Delete customer (hard delete)
export const deleteCustomerService = async (customerId: number): Promise<void> => {
  // Validación ANTES del try-catch
  if (!customerId || customerId <= 0) {
    throw new ValidationError("ID de cliente inválido");
  }

  try {
    // Verify customer exists
    const existing = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!existing) {
      throw new NotFoundError("Cliente no encontrado");
    }

    if (existing.role !== "user") {
      throw new ValidationError("Solo se pueden eliminar clientes, no staff/admins");
    }

    // Delete customer
    await prisma.user.delete({
      where: { id: customerId },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(
      `[deleteCustomerService] Error al eliminar cliente ${customerId}:`,
      error
    );
    throw handlePrismaError(error);
  }
};

// GET - Export all customers for CSV/Excel
export const exportCustomersService = async (): Promise<any[]> => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "user" },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        orders: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Format for export
    return customers.map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phoneNumber,
      active: c.active,
      orderCount: c.orders?.length || 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  } catch (error: any) {
    console.error("[exportCustomersService] Error al exportar clientes:", error);
    throw handlePrismaError(error);
  }
};

export const editProfileService = async ({
  userId,
  name,
  phone,
  image,
  currentPassword,
  newPassword,
}: {
  userId: number;
  name: string;
  phone?: string;
  image?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  // Validation
  if (!userId || userId <= 0) {
    throw new ValidationError("Invalid user ID");
  }
  if (!name || !name.trim()) {
    throw new ValidationError("Name is required");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true, image: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Validate password if provided
    if (currentPassword && newPassword) {
      // Ensure user.password exists before comparing
      if (!user.password) {
        throw new ValidationError("User account has no password set");
      }
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        throw new ValidationError("Current password is incorrect");
      }
    } else if (currentPassword || newPassword) {
      throw new ValidationError("Both current and new password are required");
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      name: name.trim(),
      updatedAt: new Date(),
    };

    // Update phone if provided
    if (phone && phone.trim() !== "") {
      updateData.phoneNumber = phone.trim();
    } else {
      updateData.phoneNumber = null;
    }

    // Update image if provided
    if (image && image.trim()) {
      updateData.image = image.trim();
    }

    // Hash and update password if provided
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
      },
    });

    return {
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    };
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    console.error(
      `[editProfileService] Error updating profile for user ${userId}:`,
      error
    );
    throw handlePrismaError(error);
  }
};
