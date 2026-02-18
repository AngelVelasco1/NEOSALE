# 📋 MAPEO SCHEMA → SERVICIOS - VERIFICACIÓN

**Propósito:** Verificar que cada modelo Prisma tenga servicios que retornen todos los atributos correctamente.

---

## 1. Model: BRANDS

### ✅ Schema Prisma
```prisma
model brands {
  id          Int        @id
  name        String     @unique
  description String?
  active      Boolean    @default(true)
  image_url   String?
  deleted_at  DateTime?
  deleted_by  Int?
  User        User?      @relation(...)
  products    products[]
}
```

### 📊 Servicios

| Función | GET id | GET name | GET all | POST | PUT | DELETE |
|---------|--------|----------|---------|------|-----|--------|
| `getAllBrandsService` | ✅ | - | ✅ | - | - | - |
| `getBrandByIdService` | ✅ | - | - | - | - | - |
| `getBrandByNameService` | - | ✅ | - | - | - | - |
| `createBrandService` | - | - | - | ✅ | - | - |
| `editBrandService` | - | - | - | - | ✅ | - |
| `deleteBrandService` | - | - | - | - | - | ✅ |

### ⚠️ Problema Encontrado
```typescript
// ❌ En getAllBrandsService - FALTA created_at, updated_at, deleted_at, deleted_by
select: {
  id: true,
  name: true,
  description: true,
  image_url: true,
  active: true,
  // FALTAN: created_at, updated_at, deleted_at, deleted_by
}
```

### ✅ Solución
```typescript
// ✅ DEBERÍA ser:
select: {
  id: true,
  name: true,
  description: true,
  image_url: true,
  active: true,
  created_at: true,        // ← AGREGAR
  updated_at: true,        // ← AGREGAR
  deleted_at: true,        // ← AGREGAR
  deleted_by: true,        // ← AGREGAR
}
```

---

## 2. Model: CATEGORIES

### ✅ Schema Prisma
```prisma
model categories {
  id                   Int     @id
  name                 String
  description          String?
  id_subcategory       Int?    // ← Relación confusa
  active               Boolean
  deleted_at           DateTime?
  deleted_by           Int?
  subcategory          subcategories?
  // ... más campos
}
```

### 📊 Servicios - ✅ COMPLETO
| Función | GET id | GET all | POST | PUT | DELETE |
|---------|--------|---------|------|-----|--------|
| `getAllCategoriesWithSubcategoriesService` | ✅ | ✅ | - | - | - |
| `getCategoryByIdService` | ✅ | - | - | - | - |
| `createCategoryService` | - | - | ✅ | - | - |
| `updateCategoryService` | - | - | - | ✅ | - |
| `deleteCategoryService` | - | - | - | - | ✅ |

### ⚠️ Nota: Relación confusa
```typescript
// La relación id_subcategory → subcategory es confusa
// Mejor: cambiar id_subcategory a parent_subcategory_id o algo más claro
id_subcategory: Int?
subcategory: subcategories? @relation(fields: [id_subcategory], ...)
```

---

## 3. Model: PRODUCTS

### ✅ Schema Prisma
```prisma
model products {
  id               Int     @id
  name             String
  description      String
  price            Int     // ← En CENTAVOS
  stock            Int
  weight_grams     Int
  sizes            String
  base_discount    Decimal
  category_id      Int
  brand_id         Int
  active           Boolean
  in_offer         Boolean
  offer_discount   Decimal?
  offer_start_date DateTime?
  offer_end_date   DateTime?
  created_at       DateTime
  created_by       Int
  updated_at       DateTime?
  updated_by       Int
  deleted_at       DateTime?
  deleted_by       Int?
  // ... relaciones
}
```

### 📊 Servicios

| Función | Retorna price | Retorna currency | Conversion |
|---------|--------------|------------------|-----------|
| `getProductsService` | ✅ | ❌ | Sin conversion |
| `getLatestProductsService` | ✅ | ❌ | Sin conversion |
| `getVariantStockService` | ❌ | ❌ | N/A |
| `getOffersService` | ✅ | ❌ | Sin conversion |
| `getProductWithVariantsService` | ✅ | ❌ | Sin conversion |

### ❌ PROBLEMAS

**1. Price en centavos pero sin anotación:**
```typescript
// ❌ PROBLEMA: price está en centavos (COP = Peso colombiano)
// Pero se retorna sin conversión ni moneda
price: p.price,  // ← Es 50000 (pesos), no centavos aquí

// Necesitamos aclaración:
// El schema DEBERÍA documentar que price está en centavos
```

