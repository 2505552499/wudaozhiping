from flask import Blueprint, jsonify, request, render_template_string, redirect
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from alipay_utils import AlipayService, PaymentRecordManager
import os
import json
import time
import random

# 初始化支付宝服务和支付记录管理器
alipay_service = AlipayService()
payment_manager = PaymentRecordManager()

# 创建Blueprint
payment_api = Blueprint('payment_api', __name__)

# 模拟支付宝支付页面HTML模板
ALIPAY_MOCK_PAGE = '''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>支付宝支付模拟页面</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 400px;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 120px;
            margin-bottom: 10px;
        }
        .header h1 {
            color: #00a0e9;
            font-size: 20px;
            margin: 0;
        }
        .payment-info {
            margin-bottom: 20px;
        }
        .payment-info p {
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
        }
        .payment-info .label {
            color: #666;
        }
        .payment-info .value {
            font-weight: bold;
            text-align: right;
        }
        .total-amount {
            font-size: 24px;
            color: #f60;
            text-align: center;
            margin: 20px 0;
        }
        .btn {
            display: block;
            width: 100%;
            padding: 12px;
            background-color: #00a0e9;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            margin-bottom: 10px;
        }
        .btn:hover {
            background-color: #0092d6;
        }
        .btn-cancel {
            background-color: #f5f5f5;
            color: #333;
        }
        .btn-cancel:hover {
            background-color: #e8e8e8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://img.alicdn.com/tfs/TB1HwGTXQL0gK0jSZFAXXcA9pXa-200-200.png" alt="支付宝图标">
            <h1>支付宝付款</h1>
        </div>
        <div class="payment-info">
            <p>
                <span class="label">订单号：</span>
                <span class="value">{{ out_trade_no }}</span>
            </p>
            <p>
                <span class="label">商品名称：</span>
                <span class="value">{{ subject }}</span>
            </p>
        </div>
        <div class="total-amount">
            ¥ {{ '%.2f'|format(total_amount) }}
        </div>
        <a href="{{ success_url }}" class="btn">确认支付</a>
        <a href="{{ cancel_url }}" class="btn btn-cancel">取消支付</a>
    </div>
</body>
</html>
'''

# 获取教练数据文件路径
COACHES_DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'coaches.json')
APPOINTMENTS_DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'appointments.json')

