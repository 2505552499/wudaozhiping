from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import json
import hashlib
from datetime import timedelta
import cv2
import numpy as np
import base64
from werkzeug.utils import secure_filename

# Import project modules
import model
from coordinate_master import *
import web_model  # Import the new web_model module
import forum_api  # Import the forum API module
from payment_api import payment_api  # Import the payment API module
from course_api import course_api  # Import the course API module

# Initialize Flask app
app = Flask(__name__, static_folder='frontend/build')
CORS(app, resources={r"/*": {"origins": ["http://localhost:3001", "https://wudao.250555.xyz", "https://api.wudao.250555.xyz"], "supports_credentials": True}})

# Register blueprints
app.register_blueprint(payment_api)
app.register_blueprint(course_api)

# 配置静态文件路径
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['PROCESSED_FOLDER'] = 'img'

# 添加静态文件路由
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

@app.route('/img/<path:filename>')
def processed_file(filename):
    return send_from_directory('img', filename)

# Configure JWT
app.config['JWT_SECRET_KEY'] = 'wudao-zhi-ping-secret-key'  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
jwt = JWTManager(app)

# Ensure necessary directories exist
os.makedirs('uploads/images', exist_ok=True)
os.makedirs('uploads/videos', exist_ok=True)
os.makedirs('img', exist_ok=True)

# 允许的文件类型
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'}

# 检查文件是否允许上传
def allowed_file(filename, allowed_extensions=None):
    if allowed_extensions is None:
        allowed_extensions = {'png', 'jpg', 'jpeg'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def allowed_image_file(filename):
    """检查文件是否为允许的图像类型"""
    return allowed_file(filename, ALLOWED_IMAGE_EXTENSIONS)

def allowed_video_file(filename):
    """检查文件是否为允许的视频类型"""
    return allowed_file(filename, ALLOWED_VIDEO_EXTENSIONS)

# 用户数据文件
USERS_DATA_FILE = os.path.join(app.root_path, 'data', 'users.json')
COACHES_DATA_FILE = os.path.join(app.root_path, 'data', 'coaches.json')
APPOINTMENTS_DATA_FILE = os.path.join(app.root_path, 'data', 'appointments.json')

# Ensure user data file exists
if not os.path.exists(USERS_DATA_FILE):
    with open(USERS_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump({}, f)

# Ensure coaches data file exists
if not os.path.exists(COACHES_DATA_FILE):
    with open(COACHES_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump({
            "coaches": []
        }, f)

# Ensure appointments data file exists
if not os.path.exists(APPOINTMENTS_DATA_FILE):
    with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump({
            "appointments": []
        }, f)

# Utility functions
def hash_password(password):
    """Hash a password for storing."""
    return hashlib.sha256(password.encode()).hexdigest()

def get_current_time():
    """Get current time in ISO format."""
    from datetime import datetime
    return datetime.now().isoformat()

# 获取用户数据
def get_user_data(username):
    """从用户数据文件中获取特定用户的信息"""
    if not os.path.exists(USERS_DATA_FILE):
        return None
    
    try:
        with open(USERS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            users = json.load(f)
        
        # 检查users是否为字典类型（对象）
        if isinstance(users, dict):
            # 如果是字典，直接通过键获取用户数据
            if username in users:
                user_data = users[username]
                # 确保用户数据包含username字段
                if 'username' not in user_data:
                    user_data['username'] = username
                return user_data
        # 如果users是列表类型（数组）
        elif isinstance(users, list):
            # 如果是列表，遍历查找匹配的用户名
            for user in users:
                if isinstance(user, dict) and user.get('username') == username:
                    return user
        
        print(f"未找到用户: {username}")
        return None
    except Exception as e:
        print(f"获取用户数据失败: {str(e)}")
        return None

# Authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    role = data.get('role', 'user')  # 默认为普通用户，可以是'user'或'coach'
    
    # Validate input
    if not username or not password:
        return jsonify({'success': False, 'message': '用户名和密码不能为空'}), 400
    
    # Username validation
    if len(username) < 4 or len(username) > 20:
        return jsonify({'success': False, 'message': '用户名长度必须在4-20个字符之间'}), 400
    
    # Password validation
    if len(password) < 8:
        return jsonify({'success': False, 'message': '密码长度必须至少为8个字符'}), 400
    
    # Check if username already exists
    with open(USERS_DATA_FILE, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    if username in users:
        return jsonify({'success': False, 'message': '用户名已存在'}), 400
    
    # Hash password and store user
    hashed_password = hash_password(password)
    users[username] = {
        'password': hashed_password,
        'role': role,
        'created_at': get_current_time(),
        'last_login': None,
        'login_count': 0
    }
    
    with open(USERS_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=4)
    
    # Create access token
    access_token = create_access_token(identity=username)
    
    return jsonify({
        'success': True, 
        'message': '注册成功',
        'access_token': access_token,
        'username': username,
        'role': role
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    # Guest login
    if username == 'guest' and password == 'guest':
        access_token = create_access_token(identity='guest')
        return jsonify({
            'success': True,
            'message': '游客登录成功',
            'access_token': access_token,
            'username': 'guest',
            'role': 'user'
        }), 200
    
    # Regular login
    with open(USERS_DATA_FILE, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    if username not in users:
        return jsonify({'success': False, 'message': '用户名或密码错误'}), 401
    
    stored_password = users[username]['password']
    if hash_password(password) != stored_password:
        return jsonify({'success': False, 'message': '用户名或密码错误'}), 401
    
    # Update user login info
    users[username]['last_login'] = get_current_time()
    users[username]['login_count'] += 1
    
    with open(USERS_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=4)
    
    # Create access token
    access_token = create_access_token(identity=username)
    
    return jsonify({
        'success': True,
        'message': '登录成功',
        'access_token': access_token,
        'username': username,
        'role': users[username].get('role', 'user')  # 返回用户角色
    }), 200

@app.route('/api/auth/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    return jsonify({
        'success': True,
        'username': current_user
    }), 200

# Pose data routes
@app.route('/api/poses', methods=['GET'])
def get_poses():
    poses = [
        '弓步冲拳', '猛虎出洞', '五花坐山',
        '滚身冲拳', '猿猴纳肘', '马步推掌',
        '并步崩拳', '狮子张嘴', '马步扣床',
        '罗汉张掌'
    ]
    return jsonify({'success': True, 'poses': poses}), 200

@app.route('/api/angles/<pose_name>', methods=['GET'])
def get_angle_data(pose_name):
    """
    获取特定姿势的关节角度数据，用于可视化
    """
    # 习武者关节角度数据
    practitioner_angles = {
        '弓步冲拳': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 171.24},
            {'joint': '1-3 和 3-5夹角为', 'angle': 144.74},
            {'joint': '2-0 和 0-6夹角为', 'angle': 134.20},
            {'joint': '3-1 和 1-7夹角为', 'angle': 122.39},
            {'joint': '0-6 和 6-8夹角为', 'angle': 150.97},
            {'joint': '1-7 和 7-9夹角为', 'angle': 134.10},
            {'joint': '7-6 和 6-8夹角为', 'angle': 160.55},
            {'joint': '6-7 和 7-9夹角为', 'angle': 125.62},
            {'joint': '6-8 和 8-10夹角为', 'angle': 155.33},
            {'joint': '7-9 和 9-11夹角为', 'angle': 131.23}
        ],
        '猛虎出洞': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 165.32},
            {'joint': '1-3 和 3-5夹角为', 'angle': 163.45},
            {'joint': '2-0 和 0-6夹角为', 'angle': 140.21},
            {'joint': '3-1 和 1-7夹角为', 'angle': 142.67},
            {'joint': '0-6 和 6-8夹角为', 'angle': 155.78},
            {'joint': '1-7 和 7-9夹角为', 'angle': 156.90},
            {'joint': '7-6 和 6-8夹角为', 'angle': 145.23},
            {'joint': '6-7 和 7-9夹角为', 'angle': 146.78},
            {'joint': '6-8 和 8-10夹角为', 'angle': 160.45},
            {'joint': '7-9 和 9-11夹角为', 'angle': 159.87}
        ],
        '五花坐山': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 110.45},
            {'joint': '1-3 和 3-5夹角为', 'angle': 112.67},
            {'joint': '2-0 和 0-6夹角为', 'angle': 90.23},
            {'joint': '3-1 和 1-7夹角为', 'angle': 91.45},
            {'joint': '0-6 和 6-8夹角为', 'angle': 135.67},
            {'joint': '1-7 和 7-9夹角为', 'angle': 134.89},
            {'joint': '7-6 和 6-8夹角为', 'angle': 95.34},
            {'joint': '6-7 和 7-9夹角为', 'angle': 94.56},
            {'joint': '6-8 和 8-10夹角为', 'angle': 125.78},
            {'joint': '7-9 和 9-11夹角为', 'angle': 126.90}
        ]
    }
    
    # 传承人关节角度数据
    master_angles = {
        '弓步冲拳': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 155.60},
            {'joint': '1-3 和 3-5夹角为', 'angle': 159.79},
            {'joint': '2-0 和 0-6夹角为', 'angle': 115.97},
            {'joint': '3-1 和 1-7夹角为', 'angle': 68.88},
            {'joint': '0-6 和 6-8夹角为', 'angle': 151.87},
            {'joint': '1-7 和 7-9夹角为', 'angle': 176.27},
            {'joint': '7-6 和 6-8夹角为', 'angle': 134.59},
            {'joint': '6-7 和 7-9夹角为', 'angle': 135.88},
            {'joint': '6-8 和 8-10夹角为', 'angle': 150.69},
            {'joint': '7-9 和 9-11夹角为', 'angle': 162.30}
        ],
        '猛虎出洞': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 175.45},
            {'joint': '1-3 和 3-5夹角为', 'angle': 174.67},
            {'joint': '2-0 和 0-6夹角为', 'angle': 130.23},
            {'joint': '3-1 和 1-7夹角为', 'angle': 131.45},
            {'joint': '0-6 和 6-8夹角为', 'angle': 165.67},
            {'joint': '1-7 和 7-9夹角为', 'angle': 166.89},
            {'joint': '7-6 和 6-8夹角为', 'angle': 155.34},
            {'joint': '6-7 和 7-9夹角为', 'angle': 154.56},
            {'joint': '6-8 和 8-10夹角为', 'angle': 170.78},
            {'joint': '7-9 和 9-11夹角为', 'angle': 169.90}
        ],
        '五花坐山': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 90.45},
            {'joint': '1-3 和 3-5夹角为', 'angle': 92.67},
            {'joint': '2-0 和 0-6夹角为', 'angle': 95.23},
            {'joint': '3-1 和 1-7夹角为', 'angle': 96.45},
            {'joint': '0-6 和 6-8夹角为', 'angle': 125.67},
            {'joint': '1-7 和 7-9夹角为', 'angle': 124.89},
            {'joint': '7-6 和 6-8夹角为', 'angle': 90.34},
            {'joint': '6-7 和 7-9夹角为', 'angle': 89.56},
            {'joint': '6-8 和 8-10夹角为', 'angle': 135.78},
            {'joint': '7-9 和 9-11夹角为', 'angle': 136.90}
        ]
    }
    
    if pose_name in practitioner_angles and pose_name in master_angles:
        return jsonify({
            'success': True, 
            'practitioner_angles': practitioner_angles[pose_name],
            'master_angles': master_angles[pose_name]
        }), 200
    else:
        return jsonify({'success': False, 'message': '未找到该姿势的角度数据'}), 404

