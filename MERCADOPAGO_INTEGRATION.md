# Integración de MercadoPago - NeoCommerce

## 🚀 Configuración Inicial

### 1. Obtener Credenciales de MercadoPago

1. Regístrate en [MercadoPago Developers](https://www.mercadopago.com.mx/developers/)
2. Crea una nueva aplicación
3. Obtén tus credenciales de **TEST** y **PRODUCTION**

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto backend con:

```bash
# MercadoPago
MERCADO_PAGO_ACCESS_TOKEN=TEST-your-test-access-token-here

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Otros
HOST=localhost
PORT=8000
FRONT_PORT=3000
```

### 3. Instalar Dependencias

```bash
npm install mercadopago
```

## 🛒 API Endpoints

### Crear Orden

**POST** `/api/orders/createOrder`

```json
{
  "productId": 1,
  "quantity": 2,
  "colorCode": "rojo",
  "size": "M"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "orderId": 123,
    "paymentLink": "https://www.mercadopago.com/mla/checkout/start?pref_id=...",
    "preferenceId": "123456789-abc123-def456",
    "totalAmount": 29.99
  }
}
```

### Obtener Orden

**GET** `/api/orders/order/:orderId`

### Obtener Órdenes del Usuario

**GET** `/api/orders/user-orders`

### Webhook de MercadoPago

**POST** `/api/orders/webhook/mercadopago`

## 🔄 Flujo de Pago

1. **Frontend**: Usuario selecciona producto y hace clic en "Comprar"
2. **Backend**: Se crea orden en BD y preferencia en MercadoPago
3. **Frontend**: Redirecciona al usuario al link de pago
4. **MercadoPago**: Usuario completa el pago
5. **Webhook**: MercadoPago notifica el resultado del pago
6. **Backend**: Actualiza estado de la orden y reduce stock

## 🎨 Ejemplo de Uso en Frontend

```typescript
// Crear orden y obtener link de pago
const handleBuyNow = async (productId: number, quantity: number) => {
  try {
    const response = await fetch('/api/orders/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId,
        quantity,
        colorCode: selectedColor,
        size: selectedSize
      })
    });

    const data = await response.json();

    if (data.success) {
      // Redirigir al usuario al link de pago
      window.location.href = data.data.paymentLink;
    }
  } catch (error) {
    console.error('Error al crear orden:', error);
  }
};
```

## 📱 URLs de Retorno

Configura estas páginas en tu frontend:

- **Éxito**: `/payment/success` - Pago aprobado
- **Error**: `/payment/failure` - Pago rechazado
- **Pendiente**: `/payment/pending` - Pago en proceso

## 🔒 Seguridad

### Validación de Webhooks

Para mayor seguridad, puedes validar que los webhooks provienen realmente de MercadoPago:

```typescript
// En el controlador del webhook
const isValidWebhook = (headers: any, body: any) => {
  // Implementar validación de firma si es necesario
  return true;
};
```

### Variables de Entorno

**⚠️ NUNCA** expongas tu Access Token en el frontend. Solo úsalo en el backend.

## 🧪 Testing

### Cuentas de Prueba

MercadoPago proporciona usuarios de prueba:

- **Comprador**: Usa las credenciales de prueba para simular pagos
- **Vendedor**: Tu cuenta principal en modo TEST

### Tarjetas de Prueba

```
Visa: 4509 9535 6623 3704
Mastercard: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
```

## 📊 Estados de Orden

- `PENDING`: Orden creada, esperando pago
- `PENDING_PAYMENT`: Redirigido a MercadoPago
- `PAID`: Pago aprobado
- `CANCELLED`: Orden cancelada
- `REFUNDED`: Orden reembolsada

## 🔧 Troubleshooting

### Error: "Access token inválido"
- Verifica que tu MERCADO_PAGO_ACCESS_TOKEN esté correcto
- Asegúrate de usar el token de TEST para desarrollo

### Error: "Webhook no recibido"
- Verifica que la URL del webhook sea accesible públicamente
- Usa herramientas como ngrok para testing local

### Error: "Producto sin stock"
- El sistema verifica stock antes de crear la orden
- Asegúrate de que el producto tenga stock suficiente

## 🌟 Características

- ✅ Integración completa con MercadoPago
- ✅ Manejo de webhooks para actualizaciones automáticas
- ✅ Control de stock automático
- ✅ Soporte para ofertas flash
- ✅ URLs de retorno personalizables
- ✅ Validación de datos robusta
- ✅ Manejo de errores completo
- ✅ TypeScript support
