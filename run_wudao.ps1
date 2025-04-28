Write-Host "======================================" -ForegroundColor Cyan
Write-Host "武道智评: 智能姿态分析系统 - Web版" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Create necessary directories
New-Item -ItemType Directory -Force -Path "uploads\images" | Out-Null
New-Item -ItemType Directory -Force -Path "uploads\videos" | Out-Null
New-Item -ItemType Directory -Force -Path "img" | Out-Null

# Check if port 3000 is already in use
$port3000InUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000InUse) {
    Write-Host "WARNING: Port 3000 is already in use. The frontend may not start properly." -ForegroundColor Yellow
    Write-Host "You may need to close the application using that port first." -ForegroundColor Yellow
    Write-Host ""
}

# Start the backend server
Write-Host "Starting the backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-Command `"conda activate python11; python app.py`"" -WorkingDirectory (Get-Location)

Write-Host ""
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Starting the frontend server..." -ForegroundColor Green
Set-Location -Path "frontend"
Write-Host "Installing frontend dependencies if needed..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "(If the browser doesn't open automatically, please visit http://localhost:3000)" -ForegroundColor Cyan
npm start

Write-Host ""
Write-Host "If you encounter any issues, please make sure:" -ForegroundColor Yellow
Write-Host "1. Port 5000 is available for the backend" -ForegroundColor Yellow
Write-Host "2. Port 3000 is available for the frontend" -ForegroundColor Yellow
Write-Host "3. All required Python dependencies are installed in the 'python11' conda environment" -ForegroundColor Yellow
