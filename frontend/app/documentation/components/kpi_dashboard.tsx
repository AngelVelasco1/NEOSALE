"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Code, Users, Clock, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Calendar, Download, GitBranch, Edit, Plus, Trash2, Save, X } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Task {
  id: string;
  phase: string;
  task: string;
  assignedTo: string;
  progress: number;
  start: string;
  end: string;
}

const initialProjectData: Task[] = [
  // PLANEACIÓN (Octubre 2024)
  { id: "1", phase: "Planeación", task: "Definir objetivos y alcance del proyecto NeoSale", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-01", end: "2024-10-05" },
  { id: "2", phase: "Planeación", task: "Análisis de mercado y competidores e-commerce", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-02", end: "2024-10-08" },
  { id: "3", phase: "Planeación", task: "Definir requisitos funcionales del sistema", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-06", end: "2024-10-12" },
  { id: "4", phase: "Planeación", task: "Establecer canales de comunicación del equipo", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-08", end: "2024-10-10" },
  { id: "5", phase: "Planeación", task: "Crear document charter del proyecto", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-10", end: "2024-10-15" },
  { id: "6", phase: "Planeación", task: "Configurar estructura del equipo de desarrollo", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-12", end: "2024-10-16" },
  { id: "7", phase: "Planeación", task: "Definir stack tecnológico (Next.js, React, Node.js)", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-14", end: "2024-10-18" },
  { id: "8", phase: "Planeación", task: "Investigar pasarelas de pago para Colombia", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-16", end: "2024-10-20" },
  { id: "9", phase: "Planeación", task: "Análisis de requisitos de seguridad y compliance", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-18", end: "2024-10-22" },
  { id: "10", phase: "Planeación", task: "Definir metodología de trabajo (Scrum/Agile)", assignedTo: "Jose Alvarez", progress: 100, start: "2024-10-20", end: "2024-10-24" },

  // DISEÑO (Octubre-Noviembre 2024)
  { id: "11", phase: "Diseño", task: "Diseñar arquitectura de base de datos PostgreSQL", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-25", end: "2024-10-31" },
  { id: "12", phase: "Diseño", task: "Crear wireframes y mockups de la interfaz", assignedTo: "Angel Velasco", progress: 100, start: "2024-10-28", end: "2024-11-05" },
  { id: "13", phase: "Diseño", task: "Diseñar sistema de autenticación con NextAuth", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-01", end: "2024-11-07" },
  { id: "14", phase: "Diseño", task: "Definir API REST y endpoints del backend", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-04", end: "2024-11-10" },
  { id: "15", phase: "Diseño", task: "Diseñar flujo de carrito de compras", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-06", end: "2024-11-12" },
  { id: "16", phase: "Diseño", task: "Crear guía de estilos y design system", assignedTo: "Jose Alvarez", progress: 100, start: "2024-11-08", end: "2024-11-14" },
  { id: "17", phase: "Diseño", task: "Diseñar módulo de gestión de productos", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-11", end: "2024-11-17" },
  { id: "18", phase: "Diseño", task: "Planificar estrategia de SEO y optimización", assignedTo: "Jose Alvarez", progress: 100, start: "2024-11-13", end: "2024-11-19" },
  { id: "19", phase: "Diseño", task: "Diseñar sistema de notificaciones", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-15", end: "2024-11-21" },
  { id: "20", phase: "Diseño", task: "Definir estructura de variantes de productos", assignedTo: "Angel Velasco", progress: 100, start: "2024-11-18", end: "2024-11-24" },
  { id: "21", phase: "Diseño", task: "Diseñar dashboard administrativo", assignedTo: "Angel Velasco", progress: 90, start: "2024-11-20", end: "2024-11-26" },
  { id: "22", phase: "Diseño", task: "Crear diagramas de flujo de órdenes", assignedTo: "Jose Alvarez", progress: 90, start: "2024-11-22", end: "2024-11-28" },

  // DESARROLLO (Diciembre 2024 - Febrero 2025)
  { id: "23", phase: "Desarrollo", task: "Configurar proyecto Next.js con TypeScript", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-01", end: "2024-12-05" },
  { id: "24", phase: "Desarrollo", task: "Implementar sistema de autenticación", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-03", end: "2024-12-10" },
  { id: "25", phase: "Desarrollo", task: "Desarrollar modelos de base de datos con Prisma", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-06", end: "2024-12-12" },
  { id: "26", phase: "Desarrollo", task: "Crear API REST con Node.js y Express", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-08", end: "2024-12-15" },
  { id: "27", phase: "Desarrollo", task: "Implementar catálogo de productos frontend", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-10", end: "2024-12-18" },
  { id: "28", phase: "Desarrollo", task: "Desarrollar sistema de carrito de compras", assignedTo: "Angel Velasco", progress: 100, start: "2024-12-12", end: "2024-12-20" },
  { id: "29", phase: "Desarrollo", task: "Integrar pasarelas de pago (PSE, Efecty, PayPal)", assignedTo: "Angel Velasco", progress: 90, start: "2024-12-15", end: "2024-12-24" },
  { id: "30", phase: "Desarrollo", task: "Implementar gestión de órdenes", assignedTo: "Angel Velasco", progress: 90, start: "2024-12-18", end: "2024-12-26" },
  { id: "31", phase: "Desarrollo", task: "Desarrollar panel administrativo", assignedTo: "Angel Velasco", progress: 85, start: "2024-12-20", end: "2025-01-05" },
  { id: "32", phase: "Desarrollo", task: "Crear sistema de búsqueda y filtros", assignedTo: "Angel Velasco", progress: 85, start: "2024-12-23", end: "2025-01-08" },
  { id: "33", phase: "Desarrollo", task: "Implementar gestión de inventario", assignedTo: "Angel Velasco", progress: 80, start: "2025-01-02", end: "2025-01-12" },
  { id: "34", phase: "Desarrollo", task: "Desarrollar sistema de cupones y descuentos", assignedTo: "Angel Velasco", progress: 80, start: "2025-01-06", end: "2025-01-15" },
  { id: "35", phase: "Desarrollo", task: "Crear módulo de reviews y calificaciones", assignedTo: "Angel Velasco", progress: 75, start: "2025-01-10", end: "2025-01-20" },
  { id: "36", phase: "Desarrollo", task: "Implementar lista de favoritos", assignedTo: "Angel Velasco", progress: 75, start: "2025-01-13", end: "2025-01-22" },
  { id: "37", phase: "Desarrollo", task: "Desarrollar sistema de notificaciones", assignedTo: "Angel Velasco", progress: 70, start: "2025-01-16", end: "2025-01-25" },
  { id: "38", phase: "Desarrollo", task: "Crear gestión de direcciones de envío", assignedTo: "Angel Velasco", progress: 70, start: "2025-01-20", end: "2025-01-28" },
  { id: "39", phase: "Desarrollo", task: "Implementar variantes de productos (colores, tallas)", assignedTo: "Angel Velasco", progress: 65, start: "2025-01-23", end: "2025-02-02" },
  { id: "40", phase: "Desarrollo", task: "Desarrollar historial de órdenes", assignedTo: "Angel Velasco", progress: 65, start: "2025-01-27", end: "2025-02-05" },
  { id: "41", phase: "Desarrollo", task: "Crear dashboard de métricas y analytics", assignedTo: "Angel Velasco", progress: 60, start: "2025-02-01", end: "2025-02-10" },
  { id: "42", phase: "Desarrollo", task: "Implementar optimización de imágenes", assignedTo: "Angel Velasco", progress: 60, start: "2025-02-04", end: "2025-02-12" },
  { id: "43", phase: "Desarrollo", task: "Desarrollar responsive design mobile", assignedTo: "Angel Velasco", progress: 55, start: "2025-02-07", end: "2025-02-16" },
  { id: "44", phase: "Desarrollo", task: "Crear sistema de logs y auditoría", assignedTo: "Angel Velasco", progress: 55, start: "2025-02-10", end: "2025-02-18" },

  // PRUEBAS Y EVALUACIÓN (Febrero-Marzo 2025)
  { id: "45", phase: "Pruebas y Evaluación", task: "Testing unitario de componentes React", assignedTo: "Jose Alvarez", progress: 50, start: "2025-02-15", end: "2025-02-22" },
  { id: "46", phase: "Pruebas y Evaluación", task: "Pruebas de integración del backend", assignedTo: "Jose Alvarez", progress: 50, start: "2025-02-18", end: "2025-02-25" },
  { id: "47", phase: "Pruebas y Evaluación", task: "Testing de pasarelas de pago", assignedTo: "Jose Alvarez", progress: 45, start: "2025-02-20", end: "2025-02-28" },
  { id: "48", phase: "Pruebas y Evaluación", task: "Pruebas de seguridad y vulnerabilidades", assignedTo: "Jose Alvarez", progress: 45, start: "2025-02-23", end: "2025-03-03" },
  { id: "49", phase: "Pruebas y Evaluación", task: "Testing de rendimiento y carga", assignedTo: "Jose Alvarez", progress: 40, start: "2025-02-26", end: "2025-03-06" },
  { id: "50", phase: "Pruebas y Evaluación", task: "Pruebas de compatibilidad cross-browser", assignedTo: "Jose Alvarez", progress: 40, start: "2025-03-01", end: "2025-03-08" },
  { id: "51", phase: "Pruebas y Evaluación", task: "Testing de flujo completo de compra", assignedTo: "Jose Alvarez", progress: 35, start: "2025-03-04", end: "2025-03-12" },
  { id: "52", phase: "Pruebas y Evaluación", task: "Evaluación de accesibilidad (WCAG)", assignedTo: "Jose Alvarez", progress: 35, start: "2025-03-07", end: "2025-03-14" },
  { id: "53", phase: "Pruebas y Evaluación", task: "Pruebas de usabilidad con usuarios", assignedTo: "Jose Alvarez", progress: 30, start: "2025-03-10", end: "2025-03-18" },
  { id: "54", phase: "Pruebas y Evaluación", task: "Testing de notificaciones y emails", assignedTo: "Jose Alvarez", progress: 30, start: "2025-03-13", end: "2025-03-20" },
  { id: "55", phase: "Pruebas y Evaluación", task: "Auditoría de SEO y performance", assignedTo: "Jose Alvarez", progress: 25, start: "2025-03-16", end: "2025-03-23" },
  { id: "56", phase: "Pruebas y Evaluación", task: "Pruebas de recuperación ante fallos", assignedTo: "Jose Alvarez", progress: 25, start: "2025-03-19", end: "2025-03-26" },
  { id: "57", phase: "Pruebas y Evaluación", task: "Validación de reglas de negocio", assignedTo: "Jose Alvarez", progress: 20, start: "2025-03-22", end: "2025-03-29" },
  { id: "58", phase: "Pruebas y Evaluación", task: "Testing de migraciones de base de datos", assignedTo: "Jose Alvarez", progress: 20, start: "2025-03-25", end: "2025-04-01" },

  // CIERRE Y DESPLIEGUE (Abril-Mayo 2025)
  { id: "59", phase: "Cierre y Despliegue", task: "Configurar entorno de producción", assignedTo: "Angel Velasco", progress: 15, start: "2025-04-01", end: "2025-04-07" },
  { id: "60", phase: "Cierre y Despliegue", task: "Implementar CI/CD pipelines", assignedTo: "Angel Velasco", progress: 15, start: "2025-04-03", end: "2025-04-10" },
  { id: "61", phase: "Cierre y Despliegue", task: "Migración de datos a producción", assignedTo: "Angel Velasco", progress: 10, start: "2025-04-06", end: "2025-04-12" },
  { id: "62", phase: "Cierre y Despliegue", task: "Configurar monitoreo y alertas", assignedTo: "Angel Velasco", progress: 10, start: "2025-04-08", end: "2025-04-14" },
  { id: "63", phase: "Cierre y Despliegue", task: "Crear documentación técnica completa", assignedTo: "Jose Alvarez", progress: 5, start: "2025-04-10", end: "2025-04-18" },
  { id: "64", phase: "Cierre y Despliegue", task: "Elaborar manual de usuario", assignedTo: "Jose Alvarez", progress: 5, start: "2025-04-12", end: "2025-04-20" },
  { id: "65", phase: "Cierre y Despliegue", task: "Capacitación del equipo de soporte", assignedTo: "Jose Alvarez", progress: 0, start: "2025-04-15", end: "2025-04-22" },
  { id: "66", phase: "Cierre y Despliegue", task: "Despliegue en producción (Go-Live)", assignedTo: "Angel Velasco", progress: 0, start: "2025-04-20", end: "2025-04-25" },
  { id: "67", phase: "Cierre y Despliegue", task: "Monitoreo post-lanzamiento", assignedTo: "Angel Velasco", progress: 0, start: "2025-04-25", end: "2025-04-30" },
  { id: "68", phase: "Cierre y Despliegue", task: "Cierre formal del proyecto", assignedTo: "Jose Alvarez", progress: 0, start: "2025-04-28", end: "2025-05-01" },
];

const KPIDashboard = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [projectData, setProjectData] = useState<Task[]>(initialProjectData);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem('neosale-project-tasks');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setProjectData(parsedData);
      } catch (error) {
        console.error('Error al cargar tareas guardadas:', error);
      }
    }
  }, []);

  // Guardar datos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('neosale-project-tasks', JSON.stringify(projectData));
  }, [projectData]);

  // Funciones de gestión de tareas
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddingNew(false);
    setIsModalOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask({
      id: `new-${Date.now()}`,
      phase: 'Desarrollo',
      task: '',
      assignedTo: 'Angel Velasco',
      progress: 0,
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    });
    setIsAddingNew(true);
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!editingTask) return;

    if (isAddingNew) {
      setProjectData([...projectData, editingTask]);
    } else {
      setProjectData(projectData.map(t => t.id === editingTask.id ? editingTask : t));
    }

    setIsModalOpen(false);
    setEditingTask(null);
    setIsAddingNew(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      setProjectData(projectData.filter(t => t.id !== taskId));
    }
  };

  const handleQuickProgressUpdate = (taskId: string, newProgress: number) => {
    setProjectData(projectData.map(t =>
      t.id === taskId ? { ...t, progress: newProgress } : t
    ));
  };



  // Cálculos automáticos basados en datos reales
  const metrics = useMemo(() => {
    const totalTasks = projectData.length;
    const completedTasks = projectData.filter(t => t.progress === 100).length;
    const inProgressTasks = projectData.filter(t => t.progress > 0 && t.progress < 100).length;
    const notStartedTasks = projectData.filter(t => t.progress === 0).length;
    const overallProgress = Math.round(projectData.reduce((sum, task) => sum + task.progress, 0) / totalTasks);

    // Agrupar por fase
    const phases = ['Planeación', 'Diseño', 'Desarrollo', 'Pruebas y Evaluación', 'Cierre y Despliegue'];
    const phaseStats = phases.map(phase => {
      const phaseTasks = projectData.filter(t => t.phase === phase);
      const avgProgress = Math.round(phaseTasks.reduce((sum, t) => sum + t.progress, 0) / phaseTasks.length);
      return { phase, avgProgress, total: phaseTasks.length };
    });

    // Métricas por miembro del equipo
    const angelTasks = projectData.filter(t => t.assignedTo === 'Angel Velasco');
    const joseTasks = projectData.filter(t => t.assignedTo === 'Jose Alvarez');

    const angelCompleted = angelTasks.filter(t => t.progress === 100).length;
    const angelInProgress = angelTasks.filter(t => t.progress > 0 && t.progress < 100).length;
    const angelAvgProgress = Math.round(angelTasks.reduce((sum, t) => sum + t.progress, 0) / angelTasks.length);

    const joseCompleted = joseTasks.filter(t => t.progress === 100).length;
    const joseInProgress = joseTasks.filter(t => t.progress > 0 && t.progress < 100).length;
    const joseAvgProgress = Math.round(joseTasks.reduce((sum, t) => sum + t.progress, 0) / joseTasks.length);

    // Calcular días de proyecto
    const startDate = new Date('2024-10-01');
    const endDate = new Date('2025-05-01');
    const today = new Date();
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = totalDays - elapsedDays;
    const timeProgress = Math.round((elapsedDays / totalDays) * 100);

    // Velocidad (tareas completadas por mes)
    const monthsElapsed = elapsedDays / 30;
    const velocity = (completedTasks / monthsElapsed).toFixed(1);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      overallProgress,
      phaseStats,
      angelTasks: angelTasks.length,
      angelCompleted,
      angelInProgress,
      angelAvgProgress,
      joseTasks: joseTasks.length,
      joseCompleted,
      joseInProgress,
      joseAvgProgress,
      totalDays,
      elapsedDays,
      remainingDays,
      timeProgress,
      velocity
    };
  }, [projectData]);

  // Datos para gráficos
  const progressByPhaseData = {
    labels: metrics.phaseStats.map(p => p.phase),
    datasets: [{
      label: 'Progreso Promedio (%)',
      data: metrics.phaseStats.map(p => p.avgProgress),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
    }],
  };

  const taskStatusData = {
    labels: ['Completadas', 'En Progreso', 'No Iniciadas'],
    datasets: [{
      data: [metrics.completedTasks, metrics.inProgressTasks, metrics.notStartedTasks],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const teamComparisonData = {
    labels: ['Tareas Totales', 'Completadas', 'En Progreso'],
    datasets: [
      {
        label: 'Angel Velasco',
        data: [metrics.angelTasks, metrics.angelCompleted, metrics.angelInProgress],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Jose Alvarez',
        data: [metrics.joseTasks, metrics.joseCompleted, metrics.joseInProgress],
        backgroundColor: '#8b5cf6',
      },
    ],
  };

  const exportData = () => {
    const data = `REPORTE KPI PROYECTO NEOSALE - ${new Date().toLocaleDateString()}

MÉTRICAS GENERALES DEL PROYECTO
=================================
Total de Tareas: ${metrics.totalTasks}
Tareas Completadas: ${metrics.completedTasks} (${Math.round((metrics.completedTasks / metrics.totalTasks) * 100)}%)
Tareas en Progreso: ${metrics.inProgressTasks} (${Math.round((metrics.inProgressTasks / metrics.totalTasks) * 100)}%)
Tareas No Iniciadas: ${metrics.notStartedTasks} (${Math.round((metrics.notStartedTasks / metrics.totalTasks) * 100)}%)
Progreso General: ${metrics.overallProgress}%

CRONOGRAMA
==========
Duración Total: ${metrics.totalDays} días (Oct 2024 - May 2025)
Días Transcurridos: ${metrics.elapsedDays} días
Días Restantes: ${metrics.remainingDays} días
Progreso Temporal: ${metrics.timeProgress}%
Velocidad: ${metrics.velocity} tareas/mes

PROGRESO POR FASE
=================
${metrics.phaseStats.map(p => `${p.phase}: ${p.avgProgress}% (${p.total} tareas)`).join('\n')}

DESEMPEÑO DEL EQUIPO
====================
Angel Velasco (Desarrollo & DevOps)
  Tareas Asignadas: ${metrics.angelTasks}
  Completadas: ${metrics.angelCompleted}
  En Progreso: ${metrics.angelInProgress}
  Progreso Promedio: ${metrics.angelAvgProgress}%

Jose Alvarez (QA & Documentación)
  Tareas Asignadas: ${metrics.joseTasks}
  Completadas: ${metrics.joseCompleted}
  En Progreso: ${metrics.joseInProgress}
  Progreso Promedio: ${metrics.joseAvgProgress}%

ESTADO DEL PROYECTO
===================
${metrics.overallProgress >= metrics.timeProgress ?
        `✓ El proyecto va ADELANTADO (${metrics.overallProgress}% completado vs ${metrics.timeProgress}% del tiempo)` :
        `⚠ El proyecto va ATRASADO (${metrics.overallProgress}% completado vs ${metrics.timeProgress}% del tiempo)`
      }
`;

    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NeoSale_KPI_Development_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                KPIs Desarrollo NeoSale
              </h1>
              <p className="text-slate-600 dark:text-slate-300">Métricas del progreso del proyecto (Oct 2024 - May 2025)</p>
            </div>
            <div className="flex gap-3 flex-wrap">

              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Nueva Tarea
              </button>
              <button
                onClick={exportData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Exportar Reporte
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-6 border border-slate-200 dark:border-slate-700">
          <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            {['general', 'fases', 'equipo', 'cronograma', 'tareas'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Vista General */}
        {activeTab === 'general' && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.totalTasks}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Total Tareas</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  5 Fases del proyecto
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${metrics.overallProgress >= metrics.timeProgress ? 'text-green-600' : 'text-orange-600'
                    }`}>
                    {metrics.overallProgress >= metrics.timeProgress ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {metrics.overallProgress >= metrics.timeProgress ? 'Adelantado' : 'Revisar'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{metrics.overallProgress}%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Progreso General
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-purple-600"
                    style={{ width: `${metrics.overallProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                    <AlertCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.inProgressTasks}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">En Progreso</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {metrics.notStartedTasks} no iniciadas
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/30">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.remainingDays}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Días Restantes</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  de {metrics.totalDays} días totales
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/30">
                    <GitBranch className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.velocity}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Tareas/Mes</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Velocidad del proyecto
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">2</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Miembros</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Angel Velasco & Jose Alvarez
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Estado de Tareas</h3>
                <div style={{ height: '300px' }}>
                  <Doughnut
                    data={taskStatusData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' as const },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Progreso por Fase</h3>
                <div style={{ height: '300px' }}>
                  <Bar
                    data={progressByPhaseData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y' as const,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        x: { max: 100 },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline Indicator */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Cronograma del Proyecto</h3>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Oct 2024 - May 2025
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Progreso Temporal</span>
                    <span className="font-bold text-slate-800 dark:text-white">{metrics.timeProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-400"
                      style={{ width: `${metrics.timeProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Progreso de Tareas</span>
                    <span className="font-bold text-slate-800 dark:text-white">{metrics.overallProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${metrics.overallProgress >= metrics.timeProgress ? 'bg-green-500' : 'bg-orange-500'}`}
                      style={{ width: `${metrics.overallProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className={`mt-4 p-4 rounded-lg ${metrics.overallProgress >= metrics.timeProgress
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                }`}>
                <p className={`text-sm ${metrics.overallProgress >= metrics.timeProgress
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-orange-800 dark:text-orange-200'
                  }`}>
                  {metrics.overallProgress >= metrics.timeProgress
                    ? `✓ El proyecto va adelantado ${metrics.overallProgress - metrics.timeProgress}% respecto al cronograma`
                    : `⚠ El proyecto requiere atención: ${metrics.timeProgress - metrics.overallProgress}% por debajo del cronograma`
                  }
                </p>
              </div>
            </div>
          </>
        )}

        {/* Vista de Fases */}
        {activeTab === 'fases' && (
          <div className="space-y-6">
            {metrics.phaseStats.map((phase, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{phase.phase}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{phase.total} tareas en esta fase</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-800 dark:text-white">{phase.avgProgress}%</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Progreso</div>
                  </div>
                </div>
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${phase.avgProgress === 100 ? 'bg-green-500' :
                      phase.avgProgress >= 75 ? 'bg-blue-500' :
                        phase.avgProgress >= 50 ? 'bg-yellow-500' :
                          phase.avgProgress >= 25 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                    style={{ width: `${phase.avgProgress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista de Equipo */}
        {activeTab === 'equipo' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                    AV
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Angel Velasco</h3>
                    <p className="text-slate-600 dark:text-slate-400">Desarrollo & DevOps</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Tareas Asignadas</span>
                    <span className="font-bold text-slate-800 dark:text-white text-lg">{metrics.angelTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Completadas</span>
                    <span className="font-bold text-green-600 text-lg">{metrics.angelCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">En Progreso</span>
                    <span className="font-bold text-orange-600 text-lg">{metrics.angelInProgress}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">Progreso Promedio</span>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-500 to-purple-600"
                        style={{ width: `${metrics.angelAvgProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block text-right">{metrics.angelAvgProgress}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-2xl">
                    JA
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Jose Alvarez</h3>
                    <p className="text-slate-600 dark:text-slate-400">QA & Documentación</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Tareas Asignadas</span>
                    <span className="font-bold text-slate-800 dark:text-white text-lg">{metrics.joseTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Completadas</span>
                    <span className="font-bold text-green-600 text-lg">{metrics.joseCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">En Progreso</span>
                    <span className="font-bold text-orange-600 text-lg">{metrics.joseInProgress}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">Progreso Promedio</span>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-purple-500 to-pink-600"
                        style={{ width: `${metrics.joseAvgProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block text-right">{metrics.joseAvgProgress}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Comparación del Equipo</h3>
              <div style={{ height: '350px' }}>
                <Bar
                  data={teamComparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' as const },
                    },
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Vista Cronograma */}
        {activeTab === 'cronograma' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Información del Cronograma</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.totalDays}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Días Totales</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.elapsedDays}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Días Transcurridos</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.remainingDays}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Días Restantes</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Fechas Importantes</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-700 dark:text-slate-300">Inicio del Proyecto</span>
                  <span className="font-bold text-slate-800 dark:text-white">01 Octubre 2024</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-700 dark:text-slate-300">Fecha Actual</span>
                  <span className="font-bold text-blue-600">{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-700 dark:text-slate-300">Fecha de Finalización</span>
                  <span className="font-bold text-slate-800 dark:text-white">01 Mayo 2025</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${metrics.overallProgress >= metrics.timeProgress
              ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
              : 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800'
              }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${metrics.overallProgress >= metrics.timeProgress ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                  {metrics.overallProgress >= metrics.timeProgress ?
                    <TrendingUp className="w-6 h-6 text-white" /> :
                    <AlertCircle className="w-6 h-6 text-white" />
                  }
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${metrics.overallProgress >= metrics.timeProgress
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-orange-900 dark:text-orange-100'
                    }`}>
                    Estado del Proyecto: {metrics.overallProgress >= metrics.timeProgress ? 'Adelantado' : 'Requiere Atención'}
                  </h4>
                  <p className={`text-sm ${metrics.overallProgress >= metrics.timeProgress
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-orange-800 dark:text-orange-200'
                    }`}>
                    {metrics.overallProgress >= metrics.timeProgress
                      ? `El proyecto va ${metrics.overallProgress - metrics.timeProgress}% adelantado respecto al cronograma planificado. ¡Excelente progreso!`
                      : `El proyecto está ${metrics.timeProgress - metrics.overallProgress}% por debajo del cronograma. Se recomienda revisar prioridades y recursos.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Tareas */}
        {activeTab === 'tareas' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión de Tareas del Proyecto</h3>
              <span className="text-sm text-slate-600 dark:text-slate-400">{projectData.length} tareas totales</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                    <th className="text-left p-3 text-slate-700 dark:text-slate-300 font-semibold">Fase</th>
                    <th className="text-left p-3 text-slate-700 dark:text-slate-300 font-semibold">Tarea</th>
                    <th className="text-left p-3 text-slate-700 dark:text-slate-300 font-semibold">Asignado a</th>
                    <th className="text-center p-3 text-slate-700 dark:text-slate-300 font-semibold">Progreso</th>
                    <th className="text-center p-3 text-slate-700 dark:text-slate-300 font-semibold">Inicio</th>
                    <th className="text-center p-3 text-slate-700 dark:text-slate-300 font-semibold">Fin</th>
                    <th className="text-center p-3 text-slate-700 dark:text-slate-300 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.map((task) => (
                    <tr key={task.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${task.phase === 'Planeación' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          task.phase === 'Diseño' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                            task.phase === 'Desarrollo' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              task.phase === 'Pruebas y Evaluación' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                          {task.phase}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">{task.task}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{task.assignedTo}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={task.progress}
                            onChange={(e) => handleQuickProgressUpdate(task.id, parseInt(e.target.value))}
                            className="w-20 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                          />
                          <span className={`text-sm font-bold min-w-12 ${task.progress === 100 ? 'text-green-600' :
                            task.progress > 0 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                            {task.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center text-sm text-slate-600 dark:text-slate-400">{task.start}</td>
                      <td className="p-3 text-center text-sm text-slate-600 dark:text-slate-400">{task.end}</td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                            title="Editar tarea"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                            title="Eliminar tarea"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Edición/Creación */}
        {isModalOpen && editingTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {isAddingNew ? 'Agregar Nueva Tarea' : 'Editar Tarea'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Fase del Proyecto
                  </label>
                  <select
                    value={editingTask.phase}
                    onChange={(e) => setEditingTask({ ...editingTask, phase: e.target.value })}
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Planeación">Planeación</option>
                    <option value="Diseño">Diseño</option>
                    <option value="Desarrollo">Desarrollo</option>
                    <option value="Pruebas y Evaluación">Pruebas y Evaluación</option>
                    <option value="Cierre y Despliegue">Cierre y Despliegue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nombre de la Tarea
                  </label>
                  <input
                    type="text"
                    value={editingTask.task}
                    onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
                    placeholder="Describe la tarea..."
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Asignado a
                  </label>
                  <select
                    value={editingTask.assignedTo}
                    onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Angel Velasco">Angel Velasco</option>
                    <option value="Jose Alvarez">Jose Alvarez</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Progreso: {editingTask.progress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingTask.progress}
                    onChange={(e) => setEditingTask({ ...editingTask, progress: parseInt(e.target.value) })}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={editingTask.start}
                      onChange={(e) => setEditingTask({ ...editingTask, start: e.target.value })}
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={editingTask.end}
                      onChange={(e) => setEditingTask({ ...editingTask, end: e.target.value })}
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 flex gap-3 justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveTask}
                  disabled={!editingTask.task.trim()}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  <Save size={18} />
                  {isAddingNew ? 'Crear Tarea' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIDashboard;
