import { prisma } from "../lib/prisma";

export const getCartService = async (user_id: number) => {
  const cart = await prisma.cart.findFirst({
    where: { user_id: user_id },
    include: {
      cart_items: {
        include: {
          products: {
            include: {
              categories: true,
              images: true,
            },
          },
        },
      },
    },
  });
  if (!cart) {
    return [];
  }
  const cartProducts = cart.cart_items.map((item) => {
    const selectedImage = item.color_code
      ? item.products.images.find(
          (img) => img.color_code === item.color_code 
        )
      : item.products.images[0];
    return {
      id: item.products.id,
      color: selectedImage?.color || null,
      color_code: selectedImage?.color_code || null,
      imageUrl: selectedImage?.image_url || null,
      name: item.products.name,
      price: item.products.price,
      quantity: item.quantity,
      size: item.size,
      total: item.quantity * item.unit_price,
    };
  });

  return cartProducts;
};

export const addProductToCartService = async (
  user_id: number,
  product_id: number,
  quantity: number,
  color_code: string,
  size: string,
) => {
  if (!user_id || !product_id || !quantity || quantity <= 0) {
    throw new Error("Parámetros inválidos");
  }

  const cart = await prisma.cart.findFirst({
    where: { user_id: user_id },
  });

  if (!cart) {
    await prisma.$executeRaw`CALL sp_create_cart(${user_id}::integer)`;
  }

  await prisma.$executeRaw`CALL sp_add_product_to_cart(${user_id}::integer, ${product_id}::integer, ${quantity}::integer, ${color_code}::varchar, ${size}::varchar)`;
};

export const deleteProductFromCartService = async (
  user_id: number,
  product_id: number,
  color_code: string,
  size: string,
) => {
  if (!user_id || !product_id || !color_code || !size) {
    throw new Error("Parámetros inválidos");
  }

  await prisma.$executeRaw`CALL sp_delete_product_from_cart(${user_id}::integer, ${product_id}::integer, ${color_code}::varchar ${size}::varchar )`;
};
