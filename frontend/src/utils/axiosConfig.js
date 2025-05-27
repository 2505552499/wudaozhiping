import axios from 'axios';
import config from '../config';

// 全局axios配置
const setupAxiosDefaults = () => {
  // 设置默认基础URL
  axios.defaults.baseURL = config.API_BASE_URL;
  
  // 禁用代理（在开发环境中避免代理冲突）
  axios.defaults.proxy = false;
  
  // 设置默认超时时间
  axios.defaults.timeout = 30000;
  
  // 设置默认请求头
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  
  // 添加请求拦截器，自动添加认证token
  axios.interceptors.request.use(
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
  
  // 添加响应拦截器，处理通用错误
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // 如果是401错误，清除token并跳转到登录页
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        // 如果不在登录页，则跳转到登录页
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosDefaults;
