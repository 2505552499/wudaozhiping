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

const coachAPI = {
  // 获取教练列表
  getCoaches: () => {
    return api.get('/api/coaches');
  },
  
  // 获取教练详情
  getCoachDetail: (coachId) => {
    return api.get(`/api/coach/${coachId}`);
  },
  
  // 获取城市列表
  getCities: () => {
    return api.get('/api/cities');
  },
  
  // 获取区域列表
  getDistricts: (city) => {
    return api.get(`/api/districts?city=${city}`);
  },
  
  // 发送消息给教练
  sendMessage: (data) => {
    return api.post('/api/send_message', data);
  },
  
  // 评价教练
  rateCoach: (coachId, rating, comment) => {
    return api.post('/api/rate_coach', {
      coach_id: coachId,
      rating,
      comment
    });
  }
};

export default coachAPI;
