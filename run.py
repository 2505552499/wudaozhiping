"""
武道智评: 智能姿态分析系统启动脚本
此脚本用于同时启动前端和后端服务
"""

import os
import sys
import subprocess
import webbrowser
import time
import threading
from pathlib import Path

def print_banner():
    """打印启动横幅"""
    banner = """
    ██╗    ██╗██╗   ██╗██████╗  █████╗  ██████╗     ███████╗██╗  ██╗██╗██████╗ ██╗███╗   ██╗ ██████╗ 
    ██║    ██║██║   ██║██╔══██╗██╔══██╗██╔═══██╗    ╚══███╔╝██║  ██║██║██╔══██╗██║████╗  ██║██╔════╝ 
    ██║ █╗ ██║██║   ██║██║  ██║███████║██║   ██║      ███╔╝ ███████║██║██████╔╝██║██╔██╗ ██║██║  ███╗
    ██║███╗██║██║   ██║██║  ██║██╔══██║██║   ██║     ███╔╝  ██╔══██║██║██╔═══╝ ██║██║╚██╗██║██║   ██║
    ╚███╔███╔╝╚██████╔╝██████╔╝██║  ██║╚██████╔╝    ███████╗██║  ██║██║██║     ██║██║ ╚████║╚██████╔╝
     ╚══╝╚══╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
                                                                                                    
    武道智评: 智能姿态分析系统 - Web版
    """
    print(banner)
    print("正在启动服务...")

def check_dependencies():
    """检查必要的依赖是否已安装"""
    try:
        # 检查Python依赖
        import flask
        import mediapipe
        import cv2
        print("✓ 后端依赖检查通过")
        
        # 检查前端目录是否存在
        frontend_dir = Path("frontend")
        if not frontend_dir.exists() or not frontend_dir.is_dir():
            print("✗ 前端目录不存在")
            return False
            
        # 检查前端package.json是否存在
        package_json = frontend_dir / "package.json"
        if not package_json.exists() or not package_json.is_file():
            print("✗ 前端package.json文件不存在")
            return False
            
        print("✓ 前端目录检查通过")
        return True
        
    except ImportError as e:
        print(f"✗ 缺少必要的Python依赖: {e}")
        print("请运行: pip install -r requirements.txt")
        return False

def start_backend():
    """启动Flask后端服务"""
    print("\n启动后端服务...")
    try:
        # 在Windows上使用pythonw.exe来避免命令行窗口
        if sys.platform == 'win32':
            backend_process = subprocess.Popen(
                ["python", "app.py"],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
        else:
            backend_process = subprocess.Popen(
                ["python", "app.py"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        print("✓ 后端服务已启动 (http://localhost:5000)")
        return backend_process
    except Exception as e:
        print(f"✗ 启动后端服务失败: {e}")
        return None

def start_frontend():
    """启动React前端服务"""
    print("\n启动前端服务...")
    try:
        # 检查node_modules是否存在，如果不存在则安装依赖
        frontend_dir = os.path.join(os.getcwd(), "frontend")
        node_modules = os.path.join(frontend_dir, "node_modules")
        
        if not os.path.exists(node_modules):
            print("首次运行，正在安装前端依赖...")
            if sys.platform == 'win32':
                subprocess.run(
                    ["npm", "install"],
                    cwd=frontend_dir,
                    shell=True,
                    check=True
                )
            else:
                subprocess.run(
                    ["npm", "install"],
                    cwd=frontend_dir,
                    check=True
                )
            print("✓ 前端依赖安装完成")
        
        # 启动前端开发服务器
        if sys.platform == 'win32':
            frontend_process = subprocess.Popen(
                ["npm", "start"],
                cwd=frontend_dir,
                shell=True,
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
        else:
            frontend_process = subprocess.Popen(
                ["npm", "start"],
                cwd=frontend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        print("✓ 前端服务已启动 (http://localhost:3001)")
        return frontend_process
    except Exception as e:
        print(f"✗ 启动前端服务失败: {e}")
        return None

def open_browser():
    """打开浏览器访问应用"""
    print("\n正在打开浏览器...")
    time.sleep(5)  # 等待服务启动
    webbrowser.open("http://localhost:3001")
    print("✓ 已在浏览器中打开应用")

def main():
    """主函数"""
    print_banner()
    
    # 检查依赖
    if not check_dependencies():
        print("\n请安装必要的依赖后再运行此脚本")
        return
    
    # 确保必要的目录存在
    os.makedirs("uploads/images", exist_ok=True)
    os.makedirs("uploads/videos", exist_ok=True)
    os.makedirs("img", exist_ok=True)
    
    # 启动后端
    backend_process = start_backend()
    if not backend_process:
        return
    
    # 启动前端
    frontend_process = start_frontend()
    if not frontend_process:
        backend_process.terminate()
        return
    
    # 在新线程中打开浏览器
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    print("\n武道智评系统已启动！")
    print("- 后端API: http://localhost:5000")
    print("- 前端界面: http://localhost:3001")
    print("\n按Ctrl+C停止服务...\n")
    
    try:
        # 等待用户中断
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n正在停止服务...")
        frontend_process.terminate()
        backend_process.terminate()
        print("✓ 服务已停止")

if __name__ == "__main__":
    main()
