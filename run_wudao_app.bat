@echo off
echo ===== 武道智评系统启动脚本 =====
echo.

echo 创建必要的目录...
mkdir uploads\images 2>nul
mkdir uploads\videos 2>nul
mkdir img 2>nul

echo 1. 激活Python环境...
call conda activate python11

echo 2. 启动Flask后端服务器...
start cmd /k "conda activate python11 && python app.py"

echo 3. 等待后端服务启动...
timeout /t 5

echo 4. 启动React前端...
cd frontend
echo 安装依赖...
call npm install
echo 启动前端服务器(端口3001)...
set PORT=3001
set DANGEROUSLY_DISABLE_HOST_CHECK=true
start cmd /k "npm start"

echo.
echo ===== 武道智评系统已启动 =====
echo 后端服务: http://localhost:5000
echo 前端界面: http://localhost:3001
echo.
echo 请在浏览器中访问 http://localhost:3001 使用系统
echo.
echo 按任意键退出此窗口(不会关闭应用)...
pause > nul
