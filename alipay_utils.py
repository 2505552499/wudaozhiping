import os
import json
import uuid
import datetime
import hashlib
import time
import random

# 支付宝配置（简化版，无需外部依赖）
class AlipayConfig:
    def __init__(self):
        # 应用ID
        self.app_id = '2021000122600000'  # 这是一个示例应用ID
        
        # 支付宝网关（模拟）
        self.gateway_url = 'http://localhost:5000/api/payment/alipay/gateway'
        
        # 回调地址
        self.notify_url = 'http://localhost:5000/api/payment/alipay/notify'
        # 使用标准浏览器路由格式，与前端使用的BrowserRouter匹配
        # 前端应用运行在端口3001上
        self.return_url = '/payment/result'

# 支付记录存储
class PaymentRecordManager:
    def __init__(self):
        self.payment_file = os.path.join(os.path.dirname(__file__), 'data', 'payments.json')
        # 确保数据目录存在
        os.makedirs(os.path.dirname(self.payment_file), exist_ok=True)
        # 确保支付记录文件存在
        if not os.path.exists(self.payment_file):
            with open(self.payment_file, 'w', encoding='utf-8') as f:
                json.dump({"payments": []}, f, ensure_ascii=False, indent=4)
    
    def load_payments(self):
        """加载所有支付记录"""
        try:
            with open(self.payment_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"加载支付记录失败: {str(e)}")
            return {"payments": []}
    
    def save_payments(self, payments_data):
        """保存所有支付记录"""
        try:
            with open(self.payment_file, 'w', encoding='utf-8') as f:
                json.dump(payments_data, f, ensure_ascii=False, indent=4)
            return True
        except Exception as e:
            print(f"保存支付记录失败: {str(e)}")
            return False
    
    def create_payment(self, user_id, appointment_id, amount, coach_id, coach_name, appointment_date, appointment_time, duration):
        """创建新的支付记录"""
        payments_data = self.load_payments()
        
        # 生成支付订单号
        out_trade_no = f"WD{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:8]}"
        
        # 创建新的支付记录
        new_payment = {
            "id": str(uuid.uuid4()),
            "out_trade_no": out_trade_no,
            "user_id": user_id,
            "appointment_id": appointment_id,
            "coach_id": coach_id,
            "coach_name": coach_name,
            "amount": amount,
            "status": "pending",  # pending, paid, failed, refunded
            "created_at": datetime.datetime.now().isoformat(),
            "paid_at": None,
            "appointment_date": appointment_date,
            "appointment_time": appointment_time,
            "duration": duration
        }
        
        payments_data["payments"].append(new_payment)
        self.save_payments(payments_data)
        
        return new_payment
    
    def update_payment_status(self, out_trade_no, status):
        """更新支付状态，同时更新关联预约的支付状态"""
        payments_data = self.load_payments()
        
        payment = None
        for p in payments_data["payments"]:
            if p["out_trade_no"] == out_trade_no:
                p["status"] = status
                if status == "paid":
                    p["paid_at"] = datetime.datetime.now().isoformat()
                payment = p
                break
        
        if payment:
            self.save_payments(payments_data)
            
            # 更新关联预约的支付状态
            if status == "paid" and payment.get("appointment_id"):
                try:
                    appointments_file = os.path.join(os.path.dirname(__file__), 'data', 'appointments.json')
                    with open(appointments_file, 'r', encoding='utf-8') as f:
                        appointments_data = json.load(f)
                    
                    for appointment in appointments_data.get("appointments", []):
                        if appointment.get("id") == payment["appointment_id"]:
                            appointment["payment_status"] = "paid"
                            break
                    
                    with open(appointments_file, 'w', encoding='utf-8') as f:
                        json.dump(appointments_data, f, ensure_ascii=False, indent=4)
                    
                    print(f"已更新预约 {payment['appointment_id']} 的支付状态为已支付")
                except Exception as e:
                    print(f"更新预约支付状态失败: {str(e)}")
            
            return payment
        
        return None
    
    def get_payment_by_out_trade_no(self, out_trade_no):
        """根据订单号获取支付记录"""
        payments_data = self.load_payments()
        
        for payment in payments_data["payments"]:
            if payment["out_trade_no"] == out_trade_no:
                return payment
        
        return None
    
    def get_payment_by_appointment_id(self, appointment_id):
        """根据预约ID获取支付记录"""
        payments_data = self.load_payments()
        
        for payment in payments_data["payments"]:
            if payment["appointment_id"] == appointment_id:
                return payment
        
        return None
    
    def get_user_payments(self, user_id):
        """获取用户的所有支付记录"""
        payments_data = self.load_payments()
        user_payments = []
        
        for payment in payments_data["payments"]:
            if payment["user_id"] == user_id:
                user_payments.append(payment)
        
        return user_payments

