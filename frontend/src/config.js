// API配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000' 
    : `http://${window.location.hostname}:5000`);

// 导出配置对象和单独的API基础URL
export { API_BASE_URL };

const config = {
  API_BASE_URL
};

export default config;
