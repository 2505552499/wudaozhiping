import tkinter as tk
from martial_arts_analyzer import MartialArtsAnalyzer
from user_auth import UserAuth
import os

# 确保img目录存在
if not os.path.exists('img'):
    os.makedirs('img')

# 登录成功后的回调
def on_login_success(username):
    print(f"用户 {username} 已成功登录")
    # 显示主窗口
    root.deiconify()
    
    # 设置窗口标题
    root.title("武道智评系统")
    
    # 创建应用实例，直接传递用户名
    app = MartialArtsAnalyzer(root, username)

# 启动主程序
if __name__ == "__main__":
    print("启动武道智评系统...")
    root = tk.Tk()
    root.withdraw()  # 先隐藏主窗口
    
    # 显示登录窗口
    auth = UserAuth(root, on_login_success=on_login_success)
    
    root.mainloop() 