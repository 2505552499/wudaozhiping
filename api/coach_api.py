"""
Coach management API routes
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os
import uuid
from utils.auth_utils import get_user_data, get_current_time

# Create blueprint
coach_api = Blueprint('coach_api', __name__)

# Global variables to be set by main app
USERS_DATA_FILE = None
COACHES_DATA_FILE = None
APPOINTMENTS_DATA_FILE = None


def init_coach_api(users_data_file, coaches_data_file, appointments_data_file):
    """Initialize the coach API with data file paths"""
    global USERS_DATA_FILE, COACHES_DATA_FILE, APPOINTMENTS_DATA_FILE
    USERS_DATA_FILE = users_data_file
    COACHES_DATA_FILE = coaches_data_file
    APPOINTMENTS_DATA_FILE = appointments_data_file


@coach_api.route('/api/coach/appointments', methods=['GET'])
@jwt_required()
def get_coach_appointments():
    """获取教练的所有预约"""
    current_user = get_jwt_identity()

    # 验证用户是否为教练
    user_data = get_user_data(current_user, USERS_DATA_FILE)
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权访问此资源'}), 403

    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)

        coach_appointments = [a for a in appointments_data['appointments'] if a['coach_id'] == current_user]
        return jsonify({'success': True, 'appointments': coach_appointments}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'获取预约失败: {str(e)}'}), 500


@coach_api.route('/api/coach/appointments/with_status', methods=['GET'])
@jwt_required()
def get_coach_appointments_with_status():
    """获取教练的所有预约及其状态"""
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user, USERS_DATA_FILE)

    # 检查用户是否是教练
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403

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


@coach_api.route('/api/coach/published_appointments', methods=['GET'])
@jwt_required()
def get_coach_published_appointments():
    """Get published appointments and their approval status for a coach"""
    current_user = get_jwt_identity()

    # 检查用户是否是教练
    user_data = get_user_data(current_user, USERS_DATA_FILE)
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


@coach_api.route('/api/coach/create_appointment', methods=['POST'])
@jwt_required()
def create_coach_appointment():
    """教练创建预约信息"""
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user, USERS_DATA_FILE)

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

        # 添加到预约列表
        appointments.append(new_appointment)
        file_data['appointments'] = appointments

        # 保存到文件
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(file_data, f, ensure_ascii=False, indent=4)

        return jsonify({
            'success': True,
            'message': '预约信息创建成功，等待管理员审核',
            'appointment': new_appointment
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'创建预约信息失败: {str(e)}'
        }), 500


@coach_api.route('/api/coach/profile', methods=['GET'])
@jwt_required()
def get_coach_profile():
    """获取教练个人资料"""
    current_user = get_jwt_identity()

    # 检查用户是否是教练
    user_data = get_user_data(current_user, USERS_DATA_FILE)
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403

    # 从coaches.json文件中读取教练信息
    if os.path.exists(COACHES_DATA_FILE):
        try:
            with open(COACHES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
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


@coach_api.route('/api/coach/profile', methods=['PUT'])
@jwt_required()
def update_coach_profile():
    """更新教练个人资料"""
    current_user = get_jwt_identity()

    # 检查用户是否是教练
    user_data = get_user_data(current_user, USERS_DATA_FILE)
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403

    # 获取请求数据
    data = request.json
    if not data:
        return jsonify({'success': False, 'message': '请求数据无效'}), 400

    try:
        # 从coaches.json文件中读取教练信息
        coaches = []
        if os.path.exists(COACHES_DATA_FILE):
            try:
                with open(COACHES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
                    content = f.read()
                    if content.strip():
                        coaches = json.loads(content)
                    else:
                        coaches = []
            except json.JSONDecodeError:
                coaches = []
            except Exception:
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
                break

        # 如果没有找到教练资料，添加新的教练资料
        if not coach_found:
            coaches.append(new_coach_data)

        # 确保目录存在
        os.makedirs(os.path.dirname(COACHES_DATA_FILE), exist_ok=True)

        # 保存更新后的教练信息
        with open(COACHES_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(coaches, f, ensure_ascii=False, indent=4)

        return jsonify({
            'success': True,
            'message': '教练资料更新成功'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'保存失败: {str(e)}'
        }), 500