@app.route('/api/pose_keypoints/<pose_name>', methods=['GET'])
def get_pose_keypoints(pose_name):
    """
    获取特定姿势的关键点数据，用于可视化
    """
    # 传承人姿势关键点数据
    master_keypoints = {
        '弓步冲拳': {
            'keypoints': [
                [320, 100],  # 0: 鼻子
                [300, 130],  # 1: 左肩
                [340, 130],  # 2: 右肩
                [280, 180],  # 3: 左肘
                [360, 180],  # 4: 右肘
                [250, 230],  # 5: 左手腕
                [390, 230],  # 6: 右手腕
                [310, 220],  # 7: 左髋
                [330, 220],  # 8: 右髋
                [280, 320],  # 9: 左膝
                [380, 280],  # 10: 右膝
                [260, 420],  # 11: 左踝
                [380, 380]   # 12: 右踝
            ],
            'connections': [
                [0, 1], [0, 2],  # 鼻子到肩膀
                [1, 3], [2, 4],  # 肩膀到肘部
                [3, 5], [4, 6],  # 肘部到手腕
                [1, 7], [2, 8],  # 肩膀到髋部
                [7, 9], [8, 10], # 髋部到膝盖
                [9, 11], [10, 12] # 膝盖到踝部
            ]
        },
        '猛虎出洞': {
            'keypoints': [
                [320, 120],  # 0: 鼻子
                [290, 150],  # 1: 左肩
                [350, 150],  # 2: 右肩
                [240, 170],  # 3: 左肘
                [400, 170],  # 4: 右肘
                [200, 200],  # 5: 左手腕
                [440, 200],  # 6: 右手腕
                [310, 230],  # 7: 左髋
                [330, 230],  # 8: 右髋
                [290, 330],  # 9: 左膝
                [350, 330],  # 10: 右膝
                [290, 430],  # 11: 左踝
                [350, 430]   # 12: 右踝
            ],
            'connections': [
                [0, 1], [0, 2],  # 鼻子到肩膀
                [1, 3], [2, 4],  # 肩膀到肘部
                [3, 5], [4, 6],  # 肘部到手腕
                [1, 7], [2, 8],  # 肩膀到髋部
                [7, 9], [8, 10], # 髋部到膝盖
                [9, 11], [10, 12] # 膝盖到踝部
            ]
        },
        '五花坐山': {
            'keypoints': [
                [320, 100],  # 0: 鼻子
                [290, 130],  # 1: 左肩
                [350, 130],  # 2: 右肩
                [250, 180],  # 3: 左肘
                [390, 180],  # 4: 右肘
                [290, 230],  # 5: 左手腕
                [350, 230],  # 6: 右手腕
                [300, 220],  # 7: 左髋
                [340, 220],  # 8: 右髋
                [300, 280],  # 9: 左膝
                [340, 280],  # 10: 右膝
                [300, 320],  # 11: 左踝
                [340, 320]   # 12: 右踝
            ],
            'connections': [
                [0, 1], [0, 2],  # 鼻子到肩膀
                [1, 3], [2, 4],  # 肩膀到肘部
                [3, 5], [4, 6],  # 肘部到手腕
                [1, 7], [2, 8],  # 肩膀到髋部
                [7, 9], [8, 10], # 髋部到膝盖
                [9, 11], [10, 12] # 膝盖到踝部
            ]
        }
    }
    
    if pose_name in master_keypoints:
        return jsonify({
            'success': True, 
            'keypoints': master_keypoints[pose_name]
        }), 200
    else:
        return jsonify({'success': False, 'message': '未找到该姿势的关键点数据'}), 404

@app.route('/api/poses/<pose_name>', methods=['GET'])
def get_pose_details(pose_name):
    pose_details = {
        '弓步冲拳': {
            'name': '弓步冲拳',
            'description': '弓步冲拳是武术中最基本的招式之一，要求前腿弯曲，后腿伸直，上身挺直，拳头有力向前冲出。',
            'key_points': ['前腿膝盖应在脚尖上方', '拳头应与肩同高', '后腿需绷直', '重心应在前腿']
        },
        '猛虎出洞': {
            'name': '猛虎出洞',
            'description': '猛虎出洞是武术中的一种攻击招式，模仿猛虎出洞扑食的动作，要求双手成虎爪状，有力向前推出。',
            'key_points': ['虎爪五指张开，指尖用力', '手臂伸展有力', '步伐稳健有力', '身体重心保持稳定']
        },
        '五花坐山': {
            'name': '五花坐山',
            'description': '五花坐山是一种稳定的坐姿招式，上身保持挺直，手臂做五花环绕动作，下肢稳固盘坐。',
            'key_points': ['下肢稳固盘坐', '上身保持挺直', '手臂动作协调', '呼吸与动作结合']
        },
        # 添加其他招式的详细信息
    }
    
    if pose_name in pose_details:
        return jsonify({'success': True, 'pose': pose_details[pose_name]}), 200
    else:
        return jsonify({'success': False, 'message': '未找到该招式信息'}), 404

