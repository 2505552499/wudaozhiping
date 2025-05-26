"""
File handling utility functions
"""
import os
import json
from config.settings import ALLOWED_IMAGE_EXTENSIONS, ALLOWED_VIDEO_EXTENSIONS


def allowed_file(filename, allowed_extensions=None):
    """检查文件是否允许上传"""
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


def ensure_data_file_exists(file_path, default_content):
    """确保数据文件存在，如果不存在则创建默认内容"""
    if not os.path.exists(file_path):
        # 确保目录存在
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(default_content, f, ensure_ascii=False, indent=4)


def ensure_directories_exist(directories):
    """确保所有必要的目录存在"""
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
