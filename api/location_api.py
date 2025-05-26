"""
Location (cities and districts) API routes
"""
from flask import Blueprint, jsonify
from config.settings import CITIES, DISTRICTS_MAP

# Create blueprint
location_api = Blueprint('location_api', __name__)


@location_api.route('/api/cities', methods=['GET'])
def get_city_list():
    """获取支持的城市列表"""
    return jsonify({'cities': CITIES}), 200


@location_api.route('/api/districts/<city>', methods=['GET'])
def get_district_list(city):
    """获取指定城市的区域列表"""
    if city in DISTRICTS_MAP:
        return jsonify({'districts': DISTRICTS_MAP[city]}), 200
    else:
        # 如果没有特定城市的区域数据，返回空列表
        return jsonify({'districts': []}), 200
