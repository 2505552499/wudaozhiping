"""
Configuration settings for the martial arts coaching platform
"""
import os
from datetime import timedelta

# Flask configuration
class Config:
    # JWT Configuration
    JWT_SECRET_KEY = 'wudao-zhi-ping-secret-key'  # Change this in production
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Upload configuration
    UPLOAD_FOLDER = 'uploads'
    PROCESSED_FOLDER = 'img'
    
    # CORS origins
    CORS_ORIGINS = [
        "http://localhost:3001", 
        "https://wudao.250555.xyz", 
        "https://api.wudao.250555.xyz"
    ]
    
    # Static folder
    STATIC_FOLDER = 'frontend/build'

# File extensions
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'}

# Data file paths (will be set relative to app root)
def get_data_file_paths(app_root_path):
    """Get data file paths relative to app root"""
    return {
        'USERS_DATA_FILE': os.path.join(app_root_path, 'data', 'users.json'),
        'COACHES_DATA_FILE': os.path.join(app_root_path, 'data', 'coaches.json'),
        'APPOINTMENTS_DATA_FILE': os.path.join(app_root_path, 'data', 'appointments.json'),
        'MESSAGES_DATA_FILE': os.path.join(app_root_path, 'data', 'messages.json')
    }

# Directory structure to create
REQUIRED_DIRECTORIES = [
    'uploads/images',
    'uploads/videos', 
    'uploads/training_videos',
    'img',
    'data',
    'static/avatars'
]

# Pose data
AVAILABLE_POSES = [
    '弓步冲拳', '猛虎出洞', '五花坐山',
    '滚身冲拳', '猿猴纳肘', '马步推掌',
    '并步崩拳', '狮子张嘴', '马步扣床',
    '罗汉张掌'
]

# City and district data
CITIES = [
    "北京市", "上海市", "广州市", "深圳市", "天津市", "重庆市", "成都市", "杭州市", "武汉市", "西安市",
    "南京市", "郑州市", "长沙市", "济南市", "青岛市", "大连市", "宁波市", "厦门市", "福州市", "哈尔滨市"
]

DISTRICTS_MAP = {
    "北京市": ["海淀区", "朝阳区", "西城区", "东城区", "丰台区", "石景山区", "通州区", "顺义区"],
    "上海市": ["浦东新区", "黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区"],
    "广州市": ["天河区", "越秀区", "海珠区", "荔湾区", "白云区", "黄埔区", "番禺区", "花都区"],
    "深圳市": ["南山区", "福田区", "罗湖区", "盐田区", "龙岗区", "宝安区", "龙华区", "坪山区"],
    "郑州市": ["中原区", "二七区", "管城回族区", "金水区", "上街区", "惠济区", "郑东新区"]
}
