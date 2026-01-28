import { Metadata } from "next";
import { Database, Shield, UserCheck, Lock, FileText, AlertTriangle, Info, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Tratamiento de Datos | NeoSale",
  description: "Política de tratamiento de datos personales de NeoSale según la Ley 1581 de 2012",
};

export default function DataTreatmentPage() {
  const sections = [
    {
      title: "1. Identificación del Responsable",
      icon: Info,
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
      title: "8. Medidas de Seguridad",
      icon: Lock,
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
      title: "9. Transferencia de Datos",
      icon: Database,
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
      title: "10. Conservación de Datos",
      icon: AlertTriangle,
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
      title: "11. Datos Sensibles",
      icon: Shield,
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
      title: "12. Datos de Menores de Edad",
      icon: AlertTriangle,
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
      title: "13. Actualizaciones de la Política",
      icon: FileText,
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
      title: "14. Autoridad de Control",
      icon: Shield,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="border-b border-slate-800/50 bg-gradient-to-b from-slate-900/90 to-transparent backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-fuchsia-500/20 border border-blue-500/30 mb-6">
                <Database className="w-10 h-10 text-blue-400" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                Tratamiento de Datos Personales
              </h1>
              
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Política de tratamiento y protección de datos personales conforme a la Ley 1581 de 2012 
                y normativa colombiana vigente.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <span>Última actualización:</span>
                <span className="font-semibold text-slate-300">25 de Enero, 2026</span>
              </div>

              {/* Important Notice */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="text-left space-y-2">
                    <p className="font-semibold text-white">
                      Autorización para Tratamiento de Datos
                    </p>
                    <p className="text-sm text-slate-300">
                      Al registrarte y usar nuestros servicios, autorizas expresamente a NeoSale para recopilar, 
                      almacenar, usar, circular y tratar tus datos personales conforme a esta política y la 
                      legislación colombiana vigente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
                  
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

            {/* Contact CTA */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  Ejercicio de Derechos ARCO
                </h3>
                <p className="text-slate-300">
                  Para ejercer tus derechos de Acceso, Rectificación, Cancelación u Oposición, contáctanos:
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="mailto:protecciondatos@tutienda.com"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Contactar Protección de Datos
                    <Shield className="w-5 h-5" />
                  </a>
                  <a
                    href="tel:+573001234567"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-600 hover:border-blue-500/50 text-white font-semibold transition-all duration-300 hover:scale-105"
                  >
                    +57 300 123 4567
                  </a>
                </div>
              </div>
            </div>

            {/* Legal Footer */}
            <div className="mt-8 p-6 rounded-xl bg-slate-900/50 border border-slate-700/30">
              <p className="text-center text-sm text-slate-400">
                Esta política cumple con la <span className="text-blue-400 font-semibold">Ley 1581 de 2012</span> y el{" "}
                <span className="text-purple-400 font-semibold">Decreto 1377 de 2013</span> sobre protección de datos 
                personales en Colombia. Superintendencia de Industria y Comercio (SIC) es la autoridad de control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