# 创建支付订单
@payment_api.route('/api/payments/create', methods=['POST'])  # 修改为复数形式payments，与前端调用保持一致
@jwt_required()
def create_payment():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    appointment_id = data.get('appointment_id')
    
    # 验证必要参数
    if not appointment_id:
        error_msg = '缺少必要参数: appointment_id'
        print(f"ERROR: {error_msg}")
        return jsonify({
            'success': False,
            'message': error_msg
        }), 400
    
    # 打印详细调试信息
    print(f"DEBUG: 接收到支付创建请求: user_id={user_id}, data={data}")
    
    # 检查是否有前端传递的价格参数
    frontend_price = None
    if data.get('price') is not None:
        try:
            frontend_price = float(data.get('price'))
            print(f"DEBUG: 前端传递的价格参数: {frontend_price}")
        except (ValueError, TypeError) as e:
            print(f"WARNING: 价格参数格式错误: {data.get('price')}, 错误: {str(e)}")
    
    # 防止duration值为None或非数字
    try:
        if data.get('duration') is not None:
            duration_value = float(data.get('duration'))
            print(f"DEBUG: 解析到duration参数: {duration_value}")
        else:
            print("DEBUG: 请求中没有duration参数，将使用预约中的默认值")
    except (ValueError, TypeError) as e:
        print(f"WARNING: duration参数格式错误: {data.get('duration')}, 错误: {str(e)}")
    
    # 获取预约信息
    try:
        print(f"DEBUG: 尝试读取预约文件: {APPOINTMENTS_DATA_FILE}")
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            appointments_raw = f.read()
            print(f"DEBUG: 读取到预约数据: {len(appointments_raw)} 字节")
            appointments_data = json.loads(appointments_raw)
            print(f"DEBUG: 预约数据解析成功")
        
        appointment = None
        appointment_count = 0
        for appt in appointments_data.get('appointments', []):
            appointment_count += 1
            if appt.get('id') == appointment_id:
                appointment = appt
                break
        
        print(f"DEBUG: 共找到 {appointment_count} 条预约记录")
        
        if not appointment:
            error_msg = f'预约不存在: {appointment_id}'
            print(f"ERROR: {error_msg}")
            return jsonify({
                'success': False,
                'message': error_msg
            }), 404
        
        print(f"DEBUG: 找到预约: {appointment}")
        
        # 检查预约是否属于当前用户
        if appointment.get('user_id') and appointment.get('user_id') != user_id:
            error_msg = f'无权访问此预约: 用户ID={user_id}, 预约用户ID={appointment.get("user_id")}'
            print(f"ERROR: {error_msg}")
            return jsonify({
                'success': False,
                'message': '无权访问此预约'
            }), 403
        
        # 获取教练信息
        coach_id = appointment.get('coach_id')
        coach_name = appointment.get('coach_name', '未知教练')
        
        # 默认价格和教练信息
        hourly_rate = 100.0  # 默认每小时100元，确保是浮点数
        
        try:
            with open(COACHES_DATA_FILE, 'r', encoding='utf-8') as f:
                coaches_data = json.load(f)
            
            coach = None
            for c in coaches_data.get('coaches', []):
                if c.get('id') == coach_id:
                    coach = c
                    break
            
            # 如果教练存在，使用教练的价格
            if coach:
                hourly_rate = float(coach.get('price', 100.0))  # 默认每小时100元，转换为浮点数
        except Exception as e:
            print(f"警告: 获取教练信息时出错: {str(e)}, 使用默认价格")
        
        # 如果预约中有价格信息，优先使用
        if appointment.get('price'):
            hourly_rate = float(appointment.get('price'))
            print(f"DEBUG: 使用预约中的价格: {hourly_rate}")
        else:
            print(f"DEBUG: 使用默认价格: {hourly_rate}")
        
        # 计算支付金额 - 优先使用预约中的duration
        try:
            duration = float(appointment.get('duration', 1))
            print(f"DEBUG: 使用预约中的duration: {duration}")
        except (ValueError, TypeError) as e:
            print(f"WARNING: 无法解析预约中的duration: {e}")
            duration = 1.0
            print(f"DEBUG: 使用默认duration: {duration}")
        
        # 如果请求中包含时长，则使用请求中的
        if data.get('duration') is not None:
            try:
                duration = float(data.get('duration'))
                print(f"DEBUG: 使用请求中的duration: {duration}")
            except (ValueError, TypeError) as e:
                print(f"WARNING: 无法将请求中的duration转换为数字: {data.get('duration')}, 错误: {e}")
        
        # 计算支付金额 - 优先使用前端传递的价格
        try:
            # 如果有前端传递的价格，直接使用
            if frontend_price is not None:
                amount = frontend_price
                print(f"DEBUG: 使用前端传递的价格: {amount}")
            else:
                # 如果没有前端传递的价格，计算金额
                # 将所有参数显式转换为浮点数并去除可能的空白字符
                hourly_rate_float = float(str(hourly_rate).strip())
                duration_float = float(str(duration).strip())
                
                # 直接计算准确的金额（时费 × 时长）
                amount = hourly_rate_float * duration_float
                print(f"DEBUG: 计算支付金额: {hourly_rate_float} * {duration_float} = {amount}")
            
            # 将金额四舍五入到2位小数，保证精确度
            amount = round(amount, 2)
            
            # 确保金额不为0
            if amount == 0:
                amount = 225.0  # 使用默认金额
                print(f"DEBUG: 金额为0，使用默认金额: {amount}")
                
        except (ValueError, TypeError) as e:
            print(f"WARNING: 支付金额计算错误: {e}, 使用默认金额")
            amount = 225.0  # 默认金额
            print(f"DEBUG: 使用默认金额: {amount}")
        
        # 准备创建支付页面的参数
        try:
            print(f"DEBUG: 将创建支付页面, 参数: user_id={user_id}, appointment_id={appointment_id}, coach_id={coach_id}, amount={amount}")
            
            # 创建支付页面
            payment_result = alipay_service.create_payment_page(
                user_id=user_id,
                appointment_id=appointment_id,
                amount=amount,
                subject=f"武道智评-教练预约 {coach_name}",
                coach_id=coach_id,
                coach_name=coach_name,
                appointment_date=appointment.get('date', ''),
                appointment_time=appointment.get('time', ''),
                duration=float(duration)  # 确保是浮点数
            )
            
            print(f"DEBUG: 支付页面创建成功: {payment_result}")
            
            return jsonify({
                'success': True,
                'message': '创建支付订单成功',
                'data': payment_result
            })
        except Exception as e:
            error_msg = f"创建支付页面失败: {str(e)}"
            print(f"ERROR: {error_msg}")
            return jsonify({
                'success': False,
                'message': error_msg
            }), 500
    
    except Exception as e:
        import traceback
        error_msg = f"创建支付订单失败: {str(e)}"
        print(f"ERROR: {error_msg}")
        print(f"ERROR TRACE: {traceback.format_exc()}")  # 打印完整的错误堆栈
        return jsonify({
            'success': False,
            'message': error_msg
        }), 500

