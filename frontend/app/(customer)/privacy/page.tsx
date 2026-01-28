import { Metadata } from "next";
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad | NeoSale",
  description: "Política de privacidad de NeoSale - Conoce cómo protegemos y manejamos tu información personal",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Información que Recopilamos",
      icon: Database,
      content: `Recopilamos diferentes tipos de información para brindarte un mejor servicio:

**Información Personal:**
• Nombre completo y documento de identidad
• Dirección de correo electrónico
• Número de teléfono
• Dirección de envío y facturación
• Información de pago (procesada de forma segura)

**Información de Uso:**
• Dirección IP y tipo de navegador
• Páginas visitadas y tiempo de navegación
• Productos vistos y agregados al carrito
• Historial de compras y preferencias
• Cookies y tecnologías similares`,
    },
    {
      title: "2. Cómo Usamos tu Información",
      icon: UserCheck,
      content: `Utilizamos tu información personal para:

**Operaciones Esenciales:**
• Procesar y gestionar tus pedidos
• Comunicarnos contigo sobre tus compras
• Proporcionar soporte al cliente
• Verificar tu identidad y prevenir fraudes
• Cumplir con obligaciones legales y fiscales

**Mejoras del Servicio:**
• Personalizar tu experiencia de compra
• Enviar recomendaciones de productos
• Mejorar nuestro sitio web y servicios
• Realizar análisis estadísticos
• Desarrollar nuevos productos y servicios`,
    },
    {
      title: "3. Bases Legales para el Tratamiento",
      icon: Shield,
      content: `Tratamos tus datos personales bajo las siguientes bases legales:

• **Ejecución de contrato:** Para procesar tus pedidos
• **Consentimiento:** Para comunicaciones de marketing
• **Interés legítimo:** Para prevenir fraude y mejorar servicios
• **Obligación legal:** Para cumplir con requisitos fiscales y legales
• **Ley 1581 de 2012:** Protección de datos personales en Colombia`,
    },
    {
      title: "4. Compartir Información con Terceros",
      icon: Eye,
      content: `Podemos compartir tu información con:

**Proveedores de Servicios:**
• Empresas de transporte y logística
• Procesadores de pago seguros
• Servicios de hosting y almacenamiento
• Plataformas de email marketing
• Herramientas de análisis y métricas

**Requisitos Legales:**
• Autoridades gubernamentales cuando sea requerido
• Para proteger nuestros derechos legales
• En caso de fusión, adquisición o venta de activos

**Nota:** Nunca vendemos tu información personal a terceros con fines de marketing.`,
    },
    {
      title: "5. Seguridad de la Información",
      icon: Lock,
      content: `Implementamos medidas de seguridad para proteger tus datos:

**Medidas Técnicas:**
• Encriptación SSL/TLS en todas las transacciones
• Servidores seguros con certificaciones de seguridad
• Firewalls y sistemas de detección de intrusiones
• Copias de seguridad regulares
• Actualizaciones constantes de seguridad

**Medidas Organizacionales:**
• Acceso limitado solo a personal autorizado
• Capacitación en seguridad de datos
• Auditorías de seguridad periódicas
• Políticas estrictas de confidencialidad
• Monitoreo continuo de sistemas`,
    },
    {
      title: "6. Tus Derechos",
      icon: Shield,
      content: `Según la Ley 1581 de 2012, tienes derecho a:

**Derechos Fundamentales:**
• **Acceso:** Conocer qué datos tenemos sobre ti
• **Rectificación:** Corregir información inexacta
• **Actualización:** Mantener tus datos al día
• **Supresión:** Solicitar la eliminación de tus datos
• **Revocación:** Retirar el consentimiento otorgado

**Cómo Ejercer tus Derechos:**
• Contacta a privacidad@tutienda.com
• Proporciona identificación válida
• Especifica claramente tu solicitud
• Responderemos en máximo 15 días hábiles`,
    },
    {
      title: "7. Cookies y Tecnologías de Rastreo",
      icon: Database,
      content: `Utilizamos cookies para mejorar tu experiencia:

**Tipos de Cookies:**
• **Esenciales:** Necesarias para el funcionamiento del sitio
• **Funcionales:** Recordar tus preferencias
• **Analíticas:** Entender cómo usas el sitio
• **Publicitarias:** Mostrar anuncios relevantes

**Control de Cookies:**
• Puedes gestionar cookies desde tu navegador
• Desactivar cookies puede afectar la funcionalidad
• Consulta nuestra Política de Cookies para más detalles`,
    },
    {
      title: "8. Retención de Datos",
      icon: Database,
      content: `Conservamos tu información personal:

• Durante el tiempo necesario para prestarte servicios
• Mientras mantengas una cuenta activa
• Por requisitos legales y fiscales (hasta 5 años)
• Para resolver disputas y hacer cumplir acuerdos
• Datos anonimizados pueden retenerse indefinidamente

**Eliminación de Cuenta:**
• Puedes solicitar la eliminación de tu cuenta
• Se conservarán datos requeridos legalmente
• El proceso puede tomar hasta 30 días`,
    },
    {
      title: "9. Transferencias Internacionales",
      icon: AlertTriangle,
      content: `Tu información puede ser transferida a:

• Servidores ubicados fuera de Colombia
• Proveedores de servicios internacionales
• Países con protección adecuada de datos

**Garantías:**
• Cláusulas contractuales estándar aprobadas
• Certificaciones de privacidad reconocidas
• Medidas de seguridad apropiadas
• Cumplimiento con regulaciones aplicables`,
    },
    {
      title: "10. Menores de Edad",
      icon: Shield,
      content: `Protección de menores:

• No recopilamos intencionalmente datos de menores de 18 años
• Los padres/tutores deben supervisar el uso del sitio
• Si detectamos datos de menores, los eliminaremos
• Se requiere consentimiento parental para menores
• Contacta inmediatamente si se registró información de un menor`,
    },
    {
      title: "11. Marketing y Comunicaciones",
      icon: Eye,
      content: `Respecto a comunicaciones de marketing:

**Consentimiento:**
• Solicitamos tu consentimiento explícito
• Puedes suscribirte a nuestro newsletter
• Recibirás ofertas y promociones especiales

**Opt-out:**
• Cancela la suscripción en cualquier momento
• Usa el enlace "Darse de baja" en emails
• Actualiza preferencias en tu cuenta
• Respetamos tu decisión inmediatamente`,
    },
    {
      title: "12. Cambios a esta Política",
      icon: AlertTriangle,
      content: `Actualizaciones de la política:

• Nos reservamos el derecho de modificar esta política
• Los cambios se publicarán en esta página
• La fecha de actualización se mostrará arriba
• Cambios significativos serán notificados por email
• El uso continuado implica aceptación de cambios`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="border-b border-slate-800/50 bg-gradient-to-b from-slate-900/90 to-transparent backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30 mb-6">
                <Shield className="w-10 h-10 text-fuchsia-400" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-fuchsia-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
                Política de Privacidad
              </h1>
              
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Tu privacidad es nuestra prioridad. Conoce cómo recopilamos, usamos y protegemos 
                tu información personal conforme a la legislación colombiana.
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
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm hover:border-fuchsia-500/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/0 to-purple-500/0 group-hover:from-fuchsia-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-fuchsia-400" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <h2 className="text-2xl font-bold text-white group-hover:text-fuchsia-300 transition-colors duration-300">
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
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/30">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  ¿Preguntas sobre tu Privacidad?
                </h3>
                <p className="text-slate-300">
                  Contacta a nuestro oficial de protección de datos para consultas sobre privacidad.
                </p>
                <a
                  href="mailto:privacidad@tutienda.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 hover:scale-105"
                >
                  Contactar Privacidad
                  <Lock className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
