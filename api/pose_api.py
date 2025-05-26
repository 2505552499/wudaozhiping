"""
Pose data API routes
"""
from flask import Blueprint, jsonify
from config.settings import AVAILABLE_POSES

# Create blueprint
pose_api = Blueprint('pose_api', __name__)


@pose_api.route('/api/poses', methods=['GET'])
def get_poses():
    return jsonify({'success': True, 'poses': AVAILABLE_POSES}), 200


@pose_api.route('/api/angles/<pose_name>', methods=['GET'])
def get_angle_data(pose_name):
    """
    获取特定姿势的关节角度数据，用于可视化
    """
    # 习武者关节角度数据
    practitioner_angles = {
        '弓步冲拳': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 171.24},
            {'joint': '1-3 和 3-5夹角为', 'angle': 144.74},
            {'joint': '2-0 和 0-6夹角为', 'angle': 134.20},
            {'joint': '3-1 和 1-7夹角为', 'angle': 122.39},
            {'joint': '0-6 和 6-8夹角为', 'angle': 150.97},
            {'joint': '1-7 和 7-9夹角为', 'angle': 134.10},
            {'joint': '7-6 和 6-8夹角为', 'angle': 160.55},
            {'joint': '6-7 和 7-9夹角为', 'angle': 125.62},
            {'joint': '6-8 和 8-10夹角为', 'angle': 155.33},
            {'joint': '7-9 和 9-11夹角为', 'angle': 131.23}
        ],
        '猛虎出洞': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 165.32},
            {'joint': '1-3 和 3-5夹角为', 'angle': 163.45},
            {'joint': '2-0 和 0-6夹角为', 'angle': 140.21},
            {'joint': '3-1 和 1-7夹角为', 'angle': 142.67},
            {'joint': '0-6 和 6-8夹角为', 'angle': 155.78},
            {'joint': '1-7 和 7-9夹角为', 'angle': 156.90},
            {'joint': '7-6 和 6-8夹角为', 'angle': 145.23},
            {'joint': '6-7 和 7-9夹角为', 'angle': 146.78},
            {'joint': '6-8 和 8-10夹角为', 'angle': 160.45},
            {'joint': '7-9 和 9-11夹角为', 'angle': 159.87}
        ],
        '五花坐山': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 110.45},
            {'joint': '1-3 和 3-5夹角为', 'angle': 112.67},
            {'joint': '2-0 和 0-6夹角为', 'angle': 90.23},
            {'joint': '3-1 和 1-7夹角为', 'angle': 91.45},
            {'joint': '0-6 和 6-8夹角为', 'angle': 135.67},
            {'joint': '1-7 和 7-9夹角为', 'angle': 134.89},
            {'joint': '7-6 和 6-8夹角为', 'angle': 95.34},
            {'joint': '6-7 和 7-9夹角为', 'angle': 94.56},
            {'joint': '6-8 和 8-10夹角为', 'angle': 125.78},
            {'joint': '7-9 和 9-11夹角为', 'angle': 126.90}
        ]
    }

    # 传承人关节角度数据
    master_angles = {
        '弓步冲拳': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 155.60},
            {'joint': '1-3 和 3-5夹角为', 'angle': 159.79},
            {'joint': '2-0 和 0-6夹角为', 'angle': 115.97},
            {'joint': '3-1 和 1-7夹角为', 'angle': 68.88},
            {'joint': '0-6 和 6-8夹角为', 'angle': 151.87},
            {'joint': '1-7 和 7-9夹角为', 'angle': 176.27},
            {'joint': '7-6 和 6-8夹角为', 'angle': 134.59},
            {'joint': '6-7 和 7-9夹角为', 'angle': 135.88},
            {'joint': '6-8 和 8-10夹角为', 'angle': 150.69},
            {'joint': '7-9 和 9-11夹角为', 'angle': 162.30}
        ],
        '猛虎出洞': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 175.45},
            {'joint': '1-3 和 3-5夹角为', 'angle': 174.67},
            {'joint': '2-0 和 0-6夹角为', 'angle': 130.23},
            {'joint': '3-1 和 1-7夹角为', 'angle': 131.45},
            {'joint': '0-6 和 6-8夹角为', 'angle': 165.67},
            {'joint': '1-7 和 7-9夹角为', 'angle': 166.89},
            {'joint': '7-6 和 6-8夹角为', 'angle': 155.34},
            {'joint': '6-7 和 7-9夹角为', 'angle': 154.56},
            {'joint': '6-8 和 8-10夹角为', 'angle': 170.78},
            {'joint': '7-9 和 9-11夹角为', 'angle': 169.90}
        ],
        '五花坐山': [
            {'joint': '0-2 和 2-4夹角为', 'angle': 90.45},
            {'joint': '1-3 和 3-5夹角为', 'angle': 92.67},
            {'joint': '2-0 和 0-6夹角为', 'angle': 95.23},
            {'joint': '3-1 和 1-7夹角为', 'angle': 96.45},
            {'joint': '0-6 和 6-8夹角为', 'angle': 125.67},
            {'joint': '1-7 和 7-9夹角为', 'angle': 124.89},
            {'joint': '7-6 和 6-8夹角为', 'angle': 90.34},
            {'joint': '6-7 和 7-9夹角为', 'angle': 89.56},
            {'joint': '6-8 和 8-10夹角为', 'angle': 135.78},
            {'joint': '7-9 和 9-11夹角为', 'angle': 136.90}
        ]
    }

    if pose_name in practitioner_angles and pose_name in master_angles:
        return jsonify({
            'success': True,
            'practitioner_angles': practitioner_angles[pose_name],
            'master_angles': master_angles[pose_name]
        }), 200
    else:
        return jsonify({'success': False, 'message': '未找到该姿势的角度数据'}), 404


