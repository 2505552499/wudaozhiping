from flask import Blueprint, request, jsonify
import json
import os
import time
import uuid

# 创建批注API蓝图
annotations_api = Blueprint('annotations_api', __name__)

# 批注数据文件路径
ANNOTATIONS_FILE = 'annotations.json'

# 获取批注数据
def get_annotations_data():
    if not os.path.exists(ANNOTATIONS_FILE):
        with open(ANNOTATIONS_FILE, 'w') as f:
            json.dump([], f)
        return []
    
    try:
        with open(ANNOTATIONS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"读取批注数据错误: {e}")
        return []

# 保存批注数据
def save_annotations_data(data):
    try:
        with open(ANNOTATIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"保存批注数据错误: {e}")
        return False

# 获取视频的所有批注
@annotations_api.route('/api/annotations/<string:video_id>', methods=['GET'])
def get_video_annotations(video_id):
    annotations = get_annotations_data()
    video_annotations = [anno for anno in annotations if anno.get('video_id') == video_id]
    
    # 按时间戳排序
    video_annotations.sort(key=lambda x: x.get('timestamp', 0))
    
    return jsonify({
        'success': True,
        'annotations': video_annotations
    })

# 添加新批注
@annotations_api.route('/api/annotations', methods=['POST'])
def add_annotation():
    try:
        data = request.json
        
        # 验证必要字段
        required_fields = ['video_id', 'timestamp', 'time_seconds', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'缺少必要字段: {field}'}), 400
        
        # 创建新批注
        new_annotation = {
            'id': str(uuid.uuid4()),
            'video_id': data['video_id'],
            'timestamp': data['timestamp'],
            'time_seconds': data['time_seconds'],
            'type': data['type'],
            'content': data.get('content', ''),
            'drawing_data': data.get('drawing_data', None) if data['type'] == 'drawing' else None,
            'created_at': int(time.time())
        }
        
        # 读取现有批注并添加新批注
        annotations = get_annotations_data()
        annotations.append(new_annotation)
        
        # 保存更新后的批注
        if save_annotations_data(annotations):
            return jsonify({'success': True, 'annotation': new_annotation})
        else:
            return jsonify({'success': False, 'message': '保存批注失败'}), 500
            
    except Exception as e:
        print(f"添加批注错误: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

# 删除批注
@annotations_api.route('/api/annotations/<string:annotation_id>', methods=['DELETE'])
def delete_annotation(annotation_id):
    try:
        # 读取现有批注
        annotations = get_annotations_data()
        
        # 找到并删除指定批注
        updated_annotations = [anno for anno in annotations if anno.get('id') != annotation_id]
        
        # 检查是否找到并删除了批注
        if len(updated_annotations) == len(annotations):
            return jsonify({'success': False, 'message': '未找到指定批注'}), 404
        
        # 保存更新后的批注
        if save_annotations_data(updated_annotations):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': '删除批注失败'}), 500
            
    except Exception as e:
        print(f"删除批注错误: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500
