import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { sendOrderConfirmationEmail } from '@/lib/orderEmail';

/**
 * API Route para enviar email de confirmación de orden
 * POST /api/orders/send-confirmation
 * 
 * Body: {
 *   orderId: string,
 *   items: Array<{ productName, quantity, price }>,
 *   subtotal: number,
 *   shipping: number,
 *   taxes: number,
 *   discount: number,
 *   total: number,
 *   shippingAddress: { street, city, state, zipCode, country }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No autorizado. Debes iniciar sesión.' 
        },
        { status: 401 }
      );
    }

    // Obtener datos del request
    const body = await request.json();
    const {
      orderId,
      items,
      subtotal,
      shipping,
      taxes,
      discount = 0,
      total,
      shippingAddress,
      trackingUrl,
    } = body;

    // Validar datos requeridos
    if (!orderId || !items || !total || !shippingAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan datos requeridos: orderId, items, total, shippingAddress',
        },
        { status: 400 }
      );
    }

    // Formatear fecha actual
    const orderDate = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Enviar email de confirmación (no crítico, si falla no detiene el proceso)
    let emailResult;
    try {
      emailResult = await sendOrderConfirmationEmail({
        customerEmail: session.user.email,
        customerName: session.user.name || 'Cliente',
        orderId: orderId.toString(),
        orderDate,
        items,
        subtotal: subtotal || 0,
        shipping: shipping || 0,
        taxes: taxes || 0,
        discount: discount || 0,
        total,
        shippingAddress,
        trackingUrl: trackingUrl || undefined,
      });

      return NextResponse.json({
        success: true,
        message: 'Email de confirmación enviado exitosamente',
        data: emailResult.data,
      });
    } catch (emailError: any) {
      console.warn('⚠️ Email no pudo ser enviado pero orden fue creada:', emailError.message);
      
      // Email falló pero orden fue creada exitosamente
      return NextResponse.json({
        success: true,
        message: 'Orden procesada exitosamente',
        warning: 'Email de confirmación no pudo ser enviado (posible límite de cuenta trial)',
        data: {
          orderId,
          emailSent: false,
          emailError: emailError.message,
        },
      });
    }
  } catch (error: any) {
    console.error('❌ Error en /api/orders/send-confirmation:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error al enviar email de confirmación',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
