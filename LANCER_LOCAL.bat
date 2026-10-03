@echo off
cd /d "%~dp0"
set PORT=8080
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%/
  py -m http.server %PORT% --directory public
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%/
  python -m http.server %PORT% --directory public
  goto :end
)
echo Python n'est pas installe. Ouvre public\index.html pour un apercu statique.
start "" "%~dp0public\index.html"
:end
pause
