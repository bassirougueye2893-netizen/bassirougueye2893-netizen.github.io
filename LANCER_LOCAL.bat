@echo off
cd /d "%~dp0"
set PORT=8080
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%/
  py -m http.server %PORT% --directory docs
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%/
  python -m http.server %PORT% --directory docs
  goto :end
)
echo Python n'est pas installe. Ouvre docs\index.html pour un apercu statique.
start "" "%~dp0docs\index.html"
:end
pause
