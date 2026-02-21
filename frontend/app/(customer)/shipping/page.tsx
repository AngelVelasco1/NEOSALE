import { Metadata } from "next";
import { Truck, Package, MapPin, Clock, DollarSign, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Información de Envíos | NeoSale",
  description: "Conoce nuestras políticas de envío, tiempos de entrega y costos - NeoSale",
};

export default function ShippingPage() {
  const shippingZones = [
    {
      zone: "Bogotá y Área Metropolitana",
      time: "2-3 días hábiles",
      cost: "$10.000 - Gratis en compras superiores a $150.000",
    },
    {
      zone: "Principales Ciudades (Medellín, Cali, Barranquilla)",
      time: "3-5 días hábiles",
      cost: "$15.000 - Gratis en compras superiores a $200.000",
    },
    {
      zone: "Otras Ciudades Principales",
      time: "4-6 días hábiles",
      cost: "$18.000 - Gratis en compras superiores a $250.000",
    },
    {
      zone: "Zonas Rurales y Municipios",
      time: "5-8 días hábiles",
      cost: "$25.000 - Gratis en compras superiores a $300.000",
    },
  ];

  const shippingProcess = [
    {
      step: 1,
      title: "Confirmación de Pedido",
      description: "Recibirás un email confirmando tu compra y los detalles del envío",
      icon: Package,
    },
    {
      step: 2,
      title: "Preparación",
      description: "Nuestro equipo prepara cuidadosamente tu pedido para el envío",
      icon: ShieldCheck,
    },
    {
      step: 3,
      title: "En Camino",
      description: "Te enviamos el código de rastreo para que sigas tu paquete",
      icon: Truck,
    },
    {
      step: 4,
      title: "Entrega",
      description: "Recibes tu pedido en la dirección indicada",
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
              <Truck className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Información de Envíos
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Todo lo que necesitas saber sobre nuestros envíos
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Shipping Process */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Proceso de Envío
              </h2>
              <p className="text-lg text-gray-600">
                Seguimiento completo de tu pedido desde la compra hasta tu puerta
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingProcess.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 mt-4">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Zones */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Zonas y Tiempos de Entrega
              </h2>
              <p className="text-lg text-gray-600">
                Consulta los tiempos y costos de envío según tu ubicación
              </p>
            </div>

            <div className="space-y-4">
              {shippingZones.map((zone, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {zone.zone}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{zone.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span>{zone.cost}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Información Importante
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p>
                  <strong>Envío Gratis:</strong> Aplica para compras que superen los montos indicados en cada zona.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p>
                  <strong>Días Hábiles:</strong> Los tiempos de entrega son en días hábiles, excluyendo sábados, domingos y festivos.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p>
                  <strong>Rastreo:</strong> Todos los envíos incluyen código de rastreo para que puedas seguir tu paquete en tiempo real.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p>
                  <strong>Empaque Seguro:</strong> Todos los productos se envían con embalaje protector para garantizar que lleguen en perfecto estado.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p>
                  <strong>Cambios de Dirección:</strong> Si necesitas modificar la dirección de envío, contáctanos dentro de las primeras 24 horas después de realizar el pedido.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p>
                  <strong>Intentos de Entrega:</strong> La transportadora realizará hasta 3 intentos de entrega. Asegúrate de que haya alguien disponible para recibir el paquete.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Preguntas Frecuentes sobre Envíos
            </h2>
            <div className="space-y-6">
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-blue-600 mt-1 text-xl group-open:rotate-90 transition-transform">▸</span>
                    <span className="font-semibold text-gray-900">
                      ¿Puedo cambiar mi dirección de envío después de realizar el pedido?
                    </span>
                  </div>
                </summary>
                <p className="mt-2 ml-11 text-gray-600 leading-relaxed">
                  Sí, puedes cambiar la dirección de envío dentro de las primeras 24 horas después de realizar tu pedido. Contacta inmediatamente a nuestro servicio al cliente con tu número de pedido.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-blue-600 mt-1 text-xl group-open:rotate-90 transition-transform">▸</span>
                    <span className="font-semibold text-gray-900">
                      ¿Qué hago si mi paquete no llega en el tiempo estimado?
                    </span>
                  </div>
                </summary>
                <p className="mt-2 ml-11 text-gray-600 leading-relaxed">
                  Si tu paquete excede el tiempo de entrega estimado, contáctanos con tu número de pedido y código de rastreo. Investigaremos inmediatamente el estado de tu envío.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-blue-600 mt-1 text-xl group-open:rotate-90 transition-transform">▸</span>
                    <span className="font-semibold text-gray-900">
                      ¿Necesito estar presente para recibir mi pedido?
                    </span>
                  </div>
                </summary>
                <p className="mt-2 ml-11 text-gray-600 leading-relaxed">
                  Sí, recomendamos que haya alguien disponible para recibir el paquete. Si no hay nadie, la transportadora dejará un aviso y realizará un segundo intento de entrega.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-blue-600 mt-1 text-xl group-open:rotate-90 transition-transform">▸</span>
                    <span className="font-semibold text-gray-900">
                      ¿Hacen envíos internacionales?
                    </span>
                  </div>
                </summary>
                <p className="mt-2 ml-11 text-gray-600 leading-relaxed">
                  Actualmente solo realizamos envíos dentro de Colombia. Estamos trabajando para ofrecer envíos internacionales próximamente.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
