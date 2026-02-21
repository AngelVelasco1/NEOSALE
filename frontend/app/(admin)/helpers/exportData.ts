function triggerDownload(url: string, fileName: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Serializa un valor para JSON, manejando casos especiales
 */
function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object' && !Array.isArray(value)) {
    // Convertir objetos a string JSON
    return JSON.stringify(value);
  }
  return value;
}

/**
 * Escapa valores para CSV según RFC 4180
 */
function escapeCSVValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  
  let stringValue = String(value);
  
  // Si contiene coma, comillas, o saltos de línea, escapar
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    // Duplicar comillas internas y envolver en comillas
    stringValue = '"' + stringValue.replace(/"/g, '""') + '"';
  }
  
  return stringValue;
}

export function exportAsJSON<T extends Record<string, unknown>>(data: T[], fileNamePrefix: string) {
  if (data.length === 0) {
    
    return;
  }

  // Serializar valores complejos
  const serializedData = data.map(row => {
    const serialized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      serialized[key] = serializeValue(value);
    }
    return serialized;
  });

  const jsonString = JSON.stringify(serializedData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().split('T')[0];
  triggerDownload(url, `${fileNamePrefix}_${timestamp}.json`);
}

export function exportAsCSV<T extends Record<string, unknown>>(data: T[], fileNamePrefix: string) {
  if (data.length === 0) {
    
    return;
  }

  // Obtener headers del primer elemento
  const headers = Object.keys(data[0]);
  
  // Crear filas CSV
  const csvRows = [
    // Header row
    headers.map(h => escapeCSVValue(h)).join(','),
    // Data rows
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Manejar objetos anidados
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return escapeCSVValue(JSON.stringify(value));
        }
        return escapeCSVValue(value);
      }).join(',')
    ),
  ];

  const csvString = csvRows.join('\n');
  // Agregar BOM para UTF-8 (ayuda con Excel)
  const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().split('T')[0];
  triggerDownload(url, `${fileNamePrefix}_${timestamp}.csv`);
}
