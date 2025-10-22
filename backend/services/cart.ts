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
                  /*                   color: true,
                   */ stock: true,
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

  const cartItems: CartItem[] = cart.cart_items.map((item) => {
    const product = item.products;

    const variant = product.product_variants.find(
      (v) => v.color_code === item.color_code && v.size === item.size
    );

    const selectedImage =
      product.images.find((img) => img.color_code === item.color_code) ||
      product.images.find((img) => img.is_primary) ||
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
    await prisma.$executeRaw`
      CALL sp_delete_product_from_cart(${user_id}::integer, ${product_id}::integer, ${color_code}::varchar, ${size}::varchar)
    `;
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

export const getCartItemService = async (
  user_id: string,
  product_id: number,
  color_code: string,
  size: string
): Promise<number | null> => {
  if (!user_id || !product_id || !color_code || !size) {
    throw new Error("Parámetros inválidos");
  }

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
};

export const clearCartService = async (
  user_id: string
): Promise<CartResponse> => {
  if (!user_id) {
    throw new Error("ID de usuario requerido");
  }
  const userId = parseInt(user_id);

  await prisma.$executeRaw`SELECT fn_clear_cart(${userId}::integer)`;

  return {
    items: [],
    total_items: 0,
    total_amount: 0,
    cart_id: 0,
  };
};
