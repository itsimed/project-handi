@echo off
chcp 65001 >nul
echo ========================================
echo   🦽 PROJECT HANDI - LANCEMENT AUTO
echo ========================================
echo.

echo [1/6] Vérification de la connexion Internet...
ping -n 1 8.8.8.8 >nul 2>&1
if %errorlevel% neq 0 (
    echo [❌ ERREUR] Pas de connexion Internet
    echo.
    echo 👉 SOLUTION :
    echo    La base de données est sur Neon Cloud, une connexion Internet est requise
    echo    Vérifiez votre connexion et relancez ce script
    echo.
    pause
    exit /b 1
)
echo [✅] Connexion Internet OK
echo.

echo [2/6] Génération du client Prisma...
cd backend
call npx prisma generate
if %errorlevel% neq 0 (
    echo [❌ ERREUR] Génération Prisma échouée
    cd ..
    pause
    exit /b 1
)
echo.

echo [3/6] Synchronisation avec la base de données Neon...
call npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo [⚠️] Migration échouée, tentative avec migrate dev...
    call npx prisma migrate dev --name init
)
echo.

echo [4/6] Vérification des dépendances...
echo    - Backend...
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

echo [5/6] Vérification du fichier .env...
cd backend
if not exist ".env" (
    echo [⚠️] Fichier .env non trouvé
    echo [📝] Création du fichier .env depuis .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [✅] Fichier .env créé
    ) else (
        echo [❌ ERREUR] Fichier .env.example non trouvé
        echo [💡] Créez manuellement le fichier .env avec la configuration Neon
        cd ..
        pause
        exit /b 1
    )
)
cd ..
echo.

echo [6/6] Lancement des serveurs...
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
echo ☁️ Base de données : Neon Cloud (partagée)
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
