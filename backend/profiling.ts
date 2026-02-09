/**
 * Profiling script - Agrega middleware para medir timing de queries y requests
 */

import { prisma } from "./lib/prisma.js";

// Medir tiempo de cada query
export function enableQueryProfiling() {
  // Hook en Prisma para medir queries
  const originalQuery = prisma.$executeRaw;
  
  (prisma as any).$on('query', (e: any) => {
    console.log(`⏱️ Query: ${e.query}`);
    console.log(`⏱️ Params: ${e.params}`);
    console.log(`⏱️ Duration: ${e.duration}ms`);
    console.log('---');
  });
}

/**
 * Middleware para profiling de requests en Express
 */
export function requestProfilingMiddleware(req: any, res: any, next: any) {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;

  // Hook en end de response
  const originalEnd = res.end;
  res.end = function(...args: any[]) {
    const duration = Date.now() - startTime;
    const memoryUsed = process.memoryUsage().heapUsed - startMemory;
    
    console.log(`
╔════════════════════════════════════════╗
║ REQUEST PROFILING
╠════════════════════════════════════════╣
║ Method: ${req.method} ${req.path}
║ Status: ${res.statusCode}
║ Duration: ${duration}ms
║ Memory: ${(memoryUsed / 1024 / 1024).toFixed(2)}MB
║ Cache Hit: ${req.cacheHit ? 'YES' : 'NO'}
╚════════════════════════════════════════╝
    `);

    if (duration > 500) {
      console.warn(`⚠️ SLOW REQUEST: ${duration}ms`);
    }

    return originalEnd.apply(res, args);
  };

  next();
}

/**
 * Wrapper for measuring Prisma operations
 */
export async function measurePrismaOp<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    console.log(`✅ ${name} - ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ ${name} - ${duration}ms - ${error}`);
    throw error;
  }
}