@pose_api.route('/api/pose_keypoints/<pose_name>', methods=['GET'])
def get_pose_keypoints(pose_name):
    """
    获取特定姿势的关键点数据，用于可视化
    """
    # 传承人姿势关键点数据
    master_keypoints = {
        '弓步冲拳': {
            'keypoints': [
                [320, 100],  # 0: 鼻子
                [300, 130],  # 1: 左肩
                [340, 130],  # 2: 右肩
                [280, 180],  # 3: 左肘
                [360, 180],  # 4: 右肘
                [250, 230],  # 5: 左手腕
                [390, 230],  # 6: 右手腕
                [310, 220],  # 7: 左髋
                [330, 220],  # 8: 右髋
                [280, 320],  # 9: 左膝
                [380, 280],  # 10: 右膝
                [260, 420],  # 11: 左踝
                [380, 380]   # 12: 右踝
            ],
            'connections': [
                [0, 1], [0, 2],  # 鼻子到肩膀
                [1, 3], [2, 4],  # 肩膀到肘部
                [3, 5], [4, 6],  # 肘部到手腕
                [1, 7], [2, 8],  # 肩膀到髋部
                [7, 9], [8, 10], # 髋部到膝盖
                [9, 11], [10, 12] # 膝盖到踝部
            ]
        },
        '猛虎出洞': {
            'keypoints': [
                [320, 120],  # 0: 鼻子
                [290, 150],  # 1: 左肩
                [350, 150],  # 2: 右肩
                [240, 170],  # 3: 左肘
                [400, 170],  # 4: 右肘
                [200, 200],  # 5: 左手腕
                [440, 200],  # 6: 右手腕
                [310, 230],  # 7: 左髋
                [330, 230],  # 8: 右髋
                [290, 330],  # 9: 左膝
                [350, 330],  # 10: 右膝
                [290, 430],  # 11: 左踝
                [350, 430]   # 12: 右踝
            ],
            'connections': [
                [0, 1], [0, 2],  # 鼻子到肩膀
                [1, 3], [2, 4],  # 肩膀到肘部
                [3, 5], [4, 6],  # 肘部到手腕
                [1, 7], [2, 8],  # 肩膀到髋部
                [7, 9], [8, 10], # 髋部到膝盖
                [9, 11], [10, 12] # 膝盖到踝部
            ]
        },
        '五花坐山': {
            'keypoints': [
                [320, 100],  # 0: 鼻子
                [290, 130],  # 1: 左肩
                [350, 130],  # 2: 右肩
                [250, 180],  # 3: 左肘
                [390, 180],  # 4: 右肘
                [290, 230],  # 5: 左手腕
                [350, 230],  # 6: 右手腕
                [300, 220],  # 7: 左髋
                [340, 220],  # 8: 右髋
                [300, 280],  # 9: 左膝
                [340, 280],  # 10: 右膝
                [300, 320],  # 11: 左踝
                [340, 320]   # 12: 右踝
            ],
            'connections': [
                [0, 1], [0, 2],  # 鼻子到肩膀
                [1, 3], [2, 4],  # 肩膀到肘部
                [3, 5], [4, 6],  # 肘部到手腕
                [1, 7], [2, 8],  # 肩膀到髋部
                [7, 9], [8, 10], # 髋部到膝盖
                [9, 11], [10, 12] # 膝盖到踝部
            ]
        }
    }

    if pose_name in master_keypoints:
        return jsonify({
            'success': True,
            'keypoints': master_keypoints[pose_name]
        }), 200
    else:
        return jsonify({'success': False, 'message': '未找到该姿势的关键点数据'}), 404


@pose_api.route('/api/poses/<pose_name>', methods=['GET'])
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
