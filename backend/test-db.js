const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Connected to database successfully');
    
    // Test if we can query products
    const products = await prisma.products.findMany({
      take: 1
    });
    console.log('✅ Can query products table:', products.length, 'records found');
    
    // Test latest products query (like in your service)
    const latestProducts = await prisma.products.findMany({
      orderBy: { id: 'desc' },
      take: 6,
      include: {
        images: {
          take: 1
        }
      }
    });
    console.log('✅ Latest products query works:', latestProducts.length, 'records found');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
