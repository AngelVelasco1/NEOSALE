import { Metadata } from "next";
import { Scale, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | NeoSale",
  description: "Términos y condiciones de uso de NeoSale - Lee nuestros términos antes de usar nuestros servicios",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Aceptación de Términos",
      icon: CheckCircle2,
      content: `Al acceder y utilizar este sitio web, usted acepta y se compromete a cumplir con estos términos y condiciones de uso. Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar nuestros servicios.`,
    },
    {
      title: "2. Uso del Sitio Web",
      icon: FileText,
      content: `El contenido de este sitio web es para su información general y uso personal. Está sujeto a cambios sin previo aviso. Usted se compromete a:
      
• Utilizar el sitio de manera legal y apropiada
• No realizar actividades que puedan dañar o interferir con el funcionamiento del sitio
• No intentar acceder a áreas restringidas del sistema
• Proporcionar información veraz y actualizada al registrarse`,
    },
    {
      title: "3. Productos y Servicios",
      icon: Scale,
      content: `Nos esforzamos por mantener la información de productos actualizada y precisa. Sin embargo:

• Los precios están sujetos a cambios sin previo aviso
• Las imágenes son representativas y pueden variar ligeramente del producto real
• La disponibilidad de productos puede cambiar sin notificación previa
• Nos reservamos el derecho de limitar las cantidades de compra
• Los productos están sujetos a disponibilidad de stock`,
    },
    {
      title: "4. Registro de Cuenta",
      icon: AlertCircle,
      content: `Al crear una cuenta en nuestro sitio, usted:

• Es responsable de mantener la confidencialidad de su contraseña
• Es responsable de todas las actividades que ocurran bajo su cuenta
• Debe notificarnos inmediatamente de cualquier uso no autorizado
• Debe tener al menos 18 años de edad para registrarse
• Acepta proporcionar información veraz, actual y completa`,
    },
    {
      title: "5. Proceso de Compra",
      icon: FileText,
      content: `Al realizar una compra en nuestro sitio:

• La confirmación del pedido no garantiza la disponibilidad del producto
• Nos reservamos el derecho de rechazar o cancelar pedidos
• Los precios incluyen IVA según la legislación colombiana
• El contrato de compra se considera finalizado al recibir la confirmación
• Aplican las políticas de envío y devolución publicadas`,
    },
    {
      title: "6. Pagos y Facturación",
      icon: Scale,
      content: `Respecto a los pagos:

• Aceptamos los métodos de pago indicados en el sitio
• Los pagos son procesados de forma segura por pasarelas certificadas
• El cargo se realizará al confirmar el pedido
• En caso de error en precios, nos reservamos el derecho a cancelar
• Toda transacción está sujeta a verificación de fraude`,
    },
    {
      title: "7. Envíos y Entregas",
      icon: CheckCircle2,
      content: `Política de envíos:

• Los tiempos de entrega son estimados y no garantizados
• No somos responsables por retrasos causados por terceros
• El riesgo se transfiere al momento de la entrega al transportista
• Es responsabilidad del cliente verificar el paquete al recibirlo
• Los costos de envío se calculan según destino y peso`,
    },
    {
      title: "8. Devoluciones y Reembolsos",
      icon: AlertCircle,
      content: `Para devoluciones:

• Aplica la Ley 1480 de 2011 (Estatuto del Consumidor)
• Derecho de retracto de 5 días hábiles desde la entrega
• Los productos deben estar en su empaque original sin usar
• El cliente asume el costo del envío de devolución
• Los reembolsos se procesan en 30 días hábiles máximo`,
    },
    {
      title: "9. Propiedad Intelectual",
      icon: FileText,
      content: `Todo el contenido del sitio web:

• Está protegido por derechos de autor y marcas registradas
• No puede ser reproducido sin autorización expresa
• Incluye textos, gráficos, logos, imágenes y software
• Su uso no autorizado puede resultar en acciones legales
• Las marcas de terceros pertenecen a sus respectivos dueños`,
    },
    {
      title: "10. Limitación de Responsabilidad",
      icon: Scale,
      content: `Nuestra responsabilidad está limitada a:

• No garantizamos que el sitio esté libre de interrupciones o errores
• No somos responsables por daños indirectos o consecuentes
• La responsabilidad máxima no excederá el valor pagado por el producto
• No garantizamos la exactitud de información de terceros
• Aplican las limitaciones permitidas por la ley colombiana`,
    },
    {
      title: "11. Enlaces a Terceros",
      icon: AlertCircle,
      content: `Nuestro sitio puede contener enlaces a sitios web externos:

• No somos responsables del contenido de sitios de terceros
• Los enlaces no implican endoso o aprobación
• El uso de sitios externos es bajo su propio riesgo
• Recomendamos revisar sus políticas de privacidad
• No controlamos la disponibilidad de estos sitios`,
    },
    {
      title: "12. Modificaciones",
      icon: CheckCircle2,
      content: `Nos reservamos el derecho de:

• Modificar estos términos en cualquier momento
• Los cambios serán efectivos al publicarse en el sitio
• El uso continuado implica aceptación de los nuevos términos
• Se notificarán cambios significativos cuando sea posible
• Es su responsabilidad revisar periódicamente los términos`,
    },
    {
      title: "13. Ley Aplicable y Jurisdicción",
      icon: Scale,
      content: `Estos términos se rigen por:

• La legislación de la República de Colombia
• Cualquier disputa se resolverá en tribunales colombianos
• Se aplicará el Estatuto del Consumidor (Ley 1480 de 2011)
• Se respetan los derechos del consumidor establecidos por ley
• Mediación como primera instancia de resolución de conflictos`,
    },
    {
      title: "14. Contacto",
      icon: FileText,
      content: `Para consultas sobre estos términos:

• Email: legal@tutienda.com
• Teléfono: +57 300 123 4567
• Dirección: Bogotá, Colombia
• Horario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM
• Tiempo de respuesta: Máximo 5 días hábiles`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="border-b border-slate-800/50 bg-gradient-to-b from-slate-900/90 to-transparent backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
                <Scale className="w-10 h-10 text-blue-400" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                Términos y Condiciones
              </h1>
              
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Por favor, lee cuidadosamente estos términos antes de usar nuestros servicios. 
                Al utilizar nuestro sitio web, aceptas estar sujeto a estos términos.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <span>Última actualización:</span>
                <span className="font-semibold text-slate-300">25 de Enero, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <h2 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                          {section.title}
                        </h2>
                        
                        <div className="prose prose-invert prose-slate max-w-none">
                          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Contact CTA */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  ¿Tienes preguntas sobre nuestros términos?
                </h3>
                <p className="text-slate-300">
                  Nuestro equipo legal está aquí para ayudarte a entender mejor nuestros términos y condiciones.
                </p>
                <a
                  href="mailto:legal@tutienda.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 hover:scale-105"
                >
                  Contactar Soporte Legal
                  <AlertCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
