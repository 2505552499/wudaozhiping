import api from '../api';

// 支付相关服务
const paymentService = {
  // 创建支付订单 - 可用于新预约或已存在的预约
  createPayment: async (appointmentId, duration, price) => {
    try {
      console.log(`创建支付订单: appointmentId=${appointmentId}, duration=${duration}, price=${price}`);
      // 确保uration是数字类型并且有效
      const validDuration = duration ? parseFloat(duration) : undefined;
      const validPrice = price ? parseFloat(price) : undefined;
      const payload = {
        appointment_id: appointmentId,
      };
      
      // 只有当duration有效时才添加到请求中
      if (validDuration && !isNaN(validDuration)) {
        payload.duration = validDuration;
        console.log(`发送有效的duration=${validDuration}到服务器`);
      }
      
      // 只有当price有效时才添加到请求中
      if (validPrice && !isNaN(validPrice)) {
        payload.price = validPrice;
        console.log(`发送有效的price=${validPrice}到服务器`);
      }
      
      const response = await api.post('/api/payments/create', payload);
      console.log('支付订单创建响应:', response.data);
      return response.data;
    } catch (error) {
      console.error('创建支付订单失败:', error.response?.data || error.message || error);
      throw error;
    }
  },
  
  // 为现有预约支付 - 用于已创建但未支付的预约
  payForExistingAppointment: async (appointmentId, price) => {
    try {
      console.log(`为现有预约创建支付订单: appointmentId=${appointmentId}, price=${price}`);
      if (!appointmentId) {
        console.error('预约ID不能为空');
        throw new Error('预约ID不能为空');
      }
      
      const payload = {
        appointment_id: appointmentId
      };
      
      // 如果有价格参数，添加到请求中
      if (price && !isNaN(parseFloat(price))) {
        payload.price = parseFloat(price);
        console.log(`发送有效的price=${price}到服务器`);
      }
      
      const response = await api.post('/api/payments/create', payload);
      console.log('为现有预约创建支付订单响应:', response.data);
      return response.data;
    } catch (error) {
      console.error('为现有预约创建支付订单失败:', error.response?.data || error.message || error);
      throw error;
    }
  },

  // 查询支付状态
  queryPayment: async (outTradeNo) => {
    try {
      console.log(`查询支付状态: outTradeNo=${outTradeNo}`);
      const response = await api.get(`/api/payments/${outTradeNo}/status`);
      console.log('支付状态查询响应:', response.data);
      return response.data;
    } catch (error) {
      console.error('查询支付状态失败:', error.response?.data || error.message || error);
      throw error;
    }
  },

  // 获取用户支付记录
  getUserPaymentRecords: async () => {
    try {
      console.log('获取用户支付记录');
      const response = await api.get('/api/payments/user/records');
      console.log('用户支付记录响应:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取支付记录失败:', error.response?.data || error.message || error);
      throw error;
    }
  },

  // 打开支付宝支付页面
  openAlipayPage: (payUrl) => {
    // 在新窗口中打开支付宝支付页面
    window.open(payUrl, '_blank');
  }
};

export default paymentService;
