import { prisma } from "./lib/prisma.js";

async function seedProducts() {
  try {
    console.log("Iniciando seed de productos...");

    // Primero, crear una categoría
    const category = await prisma.categories.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: "Electrónica",
        description: "Productos electrónicos",
        active: true,
      },
    });

    console.log("Categoría creada:", category.name);

    // Crear productos de prueba
    const products = [
      {
        name: "Laptop Pro",
        description: "Laptop de alto rendimiento para profesionales",
        price: 1299.99,
        stock: 10,
        sizes: "15.6 pulgadas",
        base_discount: 0,
        category_id: category.id,
        active: true,
      },
      {
        name: "Mouse Inalámbrico",
        description: "Mouse inalámbrico con batería de larga duración",
        price: 29.99,
        stock: 50,
        sizes: "Standard",
        base_discount: 10,
        category_id: category.id,
        active: true,
      },
      {
        name: "Teclado Mecánico",
        description: "Teclado mecánico RGB para gaming",
        price: 149.99,
        stock: 25,
        sizes: "104 teclas",
        base_discount: 5,
        category_id: category.id,
        active: true,
      },
      {
        name: "Monitor 4K",
        description: "Monitor 4K UHD de 27 pulgadas",
        price: 399.99,
        stock: 15,
        sizes: "27 pulgadas",
        base_discount: 0,
        category_id: category.id,
        active: true,
      },
      {
        name: "Headphones Bluetooth",
        description: "Auriculares inalámbricos con cancelación de ruido",
        price: 199.99,
        stock: 30,
        sizes: "Universal",
        base_discount: 15,
        category_id: category.id,
        active: true,
      },
      {
        name: "Webcam HD",
        description: "Cámara web 1080p para conferencias",
        price: 79.99,
        stock: 20,
        sizes: "HD 1080p",
        base_discount: 0,
        category_id: category.id,
        active: true,
      },
      {
        name: "USB-C Hub",
        description: "Hub multifunción con 7 puertos USB-C",
        price: 59.99,
        stock: 40,
        sizes: "7 puertos",
        base_discount: 5,
        category_id: category.id,
        active: true,
      },
      {
        name: "Mousepad XL",
        description: "Mousepad XL con base antideslizante",
        price: 24.99,
        stock: 60,
        sizes: "90x40cm",
        base_discount: 0,
        category_id: category.id,
        active: true,
      },
    ];

    for (const product of products) {
      const created = await prisma.products.create({
        data: {
          ...product,
        },
      });

      console.log("✓ Producto creado:", created.name);
    }

    console.log("\n✓ Seed completado exitosamente!");
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
