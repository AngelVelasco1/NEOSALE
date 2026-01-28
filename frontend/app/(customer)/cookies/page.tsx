import { Metadata } from "next";
import { Cookie, Settings, BarChart, Target, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Política de Cookies | NeoSale",
    description: "Política de cookies de NeoSale - Información sobre cómo usamos cookies y tecnologías similares",
};

export default function CookiesPage() {
    const cookieTypes = [
        {
            title: "Cookies Estrictamente Necesarias",
            icon: CheckCircle2,
            color: "blue",
            required: true,
            content: `Estas cookies son esenciales para el funcionamiento del sitio web:

• Permitir la navegación básica del sitio
• Recordar productos en tu carrito de compras
• Mantener tu sesión activa
• Garantizar la seguridad y prevenir fraudes

Nota: No puedes desactivar estas cookies ya que el sitio no funcionaría correctamente.`,
        },
        {
            title: "Cookies de Funcionalidad",
            icon: Settings,
            color: "purple",
            required: false,
            content: `Mejoran la funcionalidad y personalización del sitio:

Propósito:
• Guardar tu ubicación (región/ciudad)
• Recordar ajustes de visualización
• Personalizar el contenido según tus preferencias
• Mejorar tu experiencia de usuario

Control: Puedes desactivar estas cookies, pero puede afectar la funcionalidad del sitio.`,
        },
        {
            title: "Cookies Analíticas",
            icon: BarChart,
            color: "fuchsia",
            required: false,
            content: `Nos ayudan a entender cómo los usuarios interactúan con el sitio:

• Contar visitantes y medir tráfico
• Analizar patrones de navegación
• Mejorar el rendimiento del sitio

Control: Puedes optar por no participar en el rastreo analítico.`,
        },
        {
            title: "Cookies de Marketing",
            icon: Target,
            color: "cyan",
            required: false,
            content: `Utilizadas para mostrar publicidad relevante:

• Mostrar anuncios personalizados
• Limitar la frecuencia de anuncios
• Medir la efectividad de campañas
• Recordar tus intereses y comportamiento de compra


Control: Puedes rechazar estas cookies sin afectar la funcionalidad básica del sitio.`,
        },
    ];



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className=" bg-gradient-to-b from-slate-900/90 to-transparent backdrop-blur-sm">
                    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18">
                        <div className="max-w-5xl mx-auto text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-6">
                                <Cookie className="w-10 h-10 text-purple-400" />
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                                Política de Cookies
                            </h1>

                            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                                Transparencia total sobre cómo usamos cookies y tecnologías similares para
                                mejorar tu experiencia en nuestro sitio web.
                            </p>

                            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                                <span>Última actualización:</span>
                                <span className="font-semibold text-slate-300">25 de Enero, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What are Cookies Section */}
                <div className="border-b border-slate-800/50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                        <div className="max-w-4xl mx-auto">
                            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    ¿Qué son las Cookies?
                                </h2>
                                <div className="space-y-3 text-slate-300">
                                    <p className="leading-relaxed text-sm">
                                        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (computadora,
                                        tablet o móvil) cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y
                                        preferencias durante un período de tiempo, para que no tengas que reconfigurarlas cada vez
                                        que regreses o navegues de una página a otra.
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cookie Types */}
                <div className="border-b border-slate-800/50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-3">
                                    Tipos de Cookies que Utilizamos
                                </h2>
                                <p className="text-slate-300 text-sm">
                                    Clasificamos las cookies según su función y propósito
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cookieTypes.map((type, index) => {
                                    const Icon = type.icon;
                                    const colorClasses = {
                                        blue: {
                                            border: "border-blue-500/30",
                                            glow: "from-blue-500/5 to-blue-500/5",
                                            icon: "from-blue-500/20 to-blue-500/20 border-blue-500/30",
                                            iconColor: "text-blue-400",
                                            badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                                        },
                                        purple: {
                                            border: "border-purple-500/30",
                                            glow: "from-purple-500/5 to-purple-500/5",
                                            icon: "from-purple-500/20 to-purple-500/20 border-purple-500/30",
                                            iconColor: "text-purple-400",
                                            badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                                        },
                                        fuchsia: {
                                            border: "border-fuchsia-500/30",
                                            glow: "from-fuchsia-500/5 to-fuchsia-500/5",
                                            icon: "from-fuchsia-500/20 to-fuchsia-500/20 border-fuchsia-500/30",
                                            iconColor: "text-fuchsia-400",
                                            badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
                                        },
                                        cyan: {
                                            border: "border-cyan-500/30",
                                            glow: "from-cyan-500/5 to-cyan-500/5",
                                            icon: "from-cyan-500/20 to-cyan-500/20 border-cyan-500/30",
                                            iconColor: "text-cyan-400",
                                            badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                                        },
                                    }[type.color as keyof typeof colorClasses];

                                    return (
                                        <div
                                            key={index}
                                            className={`group relative p-5 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border ${colorClasses.border} backdrop-blur-sm hover:${colorClasses.border} transition-all duration-300`}
                                        >
                                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colorClasses.glow} group-hover:${colorClasses.glow} transition-all duration-300 pointer-events-none`} />

                                            <div className="relative z-10 space-y-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-2 flex-1">
                                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses.icon} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                            <Icon className={`w-5 h-5 ${colorClasses.iconColor}`} />
                                                        </div>

                                                        <div className="flex-1 space-y-2">
                                                            <h3 className="ms-2 text-lg font-bold text-white">
                                                                {type.title}
                                                            </h3>

                                                            <div className="prose prose-invert prose-slate">
                                                                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                                                                    {type.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {type.required && (
                                                        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses.badge}`}>
                                                            Requeridas
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cookie Management */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-3">
                                Cómo Gestionar las Cookies
                            </h2>
                            <p className="text-slate-300 text-sm">
                                Tienes control total sobre las cookies en tu dispositivo
                            </p>
                        </div>


                        {/* Additional Info */}
                        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/30">
                            <h3 className="text-lg font-bold text-white mb-3">
                                Información Adicional
                            </h3>
                            <div className="space-y-2 text-slate-300 text-sm">
                                <p>
                                    <strong className="text-white">Cookies de Terceros:</strong> Algunos de nuestros socios comerciales
                                    (como procesadores de pago, herramientas de análisis) pueden establecer cookies en tu dispositivo.
                                    No tenemos control sobre estas cookies de terceros.
                                </p>
                                <p>
                                    <strong className="text-white">Actualización de Preferencias:</strong> Puedes cambiar tus preferencias
                                    de cookies en cualquier momento. Sin embargo, ten en cuenta que deshabilitar ciertas cookies puede
                                    afectar tu experiencia en el sitio.
                                </p>
                                <p>
                                    <strong className="text-white">Más Información:</strong> Para más detalles sobre cómo manejamos tu
                                    información personal, consulta nuestra Política de Privacidad.
                                </p>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                            <div className="text-center space-y-3">
                                <h3 className="text-xl font-bold text-white">
                                    ¿Preguntas sobre Cookies?
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Si tienes preguntas sobre nuestra política de cookies, no dudes en contactarnos.
                                </p>
                                <a
                                    href="mailto:cookies@tutienda.com"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold transition-all duration-300 hover:scale-105"
                                >
                                    Contactar Soporte
                                    <Cookie className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
