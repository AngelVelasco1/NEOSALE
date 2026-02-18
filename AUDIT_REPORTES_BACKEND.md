# 🔍 AUDITORÍA COMPLETA DE SERVICIOS BACKEND - NeoSale

## ⚠️ PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **INCONSISTENCIA EN NOMBRES DE CAMPOS - Orders Service**
**Archivo:** `backend/services/orders.ts`

**Problema:**
- En `getOrderByIdService` retorna `addresses: address` (single object)
- En `getUserOrdersWithPaymentsService` retorna `addresses: address` (single object)
- Pero en el schema Prisma, la relación es `addresses` (tabla de direcciones)

```typescript
// ❌ PROBLEMA - Inconsistencia de campo
return {
  ...order,
  addresses: address,  // Debería ser consistent en todos
};
```

**Esperado según Schema:**
```prisma
model orders {
  ...
  addresses addresses @relation(fields: [shipping_address_id], references: [id])
}
```

---

### 2. **ENUM STATUS INVÁLIDO - Update Order Status**
**Archivo:** `backend/services/orders.ts` línea ~750

**Problema:**
```typescript
async updateOrderStatusService(
  orderId: number,
  status: "pending" | "paid" | "confirmed" | "shipped" | "delivered" | "cancelled"
)
```

**❌ INVÁLIDO:** Los statuses válidos según Prisma schema son:
```prisma
enum orders_status_enum {
  pending
  paid
  processing  // ← NO es "confirmed"
  shipped
  delivered
}
```

**El servicio acepta:** `confirmed` y `cancelled` ❌
**El schema define:** `processing` (no `confirmed`)

---

### 3. **INCONSISTENCIA EN CONVERSIÓN DE DECIMALES**

#### a. **Coupons Service** - Conversión inconsistente
```typescript
// ✅ CORRECTO - Convierte a Number
discount_value: Number(coupon.discount_value),
min_purchase_amount: Number(coupon.min_purchase_amount || 0),

// ❌ PERO en otra parte no lo hace
const discountValue = Number(coupon.discount_value);
```

#### b. **Payments Service** - No convierte Decimal correctamente
```typescript
// ❌ PROBLEMA - amount_in_cents es BigInt, no se convierte
amount_in_cents: bigint  // Debería convertir a Number

// En la consulta:
(amount_in_cents / 100)::INTEGER  // Se divide pero sigue siendo BigInt en TypeScript
```

#### c. **Products Service** - Inconsistencia con prices
```typescript
// En formatProductForList no maneja Number(price) consistently
price: Number(product.price),  // ✅
// pero en otros lados:
Price: product.price  // Sin conversión
```

---

### 4. **RUTAS API INCONSISTENTES**

**Archivo:** `backend/routes/products.ts`

```typescript
❌ PROBLEMAS:
.get("/getProducts", ...)       // ← Debería ser "/" o "/list"
.get("/getLatestProducts", ...) // ← Debería ser "/latest"
.get("/getOffers", ...)         // ← Debería ser "/offers"
.post("/getVariantStock", ...)  // ← Debería ser "/variant-stock"

✅ CORRECTO en otras rutas:
.get("/", getAllBrands)         // brands.ts
.get("/:id", getBrandById)      // brands.ts
```

**De acuerdo RESTful:**
- GET /api/products → getProducts ✅
- GET /api/products/latest → getLatestProducts
- GET /api/products/offers → getOffers
- POST /api/products/stock → getVariantStock

---

### 5. **ATRIBUTOS FALTANTES O INCONSISTENTES**

#### a. **Brands Service - Problema**
```typescript
// ❌ No retorna deleted_at, deleted_by en algunos endpoints
select: {
  id: true,
  name: true,
  description: true,
  image_url: true,
  active: true,
  // Falta: created_at, updated_at, deleted_at, deleted_by
  _count: { select: { products: true } }
}
```

#### b. **Categories Service - Inconsistencia**
```prisma
model categories {
  id_subcategory  Int?  // ← Campo pero la relación se llama "subcategory"
  subcategory     subcategories?  // ← Relación confusa
}
```

La consulta en service no maneja bien esta relación.

#### c. **Products Service - Falta currency en precios**
```typescript
// ❌ No incluye currency (debería ser COP según Prisma)
price: p.price,  // Sin moneda, sin conversión de centavos

// Schema de payments tiene:
currency String @default("COP")
```

