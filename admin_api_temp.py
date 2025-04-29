# 管理员删除教练预约API端点
@app.route('/api/admin/appointments/<appointment_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_appointment(appointment_id):
    """管理员删除教练预约信息"""
    current_user = get_jwt_identity()
    
    # 检查用户是否是管理员
    user_data = get_user_data(current_user)
    if not user_data or user_data.get('role') != 'admin':
        return jsonify({'success': False, 'message': '无权限访问此接口，仅管理员可操作'}), 403
    
    try:
        # 读取预约数据
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8-sig') as f:
            appointments_data = json.load(f)
        
        # 查找要删除的预约
        appointments = appointments_data.get('appointments', [])
        found = False
        filtered_appointments = []
        deleted_appointment = None
        
        for appointment in appointments:
            if appointment.get('id') == appointment_id:
                found = True
                deleted_appointment = appointment
            else:
                filtered_appointments.append(appointment)
        
        if not found:
            return jsonify({'success': False, 'message': '未找到指定的预约信息'}), 404
        
        # 更新预约数据
        appointments_data['appointments'] = filtered_appointments
        
        # 保存更新后的数据
        with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(appointments_data, f, ensure_ascii=False, indent=4)
        
        # 记录操作日志
        operation_log = {
            'operation': 'delete_appointment',
            'user': current_user,
            'appointment_id': appointment_id,
            'timestamp': get_current_time(),
            'deleted_appointment': deleted_appointment
        }
        
        # 可以选择将操作日志保存到文件或数据库
        print(f"管理员删除预约操作日志: {operation_log}")
        
        return jsonify({
            'success': True, 
            'message': '预约信息删除成功',
            'deleted_appointment': deleted_appointment
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'删除预约失败: {str(e)}'}), 500
