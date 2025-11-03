# Comandos con Bun

## Instalación de dependencias
```bash
# Instalar todas las dependencias
bun install

# Instalar en frontend
bun install --cwd frontend

# Instalar en backend
bun install --cwd backend
```

## Desarrollo
```bash
# Ejecutar frontend y backend simultáneamente
bun run dev

# Solo frontend
bun run front

# Solo backend
bun run back
```

## Producción
```bash
# Build del frontend
bun run build

# Iniciar frontend en producción
bun run start
```

## Agregar/Remover paquetes
```bash
# Agregar dependencia
bun add <paquete>

# Agregar dependencia de desarrollo
bun add -d <paquete>

# Remover dependencia
bun remove <paquete>

# Agregar en frontend
bun add <paquete> --cwd frontend

# Agregar en backend
bun add <paquete> --cwd backend
```

## Actualizar dependencias
```bash
# Actualizar todas las dependencias
bun update

# Actualizar paquete específico
bun update <paquete>
```

## Ejecutar scripts
```bash
# Ejecutar cualquier script del package.json
bun run <nombre-script>
```

## Notas importantes
- Ya no uses `npm` o `npx`, usa `bun` o `bunx`
- Los archivos `package-lock.json` fueron eliminados
- Ahora se usa `bun.lock` o `bun.lockb`
- Bun es compatible con la mayoría de paquetes de npm
