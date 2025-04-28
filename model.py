'''导入一些基本的库'''
import cv2
import mediapipe as mp
import time
from tqdm import tqdm
import numpy as np
import matplotlib.pyplot as plt
import random
import math
from PIL import Image, ImageFont, ImageDraw
import coordinate_master
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import tkinter as tk
from tkinter import ttk
from matplotlib.figure import Figure
from PIL import Image, ImageTk
from tkinter import PhotoImage
import os

plt.rcParams['font.sans-serif'] = ['Microsoft YaHei']  # '微软雅黑'
plt.rcParams['axes.unicode_minus'] = False  # 解决负号问题（例如在坐标轴上）

# 定义常量
KEY_POINTS_LABEL = "动作要点:"
DESCRIPTION_LABEL = "动作要领:"
TITLE_LABEL = "总分:"
SCORE_LABEL = "分"
NO_PERSON_LABEL = "NO PERSON"
FPS_LABEL = "FPS-{}"
IMAGE_NOT_FOUND_ERROR = "错误: 无法找到图片 {}"
INVALID_IMAGE_ERROR = "错误: 无法读取图片 {}"
INVALID_KEYPOINTS_ERROR = "未检测到关键点数据"
UNKNOWN_POSTURE_ERROR = "未知姿态类型: {}"
VIDEO_FRAME_INVALID_ERROR = "无效的图像格式"
VIDEO_FRAME_NO_PERSON_ERROR = "未检测到人体"

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose(static_image_mode=True)

## 读取图像，解决imread不能读取中文路径的问题
def cv_imread(file_path):
    try:
        # 尝试使用普通方式读取图片
        img = cv2.imread(file_path)
        if img is not None:
            return img
            
        # 如果普通方式失败，尝试使用imdecode方式
        img = cv2.imdecode(np.fromfile(file_path, dtype=np.uint8), cv2.IMREAD_COLOR)
        if img is not None:
            return img
            
        # 如果都失败了，尝试使用PIL库读取
        from PIL import Image
        img_pil = Image.open(file_path)
        img_np = np.array(img_pil)
        # 如果是RGB格式，转换为BGR格式(OpenCV格式)
        if len(img_np.shape) == 3 and img_np.shape[2] == 3:
            img_np = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        return img_np
    except Exception as e:
        print(f"读取图片出错: {e}")
        return None

def process_frame(img):
    try:
        start_time = time.time()
        
        # 确保图像是有效的BGR格式
        if img is None or len(img.shape) != 3:
            print(VIDEO_FRAME_INVALID_ERROR)
            return None, []
            
        h, w = img.shape[0], img.shape[1]  # 高和宽
        
        # 检查图像大小，如果太大则调整大小
        max_dimension = 1280  # 设置最大尺寸
        if h > max_dimension or w > max_dimension:
            scale = max_dimension / max(h, w)
            new_h, new_w = int(h * scale), int(w * scale)
            img = cv2.resize(img, (new_w, new_h))
            print(f"图像已调整大小: {w}x{h} -> {new_w}x{new_h}")
            # 更新图像尺寸
            h, w = new_h, new_w
        
        # 转换为RGB格式并确保是连续数组
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_rgb = np.ascontiguousarray(img_rgb)

        # 将RGB图像输入模型，获取关键点预测结果
        results = pose.process(img_rgb)
        
        keypoints_indices = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]  # 定义要输出的关键点索引
        keypoints = [None] * 33
        keypoints_data = []  # 创建一个空列表来存储关键点数据

        if results.pose_landmarks:
            mp_drawing.draw_landmarks(img, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            
            # 输出目标关键点坐标
            for index in keypoints_indices:
                x = results.pose_landmarks.landmark[index].x
                y = results.pose_landmarks.landmark[index].y
                z = results.pose_landmarks.landmark[index].z
                keypoints_data.append((x, y, z))  # 将每个关键点的坐标加入列表

            for i in keypoints_indices:
                cx = int(results.pose_landmarks.landmark[i].x * w)
                cy = int(results.pose_landmarks.landmark[i].y * h)
                keypoints[i] = (cx, cy)                              

        else:
            print(NO_PERSON_LABEL)
            struction = NO_PERSON_LABEL
            img = cv2.putText(img, struction, (25, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.25, (255, 255, 0), 6)
            
        end_time = time.time()
        process_time = end_time - start_time            # 图片关键点预测时间
        fps = 1 / process_time                          # 帧率
        colors = [[random.randint(0,255) for _ in range(3)] for _ in range(33)]
        radius = [random.randint(8,15) for _ in range(33)]
        
        for index in keypoints_indices:
            if keypoints[index] is not None:
                cx, cy = keypoints[index]
                img = cv2.circle(img, (cx, cy), radius[index], colors[index], -1)
                
        cv2.putText(img, FPS_LABEL.format(str(int(fps))), (12, 100), cv2.FONT_HERSHEY_SIMPLEX,
                    3, (255, 255, 0), thickness=2)
                    
        return img, keypoints_data
        
    except Exception as e:
        print(f"处理图像时出错: {e}")
        return None, []

def angle_between_points_3d(p1, p2, p3):
    """计算由三维点p1到p2和p2到p3形成的夹角"""
    # 创建向量
    vector1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]]
    vector2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]]


    # 计算点积
    dot_product = vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2]
    # 计算向量大小
    magnitude1 = math.sqrt(vector1[0] ** 2 + vector1[1] ** 2 + vector1[2] ** 2)
    magnitude2 = math.sqrt(vector2[0] ** 2 + vector2[1] ** 2 + vector2[2] ** 2)


    # 避免除以0的错误
    if magnitude1 == 0 or magnitude2 == 0:
        return 0
    # 计算夹角的余弦值
    cos_angle = dot_product / (magnitude1 * magnitude2)
    # 余弦值可能因计算误差略微超出-1到1的范围
    cos_angle = max(min(cos_angle, 1), -1)
    # 计算角度
    angle = math.acos(cos_angle)
    # 转换为度
    angle_degrees = math.degrees(angle)
    return angle_degrees


