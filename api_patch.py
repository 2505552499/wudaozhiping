# 添加用户预约API端点
@app.route('/api/user/create_appointment', methods=['POST'])
@jwt_required()
def user_create_appointment():
    """普通用户创建预约"""
    current_user = get_jwt_identity()
    print(f"当前用户: {current_user}")
    
    # 检查用户是否存在
    user_data = get_user_data(current_user)
    print(f"用户数据: {user_data}")
    if not user_data:
        return jsonify({'success': False, 'message': '用户不存在'}), 404
    
    # 获取请求数据
    data = request.json
    print(f"请求数据: {data}")
    if not data:
        return jsonify({'success': False, 'message': '请求数据无效'}), 400
    
    try:
        # 验证教练是否存在
        with open(COACHES_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            coaches_data = json.load(f)
        
        # 确保coaches_data是列表格式
        coaches_list = coaches_data if isinstance(coaches_data, list) else coaches_data.get('coaches', [])
        
        coach = next((c for c in coaches_list if c['id'] == data['coach_id']), None)
        if not coach:
            error_msg = f'教练不存在: {data["coach_id"]}'
            print(f"预约失败: {error_msg}")
            return jsonify({'success': False, 'message': error_msg}), 404
        
        # 创建新预约
        try:
            # 确保appointments.json文件存在
            if not os.path.exists(APPOINTMENTS_DATA_FILE):
                with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump({"appointments": []}, f)
            
            with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
                appointments_data = json.load(f)
            
            # 确保appointments_data有正确的结构
            if 'appointments' not in appointments_data:
                appointments_data = {"appointments": []}
            
            # 生成唯一ID
            import uuid
            appointment_id = str(uuid.uuid4())
            
            new_appointment = {
                'id': appointment_id,
                'user_id': current_user,
                'coach_id': data['coach_id'],
                'coach_name': coach['name'],
                'coach_avatar': coach.get('avatar'),
                'date': data['date'],
                'time': data['time'],
                'location': data.get('location', f"{coach['location']['city']} {coach['location']['districts'][0]}"),
                'skill': data['skill'],
                'duration': data.get('duration', 1),
                'status': 'pending',
                'created_at': get_current_time()
            }
            
            appointments_data['appointments'].append(new_appointment)
            
            with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(appointments_data, f, indent=4, ensure_ascii=False)
            
            print(f"用户预约创建成功: {new_appointment}")
            return jsonify({'success': True, 'message': '预约创建成功', 'appointment': new_appointment}), 201
        except Exception as e:
            error_msg = f'创建预约时出错: {str(e)}'
            print(f"预约失败: {error_msg}")
            return jsonify({'success': False, 'message': error_msg}), 500
    except Exception as e:
        error_msg = f'创建预约失败: {str(e)}'
        print(f"预约失败: {error_msg}")
        return jsonify({'success': False, 'message': error_msg}), 500
