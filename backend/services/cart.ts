import { prisma } from "../lib/prisma";

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
  const cart = await prisma.cart.findFirst({
    where: { user_id: parseInt(user_id) },
    include: {
      cart_items: {
        include: {
          products: {
            include: {
              categories: true,
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
                orderBy: {
                  is_primary: "desc",
                },
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

  const cartItems: CartItem[] = cart.cart_items.map((item) => {
    const variant = item.products.product_variants.find(
      (v) => v.color_code === item.color_code && v.size === item.size
    );

    const colorImage = item.products.images.find(
      (img) => img.color_code === item.color_code
    );
    const primaryImage = item.products.images.find((img) => img.is_primary);
    const fallbackImage = item.products.images[0];

    const selectedImage = colorImage || primaryImage || fallbackImage;

    return {
      id: item.products.id,
      color_code: item.color_code,
      name: item.products.name,
      price: Number(item.products.price),
      quantity: item.quantity,
      description:
        item.products.description ||
        `${item.products.name} - Color: ${item.color_code} - Talla: ${item.size}`,
      size: item.size,
      total: item.quantity * item.unit_price,
      stock: variant?.stock || 0,
      image_url: selectedImage?.image_url || null,
      alt_text: selectedImage?.color_code
        ? `${item.products.name} color ${selectedImage.color_code}`
        : item.products.name,
      category: item.products.categories?.name || "general",
    };
  });

  return {
    items: cartItems,
    total_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    total_amount: cartItems.reduce((sum, item) => sum + item.total, 0),
    cart_id: cart.id,
  };
};

export const addProductToCartService = async (
  user_id: string,
  product_id: number,
  color_code: string,
  size: string,
  quantity: number
): Promise<CartResponse> => {
  if (!user_id || !product_id || quantity <= 0 || !color_code || !size) {
    throw new Error("Parámetros inválidos");
  }

  await prisma.$executeRaw`CALL sp_add_product_to_cart(${user_id}::integer, ${product_id}::integer, ${quantity}::integer, ${color_code}::varchar, ${size}::varchar)`;

  return await getCartService(user_id);
};

export const updateCartItemService = async (
  user_id: string,
  product_id: number,
  quantity: number,
  color_code: string,
  size: string
): Promise<CartResponse> => {
  if (!user_id || !product_id || quantity < 0 || !color_code || !size) {
    throw new Error("Parámetros inválidos");
  }

  if (quantity === 0) {
    return await removeCartItemService(user_id, product_id, color_code, size);
  }

  await prisma.$queryRaw`
    CALL sp_update_cart_quantity(${user_id}::integer, ${product_id}::integer, ${quantity}::integer, ${color_code}::varchar, ${size}::varchar)
  `;

  return await getCartService(user_id);
};

export const removeCartItemService = async (
  user_id: string,
  product_id: number,
  color_code: string,
  size: string
): Promise<CartResponse> => {
  if (!user_id || !product_id || !color_code || !size) {
    throw new Error("Parámetros inválidos");
  }

  await prisma.$executeRaw`CALL sp_delete_product_from_cart(${user_id}::integer, ${product_id}::integer, ${color_code}::varchar, ${size}::varchar)`;

  return await getCartService(user_id);
};

export const getCartItemIdService = async (
  user_id: string,
  product_id: number,
  color_code: string,
  size: string
): Promise<number | null> => {
  try {
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        cart: { user_id: parseInt(user_id) },
        product_id,
        color_code,
        size,
      },
      select: { id: true },
    });

    return cartItem?.id || null;
  } catch (error) {
    return null;
  }
};

export const clearCartService = async (
  user_id: string
): Promise<CartResponse> => {
  if (!user_id) {
    throw new Error("ID de usuario requerido");
  }

  await prisma.$queryRaw`CALL ClearCart(${user_id})`;

  return {
    items: [],
    total_items: 0,
    total_amount: 0,
    cart_id: 0,
  };
};
