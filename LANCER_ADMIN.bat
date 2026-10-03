@echo off
cd /d "%~dp0"
set PORT=8090
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%/dev/admin-local/
  py -m http.server %PORT%
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%/dev/admin-local/
  python -m http.server %PORT%
  goto :end
)
echo Python n'est pas installe. Installe Python (python.org) puis relance ce fichier.
pause
:end
pause
