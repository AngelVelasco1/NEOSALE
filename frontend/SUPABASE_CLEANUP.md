# Limpieza de Supabase - Archivos Afectados

## ✅ Eliminado

### Archivos y Carpetas
- ✅ `app/(admin)/lib/supabase/` - Carpeta completa eliminada
  - `client.ts`
  - `server.ts`
  - `server-action.ts`
- ✅ `app/(admin)/types/supabase.ts` - Archivo eliminado

## ⚠️ Archivos que Requieren Actualización

### Server Actions (Comentados - Retornan error temporal)
- `actions/categories/addCategory.ts`
- `actions/categories/editCategory.ts`
- `actions/categories/editCategories.ts`
- `actions/categories/deleteCategory.ts`
- `actions/categories/deleteCategories.ts`
- `actions/categories/toggleCategoryStatus.ts`
- `actions/categories/exportCategories.ts`
- `actions/coupons/addCoupon.ts`
- `actions/coupons/editCoupon.ts`
- `actions/coupons/editCoupons.ts`
- `actions/coupons/deleteCoupon.ts`
- `actions/coupons/deleteCoupons.ts`
- `actions/coupons/toggleCouponStatus.ts`
- `actions/coupons/exportCoupons.ts`
- `actions/customers/editCustomer.ts`
- `actions/customers/deleteCustomer.ts`
- `actions/customers/exportCustomers.ts`
- `actions/orders/changeOrderStatus.ts`
- `actions/orders/exportOrders.ts`
- `actions/staff/editStaff.ts`
- `actions/staff/deleteStaff.ts`
- `actions/staff/toggleStaffStatus.ts`
- `actions/profile/editProfile.ts`

### Componentes del Cliente
- `dashboard/products/_components/ProductFilters.tsx`
- `dashboard/products/_components/products-table/index.tsx`
- `dashboard/categories/_components/categories-table/index.tsx`
- `dashboard/coupons/_components/coupons-table/index.tsx`
- `dashboard/customers/_components/customers-table/index.tsx`
- `dashboard/staff/_components/staff-table/index.tsx`
- `dashboard/staff/_components/StaffFilters.tsx`
- `components/shared/form/FormCategoryInput.tsx`
- `components/shared/notifications/NotificationContent.tsx`
- `components/shared/notifications/NotificationsBadge.tsx`
- `components/shared/notifications/NotificationItem.tsx`

### Páginas del Servidor
- `dashboard/edit-profile/page.tsx`
- `dashboard/orders/[id]/page.tsx`
- `dashboard/products/[slug]/page.tsx`
- `dashboard/customer-orders/[id]/page.tsx`

### Servicios (API Calls)
- `services/products/index.ts`
- `services/categories/index.ts`
- `services/coupons/index.ts`
- `services/customers/index.ts`
- `services/orders/index.ts`
- `services/staff/index.ts`
- `services/notifications/index.ts`

### Helpers
- `helpers/getUser.ts`
- `helpers/queryPaginatedTable.ts`

### Contextos
- `contexts/UserContext.tsx`

## 🔧 Estrategia de Migración

### Opción 1: Comentar Todo (Rápido)
Comentar todos los imports y funciones que usan Supabase para evitar errores de compilación.

**Pros:**
- ✅ Rápido
- ✅ Sin errores de compilación
- ✅ Puedes probar `addProduct` inmediatamente

**Contras:**
- ❌ Muchas funcionalidades no disponibles
- ❌ Requiere migración manual después

### Opción 2: Migrar por Módulos (Recomendado)
Migrar módulo por módulo en orden de prioridad.

**Orden sugerido:**
1. ✅ Products (2/7 completado)
2. Categories
3. Orders
4. Customers
5. Coupons
6. Staff
7. Notifications

### Opción 3: Crear Stubs Temporales
Crear funciones temporales que retornen datos vacíos o de prueba.

## 📋 Próximos Pasos Recomendados

### Inmediato (Para probar addProduct)
1. Comentar imports de Supabase en componentes críticos
2. Comentar servicios que usan Supabase
3. Reiniciar servidor
4. Probar `addProduct`

### Corto Plazo
1. Migrar servicios de productos a Prisma
2. Actualizar componentes de productos
3. Migrar resto de server actions de productos

### Mediano Plazo
1. Migrar módulo de categorías
2. Migrar módulo de órdenes
3. Migrar módulo de clientes

## 🚨 Archivos Críticos para addProduct

Estos archivos deben funcionar para probar `addProduct`:

### ✅ Ya Funcionan
- `actions/products/addProduct.ts` - Migrado a Prisma
- `lib/prisma.ts` - Cliente de Prisma
- `lib/cloudinary.ts` - Subida de imágenes
- `app/(auth)/auth.ts` - Autenticación

### ⚠️ Pueden Causar Errores
- `services/products/index.ts` - Usa Supabase para fetch
- `dashboard/products/_components/products-table/index.tsx` - Usa Supabase
- `dashboard/products/_components/ProductFilters.tsx` - Usa Supabase

## 💡 Solución Temporal

Para probar `addProduct` sin migrar todo:

1. **Comentar servicios de productos:**
   ```typescript
   // export async function fetchProducts() {
   //   // Código con Supabase
   // }
   
   // Temporal: retornar array vacío
   export async function fetchProducts() {
     return { data: [], count: 0 };
   }
   ```

2. **Actualizar componentes:**
   ```typescript
   // import { createBrowserClient } from "@/lib/supabase/client";
   
   // Usar fetch directo o React Query con API routes
   ```

3. **Crear API routes con Prisma:**
   ```typescript
   // app/api/products/route.ts
   export async function GET() {
     const products = await prisma.products.findMany();
     return Response.json(products);
   }
   ```

## 📊 Estadísticas

- **Total de archivos afectados:** ~50+
- **Server actions:** 27
- **Componentes:** 11
- **Servicios:** 7
- **Páginas:** 4
- **Helpers:** 2
- **Contextos:** 1

## ✅ Estado Actual

- Archivos de Supabase eliminados
- Productos: 2/7 migrados (addProduct, deleteProduct)
- Resto: Pendiente de migración o comentar

---

**Recomendación:** Comentar temporalmente los servicios y componentes que usan Supabase para poder probar `addProduct`, luego migrar módulo por módulo.