**2. Currency faltante:**
```typescript
// ❌ Products no incluyen currency en respuesta
// Pero el schema tiene currency en payments table
return {
  id: product.id,
  name: product.name,
  price: product.price,
  // FALTA:
  // currency: "COP",
}
```

### ✅ Solución Recomendada
```typescript
// En products service, agregar:
return {
  id: product.id,
  name: product.name,
  price: product.price,           // En COP (pesos)
  currency: "COP",                // ← AGREGAR
  discount: product.base_discount, // ← NORMALIZAR (discount vs base_discount)
  // ...
}
```

---

## 4. Model: CART

### ✅ Schema Prisma
```prisma
model cart {
  id            Int       @id
  user_id       Int?
  session_token String?   @unique @db.Uuid
  subtotal      Int       // ← En CENTAVOS
  created_at    DateTime
  expires_at    DateTime?
  users         User?
  cart_items    cart_items[]
}
```

### 📊 Servicio: getCartService

```typescript
✅ RETORNA:
{
  items: CartItem[],
  total_items: number,
  total_amount: number,  // En centavos
  cart_id: number
}
```

### ✅ Estado: ADECUADO
El servicio retorna correctamente los datos del carrito.

---

## 5. Model: ORDERS

### ✅ Schema Prisma
```prisma
model orders {
  id                      Int     @id
  payment_id              Int
  status                  orders_status_enum  // pending|paid|processing|shipped|delivered
  subtotal                Int     // centavos
  discount                Int?
  shipping_cost           Int     // centavos
  taxes                   Int     // centavos
  total                   Int     // centavos
  shipping_address_id     Int
  user_note               String?
  admin_notes             String?
  coupon_id               Int?
  coupon_discount         Int?
  tracking_number         String?
  carrier                 String?
  estimated_delivery_date DateTime?
  created_at              DateTime
  updated_at              DateTime?
  shipped_at              DateTime?
  delivered_at            DateTime?
  cancelled_at            DateTime?
  user_id                 Int
  updated_by              Int
  // ... campos de envioclick
  order_items             order_items[]
  order_logs              order_logs[]
  coupons                 coupons?
  payments                payments
  addresses               addresses
  User_orders_updated_byToUser User
  User                    User      // El que compró
  reviews                 reviews[]
}
```

### 📊 Servicios

| Función | Retorna addresses | Retorna payment | ✅ Estado |
|---------|-------------------|-----------------|----------|
| `getOrderByIdService` | ✅ | ❌ | FIJO ✅ |
| `getOrderWithPaymentService` | ✅ | ✅ | FIJO ✅ |
| `getUserOrdersWithPaymentsService` | ✅ | ✅ | FIJO ✅ |
| `getOrdersService` | Depends | Depends | CHECK |

### ✅ Lo que SE FIJÓ:
- ✅ Ahora retorna `addresses` en `getOrderByIdService`
- ✅ Ahora retorna `addresses` en `getOrderWithPaymentService`
- ✅ Status validation usa valores correctos (pending, paid, processing, shipped, delivered)

### ⚠️ PENDIENTE: Validar montos en centavos
```typescript
// TODOS los montos están en centavos en el DB
subtotal: order.subtotal,           // Centavos
shipping_cost: order.shipping_cost, // Centavos
taxes: order.taxes,                 // Centavos
total: order.total,                 // Centavos

// DEBERÍA convertir: /100 para mostrar en pesos
// O documentar claramente que están en centavos
```

---

## 6. Model: PAYMENTS

### ✅ Schema Prisma
```prisma
model payments {
  id                      Int     @id
  transaction_id          String? @unique
  reference               String  @unique
  amount_in_cents         BigInt
  currency                String  @default("COP")
  payment_status          payment_status_enum
  payment_method          payment_method_enum
  payment_method_details  Json?
  // ... más campos
}
```

### ❌ PROBLEMAS

**1. BigInt no se convierte en respuestas:**
```typescript
// ❌ En getWompiAcceptanceTokensService
amount_in_cents: {
  type: "bigint"  // ← BigInt no es JSON serializable en respuestas!
}

// ✅ DEBE convertir:
amount_in_cents: Number(payment.amount_in_cents),
amount_in_pesos: Math.round(Number(payment.amount_in_cents) / 100),
```

