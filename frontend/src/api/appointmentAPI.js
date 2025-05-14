import axios from 'axios';
import { API_BASE_URL } from '../config';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 添加请求拦截器，自动添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const appointmentAPI = {
  // 创建预约
  createAppointment: (data) => {
    return api.post('/api/user/create_appointment', data);
  },
  
  // 获取用户的预约列表
  getUserAppointments: () => {
    return api.get('/api/user/appointments');
  },
  
  // 取消预约
  cancelAppointment: (appointmentId) => {
    return api.delete(`/api/appointments/${appointmentId}`);
  },
  
  // 教练确认预约
  confirmAppointment: (appointmentId) => {
    return api.post(`/api/coach/confirm_appointment/${appointmentId}`);
  },
  
  // 教练获取预约列表
  getCoachAppointments: () => {
    return api.get('/api/coach/appointments');
  },
  
  // 完成预约
  completeAppointment: (appointmentId) => {
    return api.post(`/api/complete_appointment/${appointmentId}`);
  }
};

export default appointmentAPI;
