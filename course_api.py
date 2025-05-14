from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os
import time
import uuid
from datetime import datetime

# 创建蓝图
course_api = Blueprint('course_api', __name__)

# 数据文件路径
COURSES_DATA_FILE = 'data/courses.json'
ENROLLMENTS_DATA_FILE = 'data/enrollments.json'

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
        
# 辅助函数：加载报名数据
def load_enrollments_data():
    if not os.path.exists(ENROLLMENTS_DATA_FILE):
        return {"enrollments": []}
    
    try:
        with open(ENROLLMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"加载报名数据出错: {str(e)}")
        return {"enrollments": []}

# 辅助函数：保存报名数据
def save_enrollments_data(data):
    try:
        with open(ENROLLMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"保存报名数据出错: {str(e)}")
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

# API: 获取所有报名信息（管理员）
@course_api.route('/api/admin/enrollments', methods=['GET'])
@jwt_required()
def get_all_enrollments():
    try:
        # 检查是否为管理员
        current_user = get_jwt_identity()
        if not is_admin_user(current_user):
            return jsonify({
                'success': False,
                'message': "权限不足，只有管理员可以查看报名信息"
            }), 403
        
        # 加载报名数据
        enrollment_data = load_enrollments_data()
        enrollments = enrollment_data.get('enrollments', [])
        
        # 获取查询参数
        course_id = request.args.get('course_id')
        status = request.args.get('status')
        username = request.args.get('username')
        
        # 过滤数据
        if course_id:
            enrollments = [e for e in enrollments if e.get('course_id') == course_id]
        
        if status:
            enrollments = [e for e in enrollments if e.get('status') == status]
            
        if username:
            enrollments = [e for e in enrollments if e.get('user') and username.lower() in e.get('user').lower()]
        
        # 按报名日期降序排序
        enrollments = sorted(enrollments, key=lambda x: x.get('enrollment_date', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'data': enrollments
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"获取报名信息失败: {str(e)}"
        }), 500

# API: 获取课程的报名信息（管理员）
@course_api.route('/api/admin/courses/<course_id>/enrollments', methods=['GET'])
@jwt_required()
def get_course_enrollments(course_id):
    try:
        # 检查是否为管理员
        current_user = get_jwt_identity()
        if not is_admin_user(current_user):
            return jsonify({
                'success': False,
                'message': "权限不足，只有管理员可以查看报名信息"
            }), 403
        
        # 加载报名数据
        enrollment_data = load_enrollments_data()
        enrollments = enrollment_data.get('enrollments', [])
        
        # 过滤指定课程的报名信息
        course_enrollments = [e for e in enrollments if e.get('course_id') == course_id]
        
        # 按报名日期降序排序
        course_enrollments = sorted(course_enrollments, key=lambda x: x.get('enrollment_date', ''), reverse=True)
        
        # 获取课程信息
        courses_data = load_courses_data()
        courses = courses_data.get('courses', [])
        course = next((c for c in courses if c.get('id') == course_id), None)
        
        if not course:
            return jsonify({
                'success': False,
                'message': f"未找到ID为 {course_id} 的课程"
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'course': course,
                'enrollments': course_enrollments,
                'total_enrollments': len(course_enrollments)
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"获取课程报名信息失败: {str(e)}"
        }), 500

