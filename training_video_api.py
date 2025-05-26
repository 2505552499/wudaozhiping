from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os
import time
import uuid
from werkzeug.utils import secure_filename

# 创建训练视频API蓝图
training_video_api = Blueprint('training_video_api', __name__)

# 数据文件路径
APPOINTMENTS_DATA_FILE = 'data/appointments.json'
TRAINING_VIDEOS_FILE = 'data/training_videos.json'
ANNOTATIONS_FILE = 'annotations.json'
USERS_DATA_FILE = 'data/users.json'

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

# 允许的视频文件类型
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'}

def allowed_video_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_VIDEO_EXTENSIONS

# 获取训练视频数据
def get_training_videos_data():
    if not os.path.exists(TRAINING_VIDEOS_FILE):
        with open(TRAINING_VIDEOS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)
        return []

    try:
        with open(TRAINING_VIDEOS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"读取训练视频数据错误: {e}")
        return []

# 保存训练视频数据
def save_training_videos_data(data):
    try:
        os.makedirs(os.path.dirname(TRAINING_VIDEOS_FILE), exist_ok=True)
        with open(TRAINING_VIDEOS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"保存训练视频数据错误: {e}")
        return False

# 获取预约数据
def get_appointments_data():
    try:
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"读取预约数据错误: {e}")
        return {'appointments': []}

# 保存预约数据
def save_appointments_data(data):
    try:
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"保存预约数据错误: {e}")
        return False

# 获取标注数据
def get_annotations_data():
    if not os.path.exists(ANNOTATIONS_FILE):
        with open(ANNOTATIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)
        return []

    try:
        with open(ANNOTATIONS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"读取标注数据错误: {e}")
        return []

# 保存标注数据
def save_annotations_data(data):
    try:
        with open(ANNOTATIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"保存标注数据错误: {e}")
        return False

@training_video_api.route('/api/training-videos/upload/<appointment_id>', methods=['POST'])
@jwt_required()
def upload_training_video(appointment_id):
    """用户为预约上传训练视频"""
    current_user = get_jwt_identity()

    # 检查是否有文件上传
    if 'video' not in request.files:
        return jsonify({'success': False, 'message': '没有上传视频文件'}), 400

    file = request.files['video']
    if file.filename == '':
        return jsonify({'success': False, 'message': '没有选择文件'}), 400

    # 检查文件类型
    if not allowed_video_file(file.filename):
        return jsonify({'success': False, 'message': '不支持的视频文件类型'}), 400

    try:
        # 验证预约是否存在且属于当前用户
        appointments_data = get_appointments_data()
        appointment = None
        for apt in appointments_data.get('appointments', []):
            if apt.get('id') == appointment_id and apt.get('user_id') == current_user:
                appointment = apt
                break

        if not appointment:
            return jsonify({'success': False, 'message': '预约不存在或无权限'}), 404

        # 检查预约状态（只有已确认或已完成的预约才能上传视频）
        # 暂时允许pending状态用于测试
        if appointment.get('status') not in ['confirmed', 'completed', 'pending']:
            return jsonify({'success': False, 'message': '只有已确认或已完成的预约才能上传训练视频'}), 400

        # 保存视频文件
        filename = secure_filename(file.filename)
        # 生成唯一文件名
        if '.' in filename:
            file_extension = filename.rsplit('.', 1)[1].lower()
        else:
            file_extension = 'mp4'  # 默认扩展名
        unique_filename = f"training_{appointment_id}_{int(time.time())}.{file_extension}"

        # 确保上传目录存在
        upload_dir = 'uploads/training_videos'
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)

        # 获取视频描述
        description = request.form.get('description', '')

        # 创建训练视频记录
        training_videos = get_training_videos_data()

        video_record = {
            'id': str(uuid.uuid4()),
            'appointment_id': appointment_id,
            'user_id': current_user,
            'coach_id': appointment.get('coach_id'),
            'filename': unique_filename,
            'original_filename': filename,
            'file_path': file_path,
            'description': description,
            'upload_time': int(time.time()),
            'annotation_status': 'pending',  # pending, annotated, published
            'coach_score': None,
            'coach_feedback': '',
            'annotation_published': False
        }

        training_videos.append(video_record)

        if save_training_videos_data(training_videos):
            return jsonify({
                'success': True,
                'message': '训练视频上传成功',
                'video_id': video_record['id']
            })
        else:
            # 删除已上传的文件
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'success': False, 'message': '保存视频记录失败'}), 500

    except Exception as e:
        print(f"上传训练视频错误: {e}")
        return jsonify({'success': False, 'message': f'上传失败: {str(e)}'}), 500

