import tkinter as tk
from martial_arts_analyzer import MartialArtsAnalyzer
import os

# 确保img目录存在
if not os.path.exists('img'):
    os.makedirs('img')

# 启动主程序
if __name__ == "__main__":
    print("启动武道智评系统...")
    root = tk.Tk()
    app = MartialArtsAnalyzer(root)
    root.mainloop() 