# API: 更新报名状态（管理员）
@course_api.route('/api/admin/enrollments/<enrollment_id>', methods=['PUT'])
@jwt_required()
def update_enrollment_status(enrollment_id):
    try:
        # 检查是否为管理员
        current_user = get_jwt_identity()
        if not is_admin_user(current_user):
            return jsonify({
                'success': False,
                'message': "权限不足，只有管理员可以更新报名状态"
            }), 403
        
        # 获取请求数据
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({
                'success': False,
                'message': "缺少状态参数"
            }), 400
        
        # 检查状态是否有效
        valid_statuses = ['已报名', '已付款', '已取消']
        if new_status not in valid_statuses:
            return jsonify({
                'success': False,
                'message': f"无效的状态值，必须是 {', '.join(valid_statuses)} 之一"
            }), 400
        
        # 加载报名数据
        enrollment_data = load_enrollments_data()
        enrollments = enrollment_data.get('enrollments', [])
        
        # 查找指定的报名记录
        enrollment_index = next((i for i, e in enumerate(enrollments) if e.get('id') == enrollment_id), None)
        
        if enrollment_index is None:
            return jsonify({
                'success': False,
                'message': f"未找到ID为 {enrollment_id} 的报名记录"
            }), 404
        
        # 更新状态
        enrollments[enrollment_index]['status'] = new_status
        enrollments[enrollment_index]['updated_at'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        enrollments[enrollment_index]['updated_by'] = username = current_user if isinstance(current_user, str) else current_user.get('username', 'admin')
        
        # 如果状态是已取消，需要更新课程的报名人数
        if new_status == '已取消':
            course_id = enrollments[enrollment_index].get('course_id')
            if course_id:
                courses_data = load_courses_data()
                courses = courses_data.get('courses', [])
                course_index = next((i for i, c in enumerate(courses) if c.get('id') == course_id), None)
                
                if course_index is not None and courses[course_index].get('current_participants', 0) > 0:
                    courses[course_index]['current_participants'] -= 1
                    
                    # 如果课程状态是已满，改为开放报名
                    if courses[course_index].get('status') == '已满':
                        courses[course_index]['status'] = '开放报名'
                    
                    save_courses_data(courses_data)
        
        # 保存数据
        if save_enrollments_data(enrollment_data):
            return jsonify({
                'success': True,
                'message': "报名状态更新成功",
                'data': enrollments[enrollment_index]
            })
        else:
            return jsonify({
                'success': False,
                'message': "保存报名数据失败"
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"更新报名状态失败: {str(e)}"
        }), 500

# API: 检查用户是否已报名课程
@course_api.route('/api/courses/<course_id>/check-enrollment', methods=['GET'])
@jwt_required()
def check_enrollment(course_id):
    try:
        # 获取当前用户身份
        current_user = get_jwt_identity()
        
        # 获取用户名
        username = current_user
        if isinstance(current_user, dict):
            username = current_user.get('username', 'unknown')
        
        # 加载报名数据
        enrollment_data = load_enrollments_data()
        enrollments = enrollment_data.get('enrollments', [])
        
        # 查找用户对该课程的报名记录
        user_enrollment = next((e for e in enrollments if e.get('course_id') == course_id and e.get('user') == username), None)
        
        if user_enrollment:
            return jsonify({
                'success': True,
                'enrolled': True,
                'enrollment': user_enrollment
            })
        else:
            return jsonify({
                'success': True,
                'enrolled': False
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"检查报名状态失败: {str(e)}"
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
        
        # 获取用户名
        username = current_user
        if isinstance(current_user, dict):
            username = current_user.get('username', 'unknown')
        
        # 创建报名记录
        enrollment_id = str(uuid.uuid4())
        enrollment_data = load_enrollments_data()
        
        new_enrollment = {
            "id": enrollment_id,
            "course_id": course_id,
            "course_title": course.get('title'),
            "user": username,
            "price": course.get('price'),
            "status": "已报名",  # 可能的状态：已报名、已付款、已取消
            "enrollment_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "payment_method": "线下付款"
        }
        
        enrollment_data['enrollments'].append(new_enrollment)
        
        # 保存数据
        courses_saved = save_courses_data(courses_data)
        enrollments_saved = save_enrollments_data(enrollment_data)
        
        if courses_saved and enrollments_saved:
            # 获取用户名
            username = current_user
            if isinstance(current_user, dict):
                username = current_user.get('username', 'unknown')
                
            return jsonify({
                'success': True,
                'message': "课程报名成功",
                'data': {
                    'enrollment_id': enrollment_id,
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
