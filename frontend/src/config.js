// API配置
const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000' 
      : `http://${window.location.hostname}:5000`)
};

export default config;