def calculate_angles(keypoints_data):
    # 定义关节点对，用于计算夹角
    #这里虽然代号是11-16，23-28，但是keypoints_data里是从1-12的，所以这里要进行映射，11-16相当于0-5，23-28相当于6-11
    joints_pairs = [
        (2, 0, 4),  # 13-11 与 13-15
        (3, 1, 5),  # 14-12 与 14-16
        (0, 2, 6),  # 11-13 与 11-23
        (1, 3, 7),  # 12-14 与 12-24
        (6, 0, 8),  # 23-11 与 23-25
        (7, 1, 9),  # 24-12 与 24-26
        (6, 7, 8),  # 23-24 与 23-25
        (7, 6, 9),  # 24-23 与 24-26
        (8, 6, 10),  # 25-23 与 25-27
        (9, 7, 11),  # 26-24 与 26-28
    ]


    # 存储计算结果的列表
    angles = []
    # 遍历所有关节点对，计算夹角
    for joints in joints_pairs:
        p1, p2, p3 = keypoints_data[joints[0]], keypoints_data[joints[1]], keypoints_data[joints[2]]
        angle = angle_between_points_3d(p1, p2, p3)
        angles.append(f" {joints[1]}-{joints[0]} 和 {joints[0]}-{joints[2]}夹角为: {angle:.2f} 度")
    return angles


def view_bar(angles, name):
    try:
        print(f"显示角度数据: {name}")
        # 解析角度数据
        labels = [angle.split(':')[0] for angle in angles]
        values = [float(angle.split(': ')[1].split(' ')[0]) for angle in angles]
        
        # 创建Tkinter窗口
        window = tk.Toplevel()
        window.title(f"{name}角度数据可视化")
        window.geometry("800x600")  # 设置窗口大小
        
        # 标题
        title_label = tk.Label(window, text=f"{name}关节角度数据", font=('Arial', 14, 'bold'))
        title_label.pack(pady=10)
        
        # 创建主框架
        main_frame = tk.Frame(window)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # 创建画布
        canvas_width = 650
        canvas_height = 400
        canvas = tk.Canvas(main_frame, width=canvas_width, height=canvas_height, bg='white')
        canvas.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        
        # 计算参数
        max_value = max(values) if values else 0
        if max_value == 0:  # 防止除零错误
            max_value = 1
        bar_height = 25
        bar_spacing = 15
        margin_left = 250  # 左侧留出空间显示标签
        margin_top = 50
        margin_bottom = 50
        
        # 画水平线和刻度
        for i in range(5):
            tick_value = max_value * i / 4
            x_pos = margin_left + (canvas_width - margin_left) * tick_value / max_value
            canvas.create_line(x_pos, margin_top, x_pos, canvas_height - margin_bottom, fill='lightgray')
            canvas.create_text(x_pos, canvas_height - margin_bottom + 10, text=f"{tick_value:.0f}")
            
        # X轴标签
        canvas.create_text(margin_left + (canvas_width - margin_left) / 2, 
                           canvas_height - margin_bottom + 30, 
                           text="度数")
        
        # 绘制柱状图
        for i, (label, value) in enumerate(zip(labels, values)):
            y_pos = margin_top + i * (bar_height + bar_spacing)
            bar_width = (canvas_width - margin_left) * value / max_value
            
            # 绘制标签
            canvas.create_text(margin_left - 10, y_pos + bar_height/2, 
                               text=label, anchor=tk.E, width=240, font=('Arial', 9))
            
            # 绘制条形
            canvas.create_rectangle(margin_left, y_pos, margin_left + bar_width, y_pos + bar_height, 
                                   fill='skyblue', outline='')
            
            # 显示数值
            canvas.create_text(margin_left + bar_width + 10, y_pos + bar_height/2, 
                               text=f"{value:.2f}", anchor=tk.W)
        
        print(f"{name}角度数据可视化完成")
        
    except Exception as e:
        import traceback
        print(f"显示角度数据时出错: {e}")
        print(traceback.format_exc())


