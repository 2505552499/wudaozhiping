import React from 'react';
import { List, Avatar, Tag, Space } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';

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

// 教练端预约项组件
const CoachAppointmentItem = ({ appointment }) => {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={
          <div>
            <span>{appointment.user_id || '未知用户'}</span>
            <Space size={8} style={{ marginLeft: 8 }}>
              {/* 预约状态标签 */}
              <Tag color={getStatusColor(appointment.status)}>
                {getStatusText(appointment.status)}
              </Tag>
              {/* 支付状态标签 */}
              <Tag color={getPaymentStatusColor(appointment.payment_status)}>
                <DollarOutlined style={{ marginRight: 4 }} />
                {getPaymentStatusText(appointment.payment_status)}
              </Tag>
            </Space>
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
            {appointment.payment_status === 'paid' && (
              <p style={{ color: 'green' }}>
                <DollarOutlined style={{ marginRight: 8 }} />
                学员已支付课程费用
              </p>
            )}
          </>
        }
      />
    </List.Item>
  );
};

export default CoachAppointmentItem;
