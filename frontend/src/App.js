import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
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
// 支付结果页面
import PaymentResult from './pages/PaymentResult';
// 武友论坛页面
import ForumList from './pages/ForumList';
import ForumDetail from './pages/ForumDetail';
import ForumCreate from './pages/ForumCreate';
import ForumMyPosts from './pages/ForumMyPosts';
import ForumReview from './pages/ForumReview';

// 精品课程页面
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import AdminCourseManagement from './pages/AdminCourseManagement';
import EnrollmentSuccess from './pages/EnrollmentSuccess';
import AdminEnrollmentManagement from './pages/AdminEnrollmentManagement';

// 新增页面
import UserProfile from './pages/UserProfile';
import MyCourses from './pages/MyCourses';
import MyAppointments from './pages/MyAppointments';
import ActionGuidance from './pages/ActionGuidance';
import CoachTeam from './pages/CoachTeam';
import OfflineGuidance from './pages/OfflineGuidance';
import BeginnerCourses from './pages/BeginnerCourses';
import AdvancedCourses from './pages/AdvancedCourses';
import ProfessionalSkills from './pages/ProfessionalSkills';
import AboutUs from './pages/AboutUs';
import CourseStudy from './pages/CourseStudy';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorPrimary: '#4F49FF', // XtalPi靛蓝色
      },
    }}>
      <Router>
        <div className="App">
          <Routes>
            {/* 首页路由 */}
            <Route path="/" element={
              <Layout>
                <HomePage />
              </Layout>
            } />

            {/* 登录页面（不使用布局组件，有自己的设计） */}
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
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

            {/* 支付结果页面 */}
            <Route path="/payment/result" element={
              <ProtectedRoute>
                <PaymentResult />
              </ProtectedRoute>
            } />

            {/* 武友论坛路由 */}
            <Route path="/forum" element={
              <ProtectedRoute>
                <ForumList />
              </ProtectedRoute>
            } />
            <Route path="/forum/post/:postId" element={
              <ProtectedRoute>
                <ForumDetail />
              </ProtectedRoute>
            } />
            <Route path="/forum/create" element={
              <ProtectedRoute>
                <ForumCreate />
              </ProtectedRoute>
            } />
            <Route path="/forum/my-posts" element={
              <ProtectedRoute>
                <ForumMyPosts />
              </ProtectedRoute>
            } />
            <Route path="/forum/review" element={
              <ProtectedRoute>
                <ForumReview />
              </ProtectedRoute>
            } />

            {/* 精品课程路由 */}
            <Route path="/courses" element={
              <CourseList />
            } />
            <Route path="/courses/:courseId" element={
              <CourseDetail />
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute>
                <AdminCourseManagement />
              </ProtectedRoute>
            } />

            <Route path="/admin/enrollments" element={
              <ProtectedRoute>
                <AdminEnrollmentManagement />
              </ProtectedRoute>
            } />

            <Route path="/enrollment-success" element={
              <EnrollmentSuccess />
            } />

            {/* 用户个人中心相关页面 */}
            <Route path="/user-profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/my-courses" element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            } />
            <Route path="/my-appointments" element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            } />

            {/* 智能分析服务页面 */}
            <Route path="/action-guidance" element={
              <ProtectedRoute>
                <ActionGuidance />
              </ProtectedRoute>
            } />

            {/* 教练资源页面 */}
            <Route path="/coach-team" element={
              <CoachTeam />
            } />
            <Route path="/offline-guidance" element={
              <OfflineGuidance />
            } />

            {/* 课程中心页面 */}
            <Route path="/beginner-courses" element={
              <BeginnerCourses />
            } />
            <Route path="/advanced-courses" element={
              <AdvancedCourses />
            } />
            <Route path="/professional-skills" element={
              <ProfessionalSkills />
            } />

            {/* 课程学习页面 */}
            <Route path="/course-study/:courseId" element={
              <ProtectedRoute>
                <CourseStudy />
              </ProtectedRoute>
            } />

            {/* 关于我们页面 */}
            <Route path="/about" element={
              <AboutUs />
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
