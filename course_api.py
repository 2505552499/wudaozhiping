from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os
import time
import uuid
from datetime import datetime

# 创建蓝图
course_api = Blueprint('course_api', __name__)

# 课程数据文件路径
COURSES_DATA_FILE = 'data/courses.json'

# 辅助函数：加载课程数据
def load_courses_data():
    if not os.path.exists(COURSES_DATA_FILE):
        return {"courses": []}
    
    try:
        with open(COURSES_DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"加载课程数据出错: {str(e)}")
        return {"courses": []}

# 辅助函数：保存课程数据
def save_courses_data(data):
    try:
        with open(COURSES_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"保存课程数据出错: {str(e)}")
        return False

# 辅助函数：检查用户是否为管理员
def is_admin_user(current_user):
    # JWT认证可能返回的是字符串或字典，需要兼容处理
    if isinstance(current_user, dict):
        return current_user.get('is_admin', False)
    elif isinstance(current_user, str):
        # 如果是字符串，检查是否为管理员用户名
        return current_user == 'admin'
    return False

# API: 获取所有课程
@course_api.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        # 获取查询参数
        course_type = request.args.get('type')
        
        # 加载课程数据
        courses_data = load_courses_data()
        courses = courses_data.get('courses', [])
        
        # 如果指定了类型，进行过滤
        if course_type:
            courses = [course for course in courses if course.get('type') == course_type]
        
        return jsonify({
            'success': True,
            'data': courses
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"获取课程列表失败: {str(e)}"
        }), 500

# API: 获取课程详情
@course_api.route('/api/courses/<course_id>', methods=['GET'])
def get_course_detail(course_id):
    try:
        # 加载课程数据
        courses_data = load_courses_data()
        courses = courses_data.get('courses', [])
        
        # 查找指定ID的课程
        course = next((c for c in courses if c.get('id') == course_id), None)
        
        if not course:
            return jsonify({
                'success': False,
                'message': f"未找到ID为 {course_id} 的课程"
            }), 404
        
        return jsonify({
            'success': True,
            'data': course
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"获取课程详情失败: {str(e)}"
        }), 500

# API: 创建新课程（管理员）
@course_api.route('/api/admin/courses', methods=['POST'])
@jwt_required()
def create_course():
    try:
        # 获取当前用户身份
        current_user = get_jwt_identity()
        
        # 检查是否为管理员
        if not is_admin_user(current_user):
            return jsonify({
                'success': False,
                'message': "权限不足，只有管理员可以创建课程"
            }), 403
        
        # 获取请求数据
        data = request.json
        
        # 验证必填字段
        required_fields = ['title', 'type', 'price', 'duration', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f"缺少必填字段: {field}"
                }), 400
        
        # 加载课程数据
        courses_data = load_courses_data()
        
        # 创建新课程
        new_course = {
            'id': f"course_{uuid.uuid4().hex[:8]}",
            'title': data.get('title'),
            'type': data.get('type'),
            'price': data.get('price'),
            'duration': data.get('duration'),
            'date_range': data.get('date_range', ''),
            'description': data.get('description'),
            'content': data.get('content', []),
            'benefits': data.get('benefits', []),
            'target_audience': data.get('target_audience', ''),
            'daily_schedule': data.get('daily_schedule', []),
            'location': data.get('location', ''),
            'max_participants': data.get('max_participants', 30),
            'current_participants': 0,
            'status': '开放报名',
            'cover_image': data.get('cover_image', ''),
            'created_by': isinstance(current_user, str) and current_user or current_user.get('username', 'admin'),
            'created_at': datetime.now().isoformat()
        }
        
        # 添加新课程
        courses_data['courses'].append(new_course)
        
        # 保存数据
        if save_courses_data(courses_data):
            return jsonify({
                'success': True,
                'message': "课程创建成功",
                'data': new_course
            })
        else:
            return jsonify({
                'success': False,
                'message': "保存课程数据失败"
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"创建课程失败: {str(e)}"
        }), 500

