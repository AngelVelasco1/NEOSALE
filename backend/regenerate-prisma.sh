#!/bin/bash
# Script para regenerar Prisma después de cambios en schema

echo "🔄 Regenerando cliente de Prisma..."

# Detener procesos de Bun (opcional)
# taskkill /F /IM bun.exe 2>nul || true

# Eliminar caché de Prisma
rm -rf node_modules/.prisma

# Regenerar cliente
bun prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Cliente de Prisma regenerado exitosamente"
    echo ""
    echo "Ahora puedes iniciar el servidor:"
    echo "  bun run dev"
else
    echo "❌ Error al regenerar Prisma"
    echo ""
    echo "Si el error persiste:"
    echo "  1. Cierra todos los terminales y VSCode"
    echo "  2. Abre VSCode nuevamente"
    echo "  3. Ejecuta: bun prisma generate"
fi
