import tkinter as tk
from tkinter import filedialog, ttk, messagebox
import shutil
import cv2
import model
import os
import threading
import time
from PIL import Image, ImageTk
from camera_control import CameraControl
import sys

class MartialArtsAnalyzer:
    def __init__(self, root, username="游客"):
        self.root = root
        self.root.title("武道智评: 智能姿态分析系统")
        self.root.geometry("1000x650")
        self.root.configure(bg="#f0f0f0")
        
        # 保存用户名
        self.username = username
        
        # 设置主标题
        self.title_frame = tk.Frame(self.root, bg="#c62828", height=60)
        self.title_frame.pack(fill=tk.X)
        
        # 标题栏布局调整，添加用户信息显示
        title_container = tk.Frame(self.title_frame, bg="#c62828")
        title_container.pack(fill=tk.X)
        
        self.title_label = tk.Label(title_container, text="武道智评: 智能姿态分析系统", 
                                    font=("Arial", 18, "bold"), fg="white", bg="#c62828")
        self.title_label.pack(side=tk.LEFT, pady=10, padx=20)
        
        # 用户信息显示
        user_frame = tk.Frame(title_container, bg="#c62828")
        user_frame.pack(side=tk.RIGHT, pady=10, padx=20)
        
        user_label = tk.Label(user_frame, text=f"当前用户: {self.username}", 
                            font=("Arial", 12), fg="white", bg="#c62828")
        user_label.pack(side=tk.RIGHT)
        
        # 如果不是游客，添加退出登录按钮
        if self.username != "游客":
            logout_btn = tk.Button(user_frame, text="退出登录", 
                                command=self.logout,
                                bg='#f44336', fg='white', font=('Arial', 9), 
                                height=1, width=8)
            logout_btn.pack(side=tk.RIGHT, padx=10)
        
        # 创建选项卡控件
        self.tab_control = ttk.Notebook(self.root)
        
        # 创建选项卡
        self.tab_image = ttk.Frame(self.tab_control)
        self.tab_video = ttk.Frame(self.tab_control)
        self.tab_camera = ttk.Frame(self.tab_control)
        self.tab_knowledge = ttk.Frame(self.tab_control)  # 新增武术知识库选项卡
        self.tab_settings = ttk.Frame(self.tab_control)
        
        # 添加选项卡到选项卡控件
        self.tab_control.add(self.tab_image, text="图像分析")
        self.tab_control.add(self.tab_video, text="视频分析")
        self.tab_control.add(self.tab_camera, text="摄像头分析")
        self.tab_control.add(self.tab_knowledge, text="武术知识库")  # 新增武术知识库选项卡
        self.tab_control.add(self.tab_settings, text="帮助与设置")
        
        # 显示选项卡控件
        self.tab_control.pack(expand=1, fill="both")
        
        # 初始化各选项卡内容
        self.setup_image_tab()
        self.setup_video_tab()
        self.setup_camera_tab()
        self.setup_knowledge_tab()  # 初始化武术知识库选项卡
        self.setup_settings_tab()
        
        # 视频和摄像头分析变量
        self.cap = None
        self.analyzing = False
        self.camera_on = False
        
    def setup_image_tab(self):
        frame = tk.Frame(self.tab_image, bg="white")
        frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # 图像分析说明
        title_label = tk.Label(frame, text="武术动作图片分析", font=("Arial", 16, "bold"), bg="white")
        title_label.pack(pady=10)
        
        desc_label = tk.Label(frame, text="您可以上传武术动作图片进行分析，系统将自动识别动作姿态，并提供评分和改进建议。", 
                           bg="white", wraplength=800)
        desc_label.pack(pady=10)
        
        # 选择动作类型框架
        move_frame = tk.Frame(frame, bg="white")
        move_frame.pack(pady=20)
        
        move_label = tk.Label(move_frame, text="选择动作类型:", bg="white")
        move_label.pack(pady=10)
        
        # 创建按钮框架 - 分成网格布局以容纳更多按钮
        button_frame = tk.Frame(move_frame, bg="white")
        button_frame.pack()
        
        # 所有招式列表
        moves = [
            '弓步冲拳', '猛虎出洞', '五花坐山',
            '滚身冲拳', '猿猴纳肘', '马步推掌',
            '并步崩拳', '狮子张嘴', '马步扣床',
            '罗汉张掌'
        ]
        
        # 创建动作按钮网格
        row, col = 0, 0
        for move in moves:
            button = tk.Button(button_frame, text=move, 
                             command=lambda m=move: self.upload_image(m),
                             bg='#4285F4', fg='white', font=('Arial', 11), 
                             height=1, width=15)
            button.grid(row=row, column=col, padx=10, pady=5)
            col += 1
            if col > 2:  # 每行3个按钮
                col = 0
                row += 1
    
    def setup_video_tab(self):
        frame = tk.Frame(self.tab_video, bg="white")
        frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # 视频分析说明
        title_label = tk.Label(frame, text="武术动作视频分析", font=("Arial", 16, "bold"), bg="white")
        title_label.pack(pady=10)
        
        desc_label = tk.Label(frame, text="您可以上传武术动作视频进行分析，系统将自动识别视频中的动作姿态序列，并提供评分和改进建议。", 
                           bg="white", wraplength=800)
        desc_label.pack(pady=10)
        
        # 选择动作类型框架
        control_frame = tk.Frame(frame, bg="white")
        control_frame.pack(pady=20)
        
        move_label = tk.Label(control_frame, text="选择动作类型:", bg="white")
        move_label.pack(side=tk.LEFT, padx=10)
        
        # 动作下拉菜单
        self.video_move_var = tk.StringVar()
        moves = [
            '弓步冲拳', '猛虎出洞', '五花坐山',
            '滚身冲拳', '猿猴纳肘', '马步推掌',
            '并步崩拳', '狮子张嘴', '马步扣床',
            '罗汉张掌'
        ]
        self.video_move_dropdown = ttk.Combobox(control_frame, textvariable=self.video_move_var, values=moves, width=15)
        self.video_move_dropdown.current(0)
        self.video_move_dropdown.pack(side=tk.LEFT, padx=10)
        
        # 选择视频按钮
        self.select_video_btn = tk.Button(control_frame, text="选择视频文件", 
                                      command=self.select_video,
                                      bg='#4285F4', fg='white', font=('Arial', 11), height=1, width=15)
        self.select_video_btn.pack(side=tk.LEFT, padx=10)
        
        # 视频显示区域
        self.video_frame = tk.Frame(frame, bg="black", width=640, height=480)
        self.video_frame.pack(pady=20)
        
        # 视频控制按钮框架
        btn_frame = tk.Frame(frame, bg="white")
        btn_frame.pack(pady=10)
        
        # 开始分析按钮
        self.start_video_btn = tk.Button(btn_frame, text="开始分析", 
                                     command=self.start_video_analysis,
                                     bg='#4CAF50', fg='white', font=('Arial', 11), height=1, width=15)
        self.start_video_btn.pack(side=tk.LEFT, padx=10)
        
        # 停止分析按钮
        self.stop_video_btn = tk.Button(btn_frame, text="停止分析", 
                                    command=self.stop_video_analysis,
                                    bg='#F44336', fg='white', font=('Arial', 11), height=1, width=15,
                                    state=tk.DISABLED)
        self.stop_video_btn.pack(side=tk.LEFT, padx=10)
        
        # 视频显示标签
        self.video_label = tk.Label(self.video_frame, bg="black")
        self.video_label.pack(expand=True, fill=tk.BOTH)
        
    def setup_camera_tab(self):
        frame = tk.Frame(self.tab_camera, bg="white")
        frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # 摄像头分析说明
        title_label = tk.Label(frame, text="实时摄像头动作分析", font=("Arial", 16, "bold"), bg="white")
        title_label.pack(pady=10)
        
        desc_label = tk.Label(frame, text="系统将通过摄像头实时采集您的动作，并立即分析评估您的武术姿态，提供及时反馈。", 
                           bg="white", wraplength=800)
        desc_label.pack(pady=10)
        
        # 选择动作类型框架
        control_frame = tk.Frame(frame, bg="white")
        control_frame.pack(pady=20)
        
        move_label = tk.Label(control_frame, text="选择动作类型:", bg="white")
        move_label.pack(side=tk.LEFT, padx=10)
        
        # 动作下拉菜单
        self.camera_move_var = tk.StringVar()
        moves = [
            '弓步冲拳', '猛虎出洞', '五花坐山',
            '滚身冲拳', '猿猴纳肘', '马步推掌',
            '并步崩拳', '狮子张嘴', '马步扣床',
            '罗汉张掌'
        ]
        self.camera_move_dropdown = ttk.Combobox(control_frame, textvariable=self.camera_move_var, values=moves, width=15)
        self.camera_move_dropdown.current(0)
        self.camera_move_dropdown.pack(side=tk.LEFT, padx=10)
        
        # 摄像头显示区域
        self.camera_frame = tk.Frame(frame, bg="black", width=640, height=480)
        self.camera_frame.pack(pady=20)
        
        # 摄像头控制按钮框架
        btn_frame = tk.Frame(frame, bg="white")
        btn_frame.pack(pady=10)
        
        # 开始分析按钮
        self.start_camera_btn = tk.Button(btn_frame, text="启动摄像头", 
                                      command=self.start_camera,
                                      bg='#4CAF50', fg='white', font=('Arial', 11), height=1, width=15)
        self.start_camera_btn.pack(side=tk.LEFT, padx=10)
        
        # 停止分析按钮
        self.stop_camera_btn = tk.Button(btn_frame, text="停止分析", 
                                     command=self.stop_camera,
                                     bg='#F44336', fg='white', font=('Arial', 11), height=1, width=15,
                                     state=tk.DISABLED)
        self.stop_camera_btn.pack(side=tk.LEFT, padx=10)
        
        # 截图评分按钮
        self.capture_btn = tk.Button(btn_frame, text="截图并评分", 
                                 command=self.capture_and_analyze,
                                 bg='#2196F3', fg='white', font=('Arial', 11), height=1, width=15,
                                 state=tk.DISABLED)
        self.capture_btn.pack(side=tk.LEFT, padx=10)
        
        # 摄像头显示标签
        self.camera_label = tk.Label(self.camera_frame, bg="black")
        self.camera_label.pack(expand=True, fill=tk.BOTH)
        
    def setup_knowledge_tab(self):
        """设置武术知识库选项卡"""
        frame = tk.Frame(self.tab_knowledge, bg="white")
        frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # 标题
        title_label = tk.Label(frame, text="武术知识库", font=("Arial", 16, "bold"), bg="white")
        title_label.pack(pady=10)
        
        # 上部介绍
        intro_text = """武术知识库收录了各派武术的基本资料、技法说明和历史文化，
为武术爱好者提供全面的知识参考。通过左侧目录选择感兴趣的内容。"""
        intro_label = tk.Label(frame, text=intro_text, wraplength=800, justify=tk.LEFT, bg="white")
        intro_label.pack(pady=10, anchor=tk.W)
        
        # 创建主内容区，分为左侧目录和右侧内容
        content_frame = tk.Frame(frame, bg="white")
        content_frame.pack(fill="both", expand=True, pady=10)
        
        # 左侧目录框架
        menu_frame = tk.Frame(content_frame, bg="#f5f5f5", width=200)
        menu_frame.pack(side=tk.LEFT, fill="y", padx=(0, 10))
        menu_frame.pack_propagate(False)  # 固定大小
        
        # 右侧内容框架
        self.knowledge_content = tk.Frame(content_frame, bg="white")
        self.knowledge_content.pack(side=tk.RIGHT, fill="both", expand=True)
        
        # 目录内容
        menu_title = tk.Label(menu_frame, text="知识分类", font=("Arial", 12, "bold"), bg="#f5f5f5")
        menu_title.pack(anchor=tk.W, padx=10, pady=10)
        
        # 目录类别
        categories = [
            ("武术流派", "流派"),
            ("技法说明", "技法"),
            ("历史文化", "历史"),
            ("代表人物", "人物")
        ]
        
        for cat_name, cat_id in categories:
            cat_btn = tk.Button(menu_frame, text=cat_name, width=18, height=2,
                             command=lambda c=cat_id: self.show_knowledge_category(c),
                             bg="#e1e1e1", relief=tk.FLAT,
                             anchor=tk.W, padx=15)
            cat_btn.pack(fill=tk.X, pady=1)
        
        # 默认显示流派内容
        self.show_knowledge_category("流派")
    
    def show_knowledge_category(self, category):
        """显示指定类别的武术知识内容"""
        # 清空内容区
        for widget in self.knowledge_content.winfo_children():
            widget.destroy()
        
        # 创建内容区滚动框架
        content_canvas = tk.Canvas(self.knowledge_content, bg="white")
        scrollbar = ttk.Scrollbar(self.knowledge_content, orient="vertical", command=content_canvas.yview)
        scrollable_frame = ttk.Frame(content_canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: content_canvas.configure(scrollregion=content_canvas.bbox("all"))
        )
        
        content_canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        content_canvas.configure(yscrollcommand=scrollbar.set)
        
        content_canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # 根据类别显示不同内容
        if category == "流派":
            self.show_martial_arts_styles(scrollable_frame)
        elif category == "技法":
            self.show_techniques(scrollable_frame)
        elif category == "历史":
            self.show_history(scrollable_frame)
        elif category == "人物":
            self.show_famous_people(scrollable_frame)
    
    def show_martial_arts_styles(self, parent):
        """显示武术流派内容"""
        # 标题
        title = tk.Label(parent, text="中国武术主要流派", font=("Arial", 14, "bold"))
        title.pack(anchor=tk.W, pady=(0, 10))
        
        styles = [
            {
                "name": "太极拳",
                "origin": "起源于河南温县陈家沟",
                "desc": "太极拳强调以柔克刚，讲究内外兼修、形神兼备，动作圆活连贯，是一种内家拳法。代表人物有陈长兴、杨露禅等。",
                "features": "柔和缓慢、刚柔相济、轻灵沉着、圆活连贯"
            },
            {
                "name": "形意拳",
                "origin": "源于河北邢台内丘县",
                "desc": "形意拳取法于动物形态，以五行为纲，十二形为目，强调三体合一，讲究整体协调。代表人物有李洛能、郭云深等。",
                "features": "刚猛凶狠、短促爆发、形神一体、直来直往"
            },
            {
                "name": "八卦掌",
                "origin": "创始于清朝道光年间",
                "desc": "八卦掌以走圆为主要特征，强调手随身转、步随掌换，动作灵活多变。代表人物有董海川、尹福等。",
                "features": "圆活绵长、连绵不断、变化多端、旋转走转"
            }
        ]
        
        # 遍历显示武术流派
        for i, style in enumerate(styles):
            style_frame = tk.Frame(parent, bd=1, relief=tk.GROOVE, padx=10, pady=10)
            style_frame.pack(fill=tk.X, pady=5)
            
            name_label = tk.Label(style_frame, text=style["name"], font=("Arial", 12, "bold"))
            name_label.pack(anchor=tk.W)
            
            origin_label = tk.Label(style_frame, text=f"起源: {style['origin']}")
            origin_label.pack(anchor=tk.W, pady=(5, 0))
            
            desc_label = tk.Label(style_frame, text=style["desc"], wraplength=700, justify=tk.LEFT)
            desc_label.pack(anchor=tk.W)
            
            features_label = tk.Label(style_frame, text=f"特点: {style['features']}")
            features_label.pack(anchor=tk.W)
    
    def show_techniques(self, parent):
        """显示武术技法内容"""
        # 标题
        title = tk.Label(parent, text="武术基本技法说明", font=("Arial", 14, "bold"))
        title.pack(anchor=tk.W, pady=(0, 10))
        
        # 基本功分类展示
        categories = [
            {
                "name": "基本步型",
                "desc": "武术中的基本步型包括弓步、马步、仆步、虚步、歇步等，是武术技击的根基。",
                "items": ["弓步: 前腿屈膝，膝关节与脚尖在同一垂直线上；后腿伸直", 
                          "马步: 两腿与肩同宽，下蹲，膝盖向外，大腿与地面平行", 
                          "虚步: 一腿承重，另一腿轻点地面，脚尖着地"]
            },
            {
                "name": "手法技巧",
                "desc": "武术手法包括拳、掌、勾、爪等多种形式，是武术攻防的主要技术。",
                "items": ["拳法: 常见的有冲拳、横拳、直拳、摆拳、钩拳等", 
                          "掌法: 包括推掌、劈掌、拍掌、云掌等手型和运动方式", 
                          "指法: 一指禅、二指禅、梅花手等指型变化"]
            },
            {
                "name": "身法技巧",
                "desc": "身法是指武术中的各种身体移动、转换和姿态变化，是连接上下肢动作的纽带。",
                "items": ["提沉: 通过提肩沉肘实现力量传导", 
                          "旋转: 腰为轴的整体转动，增加发力距离", 
                          "闪展: 身体快速收缩和展开的变化"]
            }
        ]
        
        # 遍历技法分类
        for category in categories:
            cat_frame = tk.Frame(parent, bd=1, relief=tk.GROOVE, padx=10, pady=10)
            cat_frame.pack(fill=tk.X, pady=5)
            
            name_label = tk.Label(cat_frame, text=category["name"], font=("Arial", 12, "bold"))
            name_label.pack(anchor=tk.W)
            
            desc_label = tk.Label(cat_frame, text=category["desc"], wraplength=700, justify=tk.LEFT)
            desc_label.pack(anchor=tk.W, pady=5)
            
            for item in category["items"]:
                item_label = tk.Label(cat_frame, text=f"• {item}", wraplength=700, justify=tk.LEFT)
                item_label.pack(anchor=tk.W, padx=(15, 0))
    
    def show_history(self, parent):
        """显示武术历史内容"""
        # 标题
        title = tk.Label(parent, text="中国武术发展历史", font=("Arial", 14, "bold"))
        title.pack(anchor=tk.W, pady=(0, 10))
        
        # 武术历史时期
        periods = [
            {
                "name": "远古时期 (约公元前2000年前)",
                "desc": "原始武术源于原始人类的生存需求，主要为狩猎、防御野兽和部落间争斗。这一时期的武术动作多模仿动物动作，带有浓厚的巫术色彩。"
            },
            {
                "name": "春秋战国时期 (公元前770年-公元前221年)",
                "desc": "这一时期是中国武术的初步形成时期，产生了'六艺'，即礼、乐、射、御、书、数，其中'射'和'御'与武术直接相关。同时，这一时期也出现了专业的'技击之士'。"
            },
            {
                "name": "秦汉时期 (公元前221年-公元220年)",
                "desc": "此时期武术进一步发展，出现了'角力'、'手搏'等技击活动，并开始与军事训练结合。汉代出现了首部武术著作《手搏图》，标志着武术理论的初步形成。"
            },
            {
                "name": "唐宋时期 (公元618年-公元1279年)",
                "desc": "唐宋时期武术日益普及，并开始形成各种拳术流派。唐代的'角抵戏'和宋代的武举考试推动了武术的发展，同时佛家、道家思想开始渗入武术。"
            },
            {
                "name": "明清时期 (公元1368年-公元1911年)",
                "desc": "明清时期是中国武术发展的鼎盛时期，各大流派逐渐形成。太极拳、形意拳、八卦掌等内家拳兴起，少林、武当等门派发展壮大。这一时期出现了大量武术著作，武术理论更加系统化。"
            }
        ]
        
        # 遍历历史时期
        for period in periods:
            period_frame = tk.Frame(parent, bd=1, relief=tk.GROOVE, padx=10, pady=10)
            period_frame.pack(fill=tk.X, pady=5)
            
            name_label = tk.Label(period_frame, text=period["name"], font=("Arial", 12, "bold"))
            name_label.pack(anchor=tk.W)
            
            desc_label = tk.Label(period_frame, text=period["desc"], wraplength=700, justify=tk.LEFT)
            desc_label.pack(anchor=tk.W, pady=5)
    
    def show_famous_people(self, parent):
        """显示武术名人内容"""
        # 标题
        title = tk.Label(parent, text="武术代表人物", font=("Arial", 14, "bold"))
        title.pack(anchor=tk.W, pady=(0, 10))
        
        # 武术名人
        people = [
            {
                "name": "霍元甲 (1868-1910)",
                "style": "精通密宗、擅长劈拳",
                "desc": "天津静海人，近代著名武术家，精通密宗拳法和劈挂拳，创办精武体育会，致力于弘扬中华武术。与日本柔道家交流切磋，提升了中国武术的声誉。"
            },
            {
                "name": "陈长兴 (1771-1853)",
                "style": "陈式太极拳第九代传人",
                "desc": "河南温县陈家沟人，陈式太极拳第九代传人，被称为'太极拳的集大成者'。他将陈式太极拳的动作和理论进一步完善，形成了完整的套路体系。杨露禅曾拜其为师。"
            },
            {
                "name": "黄飞鸿 (1847-1924)",
                "style": "洪家拳、佛山无影脚",
                "desc": "广东佛山人，清末民初著名武术家，精通洪家拳、佛山无影脚等技艺。开设宝芝林药店行医治病，同时传授武艺，精神被多部影视作品所传颂。"
            },
            {
                "name": "董海川 (1797-1882)",
                "style": "八卦掌创始人",
                "desc": "河北文安人，八卦掌创始人。据传他师从道士董奇，学得奇门遁甲之术和特殊的步法，后创编八卦掌。其特点是以走圆转身为主要运动形式，动作圆活连贯。"
            }
        ]
        
        # 遍历名人
        for person in people:
            person_frame = tk.Frame(parent, bd=1, relief=tk.GROOVE, padx=10, pady=10)
            person_frame.pack(fill=tk.X, pady=5)
            
            name_label = tk.Label(person_frame, text=person["name"], font=("Arial", 12, "bold"))
            name_label.pack(anchor=tk.W)
            
            style_label = tk.Label(person_frame, text=f"流派: {person['style']}")
            style_label.pack(anchor=tk.W, pady=(5, 0))
            
            desc_label = tk.Label(person_frame, text=person["desc"], wraplength=700, justify=tk.LEFT)
            desc_label.pack(anchor=tk.W, pady=5)
    
    def setup_settings_tab(self):
        frame = tk.Frame(self.tab_settings, bg="white")
        frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # 创建notebook选项卡切换帮助和用户设置
        settings_notebook = ttk.Notebook(frame)
        settings_notebook.pack(fill="both", expand=True)
        
        # 帮助选项卡
        help_tab = ttk.Frame(settings_notebook)
        settings_notebook.add(help_tab, text="帮助与使用说明")
        
        # 用户设置选项卡(仅对注册用户显示)
        if self.username != "游客":
            user_tab = ttk.Frame(settings_notebook)
            settings_notebook.add(user_tab, text="用户设置")
            self.setup_user_settings(user_tab, self.username)
        
        # 设置帮助选项卡内容
        self.setup_help_tab(help_tab)
        
        # 版本信息
        version_label = tk.Label(frame, text="版本: V1.0.0  |  开发者: 武术智能辅助团队", bg="white")
        version_label.pack(side=tk.BOTTOM, pady=10)
    
    def setup_help_tab(self, parent):
        """帮助选项卡内容"""
        # 帮助说明
        title_label = tk.Label(parent, text="帮助与使用说明", font=("Arial", 16, "bold"))
        title_label.pack(pady=10)
        
        # 使用技巧
        tips_frame = tk.Frame(parent, bd=2, relief=tk.GROOVE)
        tips_frame.pack(fill=tk.X, padx=20, pady=10)
        
        tips_title = tk.Label(tips_frame, text="使用技巧", font=("Arial", 14, "bold"))
        tips_title.pack(anchor=tk.W, padx=10, pady=5)
        
        tips = [
            "确保光线充足，便于系统准确识别",
            "保持全身在画面内",
            "避免遮挡身体关键部位",
            "动作要标准、到位",
            "穿着与背景有明显色差的衣物，提高识别准确率"
        ]
        
        for tip in tips:
            tip_label = tk.Label(tips_frame, text="• " + tip, anchor=tk.W)
            tip_label.pack(fill=tk.X, padx=20, pady=2)
            
        # 关于系统
        about_frame = tk.Frame(parent, bd=2, relief=tk.GROOVE)
        about_frame.pack(fill=tk.X, padx=20, pady=20)
        
        about_title = tk.Label(about_frame, text="关于系统", font=("Arial", 14, "bold"))
        about_title.pack(anchor=tk.W, padx=10, pady=5)
        
        about_text = """武道智评系统是一款专为武术爱好者设计的智能姿态分析工具。
系统采用先进的计算机视觉和人工智能技术，通过与专业武术传承人的标准动作对比，
为用户提供客观、准确的姿态评分和改进建议。

本系统可分析图片、视频以及实时摄像头输入，全方位满足不同学习场景需求。
        """
        
        about_label = tk.Label(about_frame, text=about_text, justify=tk.LEFT, wraplength=800)
        about_label.pack(padx=20, pady=10, anchor=tk.W)
    
    def setup_user_settings(self, parent, username):
        """用户设置选项卡内容"""
        import json
        
        # 标题
        title_label = tk.Label(parent, text="用户信息与设置", font=("Arial", 16, "bold"))
        title_label.pack(pady=10)
        
        # 用户信息框架
        info_frame = tk.LabelFrame(parent, text="账号信息", font=("Arial", 12))
        info_frame.pack(fill=tk.X, padx=20, pady=10)
        
        # 加载用户数据
        user_data = {}
        try:
            with open("users.json", "r", encoding='utf-8') as f:
                users = json.load(f)
                if username in users:
                    user_data = users[username]
        except Exception as e:
            print(f"加载用户数据错误: {e}")
        
        # 用户名
        username_frame = tk.Frame(info_frame)
        username_frame.pack(fill=tk.X, padx=20, pady=5)
        
        username_label = tk.Label(username_frame, text="用户名:", width=10, anchor=tk.W)
        username_label.pack(side=tk.LEFT, padx=5)
        
        username_value = tk.Label(username_frame, text=username)
        username_value.pack(side=tk.LEFT, padx=5)
        
        # 注册时间
        reg_time_frame = tk.Frame(info_frame)
        reg_time_frame.pack(fill=tk.X, padx=20, pady=5)
        
        reg_time_label = tk.Label(reg_time_frame, text="注册时间:", width=10, anchor=tk.W)
        reg_time_label.pack(side=tk.LEFT, padx=5)
        
        reg_time_value = tk.Label(reg_time_frame, text=user_data.get("register_time", "未知"))
        reg_time_value.pack(side=tk.LEFT, padx=5)
        
        # 上次登录
        last_login_frame = tk.Frame(info_frame)
        last_login_frame.pack(fill=tk.X, padx=20, pady=5)
        
        last_login_label = tk.Label(last_login_frame, text="上次登录:", width=10, anchor=tk.W)
        last_login_label.pack(side=tk.LEFT, padx=5)
        
        last_login_value = tk.Label(last_login_frame, text=user_data.get("last_login", "未知"))
        last_login_value.pack(side=tk.LEFT, padx=5)
        
        # 登录次数
        login_count_frame = tk.Frame(info_frame)
        login_count_frame.pack(fill=tk.X, padx=20, pady=5)
        
        login_count_label = tk.Label(login_count_frame, text="登录次数:", width=10, anchor=tk.W)
        login_count_label.pack(side=tk.LEFT, padx=5)
        
        login_count_value = tk.Label(login_count_frame, text=str(user_data.get("login_count", 0)))
        login_count_value.pack(side=tk.LEFT, padx=5)
        
        # 密码修改框架
        passwd_frame = tk.LabelFrame(parent, text="修改密码", font=("Arial", 12))
        passwd_frame.pack(fill=tk.X, padx=20, pady=20)
        
        # 当前密码
        current_pwd_frame = tk.Frame(passwd_frame)
        current_pwd_frame.pack(fill=tk.X, padx=20, pady=5)
        
        current_pwd_label = tk.Label(current_pwd_frame, text="当前密码:", width=10, anchor=tk.W)
        current_pwd_label.pack(side=tk.LEFT, padx=5)
        
        self.current_pwd_var = tk.StringVar()
        current_pwd_entry = tk.Entry(current_pwd_frame, show="*", width=20, textvariable=self.current_pwd_var)
        current_pwd_entry.pack(side=tk.LEFT, padx=5)
        
        # 新密码
        new_pwd_frame = tk.Frame(passwd_frame)
        new_pwd_frame.pack(fill=tk.X, padx=20, pady=5)
        
        new_pwd_label = tk.Label(new_pwd_frame, text="新密码:", width=10, anchor=tk.W)
        new_pwd_label.pack(side=tk.LEFT, padx=5)
        
        self.new_pwd_var = tk.StringVar()
        new_pwd_entry = tk.Entry(new_pwd_frame, show="*", width=20, textvariable=self.new_pwd_var)
        new_pwd_entry.pack(side=tk.LEFT, padx=5)
        
        # 确认新密码
        confirm_pwd_frame = tk.Frame(passwd_frame)
        confirm_pwd_frame.pack(fill=tk.X, padx=20, pady=5)
        
        confirm_pwd_label = tk.Label(confirm_pwd_frame, text="确认密码:", width=10, anchor=tk.W)
        confirm_pwd_label.pack(side=tk.LEFT, padx=5)
        
        self.confirm_pwd_var = tk.StringVar()
        confirm_pwd_entry = tk.Entry(confirm_pwd_frame, show="*", width=20, textvariable=self.confirm_pwd_var)
        confirm_pwd_entry.pack(side=tk.LEFT, padx=5)
        
        # 修改密码按钮
        change_pwd_btn = tk.Button(passwd_frame, text="修改密码", 
                                 command=lambda: self.change_password(username),
                                 bg='#4285F4', fg='white', font=('Arial', 11), 
                                 height=1, width=15)
        change_pwd_btn.pack(pady=10)
    
    def change_password(self, username):
        """修改用户密码"""
        import json
        import hashlib
        import re
        
        current_pwd = self.current_pwd_var.get()
        new_pwd = self.new_pwd_var.get()
        confirm_pwd = self.confirm_pwd_var.get()
        
        # 验证输入
        if not current_pwd or not new_pwd or not confirm_pwd:
            messagebox.showerror("错误", "所有密码字段都必须填写")
            return
        
        # 验证新密码格式
        if len(new_pwd) < 8 or not re.search(r'[a-zA-Z]', new_pwd) or not re.search(r'[0-9]', new_pwd):
            messagebox.showerror("错误", "新密码至少8位，且必须包含字母和数字")
            return
        
        # 验证两次密码输入是否一致
        if new_pwd != confirm_pwd:
            messagebox.showerror("错误", "两次输入的新密码不一致")
            return
        
        # 验证当前密码是否正确
        try:
            with open("users.json", "r", encoding='utf-8') as f:
                users = json.load(f)
                
            if username not in users:
                messagebox.showerror("错误", "用户数据异常，请重新登录")
                return
            
            # 哈希当前输入的密码进行比对
            current_pwd_hash = hashlib.sha256(current_pwd.encode()).hexdigest()
            if users[username]["password"] != current_pwd_hash:
                messagebox.showerror("错误", "当前密码不正确")
                return
            
            # 更新密码
            users[username]["password"] = hashlib.sha256(new_pwd.encode()).hexdigest()
            users[username]["password_changed_at"] = self.get_current_time()
            
            with open("users.json", "w", encoding='utf-8') as f:
                json.dump(users, f, indent=4)
            
            messagebox.showinfo("成功", "密码修改成功！")
            
            # 清空输入框
            self.current_pwd_var.set("")
            self.new_pwd_var.set("")
            self.confirm_pwd_var.set("")
            
        except Exception as e:
            messagebox.showerror("错误", f"修改密码时出错: {e}")
    
    def get_current_time(self):
        """获取当前时间字符串"""
        import datetime
        return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    def logout(self):
        """退出登录"""
        if messagebox.askyesno("退出登录", "确定要退出登录吗?"):
            self.root.destroy()  # 关闭当前窗口
            # 重新启动应用
            os.execl(sys.executable, sys.executable, *sys.argv)
        
    def upload_image(self, move_name):
        # 打开文件选择对话框
        filepath = filedialog.askopenfilename(
            title="选择图片",
            filetypes=(("jpeg files", "*.jpg"), ("png files", "*.png"), ("all files", "*.*"))
        )
        if filepath:
            print(f"已选择文件: {filepath}")
            print(f"招式名称: {move_name}")
            
            # 确保img目录存在
            img_dir = 'img'
            if not os.path.exists(img_dir):
                os.makedirs(img_dir)
                
            # 根据招式名称修改文件名
            move_code = move_name.replace("弓步冲拳", "gongbuchongquan")\
                                .replace("猛虎出洞", "menghuchudong")\
                                .replace("五花坐山", "wuhuazuoshan")\
                                .replace("滚身冲拳", "gunshenchongquan")\
                                .replace("猿猴纳肘", "yuanhounazhou")\
                                .replace("马步推掌", "mabutuizhang")\
                                .replace("并步崩拳", "bingbubengquan")\
                                .replace("狮子张嘴", "shizizhangzui")\
                                .replace("马步扣床", "mabukouchuang")\
                                .replace("罗汉张掌", "luohanzhangzhang")
            
            # 目标文件路径
            target_file = os.path.join(img_dir, move_code + os.path.splitext(filepath)[1])
            
            # 复制文件
            shutil.copy(filepath, target_file)
            print(f"文件已保存到: {target_file}")
            
            try:
                # 调用模型分析功能
                score = model.analyze_frame(target_file, move_code)
                if score > 0:
                    messagebox.showinfo("分析结果", f"动作评分：{score:.1f}分")
                else:
                    messagebox.showerror("分析失败", "无法识别动作姿势，请确保图片中有清晰的人物姿势")
            except Exception as e:
                messagebox.showerror("错误", f"分析图像时出错: {str(e)}")
                print(f"分析图像时出错: {e}")
        else:
            print("没有选择文件")
    
    def select_video(self):
        # 打开文件选择对话框
        filepath = filedialog.askopenfilename(
            title="选择视频",
            filetypes=(("mp4 files", "*.mp4"), ("avi files", "*.avi"), ("all files", "*.*"))
        )
        if filepath:
            print(f"已选择视频: {filepath}")
            self.video_path = filepath
            self.start_video_btn.config(state=tk.NORMAL)
            
            # 显示视频第一帧
            self.cap = cv2.VideoCapture(filepath)
            ret, frame = self.cap.read()
            if ret:
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frame = cv2.resize(frame, (640, 480))
                img = Image.fromarray(frame)
                img_tk = ImageTk.PhotoImage(image=img)
                self.video_label.config(image=img_tk)
                self.video_label.image = img_tk
            self.cap.release()
        else:
            print("没有选择视频")
    
    def start_video_analysis(self):
        if hasattr(self, 'video_path'):
            self.analyzing = True
            self.start_video_btn.config(state=tk.DISABLED)
            self.stop_video_btn.config(state=tk.NORMAL)
            
            # 获取选中的动作类型
            move_name = self.video_move_var.get()
            move_code = move_name.replace("弓步冲拳", "gongbuchongquan")\
                                .replace("猛虎出洞", "menghuchudong")\
                                .replace("五花坐山", "wuhuazuoshan")\
                                .replace("滚身冲拳", "gunshenchongquan")\
                                .replace("猿猴纳肘", "yuanhounazhou")\
                                .replace("马步推掌", "mabutuizhang")\
                                .replace("并步崩拳", "bingbubengquan")\
                                .replace("狮子张嘴", "shizizhangzui")\
                                .replace("马步扣床", "mabukouchuang")\
                                .replace("罗汉张掌", "luohanzhangzhang")
            
            # 启动视频分析线程
            self.analysis_thread = threading.Thread(target=self.analyze_video, args=(move_code,))
            self.analysis_thread.daemon = True
            self.analysis_thread.start()
    
    def analyze_video(self, move_code):
        # 打开视频
        self.cap = cv2.VideoCapture(self.video_path)
        
        # 创建视频控制窗口
        control_window = tk.Toplevel(self.root)
        control_window.title("视频分析控制")
        control_window.geometry("300x200")
        
        control_label = tk.Label(control_window, text="正在分析视频...", font=("Arial", 12))
        control_label.pack(pady=10)
        
        # 添加一个进度条
        progress = ttk.Progressbar(control_window, orient="horizontal", length=250, mode="indeterminate")
        progress.pack(pady=10)
        progress.start()
        
        # 当前评分显示
        score_var = tk.StringVar(value="当前评分: 0.0")
        score_label = tk.Label(control_window, textvariable=score_var, font=("Arial", 12))
        score_label.pack(pady=5)
        
        # 停止按钮
        stop_btn = tk.Button(control_window, text="停止分析", 
                            command=self.stop_video_analysis,
                            bg='#F44336', fg='white', font=('Arial', 11), height=1, width=15)
        stop_btn.pack(pady=10)
        
        frame_count = 0
        best_frame = None
        best_score = 0
        
        while self.analyzing and self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break
                
            frame_count += 1
            
            # 调整frame大小以适应显示
            display_frame = cv2.resize(frame, (640, 480))
            
            # 每帧都用process_video_frame处理来显示骨架，但不是每帧都分析评分
            processed_frame, _ = model.process_video_frame(display_frame)
            
            # 显示处理后的帧
            frame_rgb = cv2.cvtColor(processed_frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(frame_rgb)
            img_tk = ImageTk.PhotoImage(image=img)
            self.video_label.config(image=img_tk)
            self.video_label.image = img_tk
            
            # 每10帧分析一次评分，减少计算负担
            if frame_count % 10 == 0:
                # 保存当前帧用于分析
                temp_img_path = f"temp_{move_code}.jpg"
                cv2.imwrite(temp_img_path, frame)
                
                # 分析当前帧并获取评分
                score = model.analyze_frame(temp_img_path, move_code)
                score_var.set(f"当前评分: {score:.1f}")
                
                # 更新最佳帧
                if score > best_score:
                    best_score = score
                    best_frame = frame.copy()
                
                # 删除临时文件
                if os.path.exists(temp_img_path):
                    os.remove(temp_img_path)
            
            # 更新UI
            self.root.update()
            
            # 控制视频播放速度
            time.sleep(0.03)  # 约30fps
        
        # 视频分析完成，显示最佳帧
        if best_frame is not None:
            # 保存最佳帧
            best_frame_path = f"img/{move_code}.jpg"
            cv2.imwrite(best_frame_path, best_frame)
            
            # 关闭进度窗口
            control_window.destroy()
            
            # 弹出提示
            analysis_done = tk.Toplevel(self.root)
            analysis_done.title("分析完成")
            analysis_done.geometry("300x150")
            
            done_label = tk.Label(analysis_done, text=f"视频分析完成!\n最佳评分: {best_score:.1f}", font=("Arial", 12))
            done_label.pack(pady=10)
            
            show_btn = tk.Button(analysis_done, text="查看详细分析", 
                               command=lambda: model.main(move_code),
                               bg='#4285F4', fg='white', font=('Arial', 11), height=1, width=15)
            show_btn.pack(pady=10)
        
        # 释放资源
        self.cap.release()
        self.analyzing = False
        self.start_video_btn.config(state=tk.NORMAL)
        self.stop_video_btn.config(state=tk.DISABLED)
    
    def stop_video_analysis(self):
        self.analyzing = False
        if self.cap is not None:
            self.cap.release()
        self.start_video_btn.config(state=tk.NORMAL)
        self.stop_video_btn.config(state=tk.DISABLED)
    
    def start_camera(self):
        self.camera_on = True
        self.start_camera_btn.config(state=tk.DISABLED)
        self.stop_camera_btn.config(state=tk.NORMAL)
        self.capture_btn.config(state=tk.NORMAL)
        
        # 获取选中的动作类型
        move_name = self.camera_move_var.get()
        self.current_move_code = move_name.replace("弓步冲拳", "gongbuchongquan").replace("猛虎出洞", "menghuchudong").replace("五花坐山", "wuhuazuoshan")
        
        # 创建摄像头控制窗口
        self.control_window = CameraControl(
            self.root,
            on_stop=self.stop_camera,
            on_capture=self.capture_and_analyze
        )
        
        # 启动摄像头线程
        self.camera_thread = threading.Thread(target=self.update_camera)
        self.camera_thread.daemon = True
        self.camera_thread.start()
    
    def update_camera(self):
        # 打开摄像头
        self.cap = cv2.VideoCapture(0)  # 0表示默认摄像头
        
        frame_count = 0
        last_score_time = time.time()
        
        while self.camera_on:
            ret, frame = self.cap.read()
            if ret:
                # 调整画面大小
                frame = cv2.resize(frame, (640, 480))
                
                # 处理帧并显示骨骼
                processed_frame, keypoints_data = model.process_video_frame(frame)
                
                # 转换颜色空间用于显示
                frame_rgb = cv2.cvtColor(processed_frame, cv2.COLOR_BGR2RGB)
                
                # 创建PIL图像
                img = Image.fromarray(frame_rgb)
                img_tk = ImageTk.PhotoImage(image=img)
                
                # 更新标签
                self.camera_label.config(image=img_tk)
                self.camera_label.image = img_tk  # 保持引用
                
                # 存储当前帧用于截图
                self.current_frame = frame.copy()
                
                # 每秒计算一次评分
                current_time = time.time()
                if current_time - last_score_time > 1.0 and len(keypoints_data) > 0:
                    # 计算评分但不显示UI
                    try:
                        # 保存临时帧
                        temp_path = "temp_camera_frame.jpg"
                        cv2.imwrite(temp_path, frame)
                        
                        # 分析帧
                        score = model.analyze_frame(temp_path, self.current_move_code)
                        
                        # 更新评分显示
                        if hasattr(self, 'control_window'):
                            self.control_window.update_score(score)
                            self.control_window.update_tips(self.camera_move_var.get(), score)
                        
                        # 删除临时文件
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                        
                        last_score_time = current_time
                    except Exception as e:
                        print(f"实时评分计算错误: {e}")
                
                frame_count += 1
            
            # 给UI线程一些时间更新
            time.sleep(0.03)  # 约30fps
        
        # 释放摄像头
        self.cap.release()
    
    def stop_camera(self):
        self.camera_on = False
        if hasattr(self, 'control_window') and self.control_window:
            self.control_window.window.destroy()
        
        self.start_camera_btn.config(state=tk.NORMAL)
        self.stop_camera_btn.config(state=tk.DISABLED)
        self.capture_btn.config(state=tk.DISABLED)
        
        # 清空摄像头显示
        self.camera_label.config(image='')
    
    def capture_and_analyze(self):
        if hasattr(self, 'current_frame') and self.current_frame is not None:
            # 获取当前选择的动作类型
            move_name = self.camera_move_var.get()
            move_code = move_name.replace("弓步冲拳", "gongbuchongquan")\
                                .replace("猛虎出洞", "menghuchudong")\
                                .replace("五花坐山", "wuhuazuoshan")\
                                .replace("滚身冲拳", "gunshenchongquan")\
                                .replace("猿猴纳肘", "yuanhounazhou")\
                                .replace("马步推掌", "mabutuizhang")\
                                .replace("并步崩拳", "bingbubengquan")\
                                .replace("狮子张嘴", "shizizhangzui")\
                                .replace("马步扣床", "mabukouchuang")\
                                .replace("罗汉张掌", "luohanzhangzhang")
            
            # 确保img目录存在
            img_dir = 'img'
            if not os.path.exists(img_dir):
                os.makedirs(img_dir)
            
            # 保存当前帧
            img_path = os.path.join(img_dir, f"{move_code}.jpg")
            cv2.imwrite(img_path, self.current_frame)
            print(f"已保存截图到: {img_path}")
            
            # 调用模型分析
            model.main(move_code)

# 添加到model.py的函数，用于仅返回分数而不显示UI
def add_analyze_frame_function():
    # 创建analyze_frame函数，稍后添加到model.py
    analyze_frame_code = '''
def analyze_frame(img_path, posture):
    """分析单帧图像并返回评分，不显示UI"""
    try:
        if not os.path.exists(img_path):
            print(f"错误: 无法找到图片 {img_path}")
            return 0
        
        # 读取图片
        img0 = cv2.imread(img_path)
        if img0 is None:
            img0 = cv_imread(img_path)
            
        if img0 is None:
            print(f"错误: 无法读取图片 {img_path}")
            return 0
            
        image = img0.copy()
        img = image.copy()

        # 检测关键点
        image, keypoints_data = process_frame(img)
        
        if keypoints_data is None or len(keypoints_data) == 0:
            print("未检测到关键点数据")
            return 0
            
        angles = calculate_angles(keypoints_data)
        
        # 根据姿态选择不同的对照数据
        if "gongbuchongquan" in posture:
            angles2 = calculate_angles(coordinate_master.master_gong_bu_chong_quan)
        elif "menghuchudong" in posture:
            angles2 = calculate_angles(coordinate_master.master_meng_hu_chu_dong)
        elif "wuhuazuoshan" in posture:
            angles2 = calculate_angles(coordinate_master.master_wu_hua_zuo_shan)
        elif "gunshenchongquan" in posture:
            angles2 = calculate_angles(coordinate_master.master_gun_shen_chong_quan)
        elif "yuanhounazhou" in posture:
            angles2 = calculate_angles(coordinate_master.master_yuan_hou_na_zhou)
        elif "mabutuizhang" in posture:
            angles2 = calculate_angles(coordinate_master.master_ma_bu_tui_zhang)
        elif "bingbubengquan" in posture:
            angles2 = calculate_angles(coordinate_master.master_bing_bu_beng_quan)
        elif "shizizhangzui" in posture:
            angles2 = calculate_angles(coordinate_master.master_shi_zi_zhang_zui)
        elif "mabukouchuang" in posture:
            angles2 = calculate_angles(coordinate_master.master_ma_bu_kou_chuang)
        elif "luohanzhangzhang" in posture:
            angles2 = calculate_angles(coordinate_master.master_luo_han_zhang_zhang)
        else:
            print(f"未知姿态类型: {posture}")
            return 0
            
        # 计算得分
        score = show_goal(angles, angles2) * 10
        return score
    
    except Exception as e:
        print(f"分析帧时出错: {e}")
        return 0
'''
    return analyze_frame_code

if __name__ == "__main__":
    # 检查并添加analyze_frame函数到model.py
    with open('model.py', 'r', encoding='utf-8') as f:
        model_code = f.read()
    
    if 'def analyze_frame' not in model_code:
        analyze_frame_code = add_analyze_frame_function()
        with open('model.py', 'a', encoding='utf-8') as f:
            f.write(analyze_frame_code)
        print("已添加analyze_frame函数到model.py")
    
    # 启动主程序
    root = tk.Tk()
    app = MartialArtsAnalyzer(root)
    root.mainloop() 