def show_master(master_posture):
    try:
        print("显示传承人姿态模型")
        # 确保master_posture是列表类型并且有数据
        if not isinstance(master_posture, list) or len(master_posture) == 0:
            print("错误: 传承人姿态数据无效")
            return
        
        # 创建Tkinter窗口
        window = tk.Toplevel()
        window.title("传承人姿态图解")
        window.geometry("600x500")  # 设置窗口大小
        
        # 创建画布
        canvas_width, canvas_height = 500, 400
        canvas = tk.Canvas(window, width=canvas_width, height=canvas_height, bg='white')
        canvas.pack(padx=10, pady=10)
        
        # 设置坐标系和边距
        margin = 50
        x_min = min([point[0] for point in master_posture])
        x_max = max([point[0] for point in master_posture])
        z_min = min([point[2] for point in master_posture])
        z_max = max([point[2] for point in master_posture])
        
        # 计算缩放比例
        x_scale = (canvas_width - 2 * margin) / (x_max - x_min) if x_max != x_min else 1
        z_scale = (canvas_height - 2 * margin) / (z_max - z_min) if z_max != z_min else 1
        scale = min(x_scale, z_scale) * 0.8  # 使用80%的可用空间来确保有足够的边距
        
        # 计算居中偏移
        x_center = (x_max + x_min) / 2
        z_center = (z_max + z_min) / 2
        canvas_center_x = canvas_width / 2
        canvas_center_y = canvas_height / 2
        
        # 将3D坐标转换为Canvas坐标
        coords = []
        for point in master_posture:
            # 计算相对于中心点的偏移，然后缩放，最后加上画布中心点
            canvas_x = canvas_center_x + (point[0] - x_center) * scale
            # 翻转y轴（Canvas坐标系中y轴向下增长）
            canvas_y = canvas_center_y - (point[2] - z_center) * scale
            coords.append((canvas_x, canvas_y))
        
        # 定义连接关系
        connections = [
            (0, 1), (0, 2), (1, 3), (2, 4), (3, 5),  # Shoulders to elbows to wrists
            (6, 7), (6, 8), (7, 9), (8, 10), (9, 11)  # Hips to knees to ankles
        ]
        
        # 绘制连接线
        for start, end in connections:
            if start < len(coords) and end < len(coords):
                canvas.create_line(coords[start][0], coords[start][1], 
                                  coords[end][0], coords[end][1], 
                                  fill='blue', width=2)
        
        # 绘制关键点
        for x, y in coords:
            canvas.create_oval(x-5, y-5, x+5, y+5, fill='red', outline='')
        
        # 添加标题和轴标签
        title_label = tk.Label(window, text="传承人姿态二维映射图解", font=('Arial', 14, 'bold'))
        title_label.pack(pady=(5, 0))
        
        x_axis_label = tk.Label(window, text="X 轴")
        x_axis_label.pack()
        
        z_axis_label = tk.Label(window, text="Z 轴")
        z_axis_label.place(x=10, y=canvas_height/2)
        
        print("传承人姿态模型显示成功")
        
    except Exception as e:
        import traceback
        print(f"显示传承人姿态时出错: {e}")
        print(traceback.format_exc())