**2. payment_status_enum mal nombrado:**
```typescript
// Schema tiene:
enum payment_status_enum {
  PENDING      // ← MAYUSCULAS
  APPROVED
  DECLINED
  VOIDED
  ERROR
}

// Pero en algunos servicios se retorna en minúsculas
payment_status: "pending"  // ❌ Debería ser PENDING
```

---

## 7. Model: REVIEWS

### ✅ Servicios - COMPLETO
```typescript
✅ getReviewsService
✅ getReviewByIdService
✅ createReviewService
✅ updateReviewService
✅ deleteReviewService
```

### ⚠️ NOTA: Conversión de rating
```typescript
// El rating es Int (1-5)
// VALIDAR en todos los servicios:
if (!data.rating || data.rating < 1 || data.rating > 5) {
  throw new ValidationError("La calificación debe estar entre 1 y 5");
}
```

---

## 8. Model: USERS

### ⚠️ PROBLEMAS

**1. Nombre de campos inconsistente:**
```typescript
// Schema usa camelCase con @map
phoneNumber String? @unique @map("phone_number")
identification String? @unique

// En servicios:
phone_number: user.phoneNumber,     // ✅ Snake_case en respuesta
identification: user.identification, // ✅ Snake_case

// INCONSISTENCIA: ¿Usar camelCase o snake_case en respuestas JSON?
// Decisión: Usar SNAKE_CASE en todas las respuestas JSON
```

**2. emailVerified nunca se actualiza:**
```typescript
// El schema tiene:
emailVerified DateTime? @map("email_verified")

// Pero en registerUserService se asigna valor inicial:
emailVerified: email_verified || null,

// NUNCA se actualiza cuando el email se verifica
// DEBERÍA HABER: updateUserEmailVerificationService(userId, verifiedAt)
```

---

## 📊 TABLA RESUMEN - Cobertura de Servicios

| Modelo | Total Atributos | Retorna Todos | Currency | BigInt | Timestamp |
|--------|-----------------|---------------|----------|--------|-----------|
| brands | 8 | ❌ | N/A | N/A | ❌ |
| categories | 8 | ✅ | N/A | N/A | ✅ |
| products | 16 | ❌ | ❌ | N/A | ✅ |
| cart | 6 | ✅ | ✅ | N/A | ✅ |
| cart_items | 7 | ✅ | N/A | N/A | N/A |
| orders | 24 | ❌ | ✅ | N/A | ✅ |
| order_items | 9 | ✅ | N/A | N/A | ✅ |
| payments | 21 | ❌ | ✅ | ❌ | ✅ |
| reviews | 8 | ✅ | N/A | N/A | ✅ |
| users | 13 | ❌ | N/A | N/A | ✅ |
| addresses | 8 | ✅ | N/A | N/A | ✅ |
| coupons | 11 | ❌ | N/A | N/A | ✅ |

**Cobertura General:** 5/12 = **41.7% ✅**

---

## 🎯 CHECKLIST - PRÓXIMAS CORRECCIONES

- [ ] Convertir BigInt a Number en payment responses
- [ ] Agregar timestamps (created_at, updated_at) a brands.ts selects
- [ ] Agregar currency a product responses
- [ ] Estandarizar enum values (UPPERCASE en response vs lowercase)
- [ ] Validar que todos los precios estén documentados como centavos
- [ ] Implementations field alias mapping para consistency
- [ ] Crear interceptor de respuestas que normalice moneda

---

## 📚 Recomendaciones

### 1. Usar DTO (Data Transfer Objects)
```typescript
// Crear archivo: services/dtos/product.dto.ts
export class ProductResponseDTO {
  id: number;
  name: string;
  price: number;           // En pesos (no centavos)
  currency: string;        // "COP"
  discount: number;        // Porcentaje
  // ... etc
}
```

### 2. Crear Response Transformer
```typescript
// Crear interceptor que normalice respuestas:
// - Convertir BigInt → Number
// - Convertir centavos → pesos (divide by 100)
// - Convertir Decimal → Number
// - Normalizar keys (camelCase → snake_case)
```

### 3. Documentar el Schema
```prisma
// Agregar comentarios:
price Int /// Precio en pesos COP (no centavos)
```

### 4. Type Safety
```typescript
// Usar branded types:
type CentAVOS = number & { readonly __brand: "CENTAVOS" };
type Pesos = number & { readonly __brand: "PESOS" };
```
