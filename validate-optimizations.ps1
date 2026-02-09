# 🔍 Script de validación de optimizaciones - NEOSALE (Windows)
# Ejecuta: .\validate-optimizations.ps1

$BACKEND_URL = "http://localhost:3001/api"
$PASSES = 0
$FAILS = 0

Write-Host "🚀 VALIDANDO OPTIMIZACIONES DE RENDIMIENTO" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Name
    )
    
    Write-Host "📊 Testeando $Name... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri "$BACKEND_URL$Endpoint" -Method $Method -TimeoutSec 10
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200 -or $statusCode -eq 201) {
            $cacheStatus = $response.Headers['X-Cache']
            Write-Host "✓" -ForegroundColor Green -NoNewline
            Write-Host " ($statusCode)"
            
            if ($cacheStatus -eq "HIT") {
                Write-Host "   ✓ Cache HIT" -ForegroundColor Green
            } else {
                Write-Host "   ℹ Cache MISS (primera vez)" -ForegroundColor Yellow
            }
            
            $global:PASSES++
        } else {
            Write-Host "✗ ($statusCode)" -ForegroundColor Red
            $global:FAILS++
        }
    } catch {
        Write-Host "✗ (Error)" -ForegroundColor Red
        Write-Host "   $_" -ForegroundColor Red
        $global:FAILS++
    }
}

# Verificar si backend está corriendo
Write-Host "🔗 Verificando conexión al backend..." -ForegroundColor Cyan

try {
    $null = Invoke-WebRequest -Uri "$BACKEND_URL" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend está disponible" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend no está corriendo en $BACKEND_URL" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Inicia el backend con:" -ForegroundColor Yellow
    Write-Host "  cd backend && bun run dev" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
Write-Host ""

# Tests
Write-Host "🧪 TESTS DE ENDPOINTS" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

Test-Endpoint "GET" "/products?page=1&limit=20" "GET /products (primera vista)"
Write-Host ""
Start-Sleep -Milliseconds 100
Test-Endpoint "GET" "/products?page=1&limit=20" "GET /products (segunda vista - debe mostrar CACHE HIT)"
Write-Host ""
Test-Endpoint "GET" "/offers" "GET /offers"
Write-Host ""

# Tamaño de respuesta
Write-Host "📦 TAMAÑO DE RESPUESTAS" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/products?page=1&limit=20" -Method GET
    $size = $response.Content.Length
    $sizeKB = [Math]::Round($size / 1024, 2)
    
    Write-Host "📊 Tamaño JSON /products: ${sizeKB}KB"
    
    if ($size -lt 1000000) {
        Write-Host "✓ Tamaño optimizado (<1MB)" -ForegroundColor Green
        $PASSES++
    } else {
        Write-Host "✗ Tamaño alto (>1MB, revisar optimizaciones)" -ForegroundColor Red
        $FAILS++
    }
} catch {
    Write-Host "⚠️  No se pudo medir tamaño" -ForegroundColor Yellow
}
Write-Host ""

# Tiempo de respuesta
Write-Host "⏱️  TIEMPO DE RESPUESTA" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $null = Invoke-WebRequest -Uri "$BACKEND_URL/products?page=1&limit=20" -Method GET -TimeoutSec 10
    $stopwatch.Stop()
    $time1 = $stopwatch.ElapsedMilliseconds
    
    Write-Host "Primera solicitud: ${time1}ms"
    
    Start-Sleep -Milliseconds 100
    
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $null = Invoke-WebRequest -Uri "$BACKEND_URL/products?page=1&limit=20" -Method GET -TimeoutSec 10
    $stopwatch.Stop()
    $time2 = $stopwatch.ElapsedMilliseconds
    
    Write-Host "Segunda solicitud (caché): ${time2}ms"
    
    if ($time2 -lt ($time1 / 2)) {
        Write-Host "✓ Caché funcionando correctamente" -ForegroundColor Green
        $PASSES++
    }
} catch {
    Write-Host "⚠️  Error midiendo tiempo de respuesta" -ForegroundColor Yellow
}
Write-Host ""

# Resumen
Write-Host "📋 RESUMEN" -ForegroundColor Cyan
Write-Host "=========" -ForegroundColor Cyan
Write-Host "Passed: " -NoNewline
Write-Host "$PASSES" -ForegroundColor Green

Write-Host "Failed: " -NoNewline
Write-Host "$FAILS" -ForegroundColor Red
Write-Host ""

if ($FAILS -gt 0) {
    Write-Host "⚠️  Hay issues a revisar" -ForegroundColor Red
} else {
    Write-Host "✓ Todas las optimizaciones se aplican correctamente" -ForegroundColor Green
}

Write-Host ""
Write-Host "📚 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  EJECUTAR LOS ÍNDICES EN LA BD:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Abre pgAdmin o psql y ejecuta:"
Write-Host ""
Write-Host "   psql -U tu_usuario -d neosale < backend\db\migrations\add_performance_indexes.sql"
Write-Host ""
Write-Host "2️⃣  REINICIA EL BACKEND" -ForegroundColor Yellow
Write-Host ""
Write-Host "   cd backend && bun run dev"
Write-Host ""
Write-Host "3️⃣  MONITOREA LOS LOGS" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Verás entradas como:"
Write-Host "   ⏱️ [GET] /api/products - 523ms - 200"
Write-Host ""
Write-Host "📖 Lee OPTIMIZATION_REPORT.md para más detalles" -ForegroundColor Cyan
Write-Host ""