# 查询支付状态
@payment_api.route('/api/payments/<string:out_trade_no>/status', methods=['GET'])
@jwt_required(optional=True)
def query_payment(out_trade_no):
    print(f"DEBUG: 查询支付状态 out_trade_no={out_trade_no}")
    user_id = get_jwt_identity()
    print(f"DEBUG: 当前用户ID: {user_id}")
    
    # 获取支付记录
    payment = payment_manager.get_payment_by_out_trade_no(out_trade_no)
    print(f"DEBUG: 支付记录: {payment}")
    
    if not payment:
        print(f"ERROR: 支付订单不存在: {out_trade_no}")
        return jsonify({
            'success': False,
            'message': '支付订单不存在'
        }), 404
    
    # 如果有用户身份，检查是否属于当前用户，但不强制要求登录
    # 修改逻辑：先检查是否有用户登录，如果有才检查权限
    if user_id and payment.get('user_id') != user_id:
        print(f"WARNING: 用户访问了不属于自己的支付订单: 用户={user_id}, 支付用户={payment.get('user_id')}")
        # 不再返回403错误，而是记录警告并继续处理
    
    # 查询支付状态
    query_result = alipay_service.query_payment(out_trade_no)
    print(f"DEBUG: 支付状态查询结果: {query_result}")
    
    return jsonify({
        'success': True,
        'message': '查询支付状态成功',
        'data': {
            'payment': payment,
            'status': query_result.get('status')
        }
    })

# 获取用户支付记录
@payment_api.route('/api/payment/user/records', methods=['GET'])
@jwt_required()
def get_user_payment_records():
    user_id = get_jwt_identity()
    
    # 获取用户支付记录
    payments = payment_manager.get_user_payments(user_id)
    
    return jsonify({
        'success': True,
        'message': '获取支付记录成功',
        'data': {
            'payments': payments
        }
    })

