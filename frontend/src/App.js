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
import AdminAppointmentReview from './pages/AdminAppointmentReview';
import CoachCreateAppointment from './pages/CoachCreateAppointment';
import CoachDetail from './pages/CoachDetail';
import CoachProfileEdit from './pages/CoachProfileEdit';
import CoachAppointmentCreate from './pages/CoachAppointmentCreate';

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
            {/* 管理员预约审核页面 */}
            <Route path="/admin-review" element={
              <ProtectedRoute>
                <AdminAppointmentReview />
              </ProtectedRoute>
            } />
            {/* 教练创建预约页面 */}
            <Route path="/coach-create-appointment" element={
              <ProtectedRoute>
                <CoachCreateAppointment />
              </ProtectedRoute>
            } />
            
            {/* 教练详情页面 */}
            <Route path="/coach/:coachId" element={
              <ProtectedRoute>
                <CoachDetail />
              </ProtectedRoute>
            } />
            
            {/* 教练资料编辑页面 */}
            <Route path="/coach-profile-edit" element={
              <ProtectedRoute>
                <CoachProfileEdit />
              </ProtectedRoute>
            } />
            
            {/* 教练发布预约页面 */}
            <Route path="/coach-appointment-create" element={
              <ProtectedRoute>
                <CoachAppointmentCreate />
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
