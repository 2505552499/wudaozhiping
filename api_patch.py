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


@app.route('/api/user/appointments', methods=['GET'])
@jwt_required()
def get_user_appointments():
    """获取用户的所有预约"""
    current_user = get_jwt_identity()
    print(f"查询用户 {current_user} 的预约")
    
    try:
        if not os.path.exists(APPOINTMENTS_DATA_FILE):
            print(f"预约文件不存在: {APPOINTMENTS_DATA_FILE}")
            return jsonify({'appointments': []}), 200
            
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        if not isinstance(appointments_data, dict) or 'appointments' not in appointments_data:
            print("预约数据格式错误")
            return jsonify({'appointments': []}), 200
            
        # 返回该用户的所有预约，不论状态
        user_appointments = [a for a in appointments_data['appointments'] 
                          if a.get('user_id') == current_user]
                           
        print(f"找到用户 {current_user} 的 {len(user_appointments)} 条预约记录")
        return jsonify({'appointments': user_appointments}), 200
    except Exception as e:
        print(f"获取用户预约时出错: {str(e)}")
        return jsonify({'success': False, 'message': f'获取预约记录失败: {str(e)}'}), 500


# 用户取消预约接口
@app.route('/api/user/cancel_appointment/<string:appointment_id>', methods=['POST'])
@jwt_required()
def user_cancel_appointment(appointment_id):
    """普通用户取消自己的预约"""
    current_user = get_jwt_identity()
    print(f"用户 {current_user} 尝试取消预约 {appointment_id}")

    try:
        if not os.path.exists(APPOINTMENTS_DATA_FILE):
            return jsonify({'success': False, 'message': '预约数据文件不存在'}), 500

        with open(APPOINTMENTS_DATA_FILE, 'r+', encoding='utf-8-sig') as f:
            try:
                appointments_data = json.load(f)
            except json.JSONDecodeError:
                return jsonify({'success': False, 'message': '预约数据格式错误'}), 500

            if 'appointments' not in appointments_data or not isinstance(appointments_data['appointments'], list):
                return jsonify({'success': False, 'message': '预约列表结构错误'}), 500

            appointment_to_cancel = None
            appointment_index = -1

            for i, appt in enumerate(appointments_data['appointments']):
                if appt.get('id') == appointment_id:
                    if appt.get('user_id') == current_user:
                        appointment_to_cancel = appt
                        appointment_index = i
                        break
                    else:
                        print(f"用户 {current_user} 无权取消不属于自己的预约 {appointment_id}")
                        return jsonify({'success': False, 'message': '您无权取消此预约'}), 403 # Forbidden
            
            if appointment_to_cancel:
                # 检查预约状态，例如，可能只有 'pending' 或 'confirmed' 状态的才能取消
                if appointment_to_cancel.get('status') not in ['pending', 'confirmed']:
                    message = f'预约 {appointment_id} 当前状态为 {appointment_to_cancel.get("status")}，无法取消。'
                    print(message)
                    return jsonify({'success': False, 'message': message}), 400

                appointments_data['appointments'][appointment_index]['status'] = 'cancelled'
                appointments_data['appointments'][appointment_index]['updated_at'] = get_current_time()
                
                f.seek(0)
                json.dump(appointments_data, f, indent=4, ensure_ascii=False)
                f.truncate()
                
                print(f"预约 {appointment_id} 已被用户 {current_user} 取消")
                return jsonify({'success': True, 'message': '预约已成功取消'}), 200
            else:
                print(f"未找到用户 {current_user} 的预约 {appointment_id}")
                return jsonify({'success': False, 'message': '未找到要取消的预约或预约不属于您'}), 404

    except Exception as e:
        error_msg = f'取消预约时发生服务器内部错误: {str(e)}'
        print(error_msg)
        # 记录更详细的错误到日志
        from flask import current_app
        current_app.logger.error(f"Error cancelling appointment {appointment_id} for user {current_user}: {e}", exc_info=True)
        return jsonify({'success': False, 'message': '取消预约失败，请稍后重试'}), 500


# 教练相关接口
@app.route('/api/coach/appointments', methods=['GET'])
@jwt_required()
def get_coach_appointments():
    """获取教练的所有预约"""
    current_user = get_jwt_identity()
    print(f"查询教练 {current_user} 的预约")
    
    # 验证用户是否为教练
    user_data = get_user_data(current_user)
    if not user_data or user_data.get('role') != 'coach':
        return jsonify({'success': False, 'message': '只有教练可以访问此接口'}), 403
    
    try:
        if not os.path.exists(APPOINTMENTS_DATA_FILE):
            return jsonify({'appointments': []}), 200
            
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        if not isinstance(appointments_data, dict) or 'appointments' not in appointments_data:
            return jsonify({'appointments': []}), 200
            
        # 返回该教练的所有预约，不论状态
        coach_appointments = [a for a in appointments_data['appointments'] 
                             if a.get('coach_id') == current_user]
                             
        print(f"找到教练 {current_user} 的 {len(coach_appointments)} 条预约记录")
        return jsonify({'appointments': coach_appointments}), 200
    except Exception as e:
        print(f"获取教练预约时出错: {str(e)}")
        return jsonify({'success': False, 'message': f'获取预约记录失败: {str(e)}'}), 500
