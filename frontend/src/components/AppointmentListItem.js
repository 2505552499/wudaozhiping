import React from 'react';
import { List, Avatar, Tag, Button, message } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import paymentService from '../services/paymentService';

// 获取预约状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return '待确认';
    case 'confirmed':
      return '已确认';
    case 'completed':
      return '已完成';
    case 'cancelled':
      return '已取消';
    default:
      return '未知状态';
  }
};

// 获取预约状态标签颜色
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'blue';
    case 'confirmed':
      return 'green';
    case 'completed':
      return 'purple';
    case 'cancelled':
      return 'red';
    default:
      return 'default';
  }
};

// 获取支付状态文本
const getPaymentStatusText = (status) => {
  if (!status || status === 'unpaid') return '未支付';
  if (status === 'paid') return '已支付';
  return '未知状态';
};

// 获取支付状态标签颜色
const getPaymentStatusColor = (status) => {
  if (!status || status === 'unpaid') return 'orange';
  if (status === 'paid') return 'green';
  return 'default';
};

const AppointmentListItem = ({ 
  appointment, 
  onCancel, 
  refreshList, 
  onPayNow,
  openCoachDetail
}) => {
  // 处理立即支付
  const handlePayNow = async () => {
    try {
      message.loading('正在处理支付请求...');
      
      // 使用支付服务对已有预约进行支付
      const response = await paymentService.payForExistingAppointment(appointment.id);
      
      if (response.success) {
        // 打开支付宝支付页面
        paymentService.openAlipayPage(response.data.pay_url);
        message.success('已打开支付页面，请完成支付');
      } else {
        message.error(response.message || '创建支付订单失败');
      }
    } catch (error) {
      console.error('处理立即支付失败:', error);
      message.error('支付请求失败，请稍后重试');
    }
  };

  return (
    <List.Item
      actions={[
        // 显示取消按钮
        appointment.status === 'pending' && (
          <Button onClick={() => onCancel(appointment.id)} type="text" danger>
            取消预约
          </Button>
        ),
        // 显示立即支付按钮(如果未支付)
        (!appointment.payment_status || appointment.payment_status === 'unpaid') && (
          <Button onClick={() => onPayNow(appointment)} type="primary" style={{ backgroundColor: '#1890ff' }}>
            立即支付
          </Button>
        )
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={
          <div>
            <span style={{ cursor: 'pointer' }} onClick={() => openCoachDetail && openCoachDetail(appointment.coach_id)}>
              {appointment.coach_name || '未知教练'}
            </span>
            {/* 显示预约状态 */}
            <Tag 
              color={getStatusColor(appointment.status)} 
              style={{ marginLeft: 8 }}
            >
              {getStatusText(appointment.status)}
            </Tag>
            {/* 显示支付状态 */}
            <Tag 
              color={getPaymentStatusColor(appointment.payment_status)} 
              style={{ marginLeft: 8 }}
            >
              {getPaymentStatusText(appointment.payment_status)}
            </Tag>
          </div>
        }
        description={
          <>
            <p>
              <CalendarOutlined style={{ marginRight: 8 }} />
              预约日期: {appointment.date}
            </p>
            <p>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              预约时间: {appointment.time}
              {appointment.duration && `，时长: ${appointment.duration}小时`}
            </p>
            <p>
              训练项目: {appointment.skill || '未指定'}
            </p>
          </>
        }
      />
    </List.Item>
  );
};

export default AppointmentListItem;
