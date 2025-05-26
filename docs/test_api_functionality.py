#!/usr/bin/env python3
"""
武道智评平台 API 功能测试脚本
测试所有主要API端点的功能完整性
"""

import requests
import json
import sys
import time

BASE_URL = "http://localhost:5000"

class APITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.tokens = {}
        self.test_results = []
        
    def log_test(self, test_name, success, message=""):
        """记录测试结果"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = f"{status} {test_name}"
        if message:
            result += f" - {message}"
        print(result)
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message
        })
        
    def test_basic_endpoints(self):
        """测试基础端点"""
        print("\n=== 测试基础端点 ===")
        
        # 测试姿势列表
        try:
            response = self.session.get(f"{self.base_url}/api/poses")
            success = response.status_code == 200 and 'poses' in response.json()
            self.log_test("获取姿势列表", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取姿势列表", False, str(e))
            
        # 测试城市列表
        try:
            response = self.session.get(f"{self.base_url}/api/cities")
            success = response.status_code == 200 and 'cities' in response.json()
            self.log_test("获取城市列表", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取城市列表", False, str(e))
            
        # 测试教练列表
        try:
            response = self.session.get(f"{self.base_url}/api/coaches")
            success = response.status_code == 200 and 'coaches' in response.json()
            self.log_test("获取教练列表", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取教练列表", False, str(e))
            
    def test_authentication(self):
        """测试认证系统"""
        print("\n=== 测试认证系统 ===")
        
        # 测试游客登录
        try:
            response = self.session.post(f"{self.base_url}/api/auth/login", 
                                       json={"username": "guest", "password": "guest"})
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data:
                    self.tokens['guest'] = data['access_token']
                    self.log_test("游客登录", True, "获取到token")
                else:
                    self.log_test("游客登录", False, "未获取到token")
            else:
                self.log_test("游客登录", False, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("游客登录", False, str(e))
            
        # 测试教练登录
        try:
            response = self.session.post(f"{self.base_url}/api/auth/login", 
                                       json={"username": "coach1", "password": "12345678"})
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data:
                    self.tokens['coach1'] = data['access_token']
                    self.log_test("教练登录", True, "获取到token")
                else:
                    self.log_test("教练登录", False, "未获取到token")
            else:
                self.log_test("教练登录", False, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("教练登录", False, str(e))
            
    def test_coach_apis(self):
        """测试教练API"""
        print("\n=== 测试教练API ===")
        
        if 'coach1' not in self.tokens:
            self.log_test("教练API测试", False, "缺少教练token")
            return
            
        headers = {"Authorization": f"Bearer {self.tokens['coach1']}"}
        
        # 测试获取教练发布的预约
        try:
            response = self.session.get(f"{self.base_url}/api/coach/published_appointments", 
                                      headers=headers)
            success = response.status_code == 200
            self.log_test("获取教练发布的预约", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取教练发布的预约", False, str(e))
            
        # 测试获取教练预约
        try:
            response = self.session.get(f"{self.base_url}/api/coach/appointments", 
                                      headers=headers)
            success = response.status_code == 200
            self.log_test("获取教练预约", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取教练预约", False, str(e))
            
        # 测试获取教练资料
        try:
            response = self.session.get(f"{self.base_url}/api/coach/profile", 
                                      headers=headers)
            success = response.status_code == 200
            self.log_test("获取教练资料", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取教练资料", False, str(e))
            
    def test_user_apis(self):
        """测试用户API"""
        print("\n=== 测试用户API ===")
        
        if 'guest' not in self.tokens:
            self.log_test("用户API测试", False, "缺少用户token")
            return
            
        headers = {"Authorization": f"Bearer {self.tokens['guest']}"}
        
        # 测试获取用户信息
        try:
            response = self.session.get(f"{self.base_url}/api/auth/user", 
                                      headers=headers)
            success = response.status_code == 200
            self.log_test("获取用户信息", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取用户信息", False, str(e))
            
        # 测试获取消息
        try:
            response = self.session.get(f"{self.base_url}/api/messages", 
                                      headers=headers)
            success = response.status_code == 200
            self.log_test("获取用户消息", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取用户消息", False, str(e))
            
    def test_location_apis(self):
        """测试地理位置API"""
        print("\n=== 测试地理位置API ===")
        
        # 测试获取区域列表
        try:
            response = self.session.get(f"{self.base_url}/api/districts/北京市")
            success = response.status_code == 200 and 'districts' in response.json()
            self.log_test("获取区域列表", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取区域列表", False, str(e))
            
    def test_course_apis(self):
        """测试课程API"""
        print("\n=== 测试课程API ===")
        
        # 测试获取课程列表
        try:
            response = self.session.get(f"{self.base_url}/api/courses")
            success = response.status_code == 200
            self.log_test("获取课程列表", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取课程列表", False, str(e))
            
    def test_forum_apis(self):
        """测试论坛API"""
        print("\n=== 测试论坛API ===")
        
        # 测试获取帖子列表
        try:
            response = self.session.get(f"{self.base_url}/api/forum/posts")
            success = response.status_code == 200
            self.log_test("获取论坛帖子", success, f"状态码: {response.status_code}")
        except Exception as e:
            self.log_test("获取论坛帖子", False, str(e))
            
    def run_all_tests(self):
        """运行所有测试"""
        print("🚀 开始API功能测试...")
        print(f"测试目标: {self.base_url}")
        
        self.test_basic_endpoints()
        self.test_authentication()
        self.test_coach_apis()
        self.test_user_apis()
        self.test_location_apis()
        self.test_course_apis()
        self.test_forum_apis()
        
        # 统计结果
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"\n📊 测试结果统计:")
        print(f"总测试数: {total_tests}")
        print(f"通过: {passed_tests} ✅")
        print(f"失败: {failed_tests} ❌")
        print(f"成功率: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ 失败的测试:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
                    
        return failed_tests == 0

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)