@training_video_api.route('/api/training-videos/appointment/<appointment_id>', methods=['GET'])
@jwt_required()
def get_appointment_training_videos(appointment_id):
    """获取预约的训练视频列表"""
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)

    try:
        # 验证预约权限
        appointments_data = get_appointments_data()
        appointment = None
        for apt in appointments_data.get('appointments', []):
            if apt.get('id') == appointment_id:
                appointment = apt
                break

        if not appointment:
            return jsonify({'success': False, 'message': '预约不存在'}), 404

        # 检查权限：用户本人或教练
        if (appointment.get('user_id') != current_user and
            appointment.get('coach_id') != current_user):
            return jsonify({'success': False, 'message': '无权限查看此预约的训练视频'}), 403

        # 获取训练视频
        training_videos = get_training_videos_data()
        appointment_videos = [
            video for video in training_videos
            if video.get('appointment_id') == appointment_id
        ]

        # 根据用户角色过滤信息
        if user_data and user_data.get('role') == 'coach':
            # 教练可以看到所有信息
            pass
        else:
            # 普通用户只能看到已发布的标注
            for video in appointment_videos:
                if not video.get('annotation_published', False):
                    video['coach_score'] = None
                    video['coach_feedback'] = ''

        return jsonify({
            'success': True,
            'videos': appointment_videos,
            'appointment': appointment
        })

    except Exception as e:
        print(f"获取训练视频错误: {e}")
        return jsonify({'success': False, 'message': f'获取失败: {str(e)}'}), 500

@training_video_api.route('/api/training-videos/coach/pending', methods=['GET'])
@jwt_required()
def get_coach_pending_videos():
    """教练获取待标注的训练视频"""
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)

    # 检查是否是教练
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403

    try:
        training_videos = get_training_videos_data()

        # 获取该教练的待标注视频
        pending_videos = [
            video for video in training_videos
            if (video.get('coach_id') == current_user and
                video.get('annotation_status') == 'pending')
        ]

        # 获取相关预约信息
        appointments_data = get_appointments_data()
        appointments_dict = {
            apt.get('id'): apt for apt in appointments_data.get('appointments', [])
        }

        # 为每个视频添加预约信息
        for video in pending_videos:
            appointment_id = video.get('appointment_id')
            if appointment_id in appointments_dict:
                video['appointment_info'] = appointments_dict[appointment_id]

        return jsonify({
            'success': True,
            'videos': pending_videos
        })

    except Exception as e:
        print(f"获取待标注视频错误: {e}")
        return jsonify({'success': False, 'message': f'获取失败: {str(e)}'}), 500

@training_video_api.route('/api/training-videos/coach/all', methods=['GET'])
@jwt_required()
def get_coach_all_videos():
    """教练获取所有相关的训练视频（包括待标注、已标注、已发布）"""
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)

    # 检查是否是教练
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403

    try:
        training_videos = get_training_videos_data()

        # 获取该教练的所有视频
        coach_videos = [
            video for video in training_videos
            if video.get('coach_id') == current_user
        ]

        # 获取相关预约信息
        appointments_data = get_appointments_data()
        appointments_dict = {
            apt.get('id'): apt for apt in appointments_data.get('appointments', [])
        }

        # 为每个视频添加预约信息
        for video in coach_videos:
            appointment_id = video.get('appointment_id')
            if appointment_id in appointments_dict:
                video['appointment_info'] = appointments_dict[appointment_id]

        # 按上传时间倒序排序
        coach_videos.sort(key=lambda x: x.get('upload_time', 0), reverse=True)

        return jsonify({
            'success': True,
            'videos': coach_videos
        })

    except Exception as e:
        print(f"获取教练视频错误: {e}")
        return jsonify({'success': False, 'message': f'获取失败: {str(e)}'}), 500

@training_video_api.route('/api/training-videos/<video_id>/annotate', methods=['POST'])
@jwt_required()
def save_video_annotation(video_id):
    """教练保存视频标注"""
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)

    # 检查是否是教练
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403

    try:
        data = request.get_json()

        # 验证视频是否存在且属于该教练
        training_videos = get_training_videos_data()
        video_index = -1
        for i, video in enumerate(training_videos):
            if video.get('id') == video_id and video.get('coach_id') == current_user:
                video_index = i
                break

        if video_index == -1:
            return jsonify({'success': False, 'message': '视频不存在或无权限'}), 404

        # 更新视频记录
        training_videos[video_index].update({
            'coach_score': data.get('score'),
            'coach_feedback': data.get('feedback', ''),
            'annotation_status': 'annotated',
            'annotation_time': int(time.time())
        })

        if save_training_videos_data(training_videos):
            return jsonify({
                'success': True,
                'message': '标注保存成功'
            })
        else:
            return jsonify({'success': False, 'message': '保存标注失败'}), 500

    except Exception as e:
        print(f"保存视频标注错误: {e}")
        return jsonify({'success': False, 'message': f'保存失败: {str(e)}'}), 500