# API: 更新课程（管理员）
@course_api.route('/api/admin/courses/<course_id>', methods=['PUT'])
@jwt_required()
def update_course(course_id):
    try:
        # 获取当前用户身份
        current_user = get_jwt_identity()
        
        # 检查是否为管理员
        if not is_admin_user(current_user):
            return jsonify({
                'success': False,
                'message': "权限不足，只有管理员可以更新课程"
            }), 403
        
        # 获取请求数据
        data = request.json
        
        # 加载课程数据
        courses_data = load_courses_data()
        courses = courses_data.get('courses', [])
        
        # 查找指定ID的课程
        course_index = next((i for i, c in enumerate(courses) if c.get('id') == course_id), None)
        
        if course_index is None:
            return jsonify({
                'success': False,
                'message': f"未找到ID为 {course_id} 的课程"
            }), 404
        
        # 更新课程信息
        for key, value in data.items():
            if key not in ['id', 'created_by', 'created_at']:  # 这些字段不允许更新
                courses[course_index][key] = value
        
        # 保存数据
        if save_courses_data(courses_data):
            return jsonify({
                'success': True,
                'message': "课程更新成功",
                'data': courses[course_index]
            })
        else:
            return jsonify({
                'success': False,
                'message': "保存课程数据失败"
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"更新课程失败: {str(e)}"
        }), 500

# API: 删除课程（管理员）
@course_api.route('/api/admin/courses/<course_id>', methods=['DELETE'])
@jwt_required()
def delete_course(course_id):
    try:
        # 获取当前用户身份
        current_user = get_jwt_identity()
        
        # 检查是否为管理员
        if not is_admin_user(current_user):
            return jsonify({
                'success': False,
                'message': "权限不足，只有管理员可以删除课程"
            }), 403
        
        # 加载课程数据
        courses_data = load_courses_data()
        courses = courses_data.get('courses', [])
        
        # 查找指定ID的课程
        course_index = next((i for i, c in enumerate(courses) if c.get('id') == course_id), None)
        
        if course_index is None:
            return jsonify({
                'success': False,
                'message': f"未找到ID为 {course_id} 的课程"
            }), 404
        
        # 删除课程
        deleted_course = courses.pop(course_index)
        
        # 保存数据
        if save_courses_data(courses_data):
            return jsonify({
                'success': True,
                'message': "课程删除成功",
                'data': deleted_course
            })
        else:
            return jsonify({
                'success': False,
                'message': "保存课程数据失败"
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"删除课程失败: {str(e)}"
        }), 500

# API: 报名课程
@course_api.route('/api/courses/<course_id>/enroll', methods=['POST'])
@jwt_required()
def enroll_course(course_id):
    try:
        # 获取当前用户身份
        current_user = get_jwt_identity()
        
        # 加载课程数据
        courses_data = load_courses_data()
        courses = courses_data.get('courses', [])
        
        # 查找指定ID的课程
        course_index = next((i for i, c in enumerate(courses) if c.get('id') == course_id), None)
        
        if course_index is None:
            return jsonify({
                'success': False,
                'message': f"未找到ID为 {course_id} 的课程"
            }), 404
        
        course = courses[course_index]
        
        # 检查课程状态
        if course.get('status') != '开放报名':
            return jsonify({
                'success': False,
                'message': "该课程当前不接受报名"
            }), 400
        
        # 检查是否已满
        if course.get('current_participants', 0) >= course.get('max_participants', 30):
            return jsonify({
                'success': False,
                'message': "该课程报名人数已满"
            }), 400
        
        # 增加报名人数
        courses[course_index]['current_participants'] += 1
        
        # 如果报名人数达到上限，更新状态
        if courses[course_index]['current_participants'] >= courses[course_index]['max_participants']:
            courses[course_index]['status'] = '已满'
        
        # 保存数据
        if save_courses_data(courses_data):
            # 获取用户名
            username = current_user
            if isinstance(current_user, dict):
                username = current_user.get('username', 'unknown')
                
            return jsonify({
                'success': True,
                'message': "课程报名成功",
                'data': {
                    'course_id': course_id,
                    'course_title': course.get('title'),
                    'price': course.get('price'),
                    'user': username
                }
            })
        else:
            return jsonify({
                'success': False,
                'message': "保存课程数据失败"
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"课程报名失败: {str(e)}"
        }), 500
