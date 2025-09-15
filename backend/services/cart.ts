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
              product_variants: {
                select: {
                  size: true,
                  color_code: true,
                  stock: true,
                }
              },
              images: {
                select: {
                  image_url: true,
                  is_primary: true,
                  color_code: true,
                },
                orderBy: {
                  is_primary: 'desc',
                }
              }
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
    const variant = item.products.product_variants.find((variant) => 
        variant.color_code === item.color_code &&
        variant.size === item.size
    );

    const selectedColorImage = item.products.images.find(img => 
      img.color_code === item.color_code
    );

    const fallbackImage = item.products.images.find(img => img.is_primary) 
                         || item.products.images[0];

    const selectedImage = selectedColorImage || fallbackImage;

    return {
      id: item.products.id,
      color_code: item.color_code,
      name: item.products.name,
      price: item.products.price,
      quantity: item.quantity,
      size: item.size,
      total: item.quantity * item.unit_price, 
      stock: variant?.stock || 0,
      image_url: selectedImage?.image_url || null,
      alt_text: selectedImage?.color_code ? 
        `${item.products.name} color ${selectedImage.color_code}` : 
        item.products.name,
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

  await prisma.$executeRaw`CALL sp_delete_product_from_cart(${user_id}::integer, ${product_id}::integer, ${color_code}::varchar, ${size}::varchar)`;
};

export const updateProductQuantityService = async (
  user_id: number,
  product_id: number,
  new_quantity: number,
  color_code: string,
  size: string,
) => {
  if (!user_id || !product_id || new_quantity < 0 || !color_code || !size) {
    throw new Error("Parámetros inválidos");
  }

  await prisma.$executeRaw`CALL sp_update_cart_quantity(${user_id}::integer, ${product_id}::integer, ${new_quantity}::integer, ${color_code}::varchar, ${size}::varchar)`;
}