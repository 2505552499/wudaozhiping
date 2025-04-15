import tkinter as tk
from tkinter import ttk
import random
import threading
import time

class CameraControl:
    def __init__(self, parent, on_stop=None, on_capture=None):
        """初始化摄像头控制界面
        
        Args:
            parent: 父窗口
            on_stop: 停止摄像头的回调函数
            on_capture: 截图分析的回调函数
        """
        self.parent = parent
        self.on_stop_callback = on_stop
        self.on_capture_callback = on_capture
        
        # 创建顶层窗口
        self.window = tk.Toplevel(parent)
        self.window.title("实时姿态分析控制")
        self.window.geometry("400x500")
        self.window.protocol("WM_DELETE_WINDOW", self.on_close)
        
        # 标题框架
        title_frame = tk.Frame(self.window, bg="#4CAF50", padx=10, pady=10)
        title_frame.pack(fill=tk.X)
        
        title_label = tk.Label(title_frame, text="实时姿态分析控制", 
                               font=("Arial", 16, "bold"), bg="#4CAF50", fg="white")
        title_label.pack()
        
        # 内容框架
        content_frame = tk.Frame(self.window, padx=20, pady=20)
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        # 评分显示
        score_frame = tk.Frame(content_frame)
        score_frame.pack(fill=tk.X, pady=10)
        
        score_label = tk.Label(score_frame, text="当前评分:", font=("Arial", 12))
        score_label.pack(side=tk.LEFT)
        
        self.score_var = tk.StringVar(value="0.0")
        self.score_display = tk.Label(score_frame, textvariable=self.score_var, 
                                     font=("Arial", 16, "bold"), fg="#2196F3")
        self.score_display.pack(side=tk.LEFT, padx=10)
        
        # 进度条
        progress_frame = tk.Frame(content_frame)
        progress_frame.pack(fill=tk.X, pady=10)
        
        progress_label = tk.Label(progress_frame, text="姿势质量:", font=("Arial", 12))
        progress_label.pack(anchor=tk.W)
        
        self.progress_bar = ttk.Progressbar(progress_frame, orient="horizontal", 
                                           length=360, mode="determinate")
        self.progress_bar.pack(fill=tk.X, pady=5)
        
        # 提示区域
        tips_frame = tk.LabelFrame(content_frame, text="动作提示", font=("Arial", 12))
        tips_frame.pack(fill=tk.BOTH, expand=True, pady=10)
        
        self.tips_var = tk.StringVar(value="请保持动作，系统正在分析...")
        tips_text = tk.Label(tips_frame, textvariable=self.tips_var, 
                           font=("Arial", 11), justify=tk.LEFT, wraplength=350)
        tips_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # 按钮区域
        buttons_frame = tk.Frame(content_frame)
        buttons_frame.pack(fill=tk.X, pady=10)
        
        self.stop_btn = tk.Button(buttons_frame, text="停止", command=self.stop_camera,
                                 bg='#F44336', fg='white', font=('Arial', 11), 
                                 height=2, width=10)
        self.stop_btn.pack(side=tk.LEFT, padx=10)
        
        self.capture_btn = tk.Button(buttons_frame, text="截图并评分", 
                                   command=self.capture_frame,
                                   bg='#2196F3', fg='white', font=('Arial', 11), 
                                   height=2, width=15)
        self.capture_btn.pack(side=tk.RIGHT, padx=10)
    
    def update_score(self, score):
        """更新评分显示
        
        Args:
            score: 动作评分(0-10)
        """
        score_rounded = round(score, 1)
        self.score_var.set(f"{score_rounded}")
        
        # 更新进度条
        self.progress_bar["value"] = score * 10  # 转换为百分比
        
        # 设置评分颜色
        if score >= 8:
            self.score_display.config(fg="#4CAF50")  # 绿色
        elif score >= 6:
            self.score_display.config(fg="#FF9800")  # 橙色
        else:
            self.score_display.config(fg="#F44336")  # 红色
    
    def update_tips(self, move_name, score):
        """根据动作和得分更新提示
        
        Args:
            move_name: 动作名称
            score: 评分
        """
        tips = "请保持动作，系统正在分析..."
        
        if move_name == "弓步冲拳":
            if score < 5:
                tips = "弓步不够稳定，前腿弯曲不足，拳头位置过低。请注意：\n1. 前腿膝盖应在脚尖上方\n2. 拳头应与肩同高\n3. 后腿需绷直"
            elif score < 8:
                tips = "弓步较好，但仍有提升空间：\n1. 重心可以更加前倾\n2. 拳头收紧，手臂伸展更有力\n3. 腰背保持挺直"
            else:
                tips = "动作标准！保持良好的弓步姿势和有力的冲拳。继续保持！"
        
        elif move_name == "猛虎出洞":
            if score < 5:
                tips = "虎爪姿势不够标准，站立不稳。请注意：\n1. 虎爪五指张开，指尖用力\n2. 手臂伸展更有力\n3. 步伐要稳健有力"
            elif score < 8:
                tips = "虎爪形态较好，但力量感不足：\n1. 增强前冲的爆发力\n2. 虎爪姿势更加紧凑\n3. 身体重心保持稳定"
            else:
                tips = "动作有力！虎爪姿态标准，冲击力十足。继续保持这种猛虎出洞的力量感！"
        
        elif move_name == "五花坐山":
            if score < 5:
                tips = "盘坐不够稳，上身摆动过大。请注意：\n1. 下肢稳固盘坐\n2. 上身保持挺直\n3. 手臂动作更加协调"
            elif score < 8:
                tips = "姿势较为稳定，但流畅度不足：\n1. 手臂动作可以更加圆融\n2. 呼吸与动作结合更紧密\n3. 上身保持中正"
            else:
                tips = "动作流畅！盘坐稳健，手臂五花动作圆润自然。坐山态势威严大方，继续保持！"
        
        self.tips_var.set(tips)
    
    def stop_camera(self):
        """停止摄像头"""
        if self.on_stop_callback:
            self.on_stop_callback()
    
    def capture_frame(self):
        """截取当前帧并分析"""
        if self.on_capture_callback:
            self.on_capture_callback()
    
    def on_close(self):
        """窗口关闭时的回调"""
        self.stop_camera()
        self.window.destroy()


# 测试代码
if __name__ == "__main__":
    root = tk.Tk()
    root.withdraw()  # 隐藏主窗口
    
    def on_stop():
        print("停止摄像头")
        
    def on_capture():
        print("截图并分析")
    
    control = CameraControl(root, on_stop, on_capture)
    
    # 模拟评分更新
    def update_demo():
        for _ in range(50):
            score = random.uniform(3, 10)
            control.update_score(score)
            moves = ["弓步冲拳", "猛虎出洞", "五花坐山"]
            move = random.choice(moves)
            control.update_tips(move, score)
            time.sleep(2)
    
    demo_thread = threading.Thread(target=update_demo)
    demo_thread.daemon = True
    demo_thread.start()
    
    root.mainloop() 