import { prisma } from '../lib/prisma'

export const addProductToCart  = async (userid?: number, productId?: number, quantity?: number) => {
    if (!userid || !productId || !quantity) throw new Error('Parámetros inválidos');

    let cart = await prisma.cart.findFirst({
        where: { userid }
    })

    if (!cart) {
        await prisma.$executeRawUnsafe(`CALL sp_createCart(${userid})`);    
        cart = await prisma.cart.findFirst({where: { userid }})
    }
    

    const existsProduct = await prisma.cart_items.findFirst({
        where: 
        {
            cartid: cart.id,
            productid: productId
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
        await prisma.$executeRawUnsafe(`CALL sp_addProductToCart(${userid}, ${productId}, ${quantity})`); 
    }

};
