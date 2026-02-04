@echo off
REM Script para regenerar Prisma en Windows

echo Regenerando cliente de Prisma...
echo.

cd /d "%~dp0"

REM Verificar si hay procesos usando Prisma
echo Verificando procesos activos...
tasklist | findstr /I "bun.exe" >nul
if %errorlevel% equ 0 (
    echo.
    echo ADVERTENCIA: Hay procesos de Bun activos.
    echo Por favor, cierra el servidor backend antes de continuar.
    echo.
    choice /C YN /M "Deseas forzar el cierre de procesos Bun?"
    if errorlevel 2 goto skip_kill
    taskkill /F /IM bun.exe >nul 2>&1
    echo Procesos cerrados.
    timeout /t 2 >nul
)

:skip_kill
echo.
echo Eliminando cache de Prisma...
if exist "node_modules\.prisma" (
    rmdir /S /Q "node_modules\.prisma" 2>nul
    timeout /t 1 >nul
)

echo.
echo Generando cliente de Prisma...
bun prisma generate

if %errorlevel% equ 0 (
    echo.
    echo [32mCliente de Prisma regenerado exitosamente[0m
    echo.
    echo Ahora puedes iniciar el servidor:
    echo   bun run dev
) else (
    echo.
    echo [31mError al regenerar Prisma[0m
    echo.
    echo Si el error persiste:
    echo   1. Cierra todos los terminales y VSCode
    echo   2. Abre VSCode nuevamente
    echo   3. Ejecuta: bun prisma generate
)

echo.
pause
