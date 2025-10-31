# Script de Actualización Masiva - Supabase a Prisma

## Cambios Realizados

### ✅ Infraestructura
1. **API Route creada:** `/app/api/products/route.ts`
   - GET endpoint con Prisma
   - Paginación, búsqueda, filtros

2. **Servicio actualizado:** `services/products/index.ts`
   - `fetchProducts()` usa fetch API en lugar de Supabase
   - Mantiene misma firma (compatibilidad)

3. **Componente actualizado:** `dashboard/products/_components/products-table/index.tsx`
   - Eliminado `createBrowserClient`
   - Llamada directa a `fetchProducts(params)`

## 📋 Patrón de Actualización

### Para Componentes del Cliente (useQuery)

**ANTES (Supabase):**
```typescript
import { createBrowserClient } from "@/lib/supabase/client";

queryFn: () => fetchData(createBrowserClient(), { params })
```

**DESPUÉS (Prisma):**
```typescript
// Sin import de Supabase

queryFn: () => fetchData({ params })
```

### Para Servicios

**ANTES (Supabase):**
```typescript
export async function fetchData(
  client: SupabaseClient<Database>,
  params: Params
): Promise<Response> {
  const { data } = await client.from("table").select();
  return data;
}
```

**DESPUÉS (Prisma/API):**
```typescript
export async function fetchData(
  params: Params,
  _client?: any // Compatibilidad
): Promise<Response> {
  const queryParams = new URLSearchParams(params);
  const response = await fetch(`/api/endpoint?${queryParams}`);
  return response.json();
}
```

### Para API Routes

**NUEVO (Prisma):**
```typescript
// app/api/endpoint/route.ts
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const data = await prisma.table.findMany({
    where: { /* filtros */ },
    include: { /* relaciones */ },
  });
  
  return NextResponse.json({ data });
}
```

## 🔄 Archivos Pendientes de Actualizar

### Alta Prioridad (Causan errores)
1. ✅ `dashboard/products/_components/products-table/index.tsx`
2. ⏳ `dashboard/orders/_components/orders-table/index.tsx`
3. ⏳ `dashboard/categories/_components/categories-table/index.tsx`
4. ⏳ `dashboard/coupons/_components/coupons-table/index.tsx`
5. ⏳ `dashboard/customers/_components/customers-table/index.tsx`
6. ⏳ `dashboard/staff/_components/staff-table/index.tsx`

### Media Prioridad (Páginas del servidor)
7. ⏳ `dashboard/products/[slug]/page.tsx`
8. ⏳ `dashboard/orders/[id]/page.tsx`
9. ⏳ `dashboard/customer-orders/[id]/page.tsx`
10. ⏳ `dashboard/edit-profile/page.tsx`

### Baja Prioridad (Filtros y helpers)
11. ⏳ `dashboard/products/_components/ProductFilters.tsx`
12. ⏳ `dashboard/staff/_components/StaffFilters.tsx`
13. ⏳ `components/shared/form/FormCategoryInput.tsx`
14. ⏳ `components/shared/notifications/*`
15. ⏳ `helpers/getUser.ts`

## 🚀 Próximos Pasos

### 1. Crear API Routes Restantes
```bash
app/api/
├── products/route.ts ✅
├── orders/route.ts ⏳
├── categories/route.ts ⏳
├── coupons/route.ts ⏳
├── customers/route.ts ⏳
├── staff/route.ts ⏳
└── notifications/route.ts ⏳
```

### 2. Actualizar Servicios
- `services/orders/index.ts`
- `services/categories/index.ts`
- `services/coupons/index.ts`
- `services/customers/index.ts`
- `services/staff/index.ts`
- `services/notifications/index.ts`

### 3. Actualizar Componentes
- Eliminar imports de `createBrowserClient`
- Actualizar llamadas a servicios

## 💡 Comando de Búsqueda y Reemplazo

Para encontrar todos los archivos que usan Supabase:

```bash
# PowerShell
Get-ChildItem -Path "app\(admin)" -Recurse -Filter "*.tsx","*.ts" | 
  Select-String -Pattern "createBrowserClient|createServerClient|createServerActionClient"
```

## ⚠️ Notas Importantes

1. **No cambiar lógica**, solo sintaxis
2. **Mantener compatibilidad** con parámetro opcional `_client`
3. **Usar fetch** en servicios del cliente
4. **Usar Prisma** en API routes del servidor
5. **Mantener tipos** existentes (Product, Order, etc.)

## 📊 Progreso Estimado

- API Routes: 1/7 (14%)
- Servicios: 1/7 (14%)
- Componentes: 1/15 (7%)
- **Total: 3/29 (10%)**

---

**Estrategia:** Crear todas las API routes primero, luego actualizar servicios en batch, finalmente actualizar componentes.
