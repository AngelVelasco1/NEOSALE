import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const getProductsService = async (id?: number) => {
    if (!id) {
        const products = await prisma.products.findMany({
            include: {
                images: {
                    take: 1 
                },
                categories: true 
            }
        });

        return products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            sizes: p.sizes,
            imageUrl: p.images[0]?.imageurl,
            colorCode: p.images[0]?.colorcode,
            color: p.images[0]?.color,
            category: p.categories?.name 
        }));
    }
    
    const product = await prisma.products.findUnique({
        where: { id },
        include: {
            images: true,
            categories: true 
        }
    });
      return product
};

export const getLatestProductsService = async () => {
    const products = await prisma.products.findMany({
        orderBy: { id: 'desc' },
        take: 6,
        include: {
            images: {
                take: 1
            }
        }
    });
    return products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            imageUrl: p.images[0]?.imageurl,
            colorCode: p.images[0]?.colorcode,
            color: p.images[0]?.color
    }));
};