@training_video_api.route('/api/training-videos/<video_id>/publish', methods=['POST'])
@jwt_required()
def publish_video_annotation(video_id):
    """教练发布视频标注"""
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)

    # 检查是否是教练
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403

    try:
        # 验证视频是否存在且属于该教练
        training_videos = get_training_videos_data()
        video_index = -1
        for i, video in enumerate(training_videos):
            if video.get('id') == video_id and video.get('coach_id') == current_user:
                video_index = i
                break

        if video_index == -1:
            return jsonify({'success': False, 'message': '视频不存在或无权限'}), 404

        # 检查是否已标注
        if training_videos[video_index].get('annotation_status') != 'annotated':
            return jsonify({'success': False, 'message': '请先完成标注再发布'}), 400

        # 发布标注
        training_videos[video_index].update({
            'annotation_published': True,
            'annotation_status': 'published',
            'publish_time': int(time.time())
        })

        if save_training_videos_data(training_videos):
            return jsonify({
                'success': True,
                'message': '标注已发布，学员可以查看'
            })
        else:
            return jsonify({'success': False, 'message': '发布标注失败'}), 500

    except Exception as e:
        print(f"发布视频标注错误: {e}")
        return jsonify({'success': False, 'message': f'发布失败: {str(e)}'}), 500

@training_video_api.route('/api/training-videos/<video_id>/unpublish', methods=['POST'])
@jwt_required()
def unpublish_video_annotation(video_id):
    """教练取消发布视频标注"""
    current_user = get_jwt_identity()
    user_data = get_user_data(current_user)

    # 检查是否是教练
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '无权限访问此接口'}), 403

    try:
        # 验证视频是否存在且属于该教练
        training_videos = get_training_videos_data()
        video_index = -1
        for i, video in enumerate(training_videos):
            if video.get('id') == video_id and video.get('coach_id') == current_user:
                video_index = i
                break

        if video_index == -1:
            return jsonify({'success': False, 'message': '视频不存在或无权限'}), 404

        # 取消发布
        training_videos[video_index].update({
            'annotation_published': False,
            'annotation_status': 'annotated'
        })

        if save_training_videos_data(training_videos):
            return jsonify({
                'success': True,
                'message': '已取消发布标注'
            })
        else:
            return jsonify({'success': False, 'message': '取消发布失败'}), 500

    except Exception as e:
        print(f"取消发布视频标注错误: {e}")
        return jsonify({'success': False, 'message': f'取消发布失败: {str(e)}'}), 500

@training_video_api.route('/api/training-videos/<video_id>/annotations', methods=['GET'])
@jwt_required()
def get_video_annotations_for_training(video_id):
    """获取训练视频的标注（包括教练标注的视频标注）"""
    current_user = get_jwt_identity()

    try:
        # 验证视频权限
        training_videos = get_training_videos_data()
        video = None
        for v in training_videos:
            if v.get('id') == video_id:
                video = v
                break

        if not video:
            return jsonify({'success': False, 'message': '视频不存在'}), 404

        # 检查权限：用户本人或教练
        if (video.get('user_id') != current_user and
            video.get('coach_id') != current_user):
            return jsonify({'success': False, 'message': '无权限查看此视频'}), 403

        # 获取视频标注（使用视频文件名作为video_id）
        annotations = get_annotations_data()
        video_annotations = [
            anno for anno in annotations
            if anno.get('video_id') == video.get('filename')
        ]

        # 按时间戳排序
        video_annotations.sort(key=lambda x: x.get('timestamp', 0))

        return jsonify({
            'success': True,
            'annotations': video_annotations,
            'video_info': video
        })

    except Exception as e:
        print(f"获取视频标注错误: {e}")
        return jsonify({'success': False, 'message': f'获取失败: {str(e)}'}), 500

@training_video_api.route('/api/training-videos/<video_id>', methods=['DELETE'])
@jwt_required()
def delete_training_video(video_id):
    """删除训练视频"""
    current_user = get_jwt_identity()

    try:
        # 验证视频是否存在且属于当前用户
        training_videos = get_training_videos_data()
        video_index = -1
        video_to_delete = None

        for i, video in enumerate(training_videos):
            if video.get('id') == video_id and video.get('user_id') == current_user:
                video_index = i
                video_to_delete = video
                break

        if video_index == -1:
            return jsonify({'success': False, 'message': '视频不存在或无权限删除'}), 404

        # 删除文件
        file_path = video_to_delete.get('file_path')
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        # 删除记录
        training_videos.pop(video_index)

        # 删除相关标注
        annotations = get_annotations_data()
        filename = video_to_delete.get('filename')
        updated_annotations = [
            anno for anno in annotations
            if anno.get('video_id') != filename
        ]

        if (save_training_videos_data(training_videos) and
            save_annotations_data(updated_annotations)):
            return jsonify({
                'success': True,
                'message': '训练视频删除成功'
            })
        else:
            return jsonify({'success': False, 'message': '删除视频失败'}), 500

    except Exception as e:
        print(f"删除训练视频错误: {e}")
        return jsonify({'success': False, 'message': f'删除失败: {str(e)}'}), 500
