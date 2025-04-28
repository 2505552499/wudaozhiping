import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set the authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Check if the token is valid
        const response = await axios.get('/api/auth/user');
        
        if (response.data.success) {
          setIsAuthenticated(true);
          // Store username in localStorage
          localStorage.setItem('username', response.data.username);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        message.error('登录已过期，请重新登录');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="验证登录状态..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
