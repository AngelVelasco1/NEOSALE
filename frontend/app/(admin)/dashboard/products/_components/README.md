// Optimizaciones implementadas en el sistema de filtros de productos:
//
// 1. MODULARIZACIÓN:
//    - Separación de constantes en `constants.ts`
//    - Hook personalizado `useProductFilters` que encapsula toda la lógica de estado y filtros
//    - Reducción del código en el componente principal de ~200 líneas a ~50 líneas
//
// 2. OPTIMIZACIONES DE RENDIMIENTO:
//    - Estado único para todos los filtros (reduce re-renders)
//    - Memoización de valores calculados (currentFilters, hasActiveFilters)
//    - useCallback para handlers (previene re-creaciones innecesarias)
//    - Debounce optimizado para búsqueda (350ms)
//    - Timers separados para precio y stock (evita llamadas excesivas)
//
// 3. OPTIMIZACIONES DE RECURSOS:
//    - React Query con staleTime y gcTime optimizados (10min/15min)
//    - Evitación de llamadas API innecesarias mediante comparación de firmas
//    - Lazy evaluation de efectos
//
// 4. MEJORAS DE UX:
//    - Indicador de carga durante búsqueda debounced
//    - Chips interactivos para filtros rápidos
//    - Reset completo de filtros
//    - Navegación sin scroll (scroll: false)
//
// 5. SISTEMA DE BÚSQUEDA Y FILTRADO:
//    - Búsqueda debounced para evitar sobrecarga del backend
//    - Filtros aplicados vía URL params (compartibles, bookmarkeables)
//    - Server Actions con Prisma para queries optimizadas
//    - Paginación eficiente con metadata completa
//
// USO RECOMENDADO:
// - Mantener staleTime alto para datos dropdown (categorías/marcas cambian poco)
// - El debounce de 350ms balancea responsiveness con performance
// - Los timers de 800ms para precio/stock evitan spam de requests