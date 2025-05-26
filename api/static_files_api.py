"""
Static files API routes
"""
from flask import Blueprint, send_from_directory

# Create blueprint
static_files_api = Blueprint('static_files_api', __name__)


@static_files_api.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)


@static_files_api.route('/uploads/training_videos/<path:filename>')
def training_video_file(filename):
    response = send_from_directory('uploads/training_videos', filename)
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@static_files_api.route('/img/<path:filename>')
def processed_file(filename):
    return send_from_directory('img', filename)
