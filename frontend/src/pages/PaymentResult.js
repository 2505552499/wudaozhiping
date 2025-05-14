import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button, Spin, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import paymentService from '../services/paymentService';
import MainLayout from '../components/MainLayout';

const { Title, Text } = Typography;

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const outTradeNo = queryParams.get('out_trade_no');
    // 支持两种状态参数形式：trade_status（旧）和status（新）
    const tradeStatus = queryParams.get('trade_status') || queryParams.get('status');
    const totalAmount = queryParams.get('total_amount');
    const subject = queryParams.get('subject');

    console.log('支付参数:', { outTradeNo, tradeStatus, totalAmount, subject });
    console.log('所有参数:', Object.fromEntries([...queryParams.entries()]));

    if (!outTradeNo) {
      setError('支付订单号不存在');
      setLoading(false);
      return;
    }

    // 如果有直接的交易状态，先使用它
    if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'success') {
      setPaymentStatus('paid');
      setLoading(false);
    } else if (tradeStatus === 'TRADE_CLOSED' || tradeStatus === 'failed') {
      setPaymentStatus('failed');
      setLoading(false);
    } else {
      // 查询支付状态 - 使用Promise而不是async/await
      const checkPaymentStatus = () => {
        console.log('开始查询支付状态:', outTradeNo);
        paymentService.queryPayment(outTradeNo)
          .then(response => {
            console.log('支付状态查询结果:', response);
            if (response.success) {
              setPaymentStatus(response.data.status);
              setPaymentInfo(response.data.payment);
            } else {
              setError(response.message || '查询支付状态失败');
            }
          })
          .catch(err => {
            console.error('查询支付状态错误:', err);
            setError('查询支付状态时发生错误');
          })
          .finally(() => {
            setLoading(false);
          });
      };

      checkPaymentStatus();
    }

    // 如果有URL中的支付信息但还没有详细支付记录，创建一个临时的展示信息
    if (!paymentInfo && totalAmount && subject) {
      setPaymentInfo({
        amount: totalAmount,
        out_trade_no: outTradeNo,
        coach_name: subject.replace('武道智评-教练预约 ', ''),
        appointment_date: '加载中...',
        appointment_time: '加载中...',
        duration: '加载中...'
      });
    }

    // 如果有支付状态，也获取支付详情
    if (tradeStatus) {
      const getPaymentDetails = () => {
        paymentService.queryPayment(outTradeNo)
          .then(response => {
            if (response.success) {
              setPaymentInfo(response.data.payment);
            }
          })
          .catch(err => {
            console.error('获取支付详情错误:', err);
          });
      };
      
      getPaymentDetails();
    }
  }, [location.search, paymentInfo]);

  // 渲染支付结果
  const renderPaymentResult = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 20 }}>正在查询支付结果...</div>
        </div>
      );
    }

    if (error) {
      return (
        <Result
          status="error"
          title="查询支付结果失败"
          subTitle={error}
          extra={[
            <Button type="primary" key="console" onClick={() => navigate('/coach-appointment')}>
              返回预约页面
            </Button>
          ]}
        />
      );
    }

    if (paymentStatus === 'paid') {
      return (
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          status="success"
          title="支付成功"
          subTitle={`您已成功支付 ${paymentInfo?.amount} 元`}
          extra={[
            <Button type="primary" key="console" onClick={() => navigate('/coach-appointment')}>
              返回预约页面
            </Button>
          ]}
        >
          {paymentInfo && (
            <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 4, marginTop: 20 }}>
              <Title level={5}>预约详情</Title>
              <div style={{ marginTop: 10 }}>
                <Text strong>教练：</Text>
                <Text>{paymentInfo.coach_name}</Text>
              </div>
              <div style={{ marginTop: 10 }}>
                <Text strong>预约日期：</Text>
                <Text>{paymentInfo.appointment_date}</Text>
              </div>
              <div style={{ marginTop: 10 }}>
                <Text strong>预约时间：</Text>
                <Text>{paymentInfo.appointment_time}</Text>
              </div>
              <div style={{ marginTop: 10 }}>
                <Text strong>训练时长：</Text>
                <Text>{paymentInfo.duration} 小时</Text>
              </div>
              <div style={{ marginTop: 10 }}>
                <Text strong>支付金额：</Text>
                <Text type="danger">{paymentInfo.amount} 元</Text>
              </div>
              <div style={{ marginTop: 10 }}>
                <Text strong>订单号：</Text>
                <Text>{paymentInfo.out_trade_no}</Text>
              </div>
            </div>
          )}
        </Result>
      );
    } else if (paymentStatus === 'pending') {
      return (
        <Result
          status="info"
          title="支付处理中"
          subTitle="您的支付正在处理中，请稍后刷新页面查看结果"
          extra={[
            <Button type="primary" key="refresh" onClick={() => window.location.reload()}>
              刷新页面
            </Button>,
            <Button key="back" onClick={() => navigate('/coach-appointment')}>
              返回预约页面
            </Button>
          ]}
        />
      );
    } else {
      return (
        <Result
          icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
          status="error"
          title="支付失败"
          subTitle="您的支付未完成或已取消"
          extra={[
            <Button type="primary" key="console" onClick={() => navigate('/coach-appointment')}>
              返回预约页面
            </Button>
          ]}
        />
      );
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px', minHeight: 'calc(100vh - 64px - 69px)' }}>
        {renderPaymentResult()}
      </div>
    </MainLayout>
  );
};

export default PaymentResult;
