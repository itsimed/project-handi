@echo off
chcp 65001 >nul
echo ========================================
echo   🦽 PROJECT HANDI - LANCEMENT AUTO
echo ========================================
echo.

echo [1/7] Vérification de Docker...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [❌ ERREUR] Docker n'est pas lancé
    echo.
    echo 👉 SOLUTION :
    echo    1. Ouvrez Docker Desktop
    echo    2. Attendez qu'il indique "Docker is running"
    echo    3. Relancez ce script
    echo.
    pause
    exit /b 1
)
echo [✅] Docker opérationnel
echo.

echo [2/7] Démarrage de PostgreSQL...
docker compose up -d
if %errorlevel% neq 0 (
    echo [❌ ERREUR] Impossible de démarrer PostgreSQL
    pause
    exit /b 1
)
echo [✅] PostgreSQL démarré
echo ⏳ Attente du démarrage de la base (5 secondes)...
timeout /t 5 /nobreak >nul
echo.

echo [3/7] Génération du client Prisma...
cd backend
call npx prisma generate
if %errorlevel% neq 0 (
    echo [❌ ERREUR] Génération Prisma échouée
    cd ..
    pause
    exit /b 1
)
echo.

echo [4/7] Application des migrations...
call npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo [⚠️] Migration échouée, tentative avec migrate dev...
    call npx prisma migrate dev --name init
)
echo.

echo [5/7] Peuplement de la base de données...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo [⚠️] Seeding échoué (peut être déjà fait)
)
cd ..
echo.

echo [6/7] Vérification des dépendances...
echo    - Backend...
cd backend
if not exist "node_modules\" (
    echo [📦] Installation des dépendances backend...
    call npm install
)
cd ..

echo    - Frontend...
cd frontend
if not exist "node_modules\" (
    echo [📦] Installation des dépendances frontend...
    call npm install
)
cd ..
echo.

echo [7/7] Lancement des serveurs...
echo.
echo ========================================
echo   ✅ PROJET PRÊT À DÉMARRER !
echo ========================================
echo.
echo 🌐 URLs :
echo    Backend  : http://localhost:5000
echo    Frontend : http://localhost:5173
echo.
echo 👤 COMPTES DE TEST :
echo    Candidat   : marie.dupont@example.com
echo    Recruteur  : recruiter@techinclusion.com
echo    Mot de passe : password123
echo.
echo 🚀 Deux fenêtres vont s'ouvrir...
echo.
timeout /t 3 /nobreak

start "🔧 Backend Server" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 2 /nobreak >nul
start "🎨 Frontend Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ✨ Serveurs lancés ! Ouvrez http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
