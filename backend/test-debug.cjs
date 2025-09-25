// Script temporal para verificar tokens y credenciales
const { MercadoPagoConfig, CardToken } = require("mercadopago");

async function testTokenGeneration() {
  try {
    console.log("🔍 Verificando configuración de MercadoPago...");
    
    // Verificar variables de entorno
    if (!process.env.MP_ACCESS_TOKEN) {
      console.error("❌ MP_ACCESS_TOKEN no configurado");
      process.exit(1);
    }
    
    const accessToken = process.env.MP_ACCESS_TOKEN;
    console.log("✅ Access Token encontrado:", `${accessToken.substring(0, 20)}...`);
    console.log("🏷️ Tipo de token:", accessToken.startsWith('TEST-') ? 'SANDBOX' : 'PRODUCTION');
    
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
    });

    const cardToken = new CardToken(client);

    // Datos de tarjeta de prueba para Colombia
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

    console.log("🔄 Generando token de prueba...");
    console.log("📋 Datos de tarjeta:", {
      card_number: testCardData.card_number,
      name: testCardData.cardholder.name,
      id_type: testCardData.cardholder.identification.type,
      id_number: testCardData.cardholder.identification.number
    });

    const token = await cardToken.create({
      body: testCardData,
    });

    console.log("✅ Token generado exitosamente:", {
      id: token.id,
      first_six_digits: token.first_six_digits,
      last_four_digits: token.last_four_digits,
      length: token.id?.length || 0
    });

    // Ahora probar inmediatamente el pago con este token
    console.log("\n🔄 Probando pago inmediatamente con token fresco...");
    
    const { Payment } = require("mercadopago");
    const payment = new Payment(client);

    const paymentPayload = {
      transaction_amount: 100,
      token: token.id,
      description: `Test Payment - ${Date.now()}`,
      installments: 1,
      payer: {
        email: "test_user@testuser.com",
      },
      external_reference: `TEST-${Date.now()}`,
    };

    console.log("📤 Payload de pago:", JSON.stringify(paymentPayload, null, 2));

    const result = await payment.create({
      body: paymentPayload,
    });

    console.log("✅ Resultado del pago:", {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      payment_method_id: result.payment_method_id,
      transaction_amount: result.transaction_amount
    });

  } catch (error) {
    console.error("❌ Error en test:", error);
    
    if (error.cause && Array.isArray(error.cause)) {
      console.error("📋 Detalles del error MP:", error.cause);
    }
    
    if (error.status) {
      console.error("🔢 Status code:", error.status);
    }
  }
}

testTokenGeneration();