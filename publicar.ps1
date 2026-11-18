# Publica TECHNOLATAM en GitHub Pages
# Ejecutar desde la carpeta del proyecto: powershell -ExecutionPolicy Bypass -File .\publicar.ps1
$ErrorActionPreference = "Stop"
$RepoName = "technolatam-noticias"
$GitHubUser = "dududev94"
$Remote = "https://github.com/$GitHubUser/$RepoName.git"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " PUBLICADOR TECHNOLATAM" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git no está instalado. Instala Git for Windows desde https://git-scm.com/download/win y vuelve a ejecutar este script."
}
if (-not (Test-Path ".\index.html") -or -not (Test-Path ".\data\articles.json")) {
    throw "No estás en la carpeta raíz del proyecto TECHNOLATAM."
}

$UserInput = Read-Host "¿Ya creaste el repositorio PUBLICO '$RepoName' en GitHub para el usuario $GitHubUser? (S/N)"
if ($UserInput -notmatch '^(S|s|SI|si|Sí|sí)$') {
    Write-Host "`nCrea primero el repositorio en https://github.com/new" -ForegroundColor Yellow
    Write-Host "Nombre: $RepoName | Visibilidad: Public | NO marques README, .gitignore ni licencia."
    Write-Host "Después vuelve a ejecutar .\publicar.ps1`n"
    exit 0
}

if (-not (Test-Path ".git")) { git init }
git branch -M main

$ExistingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    if ($ExistingRemote -ne $Remote) {
        git remote set-url origin $Remote
    }
} else {
    git remote add origin $Remote
}

git add .
$Status = git status --porcelain
if ($Status) {
    git commit -m "Publica portal inicial TECHNOLATAM"
} else {
    Write-Host "No hay cambios nuevos para confirmar." -ForegroundColor Yellow
}

Write-Host "`nSubiendo archivos a GitHub..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    throw "No se pudo subir el proyecto. Revisa que el repositorio exista y que hayas iniciado sesión/autorizado Git."
}
Write-Host "`nPUBLICACION EN GITHUB COMPLETADA." -ForegroundColor Green
Write-Host "Activa GitHub Pages en Settings > Pages > Deploy from a branch > main > /(root)." -ForegroundColor Yellow
Write-Host "Dirección esperada: https://$GitHubUser.github.io/$RepoName/" -ForegroundColor Green