# 支付宝异步通知处理
@payment_api.route('/api/payment/alipay/notify', methods=['POST'])
def alipay_notify():
    data = request.form.to_dict()
    
    # 处理支付宝通知
    payment = alipay_service.process_payment_notification(data)
    
    if payment:
        # 加载预约信息以计算价格
        appointment = None
        with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
            appointments_data = json.load(f)
            for appt in appointments_data.get('appointments', []):
                if appt['id'] == payment.get('appointment_id'):
                    appointment = appt
                    break
        
        if not appointment:
            return jsonify({
                'success': False,
                'message': '预约不存在'
            }), 404
            
        # 记录是否为现有预约创建支付订单 (后付费模式)
        print(f'为预约 {payment.get("appointment_id")} 创建支付订单')
        
        # 支付成功，更新预约状态
        try:
            with open(APPOINTMENTS_DATA_FILE, 'r', encoding='utf-8') as f:
                appointments_data = json.load(f)
                for appt in appointments_data.get('appointments', []):
                    if appt['id'] == payment.get('appointment_id'):
                        # 更新预约的支付状态为已支付
                        appt['payment_status'] = 'paid'
                        print(f"支付成功，预约ID: {appt['id']}，已更新支付状态为已支付")
                        break
            
            # 保存更新后的预约数据
            with open(APPOINTMENTS_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(appointments_data, f, ensure_ascii=False, indent=4)
            
        except Exception as e:
            print(f"更新预约支付状态失败: {str(e)}")
        
        return 'success'
    
    return 'fail'

# 模拟支付宝网关
@payment_api.route('/api/payment/alipay/gateway', methods=['GET'])
@cross_origin()
def alipay_gateway():
    # 获取支付参数
    out_trade_no = request.args.get('out_trade_no')

    # 解析总金额，确保是数字
    try:
        # 默认使用URL中的金额参数
        total_amount = float(request.args.get('total_amount', '0'))
        print(f"DEBUG: URL中的总金额参数: {total_amount}")
        
        # 获取支付记录信息
        payment_record = payment_manager.get_payment_by_out_trade_no(out_trade_no)
        
        # 如果找到支付记录，确保使用正确的金额
        if payment_record:
            # 获取预约信息
            coach_id = payment_record.get('coach_id')
            duration = float(payment_record.get('duration', 1.0))
            
            # 获取教练信息和小时费率
            coaches_file = os.path.join(os.path.dirname(__file__), 'data', 'coaches.json')
            hourly_rate = 100.0  # 默认小时费率
            
            try:
                with open(coaches_file, 'r', encoding='utf-8') as f:
                    coaches_data = json.load(f)
                    
                # 查找对应教练的小时费率
                for coach in coaches_data:
                    if coach.get('id') == coach_id:
                        hourly_rate = float(coach.get('price', 100.0))
                        print(f"DEBUG: 找到教练{coach_id}的小时费率: {hourly_rate}")
                        break
            except Exception as e:
                print(f"WARNING: 读取教练信息时出错: {e}")
            
            # 重新计算金额（小时费率 × 时长）
            calculated_amount = hourly_rate * duration
            calculated_amount = round(calculated_amount, 2)
            
            print(f"DEBUG: 重新计算的金额: {hourly_rate} * {duration} = {calculated_amount}")
            
            # 使用计算出的金额
            total_amount = calculated_amount
        
        # 确保金额至少保留2位小数显示
        total_amount = round(total_amount, 2)
    except (ValueError, TypeError) as e:
        print(f"WARNING: 解析总金额时出错: {e}, 使用默认值0")
        total_amount = 0.0

    subject = request.args.get('subject')

    
    # 生成成功和取消支付的URL - 使用后端API而非前端路由
    print(f"DEBUG: 构造支付成功和取消URL, out_trade_no={out_trade_no}")
    success_url = f"/api/payment/alipay/return?out_trade_no={out_trade_no}&trade_status=TRADE_SUCCESS"
    cancel_url = f"/api/payment/alipay/return?out_trade_no={out_trade_no}&trade_status=TRADE_CLOSED&cancel=true"
    print(f"DEBUG: 支付成功URL: {success_url}")
    print(f"DEBUG: 取消支付URL: {cancel_url}")
    
    # 渲染模拟支付宝支付页面
    return render_template_string(
        ALIPAY_MOCK_PAGE,
        out_trade_no=out_trade_no,
        total_amount=total_amount,
        subject=subject,
        success_url=success_url,
        cancel_url=cancel_url
    )

# 支付宝同步回调处理
@payment_api.route('/api/payment/alipay/return', methods=['GET'])
@cross_origin()
def alipay_return():
    print(f"DEBUG: 收到支付回调, 参数: {request.args}")
    data = request.args.to_dict()
    out_trade_no = data.get('out_trade_no')
    trade_status = data.get('trade_status')
    
    if not out_trade_no:
        print(f"ERROR: 支付回调缺少out_trade_no参数")
        return jsonify({
            'success': False,
            'message': '无效的支付回调参数'
        }), 400
    
    # 获取支付记录
    payment = alipay_service.payment_manager.get_payment_by_out_trade_no(out_trade_no)
    if not payment:
        print(f"ERROR: 找不到对应的支付记录: {out_trade_no}")
        return jsonify({
            'success': False,
            'message': '找不到支付记录'
        }), 404
    
    print(f"DEBUG: 找到支付记录: {payment}")
    
    # 判断是否是用户主动取消支付
    is_user_cancel = request.args.get('cancel') == 'true'
    
    # 如果是用户主动取消或者收到关闭状态，确保我们将其标记为取消
    if trade_status == 'TRADE_CLOSED' or is_user_cancel:
        print(f"DEBUG: 用户取消支付: {out_trade_no}")
        alipay_service.payment_manager.update_payment_status(out_trade_no, 'cancelled')
        result_status = "failed"
    # 如果是成功支付，更新支付状态
    elif trade_status == 'TRADE_SUCCESS':
        print(f"DEBUG: 更新支付状态为成功: {out_trade_no}")
        alipay_service.payment_manager.update_payment_status(out_trade_no, 'paid')
        result_status = "success"
    else:
        print(f"DEBUG: 更新支付状态为失败: {out_trade_no}")
        alipay_service.payment_manager.update_payment_status(out_trade_no, 'failed')
        result_status = "failed"
    
    # 构造重定向URL - 不再使用未定义的amount和subject变量
    redirect_url = f"http://localhost:3001/payment/result?out_trade_no={out_trade_no}&status={result_status}"
    print(f"DEBUG: 重定向到: {redirect_url}")
    
    # 重定向到前端支付结果页面
    return redirect(redirect_url)
