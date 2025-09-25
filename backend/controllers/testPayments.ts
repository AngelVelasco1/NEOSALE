import { Request, Response } from "express";
import { MercadoPagoConfig, CardToken } from "mercadopago";

export const generateTestCardToken = async (req: Request, res: Response) => {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const cardToken = new CardToken(client);

    // Datos de tarjeta de prueba
    const testCardData = {
      card_number: "4509953566233704", // Visa de prueba
      security_code: "123",
      expiration_month: "11",
      expiration_year: "2030",
      cardholder: {
        name: "APRO", // Nombre que aprueba automáticamente
        identification: {
          type: "CC",
          number: "12345678",
        },
      },
    };

    console.log("🔄 Generando token de tarjeta de prueba...");

    const token = await cardToken.create({
      body: testCardData,
    });

    console.log("✅ Token generado:", {
      id: token.id,
      first_six_digits: token.first_six_digits,
      last_four_digits: token.last_four_digits,
    });

    res.json({
      success: true,
      message: "Token de tarjeta de prueba generado",
      data: {
        token: token.id,
        card_info: {
          first_six_digits: token.first_six_digits,
          last_four_digits: token.last_four_digits,
          expiration_month: token.expiration_month,
          expiration_year: token.expiration_year,
        },
        test_payment_data: {
          amount: 100,
          email: "test_user@testuser.com",
          installments: 1,
          token: token.id,
          user_id: 1,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Error generando token de prueba:", error);

    let errorMessage = "Error generando token de prueba";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: String(error),
    });
  }
};

// ✅ Nueva función para flujo completo de pago
export const testCompletePaymentFlow = async (req: Request, res: Response) => {
  try {
    console.log("🚀 Iniciando flujo completo de pago de prueba...");
    console.log(
      "🔍 Verificando MP_ACCESS_TOKEN:",
      process.env.MP_ACCESS_TOKEN ? "ENCONTRADO" : "NO ENCONTRADO"
    );
    console.log(
      "🔍 Token preview:",
      process.env.MP_ACCESS_TOKEN
        ? `${process.env.MP_ACCESS_TOKEN.substring(0, 20)}...`
        : "N/A"
    );

    // Paso 1: Generar token fresco usando la función que ya funciona
    console.log("🔄 Paso 1: Generando token fresco...");

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const cardToken = new CardToken(client);

    // Datos de tarjeta de prueba (exactamente iguales a generateTestCardToken)
    const testCardData = {
      card_number: "4509953566233704", // Visa de prueba
      security_code: "123",
      expiration_month: "11",
      expiration_year: "2030",
      cardholder: {
        name: "APRO", // Nombre que aprueba automáticamente
        identification: {
          type: "CC",
          number: "12345678",
        },
      },
    };

    const token = await cardToken.create({
      body: testCardData,
    });

    console.log("✅ Token generado:", {
      id: token.id,
      first_six_digits: token.first_six_digits,
      last_four_digits: token.last_four_digits,
    });

    // Validar que el token se generó correctamente
    if (!token.id) {
      throw new Error("No se pudo generar el token de tarjeta");
    }

    // Paso 2: Procesar pago inmediatamente
    const { processCardPayment } = await import("../services/payments");

    const paymentData = {
      user_id: 1,
      amount: 100,
      email: "test_user@testuser.com",
      installments: 1,
      token: token.id,
    };

    console.log("🔄 Paso 2: Procesando pago con token fresco...");
    console.log(
      "📋 PaymentData que se enviará:",
      JSON.stringify(paymentData, null, 2)
    );

    const paymentResult = await processCardPayment(paymentData);

    console.log("✅ Pago procesado:", {
      id: paymentResult.id,
      status: paymentResult.status,
      status_detail: paymentResult.status_detail,
    });

    res.json({
      success: true,
      message: "Flujo de pago completo exitoso",
      data: {
        token_info: {
          token: token.id,
          card_digits: `****-****-****-${token.last_four_digits}`,
        },
        payment_result: {
          id: paymentResult.id,
          status: paymentResult.status,
          status_detail: paymentResult.status_detail,
          transaction_amount: paymentResult.transaction_amount,
          payment_method_id: paymentResult.payment_method_id,
          external_reference: paymentResult.external_reference,
          date_created: paymentResult.date_created,
        },
      },
    });
  } catch (error: unknown) {
    console.error("❌ Error en flujo completo:", error);

    let errorMessage = "Error en el flujo de pago";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: String(error),
    });
  }
};
