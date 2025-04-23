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

# Initialize Flask app
app = Flask(__name__, static_folder='frontend/build')
CORS(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = 'wudao-zhi-ping-secret-key'  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
jwt = JWTManager(app)

# Ensure necessary directories exist
os.makedirs('uploads/images', exist_ok=True)
os.makedirs('uploads/videos', exist_ok=True)
os.makedirs('img', exist_ok=True)

# User data file
USER_DATA_FILE = 'users.json'

# Ensure user data file exists
if not os.path.exists(USER_DATA_FILE):
    with open(USER_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump({}, f)

# Utility functions
def hash_password(password):
    """Hash a password for storing."""
    return hashlib.sha256(password.encode()).hexdigest()

def get_current_time():
    """Get current time in ISO format."""
    from datetime import datetime
    return datetime.now().isoformat()

# Authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
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
    with open(USER_DATA_FILE, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    if username in users:
        return jsonify({'success': False, 'message': '用户名已存在'}), 400
    
    # Hash password and store user
    hashed_password = hash_password(password)
    users[username] = {
        'password': hashed_password,
        'created_at': get_current_time(),
        'last_login': None,
        'login_count': 0
    }
    
    with open(USER_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=4)
    
    # Create access token
    access_token = create_access_token(identity=username)
    
    return jsonify({
        'success': True, 
        'message': '注册成功',
        'access_token': access_token,
        'username': username
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    # Guest login
    if username == 'guest' and password == 'guest':
        access_token = create_access_token(identity='游客')
        return jsonify({
            'success': True,
            'message': '游客登录成功',
            'access_token': access_token,
            'username': '游客'
        }), 200
    
    # Regular login
    if not username or not password:
        return jsonify({'success': False, 'message': '用户名和密码不能为空'}), 400
    
    # Read user data
    with open(USER_DATA_FILE, 'r', encoding='utf-8') as f:
        users = json.load(f)
    
    # Check if user exists
    if username not in users:
        return jsonify({'success': False, 'message': '用户名或密码不正确'}), 401
    
    # Verify password
    hashed_password = hash_password(password)
    if users[username]['password'] != hashed_password:
        return jsonify({'success': False, 'message': '用户名或密码不正确'}), 401
    
    # Update login info
    users[username]['last_login'] = get_current_time()
    users[username]['login_count'] = users[username].get('login_count', 0) + 1
    
    with open(USER_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=4)
    
    # Create access token
    access_token = create_access_token(identity=username)
    
    return jsonify({
        'success': True,
        'message': '登录成功',
        'access_token': access_token,
        'username': username
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
    
    if file:
        # Save the uploaded image
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads/images', filename)
        file.save(filepath)
        
        try:
            # Analyze the image
            score, processed_img_path, feedback = web_model.analyze_martial_arts_image(filepath, posture)
            
            # 检查处理后的图像路径
            if processed_img_path and os.path.exists(processed_img_path):
                # Read the processed image and convert to base64
                with open(processed_img_path, 'rb') as img_file:
                    processed_img_base64 = base64.b64encode(img_file.read()).decode('utf-8')
            else:
                # 如果处理后的图像路径无效，使用原始图像
                with open(filepath, 'rb') as img_file:
                    processed_img_base64 = base64.b64encode(img_file.read()).decode('utf-8')
                print(f"警告: 使用原始图像代替处理后的图像，因为处理后的路径无效: {processed_img_path}")
            
            return jsonify({
                'success': True,
                'score': score,
                'processed_image': processed_img_base64,
                'feedback': feedback
            }), 200
            
        except Exception as e:
            return jsonify({'success': False, 'message': f'分析失败: {str(e)}'}), 500
    
    return jsonify({'success': False, 'message': '处理图像失败'}), 500

# 视频分析路由
@app.route('/api/analysis/video', methods=['POST'])
def analyze_video():
    if 'video' not in request.files or 'posture' not in request.form:
        return jsonify({'success': False, 'message': '缺少视频或姿势类型'}), 400
    
    file = request.files['video']
    posture = request.form['posture']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': '未选择文件'}), 400
    
    if file:
        # 确保上传目录存在
        os.makedirs('uploads/videos', exist_ok=True)
        
        # 保存上传的视频
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads/videos', filename)
        file.save(filepath)
        
        try:
            # 处理视频
            results = process_video(filepath, posture)
            
            if 'error' in results:
                return jsonify({'success': False, 'message': results['error']}), 500
            
            return jsonify({
                'success': True,
                'average_score': results['average_score'],
                'frame_scores': results['frame_scores'],
                'key_frames': results['key_frames'],
                'feedback': results['feedback']
            }), 200
            
        except Exception as e:
            return jsonify({'success': False, 'message': f'分析失败: {str(e)}'}), 500
    
    return jsonify({'success': False, 'message': '处理视频失败'}), 500

# Camera frame analysis route
@app.route('/api/analysis/camera-frame', methods=['POST'])
# 暂时移除JWT认证要求，便于测试
# @jwt_required()
def analyze_camera_frame():
    if 'image' not in request.files or 'posture' not in request.form:
        return jsonify({'success': False, 'message': '缺少图像或姿势类型'}), 400
    
    file = request.files['image']
    posture = request.form['posture']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': '未选择文件'}), 400
    
    if file:
        # Save the uploaded frame
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads/images', filename)
        file.save(filepath)
        
        try:
            # Read the image
            img = cv2.imread(filepath)
            if img is None:
                return jsonify({'success': False, 'message': '无法读取图像'}), 400
            
            # Process the frame
            processed_img, score, message = web_model.process_video_frame_for_web(img)
            
            # Save the processed image
            output_path = os.path.join("img", f"processed_{filename}")
            cv2.imwrite(output_path, processed_img)
            
            # Convert to base64
            with open(output_path, 'rb') as img_file:
                processed_img_base64 = base64.b64encode(img_file.read()).decode('utf-8')
            
            return jsonify({
                'success': True,
                'score': score,
                'message': message,
                'processed_image': processed_img_base64
            }), 200
            
        except Exception as e:
            return jsonify({'success': False, 'message': f'分析失败: {str(e)}'}), 500
    
    return jsonify({'success': False, 'message': '处理图像失败'}), 500

# Helper function to process video
def process_video(video_path, posture):
    """处理视频并返回分析结果"""
    results = {
        'average_score': 0,
        'frame_scores': [],
        'key_frames': [],
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
                processed_img, score, _ = web_model.process_video_frame_for_web(frame)
                
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
        
        return results
    
    except Exception as e:
        print(f"处理视频时出错: {e}")
        return {'error': str(e)}

# Serve frontend in production
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
