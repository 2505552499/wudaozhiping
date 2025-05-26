"""
Authentication utility functions
"""
import hashlib
import json
import os
from datetime import datetime


def hash_password(password):
    """Hash a password for storing."""
    return hashlib.sha256(password.encode()).hexdigest()


def get_current_time():
    """Get current time in ISO format."""
    return datetime.now().isoformat()


def get_user_data(username, users_data_file):
    """从用户数据文件中获取特定用户的信息"""
    if not os.path.exists(users_data_file):
        return None

    try:
        with open(users_data_file, 'r', encoding='utf-8-sig') as f:
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
