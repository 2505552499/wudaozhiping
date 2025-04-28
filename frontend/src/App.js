import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ImageAnalysis from './pages/ImageAnalysis';
import VideoAnalysis from './pages/VideoAnalysis';
import CameraAnalysis from './pages/CameraAnalysis';
import KnowledgeBase from './pages/KnowledgeBase';
import Settings from './pages/Settings';
import CoachAppointment from './pages/CoachAppointment';
import CoachDashboard from './pages/CoachDashboard';
import CoachProfile from './pages/CoachProfile';
import MessageCenter from './pages/MessageCenter';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorPrimary: '#c62828',
      },
    }}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/image-analysis" element={
              <ProtectedRoute>
                <ImageAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/video-analysis" element={
              <ProtectedRoute>
                <VideoAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/camera-analysis" element={
              <ProtectedRoute>
                <CameraAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/knowledge-base" element={
              <ProtectedRoute>
                <KnowledgeBase />
              </ProtectedRoute>
            } />
            <Route path="/coach-appointment" element={
              <ProtectedRoute>
                <CoachAppointment />
              </ProtectedRoute>
            } />
            <Route path="/coach-dashboard" element={
              <ProtectedRoute>
                <CoachDashboard />
              </ProtectedRoute>
            } />
            <Route path="/coach-profile" element={
              <ProtectedRoute>
                <CoachProfile />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <MessageCenter />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
