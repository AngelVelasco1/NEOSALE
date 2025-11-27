"use client"
import React, { useState, useMemo } from 'react';
import { Download, Printer, Search } from 'lucide-react';

interface Task {
    phase: string;
    task: string;
    assignedTo: string;
    progress: number;
    start: string;
    end: string;
}

const GanttChart = () => {
    const [phaseFilter, setPhaseFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const projectData: Task[] = [
        // PLANEACIÓN (Octubre 2024)
        { phase: "Planeación", task: "Definir objetivos y alcance del proyecto NeoSale", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-01", end: "2024-10-05" },
        { phase: "Planeación", task: "Análisis de mercado y competidores e-commerce", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-02", end: "2024-10-08" },
        { phase: "Planeación", task: "Definir requisitos funcionales del sistema", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-06", end: "2024-10-12" },
        { phase: "Planeación", task: "Establecer canales de comunicación del equipo", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-08", end: "2024-10-10" },
        { phase: "Planeación", task: "Crear document charter del proyecto", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-10", end: "2024-10-15" },
        { phase: "Planeación", task: "Configurar estructura del equipo de desarrollo", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-12", end: "2024-10-16" },
        { phase: "Planeación", task: "Definir stack tecnológico (Next.js, React, Node.js)", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-14", end: "2024-10-18" },
        { phase: "Planeación", task: "Investigar pasarelas de pago para Colombia", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-16", end: "2024-10-20" },
        { phase: "Planeación", task: "Análisis de requisitos de seguridad y compliance", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-18", end: "2024-10-22" },
        { phase: "Planeación", task: "Definir metodología de trabajo (Scrum/Agile)", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-20", end: "2024-10-24" },

        // DISEÑO (Octubre-Noviembre 2024)
        { phase: "Diseño", task: "Diseñar arquitectura de base de datos PostgreSQL", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-25", end: "2024-10-31" },
        { phase: "Diseño", task: "Crear wireframes y mockups de la interfaz", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-28", end: "2024-11-05" },
        { phase: "Diseño", task: "Diseñar sistema de autenticación con NextAuth", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-01", end: "2024-11-07" },
        { phase: "Diseño", task: "Definir API REST y endpoints del backend", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-04", end: "2024-11-10" },
        { phase: "Diseño", task: "Diseñar flujo de carrito de compras", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-06", end: "2024-11-12" },
        { phase: "Diseño", task: "Crear guía de estilos y design system", assignedTo: "Jose Alvarez", progress: 100, start: "2024-11-08", end: "2024-11-14" },
        { phase: "Diseño", task: "Diseñar módulo de gestión de productos", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-11", end: "2024-11-17" },
        { phase: "Diseño", task: "Planificar estrategia de SEO y optimización", assignedTo: "Jose Alvarez", progress: 100, start: "2024-11-13", end: "2024-11-19" },
        { phase: "Diseño", task: "Diseñar sistema de notificaciones", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-15", end: "2024-11-21" },
        { phase: "Diseño", task: "Definir estructura de variantes de productos", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-18", end: "2024-11-24" },
        { phase: "Diseño", task: "Diseñar dashboard administrativo", assignedTo: "Angel Velasco", progress: 90, start: "2024-11-20", end: "2024-11-26" },
        { phase: "Diseño", task: "Crear diagramas de flujo de órdenes", assignedTo: "Jose Alvarez", progress: 90, start: "2024-11-22", end: "2024-11-28" },

        // DESARROLLO (Diciembre 2024 - Febrero 2025)
        { phase: "Desarrollo", task: "Configurar proyecto Next.js con TypeScript", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-01", end: "2024-12-05" },
        { phase: "Desarrollo", task: "Implementar sistema de autenticación", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-03", end: "2024-12-10" },
        { phase: "Desarrollo", task: "Desarrollar modelos de base de datos con Prisma", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-06", end: "2024-12-12" },
        { phase: "Desarrollo", task: "Crear API REST con Node.js y Express", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-08", end: "2024-12-15" },
        { phase: "Desarrollo", task: "Implementar catálogo de productos frontend", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-10", end: "2024-12-18" },
        { phase: "Desarrollo", task: "Desarrollar sistema de carrito de compras", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-12", end: "2024-12-20" },
        { phase: "Desarrollo", task: "Integrar pasarelas de pago (PSE, Efecty, PayPal)", assignedTo: "Angel Velasco", progress: 90, start: "2024-12-15", end: "2024-12-24" },
        { phase: "Desarrollo", task: "Implementar gestión de órdenes", assignedTo: "Angel Velasco", progress: 90, start: "2024-12-18", end: "2024-12-26" },
        { phase: "Desarrollo", task: "Desarrollar panel administrativo", assignedTo: "Angel Velasco", progress: 85, start: "2024-12-20", end: "2025-01-05" },
        { phase: "Desarrollo", task: "Crear sistema de búsqueda y filtros", assignedTo: "Angel Velasco", progress: 85, start: "2024-12-23", end: "2025-01-08" },
        { phase: "Desarrollo", task: "Implementar gestión de inventario", assignedTo: "Angel Velasco", progress: 80, start: "2025-01-02", end: "2025-01-12" },
        { phase: "Desarrollo", task: "Desarrollar sistema de cupones y descuentos", assignedTo: "Angel Velasco", progress: 80, start: "2025-01-06", end: "2025-01-15" },
        { phase: "Desarrollo", task: "Crear módulo de reviews y calificaciones", assignedTo: "Angel Velasco", progress: 75, start: "2025-01-10", end: "2025-01-20" },
        { phase: "Desarrollo", task: "Implementar lista de favoritos", assignedTo: "Angel Velasco", progress: 75, start: "2025-01-13", end: "2025-01-22" },
        { phase: "Desarrollo", task: "Desarrollar sistema de notificaciones", assignedTo: "Angel Velasco", progress: 70, start: "2025-01-16", end: "2025-01-25" },
        { phase: "Desarrollo", task: "Crear gestión de direcciones de envío", assignedTo: "Angel Velasco", progress: 70, start: "2025-01-20", end: "2025-01-28" },
        { phase: "Desarrollo", task: "Implementar variantes de productos (colores, tallas)", assignedTo: "Angel Velasco", progress: 65, start: "2025-01-23", end: "2025-02-02" },
        { phase: "Desarrollo", task: "Desarrollar historial de órdenes", assignedTo: "Angel Velasco", progress: 65, start: "2025-01-27", end: "2025-02-05" },
        { phase: "Desarrollo", task: "Crear dashboard de métricas y analytics", assignedTo: "Angel Velasco", progress: 60, start: "2025-02-01", end: "2025-02-10" },
        { phase: "Desarrollo", task: "Implementar optimización de imágenes", assignedTo: "Angel Velasco", progress: 60, start: "2025-02-04", end: "2025-02-12" },
        { phase: "Desarrollo", task: "Desarrollar responsive design mobile", assignedTo: "Angel Velasco", progress: 55, start: "2025-02-07", end: "2025-02-16" },
        { phase: "Desarrollo", task: "Crear sistema de logs y auditoría", assignedTo: "Angel Velasco", progress: 55, start: "2025-02-10", end: "2025-02-18" },

        // PRUEBAS Y EVALUACIÓN (Febrero-Marzo 2025)
        { phase: "Pruebas y Evaluación", task: "Testing unitario de componentes React", assignedTo: "Jose Alvarez", progress: 50, start: "2025-02-15", end: "2025-02-22" },
        { phase: "Pruebas y Evaluación", task: "Pruebas de integración del backend", assignedTo: "Jose Alvarez", progress: 50, start: "2025-02-18", end: "2025-02-25" },
        { phase: "Pruebas y Evaluación", task: "Testing de pasarelas de pago", assignedTo: "Jose Alvarez", progress: 45, start: "2025-02-20", end: "2025-02-28" },
        { phase: "Pruebas y Evaluación", task: "Pruebas de seguridad y vulnerabilidades", assignedTo: "Jose Alvarez", progress: 45, start: "2025-02-23", end: "2025-03-03" },
        { phase: "Pruebas y Evaluación", task: "Testing de rendimiento y carga", assignedTo: "Jose Alvarez", progress: 40, start: "2025-02-26", end: "2025-03-06" },
        { phase: "Pruebas y Evaluación", task: "Pruebas de compatibilidad cross-browser", assignedTo: "Jose Alvarez", progress: 40, start: "2025-03-01", end: "2025-03-08" },
        { phase: "Pruebas y Evaluación", task: "Testing de flujo completo de compra", assignedTo: "Jose Alvarez", progress: 35, start: "2025-03-04", end: "2025-03-12" },
        { phase: "Pruebas y Evaluación", task: "Evaluación de accesibilidad (WCAG)", assignedTo: "Jose Alvarez", progress: 35, start: "2025-03-07", end: "2025-03-14" },
        { phase: "Pruebas y Evaluación", task: "Pruebas de usabilidad con usuarios", assignedTo: "Jose Alvarez", progress: 30, start: "2025-03-10", end: "2025-03-18" },
        { phase: "Pruebas y Evaluación", task: "Testing de notificaciones y emails", assignedTo: "Jose Alvarez", progress: 30, start: "2025-03-13", end: "2025-03-20" },
        { phase: "Pruebas y Evaluación", task: "Auditoría de SEO y performance", assignedTo: "Jose Alvarez", progress: 25, start: "2025-03-16", end: "2025-03-23" },
        { phase: "Pruebas y Evaluación", task: "Pruebas de recuperación ante fallos", assignedTo: "Jose Alvarez", progress: 25, start: "2025-03-19", end: "2025-03-26" },
        { phase: "Pruebas y Evaluación", task: "Validación de reglas de negocio", assignedTo: "Jose Alvarez", progress: 20, start: "2025-03-22", end: "2025-03-29" },
        { phase: "Pruebas y Evaluación", task: "Testing de migraciones de base de datos", assignedTo: "Jose Alvarez", progress: 20, start: "2025-03-25", end: "2025-04-01" },

        // CIERRE Y DESPLIEGUE (Abril-Mayo 2025)
        { phase: "Cierre y Despliegue", task: "Configurar entorno de producción", assignedTo: "Angel Velasco", progress: 15, start: "2025-04-01", end: "2025-04-07" },
        { phase: "Cierre y Despliegue", task: "Implementar CI/CD pipelines", assignedTo: "Angel Velasco", progress: 15, start: "2025-04-03", end: "2025-04-10" },
        { phase: "Cierre y Despliegue", task: "Migración de datos a producción", assignedTo: "Angel Velasco", progress: 10, start: "2025-04-06", end: "2025-04-12" },
        { phase: "Cierre y Despliegue", task: "Configurar monitoreo y alertas", assignedTo: "Angel Velasco", progress: 10, start: "2025-04-08", end: "2025-04-14" },
        { phase: "Cierre y Despliegue", task: "Crear documentación técnica completa", assignedTo: "Jose Alvarez", progress: 5, start: "2025-04-10", end: "2025-04-18" },
        { phase: "Cierre y Despliegue", task: "Elaborar manual de usuario", assignedTo: "Jose Alvarez", progress: 5, start: "2025-04-12", end: "2025-04-20" },
        { phase: "Cierre y Despliegue", task: "Capacitación del equipo de soporte", assignedTo: "Jose Alvarez", progress: 0, start: "2025-04-15", end: "2025-04-22" },
        { phase: "Cierre y Despliegue", task: "Despliegue en producción (Go-Live)", assignedTo: "Angel Velasco", progress: 0, start: "2025-04-20", end: "2025-04-25" },
        { phase: "Cierre y Despliegue", task: "Monitoreo post-lanzamiento", assignedTo: "Angel Velasco", progress: 0, start: "2025-04-25", end: "2025-04-30" },
        { phase: "Cierre y Despliegue", task: "Cierre formal del proyecto", assignedTo: "Jose Alvarez", progress: 0, start: "2025-04-28", end: "2025-05-01" },
    ];

    const filteredData = useMemo(() => {
        let data = projectData;

        // Filter by phase
        if (phaseFilter !== 'all') {
            data = data.filter(task => task.phase === phaseFilter);
        }

        // Filter by status
        if (statusFilter !== 'all') {
            if (statusFilter === 'completed') {
                data = data.filter(task => task.progress === 100);
            } else if (statusFilter === 'progress') {
                data = data.filter(task => task.progress > 0 && task.progress < 100);
            } else if (statusFilter === 'pending') {
                data = data.filter(task => task.progress === 0);
            }
        }

        // Filter by search term
        if (searchTerm) {
            data = data.filter(task =>
                task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.phase.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return data;
    }, [phaseFilter, statusFilter, searchTerm]);

    const stats = useMemo(() => {
        const completed = filteredData.filter(t => t.progress === 100).length;
        const inProgress = filteredData.filter(t => t.progress > 0 && t.progress < 100).length;
        const avgProgress = Math.round(filteredData.reduce((sum, task) => sum + task.progress, 0) / filteredData.length) || 0;

        return {
            total: filteredData.length,
            completed,
            inProgress,
            avgProgress
        };
    }, [filteredData]);

    const getProgressClass = (progress: number) => {
        if (progress === 0) return '';
        if (progress <= 30) return 'bg-linear-to-r from-red-500 to-pink-500';
        if (progress <= 60) return 'bg-linear-to-r from-orange-500 to-pink-500';
        if (progress < 100) return 'bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600';
        return 'bg-linear-to-r from-green-500 to-cyan-500';
    };

    const getStatusBadge = (progress: number) => {
        if (progress === 0) return <span className="px-3 py-1 rounded-lg text-xs font-bold bg-red-500/15 text-red-500 border border-red-500/30">No Iniciado</span>;
        if (progress < 100) return <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-500/15 text-orange-500 border border-orange-500/30">En Progreso</span>;
        return <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-500/15 text-green-500 border border-green-500/30">Completado</span>;
    };

    const getPhaseBadge = (phase: string) => {
        const badges: Record<string, string> = {
            'Planeación': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
            'Diseño': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
            'Desarrollo': 'bg-green-500/20 text-green-400 border-green-500/40',
            'Pruebas y Evaluación': 'bg-orange-500/20 text-orange-400 border-orange-500/40',
            'Cierre y Despliegue': 'bg-purple-500/20 text-purple-400 border-purple-500/40'
        };
        return <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${badges[phase]}`}>{phase}</span>;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const exportToExcel = () => {
        // Simple CSV export
        const headers = ['FASE', 'TAREA', 'ASIGNADO A', 'PROGRESO (%)', 'ESTADO', 'FECHA INICIO', 'FECHA FIN'];
        const rows = projectData.map(row => [
            row.phase,
            row.task,
            row.assignedTo,
            row.progress,
            row.progress === 0 ? 'No Iniciado' : (row.progress < 100 ? 'En Progreso' : 'Completado'),
            row.start,
            row.end
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'NeoSale_Gantt_Chart_2024-2025.csv';
        link.click();
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-45 from-transparent via-white/5 to-transparent animate-shimmer"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl font-extrabold mb-3 bg-linear-to-r from-white to-blue-50 bg-clip-text text-transparent">
                            NeoSale - Ecommerce
                        </h1>
                        <p className="text-blue-100 text-xl mb-4">Diagrama de Gantt del Proyecto</p>
                        <div className="flex gap-6 text-white/90">
                            <div className="text-sm">📅 Oct 2024 - May 2025</div>
                            <div className="text-sm">👥 2 Miembros</div>
                            <div className="text-sm">📊 5 Fases</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-slate-700">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={exportToExcel}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Download size={18} />
                                Exportar Excel
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Printer size={18} />
                                Imprimir
                            </button>
                            <select
                                value={phaseFilter}
                                onChange={(e) => setPhaseFilter(e.target.value)}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todas las Fases</option>
                                <option value="Planeación">Planeación</option>
                                <option value="Diseño">Diseño</option>
                                <option value="Desarrollo">Desarrollo</option>
                                <option value="Pruebas y Evaluación">Pruebas y Evaluación</option>
                                <option value="Cierre y Despliegue">Cierre y Despliegue</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todos los Estados</option>
                                <option value="completed">Completados</option>
                                <option value="progress">En Progreso</option>
                                <option value="pending">No Iniciados</option>
                            </select>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar tareas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                        <h3 className="text-3xl font-bold text-white mb-1">{stats.total}</h3>
                        <p className="text-slate-400">Total de Tareas</p>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                        <h3 className="text-3xl font-bold text-green-400 mb-1">{stats.completed}</h3>
                        <p className="text-slate-400">Tareas Completadas</p>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                        <h3 className="text-3xl font-bold text-orange-400 mb-1">{stats.inProgress}</h3>
                        <p className="text-slate-400">En Progreso</p>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                        <h3 className="text-3xl font-bold text-blue-400 mb-1">{stats.avgProgress}%</h3>
                        <p className="text-slate-400">Progreso General</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-2xl font-bold text-white">Cronograma del Proyecto</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Fase</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Tarea</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Asignado a</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300" style={{ minWidth: '200px' }}>Progreso</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Estado</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Fecha Inicio</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Fecha Fin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, index) => {
                                    const isNewPhase = index === 0 || filteredData[index - 1].phase !== row.phase;
                                    return (
                                        <tr
                                            key={index}
                                            className="border-b border-slate-700/50 hover:bg-indigo-500/10 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                {isNewPhase && getPhaseBadge(row.phase)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <strong className="text-slate-200">{row.task}</strong>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">{row.assignedTo}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-full h-8 bg-slate-900/80 rounded-full overflow-hidden border border-slate-700">
                                                    <div
                                                        className={`h-full ${getProgressClass(row.progress)} flex items-center justify-center text-white text-xs font-bold transition-all duration-500`}
                                                        style={{ width: `${row.progress}%` }}
                                                    >
                                                        {row.progress > 0 && `${row.progress}%`}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(row.progress)}</td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(row.start)}</td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(row.end)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 text-center">
                    <div className="text-white font-bold text-lg mb-2">
                        <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            NeoSale Project 2024-2025
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Desarrollado con dedicación por el equipo de desarrollo
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