# Image analysis route
@app.route('/api/analysis/image', methods=['POST'])
def analyze_image():
    if 'image' not in request.files or 'posture' not in request.form:
        return jsonify({'success': False, 'message': '缺少图像或姿势类型'}), 400
    
    file = request.files['image']
    posture = request.form['posture']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': '未选择文件'}), 400
    
    if file and allowed_image_file(file.filename):
        try:
            # Save the uploaded file
            filename = secure_filename(file.filename)
            file_path = os.path.join('uploads/images', filename)
            file.save(file_path)
            
            # Analyze the image
            score, processed_img_path, feedback = web_model.analyze_martial_arts_image(file_path, posture)
            
            # 获取角度数据
            angle_data = web_model.get_angle_data_for_image(file_path, posture)
            
            # Return the analysis result
            return jsonify({
                'success': True,
                'score': round(score, 2),
                'image_path': processed_img_path.replace('\\', '/'),
                'feedback': feedback,
                'angle_data': angle_data
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': f'分析出错: {str(e)}'}), 500
    
    return jsonify({'success': False, 'message': '不支持的文件类型'}), 400

# Video analysis route
@app.route('/api/analysis/video', methods=['POST'])
def analyze_video():
    if 'video' not in request.files or 'posture' not in request.form:
        return jsonify({'success': False, 'message': '缺少视频或姿势类型'}), 400
    
    file = request.files['video']
    posture = request.form['posture']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': '未选择文件'}), 400
    
    if file and allowed_video_file(file.filename):
        try:
            # Save the uploaded file
            filename = secure_filename(file.filename)
            file_path = os.path.join('uploads/videos', filename)
            file.save(file_path)
            
            # Process the video
            result = process_video(file_path, posture)
            
            # 获取角度数据
            angle_data = result.get('angle_data', {})
            
            # Return the analysis result
            return jsonify({
                'success': True,
                'average_score': result.get('average_score', 0),
                'frame_scores': result.get('frame_scores', []),
                'key_frames': result.get('key_frames', []),
                'feedback': result.get('feedback', {}),
                'angle_data': angle_data
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': f'分析出错: {str(e)}'}), 500
    
    return jsonify({'success': False, 'message': '不支持的文件类型'}), 400

# Camera frame analysis route
@app.route('/api/analysis/camera', methods=['POST'])
@app.route('/api/analysis/camera-frame', methods=['POST'])  # 添加兼容旧版本的路由
def analyze_camera_frame():
    print("收到摄像头分析请求:", request.content_type)
    
    try:
        # 处理JSON格式请求
        if request.is_json:
            if 'image' not in request.json or 'posture' not in request.json:
                return jsonify({'success': False, 'message': '缺少图像数据或姿势类型'}), 400
            
            # Get base64 image and posture type
            image_data = request.json['image']
            posture = request.json['posture']
            print(f"接收到姿势类型: {posture}")
            
            # 确保image_data是base64格式
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            try:
                import io
                from PIL import Image, ImageDraw
                import numpy as np
                import base64
                import os
                import uuid
                import web_model
                
                print("开始处理摄像头图像...")
                
                # 解码base64图像并保存为临时文件
                image_bytes = base64.b64decode(image_data)
                temp_filename = f"temp_camera_{uuid.uuid4().hex}.jpg"
                temp_filepath = os.path.join('uploads/images', temp_filename)
                
                # 确保目录存在
                os.makedirs('uploads/images', exist_ok=True)
                print(f"保存临时文件到: {temp_filepath}")
                
                # 保存临时文件
                with open(temp_filepath, 'wb') as f:
                    f.write(image_bytes)
                
                print("调用 web_model.analyze_martial_arts_image 进行分析...")
                # 使用图片分析功能分析图像
                score, processed_img_path, feedback = web_model.analyze_martial_arts_image(temp_filepath, posture)
                print(f"分析结果: 得分={score}, 处理后图像路径={processed_img_path}")
                print(f"反馈: {feedback}")
                
                # 获取角度数据
                print("获取角度数据...")
                angle_data = web_model.get_angle_data_for_image(temp_filepath, posture)
                
                # 读取处理后的图像并转换为base64
                print("转换处理后的图像为base64...")
                with open(processed_img_path, 'rb') as img_file:
                    processed_img_bytes = img_file.read()
                    processed_img_base64 = base64.b64encode(processed_img_bytes).decode('utf-8')
                    # 添加base64 URL前缀
                    processed_img_base64 = f"data:image/jpeg;base64,{processed_img_base64}"
                
                # 清理临时文件
                try:
                    os.remove(temp_filepath)
                    print(f"已删除临时文件: {temp_filepath}")
                except Exception as e:
                    print(f"删除临时文件失败: {e}")
                
                # 返回分析结果
                print("返回分析结果...")
                return jsonify({
                    'success': True,
                    'message': '姿态分析完成',
                    'image': processed_img_base64,
                    'angles': angle_data,
                    'score': round(score, 1),
                    'level': feedback.get('level', ''),
                    'suggestions': feedback.get('suggestions', [])
                })
                
            except Exception as e:
                print(f"图像处理错误: {e}")
                import traceback
                traceback.print_exc()
                return jsonify({'success': False, 'message': f'图像处理错误: {str(e)}'}), 500
        
        # 处理表单数据请求
        else:
            return jsonify({'success': False, 'message': '不支持的请求格式，请使用JSON格式'}), 400
    
    except Exception as e:
        print(f"请求处理错误: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': f'请求处理错误: {str(e)}'}), 500

# Helper function to process video
def process_video(video_path, posture):
    """处理视频并返回分析结果"""
    results = {
        'average_score': 0,
        'frames': [],
        'feedback': {}
    }
    
    try:
        # Open the video file
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {'error': '无法打开视频文件'}
        
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Process every 10th frame to reduce computation
        frame_interval = max(1, int(fps / 2))  # Process 2 frames per second
        processed_frames = 0
        total_score = 0
        frame_scores = []
        key_frames = []
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Process only every frame_interval frames
            if processed_frames % frame_interval == 0:
                # Process the frame
                processed_img, score, _ = web_model.process_video_frame_for_web(frame, posture)
                
                # Save key frames (frames with significant scores)
                if score > 5:  # Save frames with score > 5
                    frame_filename = f"frame_{processed_frames}.jpg"
                    frame_path = os.path.join("img", frame_filename)
                    cv2.imwrite(frame_path, processed_img)
                    
                    # Convert to base64
                    with open(frame_path, 'rb') as img_file:
                        frame_base64 = base64.b64encode(img_file.read()).decode('utf-8')
                    
                    key_frames.append({
                        'frame': processed_frames,
                        'time': processed_frames / fps,
                        'score': score,
                        'image': frame_base64
                    })
                
                frame_scores.append({
                    'frame': processed_frames,
                    'time': processed_frames / fps,
                    'score': score
                })
                
                total_score += score
            
            processed_frames += 1
            
            # Limit to 100 frames for performance
            if processed_frames >= 300:
                break
        
        cap.release()
        
        # Calculate average score
        if len(frame_scores) > 0:
            results['average_score'] = total_score / len(frame_scores)
        
        # Sort key frames by score (highest first)
        key_frames.sort(key=lambda x: x['score'], reverse=True)
        
        # Limit to top 5 key frames
        results['key_frames'] = key_frames[:5]
        results['frame_scores'] = frame_scores
        
        # Generate overall feedback
        position_score = angle_score = stability_score = results['average_score']  # 简化处理，使用平均分
        results['feedback'] = web_model.generate_detailed_feedback(
            posture, 
            results['average_score'],
            position_score,
            angle_score,
            stability_score,
            [],  # 简化处理，不传入关键点数据
            [],  # 简化处理，不传入标准姿势数据
            []   # 简化处理，不传入角度数据
        )
        
        # 获取角度数据
        angle_data = web_model.get_angle_data_from_video(video_path, posture)
        results['angle_data'] = angle_data
        
        return results
    
    except Exception as e:
        print(f"处理视频时出错: {e}")
        return {'error': str(e)}

# Coaching appointment routes
@app.route('/api/coaches', methods=['GET'])
def get_coaches():
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
            
            # 只包含等于空字符串的user_id也算没有user_id
            coach_services = []
            for appointment in appointments_data.get('appointments', []):
                # 筛选出只有本地教练服务（空的或不存在的user_id）
                # 且是approved状态的预约
                user_id = appointment.get('user_id')
                if (user_id is None or user_id == '') and appointment.get('approval_status') == 'approved':
                    coach_services.append(appointment)
            
            print(f"DEBUG: 找到{len(coach_services)}个教练服务")
            
            # 不再按教练ID去重，允许同一教练有多个服务记录
            # 将教练服务转换为需要的格式
            coaches = []
            
            # 直接遍历每一条教练服务记录，生成教练对象
            for service in coach_services:
                coach_id = service.get('coach_id')
                if not coach_id:
                    continue  # 跳过没有教练ID的记录
                
                # 将技能字符串分割为数组
                skills = []
                if service.get('skill'):
                    # 首先将技能字符串按逗号分割
                    skills = [skill.strip() for skill in service.get('skill').split(',') if skill.strip()]
                
                # 处理位置信息
                location = service.get('location', '')
                city = location
                district = ''
                if ' ' in location:
                    parts = location.split(' ')
                    city = parts[0]
                    district = parts[1] if len(parts) > 1 else ''
                
                # 生成教练对象，使用服务ID+教练ID作为唯一标识符
                service_id = service.get('id', '')
                unique_id = f"{coach_id}_{service_id}"
                
                # 创建教练对象
                coach = {
                    'id': unique_id,  # 使用服务ID和教练ID的组合作为唯一标识
                    'coach_id': coach_id,  # 保留原始教练ID
                    'name': service.get('coach_name', ''),
                    'location': {
                        'city': city,
                        'districts': [district] if district else []
                    },
                    'skills': skills,
                    'price': service.get('price', 0),
                    'avatar': service.get('coach_avatar'),
                    'rating': 5.0,  # 默认评分
                    'description': service.get('notes', ''),
                    'phone': service.get('phone', ''),
                    'home_service': service.get('home_service', False),
                    'service_id': service_id  # 添加服务ID以便前端可以识别
                }
                coaches.append(coach)
            
            # 如果从预约中找不到教练数据，空列表不合适，回退到基本教练数据文件
            if not coaches:
                with open(COACHES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
                    coach_data = json.load(f)
                    if isinstance(coach_data, list):
                        coaches = coach_data
                    elif isinstance(coach_data, dict) and 'coaches' in coach_data:
                        coaches = coach_data['coaches']
                        
            print(f"DEBUG: 返回{len(coaches)}个教练信息")
            return jsonify({'coaches': coaches}), 200
    except Exception as e:
        print(f'获取教练列表失败: {str(e)}')
        return jsonify({'coaches': []}), 500

@app.route('/api/coaches/<coach_id>', methods=['GET'])
def get_coach(coach_id):
    """获取特定教练信息"""
    try:
        with open(COACHES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            coaches_data = json.load(f)
        
        # 处理直接是数组的情况
        if isinstance(coaches_data, list):
            coach = next((c for c in coaches_data if c['id'] == coach_id), None)
        # 处理有coaches键的情况
        else:
            coach = next((c for c in coaches_data.get('coaches', []) if c['id'] == coach_id), None)
        
        if coach:
            return jsonify(coach), 200
        else:
            return jsonify({'success': False, 'message': '教练不存在'}), 404
    except Exception as e:
        print(f'获取教练信息失败: {str(e)}')
        return jsonify({'success': False, 'message': f'获取教练信息失败: {str(e)}'}), 500

@app.route('/api/coaches/filter', methods=['GET'])
def filter_coaches():
    """根据条件筛选教练"""
    try:
        city = request.args.get('city', '')
        district = request.args.get('district', '')
        skill = request.args.get('skill', '')
        
        with open(COACHES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            coaches_data = json.load(f)
        
        # 处理直接是数组的情况
        if isinstance(coaches_data, list):
            filtered_coaches = coaches_data
        # 处理有coaches键的情况
        else:
            filtered_coaches = coaches_data.get('coaches', [])
        
        if city:
            filtered_coaches = [c for c in filtered_coaches if 'location' in c and 'city' in c['location'] and city in c['location']['city']]
        
        if district:
            filtered_coaches = [c for c in filtered_coaches if 'location' in c and 'districts' in c['location'] and district in c['location']['districts']]
        
        if skill:
            filtered_coaches = [c for c in filtered_coaches if 'skills' in c and skill in c['skills']]
        
        return jsonify({'coaches': filtered_coaches}), 200
    except Exception as e:
        print(f'筛选教练失败: {str(e)}')
        return jsonify({'success': False, 'message': f'筛选教练失败: {str(e)}'}), 500

@app.route('/api/user/appointments', methods=['GET'])
@jwt_required()
def get_user_appointments():
    """获取用户的所有预约"""
    current_user = get_jwt_identity()
    print(f"查询用户 {current_user} 的预约")
    
    try:
        if not os.path.exists(APPOINTMENTS_DATA_FILE):
            print(f"预约文件不存在: {APPOINTMENTS_DATA_FILE}")
            return jsonify({'appointments': []}), 200
            
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        if not isinstance(appointments_data, dict) or 'appointments' not in appointments_data:
            print("预约数据格式错误")
            return jsonify({'appointments': []}), 200
            
        # 返回该用户的所有预约，不论状态
        user_appointments = [a for a in appointments_data['appointments'] 
                           if a.get('user_id') == current_user]
                           
        print(f"找到用户 {current_user} 的 {len(user_appointments)} 条预约记录")
        return jsonify({'appointments': user_appointments}), 200
    except Exception as e:
        print(f"获取预约失败: {str(e)}")
        return jsonify({'success': False, 'message': f'获取预约失败: {str(e)}'}), 500

@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    """创建新预约"""
    current_user = get_jwt_identity()
    print(f"当前用户: {current_user}")
    
    # 检查用户是否是教练
    user_data = get_user_data(current_user)
    print(f"用户数据: {user_data}")
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    # 获取请求数据
    data = request.json
    print(f"请求数据: {data}")
    if not data:
        return jsonify({'success': False, 'message': '请求数据无效'}), 400
    
    try:
        # 验证教练是否存在
        with open(COACHES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            coaches_data = json.load(f)
        
        # 确保coaches_data是列表格式
        coaches_list = coaches_data if isinstance(coaches_data, list) else coaches_data.get('coaches', [])
        
        coach = next((c for c in coaches_list if c['id'] == data['coach_id']), None)
        if not coach:
            error_msg = f'教练不存在: {data["coach_id"]}'
            print(f"预约失败: {error_msg}")  # 添加日志
            return jsonify({'success': False, 'message': error_msg}), 404
        
        # 创建新预约
        try:
            # 确保appointments.json文件存在
            if not os.path.exists(APPOINTMENTS_DATA_FILE):
                with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump({"appointments": []}, f)
            
            with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
                appointments_data = json.load(f)
            
            # 确保appointments_data有正确的结构
            if 'appointments' not in appointments_data:
                appointments_data = {"appointments": []}
            
            new_appointment = {
                'id': str(len(appointments_data['appointments']) + 1),
                'user_id': current_user,
                'coach_id': data['coach_id'],
                'coach_name': coach['name'],
                'coach_avatar': coach['avatar'],
                'date': data['date'],
                'time': data['time'],
                'location': data['location'],
                'skill': data['skill'],
                'duration': data.get('duration', 1),  # 添加duration字段，默认为1小时
                'status': 'pending',
                'approval_status': 'pending',  # 添加approval_status字段，默认为pending
                'created_at': get_current_time()
            }
            
            appointments_data['appointments'].append(new_appointment)
            
            with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(appointments_data, f, indent=4)
            
            print(f"预约创建成功: {new_appointment}")  # 添加日志
            return jsonify({'success': True, 'message': '预约创建成功', 'appointment': new_appointment}), 201
        except Exception as e:
            error_msg = f'创建预约时出错: {str(e)}'
            print(f"预约失败: {error_msg}")  # 添加日志
            return jsonify({'success': False, 'message': error_msg}), 500
    except Exception as e:
        error_msg = f'创建预约失败: {str(e)}'
        print(f"预约失败: {error_msg}")  # 添加日志
        return jsonify({'success': False, 'message': error_msg}), 500

@app.route('/api/appointments/<appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    """更新预约状态"""
    current_user = get_jwt_identity()
    data = request.get_json()
    
    if 'status' not in data:
        return jsonify({'success': False, 'message': '缺少状态字段'}), 400
    
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        appointment = next((a for a in appointments_data['appointments'] if a['id'] == appointment_id), None)
        if not appointment:
            return jsonify({'success': False, 'message': '预约不存在'}), 404
        
        # 获取当前用户角色
        with open(USERS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            users_data = json.load(f)
        
        user_role = users_data.get(current_user, {}).get('role', 'user')
        
        # 检查权限：用户只能修改自己的预约，教练可以修改分配给自己的预约
        if user_role == 'coach':
            if appointment['coach_id'] != current_user:
                return jsonify({'success': False, 'message': '无权修改此预约，该预约不属于您'}), 403
        else:  # 普通用户
            if appointment['user_id'] != current_user:
                return jsonify({'success': False, 'message': '无权修改此预约'}), 403
        
        # 更新预约状态
        appointment['status'] = data['status']
        
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(appointments_data, f, indent=4)
        
        return jsonify({'success': True, 'message': '预约状态更新成功', 'appointment': appointment}), 200
    except Exception as e:
        print(f"更新预约失败: {str(e)}")  # 添加日志
        return jsonify({'success': False, 'message': f'更新预约失败: {str(e)}'}), 500

@app.route('/api/appointments/<appointment_id>', methods=['DELETE'])
@jwt_required()
def cancel_appointment(appointment_id):
    """取消预约"""
    current_user = get_jwt_identity()
    
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        appointment = next((a for a in appointments_data['appointments'] if a['id'] == appointment_id), None)
        if not appointment:
            return jsonify({'success': False, 'message': '预约不存在'}), 404
        
        if appointment['user_id'] != current_user:
            return jsonify({'success': False, 'message': '无权取消此预约'}), 403
        
        appointments_data['appointments'] = [a for a in appointments_data['appointments'] if a['id'] != appointment_id]
        
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(appointments_data, f, indent=4)
        
        return jsonify({'success': True, 'message': '预约取消成功'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'取消预约失败: {str(e)}'}), 500

@app.route('/api/cities', methods=['GET'])
def get_city_list():
    """获取支持的城市列表"""
    cities = [
        "北京市", "上海市", "广州市", "深圳市", "天津市", "重庆市", "成都市", "杭州市", "武汉市", "西安市",
        "南京市", "郑州市", "长沙市", "济南市", "青岛市", "大连市", "宁波市", "厦门市", "福州市", "哈尔滨市"
    ]
    return jsonify({'cities': cities}), 200

@app.route('/api/districts/<city>', methods=['GET'])
def get_district_list(city):
    """获取指定城市的区域列表"""
    districts_map = {
        "北京市": ["海淀区", "朝阳区", "西城区", "东城区", "丰台区", "石景山区", "通州区", "顺义区"],
        "上海市": ["浦东新区", "黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区"],
        "广州市": ["天河区", "越秀区", "海珠区", "荔湾区", "白云区", "黄埔区", "番禺区", "花都区"],
        "深圳市": ["南山区", "福田区", "罗湖区", "盐田区", "龙岗区", "宝安区", "龙华区", "坪山区"],
        "郑州市": ["中原区", "二七区", "管城回族区", "金水区", "上街区", "惠济区", "郑东新区"]
    }
    
    if city in districts_map:
        return jsonify({'districts': districts_map[city]}), 200
    else:
        # 如果没有特定城市的区域数据，返回空列表
        return jsonify({'districts': []}), 200

# 教练预约管理API
@app.route('/api/coach/appointments', methods=['GET'])
@jwt_required()
def get_coach_appointments():
    """获取教练的所有预约"""
    current_user = get_jwt_identity()
    
    # 验证用户是否为教练
    with open(USERS_DATA_FILE, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    if current_user not in users or users[current_user].get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权访问此资源'}), 403
    
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        coach_appointments = [a for a in appointments_data['appointments'] if a['coach_id'] == current_user]
        return jsonify({'success': True, 'appointments': coach_appointments}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'获取预约失败: {str(e)}'}), 500

# 消息系统API
@app.route('/api/messages', methods=['POST'])
@jwt_required()
def send_message():
    """发送消息"""
    current_user = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['receiver_id', 'content']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'message': f'缺少必要字段: {field}'}), 400
    
    try:
        # 确保消息数据文件存在
        MESSAGES_DATA_FILE = 'messages.json'
        if not os.path.exists(MESSAGES_DATA_FILE):
            with open(MESSAGES_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump({"messages": []}, f)
        
        # 读取现有消息
        with open(MESSAGES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            messages_data = json.load(f)
        
        # 创建新消息
        new_message = {
            'id': str(len(messages_data['messages']) + 1),
            'sender_id': current_user,
            'receiver_id': data['receiver_id'],
            'content': data['content'],
            'appointment_id': data.get('appointment_id'),
            'read': False,
            'created_at': get_current_time()
        }
        
        # 添加新消息
        messages_data['messages'].append(new_message)
        
        # 保存消息
        with open(MESSAGES_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(messages_data, f, indent=4)
        
        return jsonify({'success': True, 'message': '消息发送成功', 'data': new_message}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': f'发送消息失败: {str(e)}'}), 500

@app.route('/api/messages', methods=['GET'])
@jwt_required()
def get_messages():
    """获取用户的所有消息"""
    current_user = get_jwt_identity()
    
    try:
        # 确保消息数据文件存在
        MESSAGES_DATA_FILE = 'messages.json'
        if not os.path.exists(MESSAGES_DATA_FILE):
            with open(MESSAGES_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump({"messages": []}, f)
        
        # 读取消息
        with open(MESSAGES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            messages_data = json.load(f)
        
        # 获取与当前用户相关的所有消息（发送或接收）
        user_messages = [m for m in messages_data['messages'] 
                        if m['receiver_id'] == current_user or m['sender_id'] == current_user]
        
        return jsonify({'success': True, 'messages': user_messages}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'获取消息失败: {str(e)}'}), 500

@app.route('/api/messages/<message_id>/read', methods=['PUT'])
@jwt_required()
def mark_message_as_read(message_id):
    """标记消息为已读"""
    current_user = get_jwt_identity()
    
    try:
        # 确保消息数据文件存在
        MESSAGES_DATA_FILE = 'messages.json'
        if not os.path.exists(MESSAGES_DATA_FILE):
            return jsonify({'success': False, 'message': '消息不存在'}), 404
        
        # 读取消息
        with open(MESSAGES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            messages_data = json.load(f)
        
        # 查找指定消息
        message = next((m for m in messages_data['messages'] if m['id'] == message_id), None)
        if not message:
            return jsonify({'success': False, 'message': '消息不存在'}), 404
        
        # 验证消息接收者
        if message['receiver_id'] != current_user:
            return jsonify({'success': False, 'message': '无权操作此消息'}), 403
        
        # 标记为已读
        message['read'] = True
        
        # 保存消息
        with open(MESSAGES_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(messages_data, f, indent=4)
        
        return jsonify({'success': True, 'message': '消息已标记为已读'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'操作失败: {str(e)}'}), 500

# 获取教练个人资料
@app.route('/api/coach/profile', methods=['GET'])
@jwt_required()
def get_coach_profile():
    current_user = get_jwt_identity()
    
    # 检查用户是否是教练
    user_data = get_user_data(current_user)
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    # 从coaches.json文件中读取教练信息
    coaches_file = os.path.join(app.root_path, 'data', 'coaches.json')
    if os.path.exists(coaches_file):
        try:
            with open(coaches_file, 'r', encoding='utf-8-sig') as f:
                coaches = json.load(f)
                
            # 查找当前教练的资料
            coach_profile = None
            for coach in coaches:
                if coach.get('id') == current_user:
                    coach_profile = coach
                    break
            
            if coach_profile:
                return jsonify({
                    'success': True,
                    'profile': coach_profile
                })
        
        except json.JSONDecodeError:
            # 如果文件为空或格式不正确，初始化为空列表
            coaches = []
    
    # 如果没有找到教练资料或文件不存在，返回默认资料
    default_profile = {
        'id': current_user,
        'name': user_data.get('username', ''),
        'gender': 'male',
        'avatar': None,
        'location': {
            'city': '',
            'districts': []
        },
        'school': '',
        'technical_level': '',
        'certification': '',
        'skills': [],
        'description': '',
        'price': 0,
        'rating': 5.0
    }
    
    return jsonify({
        'success': True,
        'profile': default_profile
    })

# 更新教练个人资料
@app.route('/api/coach/profile', methods=['PUT'])
@jwt_required()
def update_coach_profile():
    current_user = get_jwt_identity()
    print(f"当前用户: {current_user}")
    
    # 检查用户是否是教练
    user_data = get_user_data(current_user)
    print(f"用户数据: {user_data}")
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    # 获取请求数据
    data = request.json
    print(f"请求数据: {data}")
    if not data:
        return jsonify({'success': False, 'message': '请求数据无效'}), 400
    
    try:
        # 从coaches.json文件中读取教练信息
        coaches_file = os.path.join(app.root_path, 'data', 'coaches.json')
        coaches = []
        if os.path.exists(coaches_file):
            try:
                with open(coaches_file, 'r', encoding='utf-8-sig') as f:
                    content = f.read()
                    print(f"读取到的文件内容: {content}")
                    if content.strip():
                        coaches = json.loads(content)
                    else:
                        coaches = []
                print(f"读取到的教练数据: {coaches}")
            except json.JSONDecodeError as e:
                print(f"JSON解码错误: {str(e)}")
                coaches = []
            except Exception as e:
                print(f"读取文件错误: {str(e)}")
                coaches = []
        
        # 准备新的教练资料
        new_coach_data = {
            'id': current_user,
            'name': data.get('name', ''),
            'gender': data.get('gender', 'male'),
            'location': data.get('location', {'city': '', 'districts': []}),
            'school': data.get('school', ''),
            'technical_level': data.get('technical_level', ''),
            'certification': data.get('certification', ''),
            'skills': data.get('skills', []),
            'description': data.get('description', ''),
            'price': data.get('price', 0),
            'rating': 5.0,  # 默认评分
            'avatar': None  # 默认无头像
        }
        
        # 查找当前教练的资料
        coach_found = False
        for i, coach in enumerate(coaches):
            if coach.get('id') == current_user:
                # 保留原有的avatar字段
                if 'avatar' in coach and coach['avatar']:
                    new_coach_data['avatar'] = coach['avatar']
                # 更新教练资料
                coaches[i] = new_coach_data
                coach_found = True
                print(f"更新现有教练资料: {coaches[i]}")
                break
        
        # 如果没有找到教练资料，添加新的教练资料
        if not coach_found:
            coaches.append(new_coach_data)
            print(f"添加新教练资料: {new_coach_data}")
        
        # 确保目录存在
        os.makedirs(os.path.dirname(coaches_file), exist_ok=True)
        
        # 保存更新后的教练信息
        with open(coaches_file, 'w', encoding='utf-8') as f:
            json.dump(coaches, f, ensure_ascii=False, indent=4)
        print(f"保存成功: {coaches_file}")
        
        return jsonify({
            'success': True,
            'message': '教练资料更新成功'
        })
    except Exception as e:
        print(f"保存失败: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'保存失败: {str(e)}'
        }), 500

# 上传教练头像
@app.route('/api/coach/avatar', methods=['POST'])
@jwt_required()
def upload_coach_avatar():
    current_user = get_jwt_identity()
    
    # 检查用户是否是教练
    user_data = get_user_data(current_user)
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    # 检查是否有文件上传
    if 'avatar' not in request.files:
        return jsonify({'success': False, 'message': '没有上传文件'}), 400
    
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({'success': False, 'message': '没有选择文件'}), 400
    
    # 检查文件类型
    if not allowed_file(file.filename, {'png', 'jpg', 'jpeg', 'gif'}):
        return jsonify({'success': False, 'message': '不支持的文件类型'}), 400
    
    # 保存文件
    filename = secure_filename(f"{current_user}_{int(time.time())}.{file.filename.rsplit('.', 1)[1].lower()}")
    avatar_dir = os.path.join(app.root_path, 'static', 'avatars')
    os.makedirs(avatar_dir, exist_ok=True)
    
    file_path = os.path.join(avatar_dir, filename)
    file.save(file_path)
    
    # 更新教练资料中的头像URL
    avatar_url = f"/static/avatars/{filename}"
    
    # 从coaches.json文件中读取教练信息
    coaches_file = os.path.join(app.root_path, 'data', 'coaches.json')
    coaches = []
    if os.path.exists(coaches_file):
        try:
            with open(coaches_file, 'r', encoding='utf-8-sig') as f:
                coaches = json.load(f)
        except json.JSONDecodeError:
            # 如果文件为空或格式不正确，初始化为空列表
            coaches = []
    
    # 更新教练头像
    coach_found = False
    for i, coach in enumerate(coaches):
        if coach.get('id') == current_user:
            coaches[i]['avatar'] = avatar_url
            coach_found = True
            break
    
    # 如果没有找到教练资料，添加新的教练资料
    if not coach_found:
        new_coach = {
            'id': current_user,
            'name': user_data.get('username', ''),
            'gender': 'male',
            'avatar': avatar_url,
            'location': {
                'city': '',
                'districts': []
            },
            'school': '',
            'technical_level': '',
            'certification': '',
            'skills': [],
            'description': '',
            'price': 0,
            'rating': 5.0
        }
        coaches.append(new_coach)
    
    # 保存更新后的教练信息
    os.makedirs(os.path.dirname(coaches_file), exist_ok=True)
    with open(coaches_file, 'w', encoding='utf-8') as f:
        json.dump(coaches, f, ensure_ascii=False, indent=4)
    
    return jsonify({
        'success': True,
        'message': '头像上传成功',
        'avatar_url': avatar_url
    })

# Admin appointment management routes
@app.route('/api/admin/appointments', methods=['GET'])
@jwt_required()
def get_pending_appointments():
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)
    
    # Check if user is admin
    if not user_data or user_data.get('role') != 'admin':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            appointments = data.get('appointments', [])
            
        # 返回教练发布的预约信息（使用多种条件识别）
        status = request.args.get('status', 'pending')  # pending, approved, rejected
        filtered_appointments = [
            apt for apt in appointments 
            if apt.get('approval_status', 'pending') == status and 
              # 教练发布的预约不应该有user_id（或为空），并且应该有coach_id
              (apt.get('type') == 'coach' or 
               (apt.get('user_id', '') == '' and apt.get('coach_id') is not None))
        ]
        
        return jsonify({
            'success': True,
            'appointments': filtered_appointments
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取预约列表失败: {str(e)}'
        }), 500

@app.route('/api/admin/appointments/<appointment_id>/review', methods=['POST'])
@jwt_required()
def review_appointment(appointment_id):
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)
    
    # Check if user is admin
    if not user_data or user_data.get('role') != 'admin':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    data = request.get_json()
    action = data.get('action')  # 'approve' or 'reject'
    reason = data.get('reason', '')  # Optional reason for rejection
    
    if action not in ['approve', 'reject']:
        return jsonify({'success': False, 'message': '无效的操作'}), 400
    
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            file_data = json.load(f)
            appointments = file_data.get('appointments', [])
        
        # Find and update the appointment
        for apt in appointments:
            if apt.get('id') == appointment_id:
                apt['approval_status'] = 'approved' if action == 'approve' else 'rejected'
                apt['review_time'] = get_current_time()
                apt['reviewed_by'] = current_user
                if action == 'reject' and reason:
                    apt['rejection_reason'] = reason
                break
        else:
            return jsonify({'success': False, 'message': '预约不存在'}), 404
        
        # Save the updated appointments
        file_data['appointments'] = appointments
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(file_data, f, ensure_ascii=False, indent=4)
        
        return jsonify({
            'success': True,
            'message': '预约审核完成'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'审核预约失败: {str(e)}'
        }), 500

@app.route('/api/appointments/user', methods=['GET'])
@jwt_required()
def get_user_appointments_detail():
    current_user = get_jwt_identity()
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            all_appointments = data.get('appointments', [])
            
            # Filter appointments for current user and only show approved ones
            user_appointments = [
                apt for apt in all_appointments 
                if apt.get('user_id') == current_user and
                apt.get('approval_status', 'pending') == 'approved'
            ]
            
            # Sort by creation date (newest first)
            user_appointments.sort(key=lambda x: x.get('created_at', ''), reverse=True)
            
            return jsonify({
                'success': True,
                'appointments': user_appointments
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取预约列表失败: {str(e)}'
        }), 500

# 管理员API - 获取待审核的预约列表
@app.route('/api/admin/appointments/pending', methods=['GET'])
@jwt_required()
def get_pending_appointments_list():
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)
    
    # 检查用户是否是管理员
    if not user_data or user_data.get('role') != 'admin':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            appointments = data.get('appointments', [])
            
        # 筛选待审核的预约
        pending_appointments = [
            apt for apt in appointments 
            if apt.get('approval_status', 'pending') == 'pending'
        ]
        
        # 按创建时间排序（最新的在前）
        pending_appointments.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'appointments': pending_appointments
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取待审核预约失败: {str(e)}'
        }), 500

# 管理员API - 审核预约
@app.route('/api/admin/appointments/<appointment_id>/review', methods=['POST'])
@jwt_required()
def review_appointment_status(appointment_id):
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)
    
    # 检查用户是否是管理员
    if not user_data or user_data.get('role') != 'admin':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    data = request.get_json()
    action = data.get('action')  # 'approve' 或 'reject'
    reason = data.get('reason', '')  # 可选的拒绝原因
    
    if action not in ['approve', 'reject']:
        return jsonify({'success': False, 'message': '无效的操作'}), 400
    
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            file_data = json.load(f)
            appointments = file_data.get('appointments', [])
        
        # 查找并更新预约
        for apt in appointments:
            if apt.get('id') == appointment_id:
                apt['approval_status'] = 'approved' if action == 'approve' else 'rejected'
                apt['review_time'] = get_current_time()
                apt['reviewed_by'] = current_user
                if action == 'reject' and reason:
                    apt['rejection_reason'] = reason
                break
        else:
            return jsonify({'success': False, 'message': '预约不存在'}), 404
        
        # 保存更新后的预约
        file_data['appointments'] = appointments
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(file_data, f, ensure_ascii=False, indent=4)
        
        return jsonify({
            'success': True,
            'message': '预约审核完成'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'审核预约失败: {str(e)}'
        }), 500

# 教练API - 获取自己创建的预约及其审核状态
@app.route('/api/coach/appointments/with_status', methods=['GET'])
@jwt_required()
def get_coach_appointments_with_status():
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)
    
    # 检查用户是否是教练
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            all_appointments = data.get('appointments', [])
            
        # 筛选当前教练创建的预约
        coach_appointments = [
            apt for apt in all_appointments 
            if apt.get('coach_id') == current_user
        ]
        
        # 按创建时间排序（最新的在前）
        coach_appointments.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'appointments': coach_appointments
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取预约列表失败: {str(e)}'
        }), 500

# 用户获取预约列表API
@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    try:
        current_user = get_jwt_identity()
        user_data = get_user_data(current_user)
        
        print(f"DEBUG: 用户身份: {current_user}, 角色: {user_data.get('role') if user_data else 'unknown'}")
        
        if not user_data:
            return jsonify({'success': False, 'message': '用户未登录'}), 401
        
        # 确保不管发生什么都能获取预约列表
        try:
            # 获取所有预约
            with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                all_appointments = data.get('appointments', [])
            
            user_appointments = []
            role = user_data.get('role', 'user')
            
            print(f"DEBUG: 找到{len(all_appointments)}条预约记录")
            print(f"DEBUG: 当前用户角色: {role}")
            
            # 用户角色决定获取的预约列表
            if role == 'admin':
                # 管理员可以查看所有预约
                user_appointments = all_appointments
            elif role == 'coach':
                # 教练只能看到自己的预约
                for apt in all_appointments:
                    if apt.get('coach_id') == current_user or apt.get('user_id') == current_user:
                        user_appointments.append(apt)
            else:
                # 普通用户的预约和所有可预约的教练
                # 1. 用户个人的预约
                personal_appointments = []
                for apt in all_appointments:
                    if apt.get('user_id') == current_user:
                        personal_appointments.append(apt)
                
                # 2. 所有已审核通过的教练预约
                approved_coach_appointments = []
                for apt in all_appointments:
                    if apt.get('approval_status') == 'approved':
                        approved_coach_appointments.append(apt)
                
                # 合并列表
                user_appointments = personal_appointments + approved_coach_appointments
                
                # 去除重复项
                unique_appointments = {}
                for item in user_appointments:
                    item_id = item.get('id')
                    if item_id and item_id not in unique_appointments:
                        unique_appointments[item_id] = item
                
                user_appointments = list(unique_appointments.values())
            
            # 按创建时间排序（最新的在前）
            user_appointments.sort(key=lambda x: x.get('created_at', ''), reverse=True)
            
            return jsonify({
                'success': True,
                'appointments': user_appointments
            })
        except Exception as e:
            print(f'DEBUG: 获取预约内部错误: {str(e)}')
            # 返回空列表而不是错误，确保前端不会崩溃
            return jsonify({
                'success': True,
                'appointments': [],
                'debug_message': f'获取预约列表异常: {str(e)}'
            })
    except Exception as e:
        print(f'DEBUG: 获取预约列表外部错误: {str(e)}')
        # 返回200而不是500，确保前端能正常处理
        return jsonify({
            'success': True,
            'appointments': [],
            'error': str(e)
        })

# 教练API - 创建预约信息
@app.route('/api/coach/create_appointment', methods=['POST'])
@jwt_required()
def create_coach_appointment():
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)
    
    # 检查用户是否是教练
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403
    
    data = request.get_json()
    
    # 检查必要字段
    required_fields = ['coach_name', 'phone', 'skill', 'location', 'price']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                'success': False,
                'message': f'缺少必要的字段: {field}'
            }), 400
    
    try:
        # 打开预约文件
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            file_data = json.load(f)
            appointments = file_data.get('appointments', [])
        
        # 生成唯一ID
        import uuid
        appointment_id = str(uuid.uuid4())
        
        # 创建新预约
        new_appointment = {
            'id': appointment_id,
            'coach_id': current_user,
            'coach_name': data.get('coach_name'),
            'phone': data.get('phone'),
            'skill': data.get('skill'),
            'location': data.get('location'),
            'price': data.get('price'),
            'home_service': data.get('home_service', False),
            'notes': data.get('notes', ''),
            'created_at': get_current_time(),
            'approval_status': 'pending',  # 初始状态为待审核
        }
        
        # 添加到预约文件
        appointments.append(new_appointment)
        file_data['appointments'] = appointments
        
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(file_data, f, ensure_ascii=False, indent=4)
        
        return jsonify({
            'success': True,
            'message': '预约信息发布成功，等待管理员审核',
            'appointment_id': appointment_id
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'发布预约失败: {str(e)}'
        }), 500

# 添加用户预约API端点
@app.route('/api/user/create_appointment', methods=['POST'])
@jwt_required()
def user_create_appointment():
    """普通用户创建预约"""
    current_user = get_jwt_identity()
    print(f"当前用户: {current_user}")
    
    # 检查用户是否存在
    user_data = get_user_data(current_user)
    print(f"用户数据: {user_data}")
    if not user_data:
        return jsonify({'success': False, 'message': '用户不存在'}), 404
    
    # 获取请求数据
    data = request.json
    print(f"请求数据: {data}")
    if not data:
        return jsonify({'success': False, 'message': '请求数据无效'}), 400
    
    try:
        # 尝试获取教练信息，但即使教练不存在也不会阻止预约创建
        coach_name = "未知教练"
        coach_avatar = None
        coach_location = {"city": "北京市", "districts": ["海淀区"]}
        
        try:
            with open(COACHES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
                coaches_data = json.load(f)
            
            # 确保coaches_data是列表格式
            coaches_list = coaches_data if isinstance(coaches_data, list) else coaches_data.get('coaches', [])
            
            coach = next((c for c in coaches_list if c['id'] == data['coach_id']), None)
            if coach:
                coach_name = coach['name']
                coach_avatar = coach.get('avatar')
                coach_location = coach.get('location', {"city": "北京市", "districts": ["海淀区"]})
            else:
                print(f"注意: 教练不存在: {data['coach_id']}, 但仍然允许创建预约")
        except Exception as e:
            print(f"警告: 获取教练信息时出错: {str(e)}, 但仍然允许创建预约")
        
        # 创建新预约
        try:
            # 确保appointments.json文件存在
            if not os.path.exists(APPOINTMENTS_DATA_FILE):
                with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump({"appointments": []}, f)
            
            with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
                appointments_data = json.load(f)
            
            # 确保appointments_data有正确的结构
            if 'appointments' not in appointments_data:
                appointments_data = {"appointments": []}
            
            # 生成唯一ID
            import uuid
            appointment_id = str(uuid.uuid4())
            
            # 使用默认位置或数据中提供的位置
            location = data.get('location')
            if not location and coach_location:
                try:
                    location = f"{coach_location['city']} {coach_location['districts'][0]}"
                except:
                    location = "未指定位置"
            
            new_appointment = {
                'id': appointment_id,
                'user_id': current_user,
                'coach_id': data['coach_id'],
                'coach_name': coach_name,
                'coach_avatar': coach_avatar,
                'date': data['date'],
                'time': data['time'],
                'location': location or "未指定位置",
                'skill': data.get('skill', ''),
                'duration': data.get('duration', 1),
                'status': 'pending',
                'payment_status': 'unpaid',  # 默认为未支付
                'created_at': get_current_time()
            }
            
            appointments_data['appointments'].append(new_appointment)
            
            with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(appointments_data, f, indent=4, ensure_ascii=False)
            
            print(f"用户预约创建成功: {new_appointment}")
            return jsonify({
                'success': True, 
                'message': '预约创建成功', 
                'appointment': new_appointment,
                'appointment_id': appointment_id  # 明确返回appointment_id字段
            }), 201
        except Exception as e:
            error_msg = f'创建预约时出错: {str(e)}'
            print(f"预约失败: {error_msg}")
            return jsonify({'success': False, 'message': error_msg}), 500
    except Exception as e:
        error_msg = f'创建预约失败: {str(e)}'
        print(f"预约失败: {error_msg}")
        return jsonify({'success': False, 'message': error_msg}), 500

# 管理员撤销教练预约API端点
@app.route('/api/admin/appointments/<appointment_id>/revoke', methods=['POST'])
@jwt_required()
def admin_revoke_appointment(appointment_id):
    """管理员撤销教练预约信息（软删除）"""
    current_user = get_jwt_identity()
    
    # 检查用户是否是管理员
    user_data = get_user_data(current_user)
    if not user_data or user_data.get('role') != 'admin':
        return jsonify({'success': False, 'message': '无权限访问此接口，仅管理员可操作'}), 403
    
    try:
        # 读取预约数据
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        # 查找要撤销的预约
        appointments = appointments_data.get('appointments', [])
        found = False
        revoked_appointment = None
        
        for appointment in appointments:
            if appointment.get('id') == appointment_id:
                found = True
                # 更改成撤销状态而不是删除
                appointment['approval_status'] = 'revoked'
                appointment['review_time'] = get_current_time()
                appointment['reviewed_by'] = current_user
                appointment['revoke_reason'] = '管理员撤销'
                revoked_appointment = appointment
                break
        
        if not found:
            return jsonify({'success': False, 'message': '未找到指定的预约信息'}), 404
        
        # 保存更新后的数据
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(appointments_data, f, ensure_ascii=False, indent=4)
        
        # 记录操作日志
        operation_log = {
            'operation': 'revoke_appointment',
            'user': current_user,
            'appointment_id': appointment_id,
            'timestamp': get_current_time(),
            'revoked_appointment': revoked_appointment
        }
        
        # 可以选择将操作日志保存到文件或数据库
        print(f"管理员撤销预约操作日志: {operation_log}")
        
        return jsonify({
            'success': True, 
            'message': '预约信息撤销成功',
            'revoked_appointment': revoked_appointment
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'撤销预约失败: {str(e)}'}), 500

# 管理员删除预约API端点
@app.route('/api/admin/appointments/<appointment_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_appointment(appointment_id):
    """管理员物理删除预约信息（真实删除）"""
    current_user = get_jwt_identity()
    
    # 检查用户是否是管理员
    user_data = get_user_data(current_user)
    if not user_data or user_data.get('role') != 'admin':
        return jsonify({'success': False, 'message': '无权限访问此接口，仅管理员可操作'}), 403
    
    try:
        # 读取预约数据
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        # 查找要删除的预约
        appointments = appointments_data.get('appointments', [])
        appointment_to_delete = None
        
        # 找到要删除的预约
        for i, appointment in enumerate(appointments):
            if appointment.get('id') == appointment_id:
                appointment_to_delete = appointment
                # 从预约列表中移除
                appointments.pop(i)
                break
        
        if not appointment_to_delete:
            return jsonify({'success': False, 'message': '未找到指定的预约信息'}), 404
        
        # 保存更新后的数据
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(appointments_data, f, ensure_ascii=False, indent=4)
        
        # 记录操作日志
        operation_log = {
            'operation': 'delete_appointment',
            'user': current_user,
            'appointment_id': appointment_id,
            'timestamp': get_current_time()
        }
        
        # 可以选择将操作日志保存到文件或数据库
        print(f"管理员删除预约操作日志: {operation_log}")
        
        return jsonify({
            'success': True, 
            'message': '预约信息删除成功'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'删除预约失败: {str(e)}'}), 500

# 教练查看自己发布的预约信息和审核状态
@app.route('/api/coach/published_appointments', methods=['GET'])
@jwt_required()
def get_coach_published_appointments():
    """Get published appointments and their approval status for a coach"""
    current_user = get_jwt_identity()
    
    # 检查用户是否是教练
    user_data = get_user_data(current_user)
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口，仅教练可操作'}), 403
    
    try:
        # 读取预约数据
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        # 筛选出该教练发布的预约信息（非用户预约的）
        coach_published_appointments = []
        for appointment in appointments_data.get('appointments', []):
            # 教练发布的预约将包含approval_status字段
            if appointment.get('coach_id') == current_user and 'approval_status' in appointment:
                coach_published_appointments.append(appointment)
        
        return jsonify({
            'success': True,
            'published_appointments': coach_published_appointments
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'获取发布预约信息失败: {str(e)}'}), 500

# 武友论坛API路由
@app.route('/api/forum/posts', methods=['GET'])
def api_get_forum_posts():
    return forum_api.get_posts()

@app.route('/api/forum/posts', methods=['POST'])
@jwt_required()
def api_create_forum_post():
    return forum_api.create_post()

@app.route('/api/forum/posts/pending', methods=['GET'])
@jwt_required()
def api_get_pending_forum_posts():
    return forum_api.get_pending_posts()

@app.route('/api/forum/posts/user', methods=['GET'])
@jwt_required()
def api_get_user_forum_posts():
    return forum_api.get_user_posts()

@app.route('/api/forum/posts/<post_id>', methods=['GET'])
def api_get_forum_post_detail(post_id):
    return forum_api.get_post_detail(post_id)

@app.route('/api/forum/posts/<post_id>/review', methods=['POST'])
@jwt_required()
def api_review_forum_post(post_id):
    return forum_api.review_post(post_id)

@app.route('/api/forum/posts/<post_id>/comments', methods=['POST'])
@jwt_required()
def api_add_forum_comment(post_id):
    return forum_api.add_comment(post_id)

@app.route('/api/forum/posts/<post_id>/like', methods=['POST'])
@jwt_required()
def api_like_forum_post(post_id):
    return forum_api.like_post(post_id)

@app.route('/api/forum/comments/<comment_id>/like', methods=['POST'])
@jwt_required()
def api_like_forum_comment(comment_id):
    return forum_api.like_comment(comment_id)

# Serve frontend in production
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
