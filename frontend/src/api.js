import axios from 'axios';
import config from './config';

// 创建axios实例
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 教练相关API
export const coachAPI = {
  // 获取所有教练
  getAllCoaches: () => api.get('/api/coaches'),
  
  // 获取特定教练详情
  getCoachDetail: (coachId) => api.get(`/api/coaches/${coachId}`),
  
  // 筛选教练
  filterCoaches: (params) => api.get('/api/coaches/filter', { params }),
  
  // 获取城市列表
  getCities: () => api.get('/api/cities'),
  
  // 获取特定城市的区域列表
  getDistricts: (city) => api.get(`/api/districts/${city}`),
  
  // 获取当前登录教练的个人资料
  getCoachProfile: () => api.get('/api/coach/profile'),
  
  // 更新教练个人资料
  updateCoachProfile: (data) => api.put('/api/coach/profile', data),
  
  // 上传教练头像
  uploadAvatar: (formData) => api.post('/api/coach/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// 预约相关API
export const appointmentAPI = {
  // 获取用户的所有预约
  getUserAppointments: () => api.get('/api/appointments'),
  
  // 创建新预约
  createAppointment: (data) => api.post('/api/appointments', data),
  
  // 更新预约状态
  updateAppointmentStatus: (appointmentId, status) => 
    api.put(`/api/appointments/${appointmentId}`, { status }),
  
  // 取消预约
  cancelAppointment: (appointmentId) => api.delete(`/api/appointments/${appointmentId}`),
  
  // 获取教练的所有预约（仅教练可用）
  getCoachAppointments: () => api.get('/api/coach/appointments'),
  
  // 发送消息
  sendMessage: (data) => api.post('/api/messages', data)
};

// 消息相关API
export const messageAPI = {
  // 获取用户的所有消息
  getUserMessages: () => api.get('/api/messages'),
  
  // 标记消息为已读
  markMessageAsRead: (messageId) => api.put(`/api/messages/${messageId}/read`)
};

export default api;