# 支付宝客户端（简化版，模拟支付流程）
class AlipayService:
    def __init__(self):
        self.config = AlipayConfig()
        self.payment_manager = PaymentRecordManager()
    
    def create_payment_page(self, user_id, appointment_id, amount, subject, coach_id, coach_name, appointment_date, appointment_time, duration):
        """创建支付宝支付页面（模拟）"""
        # 检查和确保价格计算正确
        try:
            amount = float(amount)  # 确保金额是浮点数
            amount = round(amount, 2)  # 四舍五入到2位小数
            print(f"DEBUG: 准备创建支付，金额: {amount}，时长: {duration}")
        except (ValueError, TypeError) as e:
            print(f"WARNING: 金额格式错误: {e}，使用默认值")
            amount = 100.0  # 默认金额
        
        # 创建支付记录
        payment = self.payment_manager.create_payment(
            user_id, 
            appointment_id, 
            amount, 
            coach_id, 
            coach_name, 
            appointment_date, 
            appointment_time, 
            duration
        )
        
        # 生成模拟的支付URL
        print(f"DEBUG: 开始构造支付URL, payment_id={payment['id']}, out_trade_no={payment['out_trade_no']}, amount={amount}")
        
        # 使用内部API端点而非前端路由
        # 我们改为使用后端接口 /api/payment/alipay/gateway 来模拟支付页面
        pay_url = f"http://localhost:5000/api/payment/alipay/gateway?out_trade_no={payment['out_trade_no']}&total_amount={amount}&subject={subject}"
        
        print(f"DEBUG: 生成的支付URL: {pay_url}")
        
        # 保存预约ID和交易号的映射关系，方便追踪
        try:
            # 创建映射文件如果不存在
            mapping_file = os.path.join(os.path.dirname(__file__), 'data', 'payment_mappings.json')
            if not os.path.exists(mapping_file):
                with open(mapping_file, 'w', encoding='utf-8') as f:
                    json.dump({"mappings": []}, f, ensure_ascii=False, indent=4)
                    
            # 读取现有映射
            with open(mapping_file, 'r', encoding='utf-8') as f:
                mappings_data = json.load(f)
                
            # 添加新映射
            mappings_data["mappings"].append({
                "appointment_id": appointment_id,
                "out_trade_no": payment['out_trade_no'],
                "created_at": datetime.datetime.now().isoformat()
            })
            
            # 保存更新的映射
            with open(mapping_file, 'w', encoding='utf-8') as f:
                json.dump(mappings_data, f, ensure_ascii=False, indent=4)
                
            print(f"DEBUG: 已保存预约ID和交易号的映射关系")
        except Exception as e:
            print(f"WARNING: 保存支付映射关系失败: {str(e)}")
            # 继续执行，不影响主流程
        
        return {
            "payment_id": payment["id"],
            "out_trade_no": payment["out_trade_no"],
            "pay_url": pay_url
        }
    
    def query_payment(self, out_trade_no):
        """查询支付状态（模拟）"""
        # 获取支付记录
        payment = self.payment_manager.get_payment_by_out_trade_no(out_trade_no)
        
        if not payment:
            return {"status": "failed", "trade_no": ""}
        
        # 模拟支付状态查询
        # 在实际应用中，这里会调用支付宝的查询接口
        # 这里我们简单模拟，根据支付记录的创建时间来判断状态
        created_time = datetime.datetime.fromisoformat(payment["created_at"])
        current_time = datetime.datetime.now()
        time_diff = (current_time - created_time).total_seconds()
        
        # 如果支付记录已经标记为已支付，直接返回已支付状态
        if payment["status"] == "paid":
            return {"status": "paid", "trade_no": out_trade_no}
        
        # 模拟支付流程：创建后60秒内为处理中，之后随机决定是否支付成功
        if time_diff < 60:
            return {"status": "pending", "trade_no": out_trade_no}
        else:
            # 随机决定支付状态，80%概率支付成功
            is_success = random.random() < 0.8
            status = "paid" if is_success else "failed"
            
            # 更新支付状态
            self.payment_manager.update_payment_status(out_trade_no, status)
            
            return {"status": status, "trade_no": out_trade_no}
    
    def process_payment_notification(self, data):
        """处理支付通知（模拟）"""
        out_trade_no = data.get("out_trade_no")
        trade_status = data.get("trade_status")
        
        if trade_status == "TRADE_SUCCESS" or trade_status == "TRADE_FINISHED":
            # 更新支付状态为已支付
            payment = self.payment_manager.update_payment_status(out_trade_no, "paid")
            return payment
        
        return None