def show_goal(angle1,angle2):
    # Function to extract angle values from the strings
    def extract_angle(angle_string):
        return float(angle_string.split(': ')[1].replace(' 度', ''))

    # Calculate the score based on the error difference
    def calculate_score(angle1, angle2):
        score = 10.0  # start with a full score of 10
        error = abs(angle1 - angle2)

        if error > 5:
            score -= (error - 5) / 5 * 0.5

        return max(score, 0)  # ensure score doesn't go below 0

    # Extract angles from the strings
    angles1 = [extract_angle(a) for a in angle1]
    angles2 = [extract_angle(a) for a in angle2]

    # Calculate scores for each joint
    scores = [calculate_score(a1, a2) for a1, a2 in zip(angles1, angles2)]

    # Calculate the average score
    average_score = sum(scores) / len(scores)

    return average_score

def show_score_and_description(score, description):
    try:
        # 创建评分窗口
        top = tk.Toplevel()
        top.title("评分与描述")
        top.geometry("600x400")  # 设置窗口大小
        
        # 尝试加载背景图片
        try:
            bg_image = PhotoImage(file="background2.png")
            bg_label = tk.Label(top, image=bg_image)
            bg_label.place(x=0, y=0, relwidth=1, relheight=1)
            # 保持对图片的引用，防止图片被垃圾回收
            top.bg_image = bg_image
        except Exception as e:
            print(f"无法加载背景图片: {e}")
            # 使用纯色背景作为备选
            top.configure(bg='#f0f0f0')  # 浅灰色背景
    
        # 创建一个Frame来放置内容
        content_frame = tk.Frame(top, bg='white')
        content_frame.pack(padx=20, pady=20)
    
        # 评分标签
        score_label = tk.Label(content_frame, text=f"{TITLE_LABEL} {score:.1f} {SCORE_LABEL}", 
                              fg='red', font=('Arial', 20, 'bold'), bg='white')
        score_label.pack(pady=20)
    
        # 动作要领标签
        lbl_title = tk.Label(content_frame, text=DESCRIPTION_LABEL, 
                            font=('Arial', 12, 'bold'), bg='white', anchor='w')
        lbl_title.pack(fill='x', pady=(10, 5))
        
        description_label = tk.Label(content_frame, text=description, 
                                    wraplength=500, bg='white', justify='left',
                                    anchor='w')
        description_label.pack(fill='x', pady=5)
        
        # 动作要点标签（可以根据不同姿势添加特定要点）
        if "弓步冲拳" in description:
            lbl_points = tk.Label(content_frame, text=KEY_POINTS_LABEL, 
                                font=('Arial', 12, 'bold'), bg='white', anchor='w')
            lbl_points.pack(fill='x', pady=(10, 5))
            
            points_text = "后拳贴身向下冲出"
            points_label = tk.Label(content_frame, text=points_text, 
                                   wraplength=500, bg='white', justify='left', 
                                   anchor='w')
            points_label.pack(fill='x', pady=5)
            
        elif "猛虎出洞" in description:
            lbl_points = tk.Label(content_frame, text=KEY_POINTS_LABEL, 
                                font=('Arial', 12, 'bold'), bg='white', anchor='w')
            lbl_points.pack(fill='x', pady=(10, 5))
            
            points_text = "两拳同时击出，保持高低错位"
            points_label = tk.Label(content_frame, text=points_text, 
                                   wraplength=500, bg='white', justify='left', 
                                   anchor='w')
            points_label.pack(fill='x', pady=5)
            
        elif "五花坐山" in description:
            lbl_points = tk.Label(content_frame, text=KEY_POINTS_LABEL, 
                                font=('Arial', 12, 'bold'), bg='white', anchor='w')
            lbl_points.pack(fill='x', pady=(10, 5))
            
            points_text = "注意右拳的摆动轨迹，左拳收紧贴于腰间"
            points_label = tk.Label(content_frame, text=points_text, 
                                   wraplength=500, bg='white', justify='left', 
                                   anchor='w')
            points_label.pack(fill='x', pady=5)
            
    except Exception as e:
        import traceback
        print(f"显示评分和描述时出错: {e}")
        print(traceback.format_exc())


