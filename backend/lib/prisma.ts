
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const global = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaBase = new PrismaClient();

export const prisma = prismaBase.$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
