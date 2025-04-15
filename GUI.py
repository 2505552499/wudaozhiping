import tkinter as tk
from tkinter import filedialog
import shutil
import model  # 确保有一个名为model.py的文件，且其中包含一个名为main的函数
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from tkinter import PhotoImage
from PIL import Image, ImageTk

def upload_image(move_name):
    # 打开文件选择对话框
    filepath = filedialog.askopenfilename(
        title="选择图片",
        filetypes=(("jpeg files", "*.jpg"), ("png files", "*.png"), ("all files", "*.*"))
    )
    if filepath:
        print(f"已选择文件: {filepath}")
        print(f"招式名称: {move_name}")
        # 定义保存图片的目录
        save_path = 'E:\\tmp\\img\\'  # 使用双斜杠避免转义字符
        # 根据招式名称修改文件名
        move_name = move_name.replace("弓步冲拳", "gongbuchongquan").replace("猛虎出洞", "menghuchudong").replace("五花坐山", "wuhuazuoshan")
        # 保存文件
        shutil.copy(filepath, save_path + move_name + filepath[filepath.rfind('.'):])  # 拼接文件名和扩展名
        print("文件已保存到:", save_path + move_name + filepath[filepath.rfind('.'):])
        model.main(move_name)  # 调用模型处理功能
    else:
        print("没有选择文件")

# 创建主窗口
root = tk.Tk()
root.title("辅助教学系统")

# 设置窗口的初始大小和背景色
root.geometry('600x400')  # 宽600像素，高400像素
root.configure(bg='#f0f0f0')  # 浅灰色背景

# 创建一个frame作为按钮的容器，水平居中
button_frame = tk.Frame(root, bg='#f0f0f0')
button_frame.pack(expand=True)

# 加载背景图片并使用Pillow
image = Image.open('background.png')  # 确保这里的路径正确
photo = ImageTk.PhotoImage(image)
bg_label = tk.Label(root, image=photo)
bg_label.place(x=0, y=0, relwidth=1, relheight=1)  # 设置标签覆盖整个窗口
bg_label.lower()  # 将背景放到底层

# 创建三个按钮，分别对应不同的招式
moves = ['弓步冲拳', '猛虎出洞', '五花坐山']
for move in moves:
    button = tk.Button(button_frame, text=move, command=lambda m=move: upload_image(m),
                       bg='#4285F4', fg='white', font=('Arial', 12), height=2, width=20)
    button.pack(side=tk.LEFT, padx=10)  # 在水平框架中侧向排列按钮，并添加水平间距

# 运行主循环
root.mainloop()