def main(posture):
    try:
        print(f"正在处理姿态: {posture}")
        
        # 检查图片是否存在
        img_path = f"img/{posture}.jpg"
        if not os.path.exists(img_path):
            print(IMAGE_NOT_FOUND_ERROR.format(img_path))
            return
        
        print(f"读取图片: {img_path}")
        # 直接使用OpenCV标准方法读取图片
        img0 = cv2.imread(img_path)
        if img0 is None:
            print("标准方法读取失败，尝试使用自定义方法")
            img0 = cv_imread(img_path)
        
        if img0 is None:
            print(INVALID_IMAGE_ERROR.format(img_path))
            return
            
        print(f"图片读取成功，尺寸: {img0.shape}")
        image = img0.copy()
        img = image.copy()

        # 检测关键点，得到的image是检测过后的图片
        image, keypoints_data = process_frame(img)
        
        if keypoints_data is None or len(keypoints_data) == 0:
            print(INVALID_KEYPOINTS_ERROR)
            return
            
        angles = calculate_angles(keypoints_data)
        
        # 根据姿态选择不同的对照数据
        if "gongbuchongquan" in posture:
            angles2 = calculate_angles(coordinate_master.master_gong_bu_chong_quan)
            show_master(coordinate_master.master_gong_bu_chong_quan)
            yaoling = "右脚向前落步，成右弓步：左拳向前冲出，拳心朝下：右拳向后斜下方冲出，拳心朝后：目视左拳"
        elif "menghuchudong" in posture:
            angles2 = calculate_angles(coordinate_master.master_meng_hu_chu_dong)
            show_master(coordinate_master.master_meng_hu_chu_dong)
            yaoling = "左脚向前上步成左弓步；两拳向前方击出；右拳高于头；左拳与胸平，两拳拳心上下相对；目视前方"
        elif "wuhuazuoshan" in posture:
            angles2 = calculate_angles(coordinate_master.master_wu_hua_zuo_shan)
            show_master(coordinate_master.master_wu_hua_zuo_shan)
            yaoling = "左脚向左上步：右拳由下向右、向上摆至面前，拳心朝后：左掌变拳回收抱于腰间，拳心朝上：目视右拳"
        else:
            print(UNKNOWN_POSTURE_ERROR.format(posture))
            return
            
        score = show_goal(angles, angles2)

        print("非遗武术传承人")
        print(angles2)
        view_bar(angles2, "传承人")

        print("习武者")
        print(angles)
        view_bar(angles, "习武者")

        print(keypoints_data)
        
        # 显示评分和要领
        show_score_and_description(score*10, yaoling)

        # 使用tkinter创建自定义窗口显示图像对比
        image_window = tk.Toplevel()
        image_window.title("习武者姿态展示")
        image_window.geometry("800x450")  # 设置窗口大小
        
        # 创建左右两个框架，增加留白和边框效果
        left_frame = tk.Frame(image_window, bd=2, relief=tk.GROOVE, padx=5, pady=5)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        right_frame = tk.Frame(image_window, bd=2, relief=tk.GROOVE, padx=5, pady=5)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # 创建标题标签，使用更大更粗的字体
        img0_label = tk.Label(left_frame, text="原图", font=("Arial", 12, "bold"))
        img0_label.pack(pady=5)
        
        # 根据图片大小调整尺寸
        max_width = 350
        max_height = 350
        img_width, img_height = img0.shape[1], img0.shape[0]
        
        # 计算调整后的尺寸，保持纵横比
        if img_width > max_width or img_height > max_height:
            scale = min(max_width / img_width, max_height / img_height)
            new_width = int(img_width * scale)
            new_height = int(img_height * scale)
            img0_resized = cv2.resize(img0, (new_width, new_height))
            image_resized = cv2.resize(image, (new_width, new_height))
        else:
            img0_resized = img0
            image_resized = image
            
        # 将OpenCV图像转换为Tkinter格式
        img0_rgb = cv2.cvtColor(img0_resized, cv2.COLOR_BGR2RGB)
        img0_pil = Image.fromarray(img0_rgb)
        img0_tk = ImageTk.PhotoImage(image=img0_pil)
        
        image_rgb = cv2.cvtColor(image_resized, cv2.COLOR_BGR2RGB)
        image_pil = Image.fromarray(image_rgb)
        image_tk = ImageTk.PhotoImage(image=image_pil)
        
        # 显示原图
        img0_canvas = tk.Label(left_frame, image=img0_tk, bd=1, relief=tk.SUNKEN)
        img0_canvas.image = img0_tk  # 保持引用
        img0_canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # 显示处理后的图片
        image_label = tk.Label(right_frame, text="检测并可视化后的图片", font=("Arial", 12, "bold"))
        image_label.pack(pady=5)
        
        image_canvas = tk.Label(right_frame, image=image_tk, bd=1, relief=tk.SUNKEN)
        image_canvas.image = image_tk  # 保持引用
        image_canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # 使窗口保持在前台
        image_window.lift()
        image_window.attributes('-topmost', True)
        image_window.after_idle(image_window.attributes, '-topmost', False)
    
    except Exception as e:
        import traceback
        print(f"处理过程中出现错误: {e}")
        print(traceback.format_exc())

