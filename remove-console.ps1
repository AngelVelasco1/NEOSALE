# Script para eliminar console statements
Write-Host "Eliminando console statements..." -ForegroundColor Yellow

$files = Get-ChildItem -Path . -Recurse -Include *.ts,*.tsx,*.js,*.jsx | 
    Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.next*" }

$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($null -eq $content) { continue }
    
    $original = $content
    
    # Eliminar todas las variantes de console
    $content = $content -replace "console\.log\([^\)]*\);?", ""
    $content = $content -replace "console\.error\([^\)]*\);?", ""
    $content = $content -replace "console\.warn\([^\)]*\);?", ""
    $content = $content -replace "console\.info\([^\)]*\);?", ""
    $content = $content -replace "console\.debug\([^\)]*\);?", ""
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "Procesado: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Total archivos modificados: $count" -ForegroundColor Cyan
