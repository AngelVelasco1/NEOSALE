import Link from 'next/link';
import { FileText, Calendar, ArrowRight, FileSpreadsheet, TrendingUp } from 'lucide-react';

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-10" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                            <FileText className="w-4 h-4" />
                            <span>Documentación del Proyecto</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            NeoSale Documentation
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            Accede a toda la documentación del proyecto, incluyendo el diagrama de Gantt y los indicadores clave de rendimiento (KPI).
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Gantt Card */}
                    <Link href="/documentation/grantt">
                        <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer overflow-hidden">
                            {/* Background Effect */}
                            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mb-6 inline-flex p-4 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Calendar className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    Diagrama de Gantt
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    Visualiza el cronograma completo del proyecto con todas las fases, tareas y progreso de cada etapa del desarrollo de NeoSale.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span>5 Fases del proyecto</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        <span>62 Tareas planificadas</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        <span>Filtros por fase y estado</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span>Exportación a Excel</span>
                                    </li>
                                </ul>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-4 transition-all">
                                    <span>Ver Diagrama</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* KPI Card */}
                    <Link href="/documentation/kpi">
                        <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer overflow-hidden">
                            {/* Background Effect */}
                            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mb-6 inline-flex p-4 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    Indicadores KPI
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    Consulta los indicadores clave de rendimiento del proyecto, métricas de avance y análisis de desempeño del equipo.
                                </p>

                                {/* Features */}
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        <span>Métricas de progreso</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        <span>Análisis de rendimiento</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                        <span>Visualización de datos</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        <span>Reportes detallados</span>
                                    </li>
                                </ul>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-4 transition-all">
                                    <span>Ver KPIs</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                </div>

                {/* Additional Info */}
                <div className="mt-12 max-w-3xl mx-auto">
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-blue-500 shadow-lg">
                                <FileSpreadsheet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Documentación del Proyecto NeoSale
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Este proyecto de e-commerce fue desarrollado entre octubre 2024 y mayo 2025, implementando una plataforma completa con Next.js, React, Node.js y PostgreSQL. El equipo está conformado por <strong>Angel Velasco</strong> (desarrollo e investigación) y <strong>Jose Alvarez</strong> (documentación y pruebas).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
