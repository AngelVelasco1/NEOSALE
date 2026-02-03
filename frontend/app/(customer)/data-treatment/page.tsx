import { Metadata } from "next";
import { Database, Shield, UserCheck, Lock, FileText, AlertTriangle, Info, CheckCircle, Globe, Mail, Phone, MapPin, Clock, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Tratamiento de Datos | NeoSale",
  description: "Política de tratamiento de datos personales de NeoSale según la Ley 1581 de 2012",
};

export default function DataTreatmentPage() {
  const sections = [
    {
      title: "1. Identificación del Responsable",
      icon: Info,
      gradient: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
      content: `**Responsable del Tratamiento:**

• Razón Social: NeoSale S.A.S.
• NIT: 900.XXX.XXX-X
• Domicilio: Bogotá, Colombia
• Dirección: Calle XX #XX-XX, Bogotá
• Correo Electrónico: protecciondatos@tutienda.com
• Teléfono: +57 300 123 4567
• Sitio Web: www.tutienda.com

**Oficial de Protección de Datos:**
• Email: dpo@tutienda.com
• Horario de Atención: Lunes a Viernes, 9:00 AM - 6:00 PM`,
    },
    {
      title: "2. Marco Legal",
      icon: FileText,
      gradient: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      content: `Esta política se fundamenta en:

**Legislación Colombiana:**
• Ley 1581 de 2012 - Protección de Datos Personales
• Decreto 1377 de 2013 - Reglamentación parcial
• Ley 1266 de 2008 - Habeas Data
• Constitución Política de Colombia (Art. 15)

**Regulaciones Internacionales:**
• Principios de la OCDE sobre protección de datos
• Mejores prácticas internacionales
• Estándares de seguridad ISO 27001`,
    },
    {
      title: "3. Datos Personales Recopilados",
      icon: Database,
      gradient: "from-indigo-500/20 to-purple-500/20",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      content: `**Datos de Identificación:**
• Nombre completo
• Tipo y número de documento de identidad
• Fecha y lugar de nacimiento
• Género
• Nacionalidad

**Datos de Contacto:**
• Dirección de residencia y envío
• Teléfono fijo y móvil
• Correo electrónico
• Ciudad y departamento

**Datos Transaccionales:**
• Historial de compras
• Productos favoritos y en carrito
• Métodos de pago utilizados
• Direcciones de facturación
• Historial de devoluciones

**Datos de Navegación:**
• Dirección IP
• Tipo de navegador y dispositivo
• Cookies y tecnologías similares
• Páginas visitadas y tiempo de navegación
• Ubicación geográfica aproximada`,
    },
    {
      title: "4. Finalidades del Tratamiento",
      icon: UserCheck,
      gradient: "from-teal-500/20 to-cyan-500/20",
      borderColor: "border-teal-500/30",
      iconColor: "text-teal-400",
      content: `Tratamos tus datos personales para:

**Finalidades Principales:**
• Procesar y gestionar pedidos de compra
• Gestionar pagos y facturación
• Realizar envíos y entregas de productos
• Proporcionar servicio al cliente y soporte
• Administrar tu cuenta de usuario

**Finalidades Secundarias:**
• Enviar comunicaciones comerciales y promocionales
• Realizar estudios de mercado y encuestas
• Personalizar tu experiencia de compra
• Mejorar nuestros productos y servicios
• Prevenir fraude y garantizar seguridad

**Finalidades Legales:**
• Cumplir obligaciones fiscales y contables
• Atender requerimientos de autoridades
• Defender derechos legales
• Cumplir con regulaciones aplicables`,
    },
    {
      title: "5. Legitimación del Tratamiento",
      icon: Shield,
      gradient: "from-cyan-500/20 to-teal-500/20",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
      content: `El tratamiento de tus datos se basa en:

**Consentimiento Informado:**
• Aceptación expresa al registrarte
• Autorización explícita para usos específicos
• Consentimiento para comunicaciones de marketing
• Puede ser revocado en cualquier momento

**Ejecución de Contrato:**
• Necesario para procesar tu compra
• Requerido para prestación de servicios
• Cumplimiento de obligaciones contractuales

**Interés Legítimo:**
• Prevención de fraude
• Seguridad de sistemas
• Mejora de servicios
• Análisis estadísticos

**Obligación Legal:**
• Cumplimiento de leyes fiscales
• Retención documental obligatoria
• Requerimientos de autoridades`,
    },
    {
      title: "6. Derechos del Titular",
      icon: CheckCircle,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      content: `Conforme a la Ley 1581 de 2012, tienes derecho a:

**Derecho de Conocer:**
• Acceder a tus datos personales que poseemos
• Conocer las finalidades del tratamiento
• Solicitar información sobre uso de datos

**Derecho de Actualizar:**
• Modificar datos inexactos o incompletos
• Actualizar información desactualizada
• Completar información parcial

**Derecho de Rectificar:**
• Corregir errores en tus datos
• Modificar información incorrecta
• Actualizar datos que hayan cambiado

**Derecho de Suprimir:**
• Solicitar eliminación de datos (derecho al olvido)
• Eliminar información que no sea necesaria
• Sujeto a obligaciones legales de retención

**Derecho de Revocar:**
• Retirar el consentimiento otorgado
• Dejar de recibir comunicaciones de marketing
• Limitar el tratamiento de datos

**Derecho de Oposición:**
• Oponerte a ciertos tratamientos
• Solicitar cese de tratamiento cuando sea procedente`,
    },
    {
      title: "7. Medidas de Seguridad",
      icon: Lock,
      gradient: "from-indigo-500/20 to-blue-500/20",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      content: `Implementamos medidas técnicas y organizacionales:

**Seguridad Técnica:**
• Encriptación SSL/TLS para transmisión de datos
• Servidores seguros con firewalls
• Copias de seguridad regulares
• Sistemas de detección de intrusiones
• Actualización constante de sistemas

**Seguridad Organizacional:**
• Políticas de seguridad documentadas
• Capacitación continua del personal
• Acceso restringido a datos personales
• Acuerdos de confidencialidad
• Auditorías de seguridad periódicas

**Protección contra Amenazas:**
• Sistemas antimalware y antivirus
• Monitoreo 24/7 de infraestructura
• Plan de respuesta a incidentes
• Evaluaciones de vulnerabilidad
• Pruebas de penetración`,
    },
    {
      title: "8. Transferencia de Datos",
      icon: Globe,
      gradient: "from-purple-500/20 to-indigo-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
      content: `**Transferencias Nacionales:**
• Proveedores de servicios en Colombia
• Empresas de logística y transporte
• Procesadores de pago autorizados
• Con acuerdos de confidencialidad

**Transferencias Internacionales:**
• Servidores cloud (AWS, Google Cloud)
• Herramientas de análisis (Google Analytics)
• Servicios de email marketing
• Con garantías adecuadas de protección

**Garantías Aplicadas:**
• Cláusulas contractuales tipo
• Certificaciones de privacidad
• Países con nivel adecuado de protección
• Consentimiento explícito cuando sea requerido`,
    },
    {
      title: "9. Conservación de Datos",
      icon: AlertTriangle,
      gradient: "from-teal-500/20 to-blue-500/20",
      borderColor: "border-teal-500/30",
      iconColor: "text-teal-400",
      content: `**Períodos de Retención:**

• **Datos de cuenta activa:** Mientras mantengas cuenta
• **Datos transaccionales:** 5 años (requisito fiscal)
• **Datos de marketing:** Hasta revocación de consentimiento
• **Datos legales:** Según plazos de prescripción legal

**Eliminación Segura:**
• Borrado permanente de sistemas
• Destrucción de copias físicas
• Certificación de eliminación disponible
• Conservación solo si hay obligación legal

**Excepciones:**
• Obligaciones fiscales y contables
• Procesos judiciales o administrativos en curso
• Investigaciones de fraude
• Defensa de derechos legales`,
    },
    {
      title: "10. Datos Sensibles",
      icon: Shield,
      gradient: "from-cyan-500/20 to-indigo-500/20",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
      content: `**No Recopilamos Datos Sensibles:**

NeoSale NO solicita ni procesa datos sensibles como:
• Origen racial o étnico
• Orientación política
• Convicciones religiosas o filosóficas
• Afiliación sindical
• Datos biométricos o genéticos
• Datos de salud
• Vida sexual u orientación sexual

**Excepción:**
Si por alguna razón necesitáramos procesar datos sensibles:
• Se solicitará consentimiento explícito y escrito
• Se implementarán medidas de seguridad reforzadas
• Se limitará el acceso estrictamente necesario
• Se cumplirán requisitos adicionales de la ley`,
    },
    {
      title: "11. Datos de Menores de Edad",
      icon: AlertTriangle,
      gradient: "from-blue-500/20 to-teal-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      content: `**Política sobre Menores:**

• Nuestros servicios están dirigidos a mayores de 18 años
• No recopilamos intencionalmente datos de menores
• Se requiere autorización de padres/tutores para menores

**Si Detectamos Datos de Menores:**
• Eliminaremos los datos inmediatamente
• Notificaremos a los padres/tutores
• No procesaremos pedidos de menores sin autorización

**Protección Especial:**
• Medidas de verificación de edad
• Monitoreo de registros sospechosos
• Protocolos especiales de manejo`,
    },
    {
      title: "12. Actualizaciones de la Política",
      icon: FileText,
      gradient: "from-indigo-500/20 to-cyan-500/20",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      content: `**Modificaciones:**

• Esta política puede actualizarse periódicamente
• Los cambios se publicarán en esta página
• La fecha de actualización se mostrará al inicio
• Cambios significativos se notificarán por email

**Tu Responsabilidad:**
• Revisar periódicamente esta política
• El uso continuado implica aceptación de cambios
• Ejercer tus derechos si no estás de acuerdo

**Versión Vigente:**
• Siempre disponible en nuestro sitio web
• Archivo de versiones anteriores disponible
• Fecha efectiva de cada versión indicada`,
    },
    {
      title: "13. Autoridad de Control",
      icon: Scale,
      gradient: "from-purple-500/20 to-blue-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
      content: `**Superintendencia de Industria y Comercio (SIC):**

Si no estás satisfecho con nuestra respuesta, puedes acudir a:

• Dirección: Carrera 13 No. 27-00, Bogotá
• Teléfono: +57 (1) 587 0000
• Web: www.sic.gov.co
• Email: contactenos@sic.gov.co

**Delegatura para la Protección de Datos Personales:**
• Recibe quejas sobre tratamiento de datos
• Investiga posibles infracciones
• Impone sanciones cuando corresponde
• Orienta a titulares sobre sus derechos`,
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "protecciondatos@tutienda.com",
      href: "mailto:protecciondatos@tutienda.com",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+57 300 123 4567",
      href: "tel:+573001234567",
      gradient: "from-indigo-500/20 to-purple-500/20",
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: "Bogotá, Colombia",
      href: "#",
      gradient: "from-teal-500/20 to-cyan-500/20",
    },
    {
      icon: Clock,
      title: "Horario",
      value: "L-V 9:00 AM - 6:00 PM",
      href: "#",
      gradient: "from-blue-500/20 to-indigo-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-linear-to-br from-blue-500/15 to-indigo-500/15 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-linear-to-br from-purple-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse delay-300" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="border-b border-slate-800/50 bg-linear-to-b from-slate-900/95 via-slate-900/90 to-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-600/30 to-blue-600/30 rounded-3xl blur-xl animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/30 backdrop-blur-sm">
                  <Database className="w-12 h-12 text-cyan-400 drop-shadow-lg" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-linear-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent leading-tight">
                  Tratamiento de
                  <br />
                  <span className="bg-linear-to-r from-teal-300 to-purple-300 bg-clip-text text-transparent">
                    Datos Personales
                  </span>
                </h1>

                <div className="w-32 h-1 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full mx-auto" />
              </div>

              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Política completa de tratamiento y protección de datos personales conforme a la
                Ley 1581 de 2012 y la normativa colombiana vigente.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-slate-300">Última actualización:</span>
                  <span className="font-semibold text-white">31 de Enero, 2026</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">Ley 1581 de 2012</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300">SIC Autoridad</span>
                </div>
              </div>

              {/* Important Notice */}
              <div className="relative p-8 rounded-3xl bg-linear-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 backdrop-blur-xl max-w-4xl mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-cyan-500/5 to-blue-500/5" />
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <Info className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1 text-left space-y-3">
                      <h3 className="text-xl font-bold bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                        Autorización para Tratamiento de Datos
                      </h3>
                      <p className="text-slate-300 leading-relaxed">
                        Al registrarte y usar nuestros servicios, autorizas expresamente a NeoSale para recopilar,
                        almacenar, usar, circular y tratar tus datos personales conforme a esta política y la
                        legislación colombiana vigente. Esta autorización es revocable en cualquier momento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Introduction Card */}
            <div className="mb-16">
              <div className="relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5" />
                <div className="relative z-10 text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    Compromiso con tus Derechos
                  </h2>
                  <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    En NeoSale, entendemos la importancia de proteger tu información personal. Esta política
                    detalla cómo recopilamos, usamos y protegemos tus datos, garantizando el cumplimiento
                    de tus derechos según la legislación colombiana.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Treatment Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${section.gradient} border ${section.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className={`w-7 h-7 ${section.iconColor} drop-shadow-sm`} />
                        </div>

                        <div className="flex-1 space-y-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 leading-tight">
                            {section.title}
                          </h3>

                          <div className="prose prose-invert prose-slate max-w-none">
                            <div className="text-slate-300 leading-relaxed whitespace-pre-line [&>strong]:text-white [&>strong]:font-semibold">
                              {section.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Section */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-bold bg-linear-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  Ejercicio de Derechos ARCO
                </h3>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Para ejercer tus derechos de Acceso, Rectificación, Cancelación u Oposición sobre tus datos personales,
                  nuestro equipo de protección de datos está disponible para ayudarte.
                </p>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={index}
                      href={contact.href}
                      className="group relative p-6 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${contact.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                      <div className="relative z-10 text-center space-y-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${contact.gradient} border border-slate-600/50 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                            {contact.title}
                          </h4>
                          <p className="text-slate-300 text-sm mt-1">
                            {contact.value}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Final CTA */}
              <div className="relative p-12 rounded-3xl bg-linear-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-cyan-500/5 to-blue-500/5" />
                <div className="relative z-10 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <Shield className="w-8 h-8 text-cyan-400" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">
                      Protección de Datos Garantizada
                    </h3>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                      Cumplimos estrictamente con la Ley 1581 de 2012 y trabajamos bajo la supervisión
                      de la Superintendencia de Industria y Comercio (SIC) para garantizar tus derechos.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:protecciondatos@tutienda.com"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25"
                    >
                      <Mail className="w-5 h-5" />
                      Contactar Protección de Datos
                    </a>
                    <a
                      href="tel:+573001234567"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold transition-all duration-300 hover:scale-105 border border-slate-600/50"
                    >
                      <Phone className="w-5 h-5" />
                      Llamar Ahora
                    </a>
                  </div>
                </div>
              </div>

              {/* Legal Footer */}
              <div className="relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5" />
                <div className="relative z-10 text-center space-y-4">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                      <Scale className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">Ley 1581 de 2012</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300">Decreto 1377 de 2013</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                      <Database className="w-4 h-4 text-indigo-400" />
                      <span className="text-slate-300">Superintendencia SIC</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm max-w-3xl mx-auto leading-relaxed">
                    Esta política cumple con la legislación colombiana sobre protección de datos personales.
                    La Superintendencia de Industria y Comercio (SIC) es la autoridad de control competente
                    para velar por el cumplimiento de estas normas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
