import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();


export const addProductToCart  = async (userId?: number, productId?: number, quantity?: number) => {
    if (!userId || !productId || !quantity) throw new Error('Parámetros inválidos');

    let cart = await prisma.cart.findFirst({
        where: { userId }
    })

    if (!cart) {
        await prisma.$executeRawUnsafe(`CALL sp_createCart(${userId})`);    
        cart = await prisma.cart.findFirst({where: { userId }})
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
        await prisma.$executeRawUnsafe(`CALL sp_addProductToCart(${userId}, ${productId}, ${quantity})`); 
    }

};
