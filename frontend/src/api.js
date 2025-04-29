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
  // 获取我的预约
  getUserAppointments: () => api.get('/api/user/appointments'),
  
  // 创建预约
  createAppointment: (data) => api.post('/api/user/create_appointment', data),
  
  // 获取教练发布的预约信息和审核状态
  getCoachPublishedAppointments: () => api.get('/api/coach/published_appointments'),
  
  // 更新预约状态
  updateAppointmentStatus: (appointmentId, status) => 
    api.put(`/api/appointments/${appointmentId}`, { status }),
  
  // 取消预约
  cancelAppointment: (appointmentId) => api.delete(`/api/appointments/${appointmentId}`),
  
  // 获取教练的所有预约（仅教练可用）
  getCoachAppointments: () => api.get('/api/coach/appointments'),
  
  // 获取教练的所有预约及其状态（仅教练可用）
  getCoachAppointmentsWithStatus: () => api.get('/api/coach/appointments/with_status'),
  
  // 教练发布服务信息（仅教练可用）
  createCoachAppointment: (data) => api.post('/api/coach/create_appointment', data),
  
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

// 管理员相关API
export const adminAPI = {
  // 获取待审核的预约
  getPendingAppointments: () => api.get('/api/admin/appointments?status=pending'),
  
  // 获取已审核通过的预约
  getApprovedAppointments: () => api.get('/api/admin/appointments?status=approved'),
  
  // 获取已拒绝的预约
  getRejectedAppointments: () => api.get('/api/admin/appointments?status=rejected'),
  
  // 获取已撤销的预约
  getRevokedAppointments: () => api.get('/api/admin/appointments?status=revoked'),
  
  // 审核预约
  reviewAppointment: (appointmentId, action, reason) => api.post(`/api/admin/appointments/${appointmentId}/review`, {
    action,
    reason
  }),
  
  // 管理员撤销预约（软删除）
  revokeAppointment: (appointmentId) => {
    return api.post(`/api/admin/appointments/${appointmentId}/revoke`);
  },
  
  // 管理员删除预约（真实删除）
  deleteAppointment: (appointmentId) => {
    return api.delete(`/api/admin/appointments/${appointmentId}`);
  },
};

// 通用的带认证的fetch函数，用于管理员审核等功能
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${config.API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

export default api;