def get_posture_angles(posture):
    """根据姿势类型获取标准角度数据"""
    posture_map = {
        "gongbuchongquan": coordinate_master.master_gong_bu_chong_quan,
        "menghuchudong": coordinate_master.master_meng_hu_chu_dong,
        "wuhuazuoshan": coordinate_master.master_wu_hua_zuo_shan,
        "gunshenchongquan": coordinate_master.master_gun_shen_chong_quan,
        "yuanhounazhou": coordinate_master.master_yuan_hou_na_zhou,
        "mabutuizhang": coordinate_master.master_ma_bu_tui_zhang,
        "bingbubengquan": coordinate_master.master_bing_bu_beng_quan,
        "shizizhangzui": coordinate_master.master_shi_zi_zhang_zui,
        "mabukouchuang": coordinate_master.master_ma_bu_kou_chuang,
        "luohanzhangzhang": coordinate_master.master_luo_han_zhang_zhang
    }
    
    for key, value in posture_map.items():
        if key in posture:
            return calculate_angles(value)
    
    print(UNKNOWN_POSTURE_ERROR.format(posture))
    return None

def analyze_frame(img_path, posture):
    """分析单帧图像并返回评分，不显示UI"""
    try:
        # 检查图片是否存在
        if not os.path.exists(img_path):
            print(IMAGE_NOT_FOUND_ERROR.format(img_path))
            return 0
        
        # 读取图片
        img0 = cv2.imread(img_path)
        if img0 is None:
            img0 = cv_imread(img_path)
            
        if img0 is None:
            print(INVALID_IMAGE_ERROR.format(img_path))
            return 0
            
        image = img0.copy()
        img = image.copy()

        # 检测关键点
        image, keypoints_data = process_frame(img)
        
        if keypoints_data is None or len(keypoints_data) == 0:
            print(INVALID_KEYPOINTS_ERROR)
            return 0
            
        # 计算当前姿势的角度
        angles = calculate_angles(keypoints_data)
        
        # 获取标准姿势的角度
        angles2 = get_posture_angles(posture)
        if angles2 is None:
            return 0
            
        # 计算得分
        score = show_goal(angles, angles2) * 10
        return score
    
    except Exception as e:
        print(f"分析帧时出错: {e}")
        return 0

def process_video_frame(img, draw=True, keypoint_size=10):
    """处理视频帧，返回处理后的图像和关键点数据"""
    try:
        if img is None or len(img.shape) != 3:
            print(VIDEO_FRAME_INVALID_ERROR)
            return img, []
        
        h, w = img.shape[0], img.shape[1]  # 高和宽
        
        # 转换为RGB格式并确保是连续数组
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_rgb = np.ascontiguousarray(img_rgb)
        
        # 将RGB图像输入模型，获取关键点预测结果
        results = pose.process(img_rgb)
        
        keypoints_indices = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]  # 定义要输出的关键点索引
        keypoints = [None] * 33
        keypoints_data = []  # 创建一个空列表来存储关键点数据
        
        if results.pose_landmarks:
            # 只在需要绘制时绘制关键点
            if draw:
                mp_drawing.draw_landmarks(img, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                
            # 收集关键点数据
            for index in keypoints_indices:
                x = results.pose_landmarks.landmark[index].x
                y = results.pose_landmarks.landmark[index].y
                z = results.pose_landmarks.landmark[index].z
                keypoints_data.append((x, y, z))
                
                if draw:
                    cx = int(x * w)
                    cy = int(y * h)
                    keypoints[index] = (cx, cy)
                    # 用较小的圆点标记视频帧中的关键点
                    cv2.circle(img, (cx, cy), keypoint_size, (0, 255, 0), -1)
        else:
            if draw:
                cv2.putText(img, VIDEO_FRAME_NO_PERSON_ERROR, (25, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        return img, keypoints_data
    
    except Exception as e:
        print(f"处理视频帧时出错: {e}")
        return img, []
