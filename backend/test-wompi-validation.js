// 🧪 Script de prueba para validar datos de Wompi antes de enviar
import fetch from 'node-fetch';

const testData = {
  reference: `wompi_${Date.now()}_test123`,
  amount_in_cents: 50000, // $500 pesos
  currency: "COP",
  customer_email: "test@example.com",
  customer_data: {
    phone_number: "+573001234567",
    full_name: "Juan Pérez",
    legal_id: "12345678",
    legal_id_type: "CC"
  },
  shipping_address: {
    address_line_1: "Calle 123 #45-67",
    address_line_2: "Apartamento 8B",
    city: "Bogotá",
    region: "Cundinamarca",
    country: "CO",
    postal_code: "110111",
    phone_number: "+573001234567",
    name: "Juan Pérez"
  },
  acceptance_token: "pub_test_example_token",
  payment_link_acceptance_token: "pub_test_example_token"
};

async function testValidation() {
  try {
    console.log("🧪 Probando validación de datos de Wompi...");
    console.log("📦 Datos de prueba:", JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:8000/api/payments/validate-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log("\n✅ Respuesta del servidor:");
    console.log("Status:", response.status);
    console.log("Success:", result.success);
    
    if (result.success && result.data) {
      console.log("\n🔍 Resultado de validación:");
      console.log("- Es válido:", result.data.isValid);
      console.log("- Problemas encontrados:", result.data.issues.length);
      
      if (result.data.issues.length > 0) {
        console.log("\n❌ Problemas identificados:");
        result.data.issues.forEach((issue, index) => {
          console.log(`  ${index + 1}. ${issue}`);
        });
      }
      
      if (result.data.recommendations.length > 0) {
        console.log("\n💡 Recomendaciones:");
        result.data.recommendations.forEach((rec, index) => {
          console.log(`  ${index + 1}. ${rec}`);
        });
      }
      
      console.log("\n📊 Datos recibidos:");
      console.log(JSON.stringify(result.data.dataReceived, null, 2));
    } else {
      console.log("❌ Error:", result.error);
    }

  } catch (error) {
    console.error("❌ Error ejecutando prueba:", error.message);
  }
}

// Ejecutar la prueba
testValidation();