---

### 6. **PROBLEM: Unused fetched address - getOrderWithPaymentService**

```typescript
// ❌ PROBLEMA - Se obtiene address pero no se usa
if (order.shipping_address_id) {
  await prisma.addresses.findUnique({  // ← Se obtiene pero...
    where: { id: order.shipping_address_id },
    // ... resto del select
  });
}
// La variable NO se asigna ni retorna!

return {
  ...order,
  payment,
  // ❌ FALTA: address
};
```

---

### 7. **INCONSISTENCIA: User Fields Naming**

**Archivo:** `backend/services/users.ts`

```typescript
// Algunos usa phoneNumber (TypeScript):
phoneNumber: user.phoneNumber,

// Otros usa phone_number (Database):
phone_number: user.phoneNumber,  // ❌ Inconsistente en naming

// El schema tiene:
phoneNumber String? @map("phone_number")  // Mapea a DB pero servicio es inconsistente
```

---

### 8. **DECIMAL vs NUMBER - Prices**

**Afecta:** Products, Payments, Coupons

```typescript
// ❌ Schema usa Decimal para precios
price         Int       // PERO el schema dice Int en products!
// En payments:
amount_in_cents BigInt   // Centavos en BigInt

// Services hacen:
Number(product.offer_discount)  // ✅ Decimal → Number

// PERO inconsistente en conversión final
```

---

### 9. **FORMATO DE RESPUESTA INCONSISTENTE**

#### Categories Service
```typescript
// ✅ Formato A
subcategories: category.category_subcategory.map(cs => cs.subcategories)

// Pero en otros endpoints:
subcategories: category.subcategories  // ❌ Formato B - inconsistente
```

#### Orders Service 
```typescript
// Formato A: order_items
order_items: [...]

// Formato B: items
items: [...]  // Inconsistente naming

// Bajo: cart_items pero no standardizado
```

---

### 10. **VALIDACIÓN DE ENUM STATUS - BUG**

```typescript
const validStatuses = ["pending", "paid", "confirmed", "shipped", "delivered", "cancelled"];
```

**❌ PROBLEMA:** `confirmed` y `cancelled` NO existen en Prisma schema!

```prisma
enum orders_status_enum {
  pending
  paid
  processing  // ← Real value
  shipped
  delivered
  // No hay confirmed ni cancelled!
}
```

---

## 📋 RESUMEN DE PROBLEMAS POR SERVICIO

| Servicio | Problema | Severidad | Línea |
|----------|----------|-----------|-------|
| orders.ts | Status inválido (confirmed, cancelled) | 🔴 CRÍTICO | ~750 |
| orders.ts | Address no se retorna en getOrderWithPaymentService | 🔴 CRÍTICO | ~240 |
| orders.ts | Inconsistencia en nombre campo (addresses vs address) | 🟠 ALTO | ~220, ~340 |
| products.ts | Rutas inconsistentes (/getProducts vs /) | 🟠 ALTO | routes/products.ts |
| products.ts | No convierte precios a Number consistently | 🟡 MEDIO | ~80 |
| coupons.ts | Decimal inconsistentemente convertido a Number | 🟡 MEDIO | ~135 |
| payments.ts | BigInt no se convierte en respuestas | 🟡 MEDIO | ~220 |
| brands.ts | Falta created_at, updated_at, deleted_at | 🟡 MEDIO | ~18 |
| categories.ts | Relación id_subcategory confusa | 🟡 MEDIO | ~38 |
| users.ts | phoneNumber vs phone_number inconsistente | 🟡 MEDIO | ~160 |

---

## ✅ ACCIONES REQUERIDAS

1. **URGENTE:** Corregir enum orders_status_enum en updateOrderStatusService
2. **URGENTE:** Retornar address en getOrderWithPaymentService
3. **ALTA:** Estandarizar nombres de campos (address vs addresses)
4. **ALTA:** Corregir rutas API /getProducts → /
5. **MEDIA:** Convertir todos los Decimal/BigInt a Number en respuestas
6. **MEDIA:** Agregar created_at, updated_at a todas las selecciones
7. **MEDIA:** Estandarizar naming (phoneNumber vs phone_number en respuestas)
