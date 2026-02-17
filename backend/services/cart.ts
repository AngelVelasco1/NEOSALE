import { prisma } from "../lib/prisma.js";
import {
  ValidationError,
  NotFoundError,
  handlePrismaError,
} from "../errors/errorsClass.js";

export interface CartItem {
  id: number;
  color_code: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  size: string;
  total: number;
  stock: number;
  image_url: string | null;
  alt_text: string;
  category: string;
}

export interface CartResponse {
  items: CartItem[];
  total_items: number;
  total_amount: number;
  cart_id: number;
}

export const getCartService = async (
  user_id: string
): Promise<CartResponse> => {
  // Validación ANTES del try-catch
  if (!user_id || !user_id.trim()) {
    throw new ValidationError("ID de usuario requerido");
  }

  const userId = parseInt(user_id);
  if (isNaN(userId) || userId <= 0) {
    throw new ValidationError("ID de usuario debe ser un número válido");
  }

  try {
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      select: {
        id: true,
        cart_items: {
          select: {
            quantity: true,
            unit_price: true,
            color_code: true,
            size: true,
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
                categories: {
                  select: { name: true },
                },
                product_variants: {
                  where: {
                    color_code: { not: undefined },
                    size: { not: undefined },
                  },
                  select: {
                    size: true,
                    color_code: true,
                    stock: true,
                  },
                },
                images: {
                  select: {
                    image_url: true,
                    is_primary: true,
                    color_code: true,
                  },
                  orderBy: { is_primary: "desc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.cart_items.length === 0) {
      return {
        items: [],
        total_items: 0,
        total_amount: 0,
        cart_id: cart?.id || 0,
      };
    }

    const cartItems: CartItem[] = cart.cart_items.map((item: any) => {
      const product = item.products;

      const variant = product.product_variants.find(
        (v: any) => v.color_code === item.color_code && v.size === item.size
      );

      const selectedImage =
        product.images.find((img: any) => img.color_code === item.color_code) ||
        product.images.find((img: any) => img.is_primary) ||
        product.images[0];

      return {
        id: product.id,
        color_code: item.color_code,
        name: product.name,
        price: Number(product.price),
        quantity: item.quantity,
        description:
          product.description ||
          `${product.name} - ${item.color_code} - ${item.size}`,
        size: item.size,
        total: item.quantity * Number(item.unit_price),
        stock: variant?.stock || 0,
        image_url: selectedImage?.image_url || null,
        alt_text: selectedImage
          ? `${product.name} ${selectedImage.color_code}`
          : product.name,
        category: product.categories?.name || "general",
      };
    });

    let total_items = 0;
    let total_amount = 0;

    for (const item of cartItems) {
      total_items += item.quantity;
      total_amount += item.total;
    }

    return {
      items: cartItems,
      total_items,
      total_amount,
      cart_id: cart.id,
    };
  } catch (error: any) {
    console.error(`[getCartService] Error al obtener carrito del usuario ${user_id}:`, error);
    throw handlePrismaError(error);
  }
};

export const addProductToCartService = async (
  user_id: string,
  product_id: number,
  color_code: string,
  size: string,
  quantity: number
): Promise<CartResponse> => {
  // Validación ANTES del try-catch
  if (!user_id || !user_id.trim()) {
    throw new ValidationError("ID de usuario requerido");
  }
  if (!product_id || product_id <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (quantity <= 0) {
    throw new ValidationError("La cantidad debe ser mayor a 0");
  }
  if (!color_code || !color_code.trim()) {
    throw new ValidationError("Código de color requerido");
  }
  if (!size || !size.trim()) {
    throw new ValidationError("Talla requerida");
  }

  const userId = parseInt(user_id);
  if (isNaN(userId) || userId <= 0) {
    throw new ValidationError("ID de usuario debe ser un número válido");
  }

  try {
    await prisma.$executeRaw`
      CALL sp_add_product_to_cart(
        ${user_id}::integer, 
        ${product_id}::integer, 
        ${quantity}::integer, 
        ${color_code.trim()}::varchar, 
        ${size.trim()}::varchar
      )
    `;

    return await getCartService(user_id);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error(`[addProductToCartService] Error al agregar producto ${product_id} al carrito:`, error);
    throw handlePrismaError(error);
  }
};

export const updateCartItemService = async (
  user_id: string,
  product_id: number,
  quantity: number,
  color_code: string,
  size: string
): Promise<CartResponse> => {
  // Validación ANTES del try-catch
  if (!user_id || !user_id.trim()) {
    throw new ValidationError("ID de usuario requerido");
  }
  if (!product_id || product_id <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (quantity < 0) {
    throw new ValidationError("La cantidad no puede ser negativa");
  }
  if (!color_code || !color_code.trim()) {
    throw new ValidationError("Código de color requerido");
  }
  if (!size || !size.trim()) {
    throw new ValidationError("Talla requerida");
  }

  const userId = parseInt(user_id);
  if (isNaN(userId) || userId <= 0) {
    throw new ValidationError("ID de usuario debe ser un número válido");
  }

  try {
    if (quantity === 0) {
      await prisma.$executeRaw`
        CALL sp_delete_product_from_cart(
          ${user_id}::integer, 
          ${product_id}::integer, 
          ${color_code.trim()}::varchar, 
          ${size.trim()}::varchar
        )
      `;
    } else {
      await prisma.$queryRaw`
        CALL sp_update_cart_quantity(
          ${user_id}::integer, 
          ${product_id}::integer, 
          ${quantity}::integer, 
          ${color_code.trim()}::varchar, 
          ${size.trim()}::varchar
        )
      `;
    }

    return await getCartService(user_id);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error(`[updateCartItemService] Error al actualizar cantidad del producto ${product_id}:`, error);
    throw handlePrismaError(error);
  }
};

export const removeCartItemService = async (
  user_id: string,
  product_id: number,
  color_code: string,
  size: string
): Promise<CartResponse> => {
  // Validación ANTES del try-catch
  if (!user_id || !user_id.trim()) {
    throw new ValidationError("ID de usuario requerido");
  }
  if (!product_id || product_id <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (!color_code || !color_code.trim()) {
    throw new ValidationError("Código de color requerido");
  }
  if (!size || !size.trim()) {
    throw new ValidationError("Talla requerida");
  }

  const userId = parseInt(user_id);
  if (isNaN(userId) || userId <= 0) {
    throw new ValidationError("ID de usuario debe ser un número válido");
  }

  try {

    await prisma.cart_items.deleteMany({
      where: {
        cart: { user_id: userId },
        product_id,
        color_code: color_code.trim(),
        size: size.trim(),
      },
    });

    return await getCartService(user_id);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error(`[removeCartItemService] Error al eliminar producto ${product_id} del carrito:`, error);
    throw handlePrismaError(error);
  }
};

export const getCartItemService = async (
  user_id: string,
  product_id: number,
  color_code: string,
  size: string
): Promise<number | null> => {
  // Validación ANTES del try-catch
  if (!user_id || !user_id.trim()) {
    throw new ValidationError("ID de usuario requerido");
  }
  if (!product_id || product_id <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (!color_code || !color_code.trim()) {
    throw new ValidationError("Código de color requerido");
  }
  if (!size || !size.trim()) {
    throw new ValidationError("Talla requerida");
  }

  const userId = parseInt(user_id);
  if (isNaN(userId) || userId <= 0) {
    throw new ValidationError("ID de usuario debe ser un número válido");
  }

  try {
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        cart: { user_id: userId },
        product_id,
        color_code: color_code.trim(),
        size: size.trim(),
      },
      select: { id: true },
    });

    return cartItem?.id || null;
  } catch (error: any) {
    console.error(`[getCartItemService] Error al obtener item del carrito:`, error);
    throw handlePrismaError(error);
  }
};

export const clearCartService = async (
  user_id: string
): Promise<CartResponse> => {
  // Validación ANTES del try-catch
  if (!user_id || !user_id.trim()) {
    throw new ValidationError("ID de usuario requerido");
  }

  const userId = parseInt(user_id);
  if (isNaN(userId) || userId <= 0) {
    throw new ValidationError("ID de usuario debe ser un número válido");
  }

  try {
    await prisma.$executeRaw`SELECT fn_clear_cart(${userId}::integer)`;

    return {
      items: [],
      total_items: 0,
      total_amount: 0,
      cart_id: 0,
    };
  } catch (error: any) {
    console.error(`[clearCartService] Error al limpiar carrito del usuario ${user_id}:`, error);
    throw handlePrismaError(error);
  }
};
