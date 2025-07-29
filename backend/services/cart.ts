import { prisma } from '../lib/prisma'

export const addProductToCart  = async (user_id?: number, product_id?: number, quantity?: number) => {
    if (!user_id || !product_id || !quantity) throw new Error('Parámetros inválidos');

    let cart = await prisma.cart.findFirst({
        where: { user_id }
    })

    if (!cart) {
        await prisma.$executeRawUnsafe(`CALL sp_create_cart(${user_id})`);    
        cart = await prisma.cart.findFirst({ where: { user_id } })
    }

    const existsProduct = await prisma.cart_items.findFirst({
        where: {
            cartid: cart?.id,
            productid: product_id
        }
    })

    if (existsProduct) {
        await prisma.cart_items.update({
            where: {
                id: existsProduct.id 
            },
            data: {
                quantity: existsProduct.quantity + quantity,
            },
        });
    }
    else {
        await prisma.$executeRawUnsafe(`CALL sp_add_product_to_cart(${user_id}, ${product_id}, ${quantity})`); 
    }
};
