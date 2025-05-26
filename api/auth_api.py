"""
Authentication API routes
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json
import os
from utils.auth_utils import hash_password, get_current_time, get_user_data

# Create blueprint
auth_api = Blueprint('auth_api', __name__)

# Global variables to be set by main app
USERS_DATA_FILE = None


def init_auth_api(users_data_file):
    """Initialize the auth API with data file paths"""
    global USERS_DATA_FILE
    USERS_DATA_FILE = users_data_file


@auth_api.route('/api/auth/register', methods=['POST'])
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


@auth_api.route('/api/auth/login', methods=['POST'])
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


@auth_api.route('/api/auth/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    return jsonify({
        'success': True,
        'username': current_user
    }), 200
