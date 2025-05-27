#!/usr/bin/env python3
"""
测试管理员预约审核API
"""
import requests
import json

# 配置
BASE_URL = "http://localhost:5000"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"

def login_admin():
    """管理员登录"""
    print("=== 管理员登录 ===")

    login_data = {
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            proxies={"http": None, "https": None}
        )

        print(f"登录状态码: {response.status_code}")
        print(f"登录响应: {response.text}")

        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                token = data.get('access_token')
                print(f"登录成功，获得token: {token[:50]}...")
                return token
            else:
                print(f"登录失败: {data.get('message')}")
                return None
        else:
            print(f"登录请求失败，状态码: {response.status_code}")
            return None

    except Exception as e:
        print(f"登录请求异常: {e}")
        return None

def test_admin_appointments(token, status="pending"):
    """测试获取管理员预约列表"""
    print(f"\n=== 测试获取{status}预约列表 ===")

    if not token:
        print("没有有效的token，跳过测试")
        return

    try:
        url = f"{BASE_URL}/api/admin/appointments?status={status}"
        print(f"请求URL: {url}")

        response = requests.get(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            proxies={"http": None, "https": None}
        )

        print(f"请求状态码: {response.status_code}")
        print(f"响应内容: {response.text}")

        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                appointments = data.get('appointments', [])
                print(f"成功获取{len(appointments)}条{status}预约")
                for i, apt in enumerate(appointments[:3]):  # 只显示前3条
                    print(f"  预约{i+1}: ID={apt.get('id')}, 教练={apt.get('coach_name')}, 状态={apt.get('approval_status')}")
            else:
                print(f"获取预约失败: {data.get('message')}")
        else:
            print(f"请求失败，状态码: {response.status_code}")

    except Exception as e:
        print(f"请求异常: {e}")

def check_appointments_file():
    """检查预约文件内容"""
    print("\n=== 检查预约文件内容 ===")

    try:
        with open('data/appointments.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            appointments = data.get('appointments', [])

        print(f"文件中共有{len(appointments)}条预约记录")

        # 按状态分组统计
        status_count = {}
        for apt in appointments:
            status = apt.get('approval_status', 'pending')
            status_count[status] = status_count.get(status, 0) + 1

        print("预约状态统计:")
        for status, count in status_count.items():
            print(f"  {status}: {count}条")

        # 显示前几条记录的详细信息
        print("\n前3条预约记录:")
        for i, apt in enumerate(appointments[:3]):
            print(f"  预约{i+1}:")
            print(f"    ID: {apt.get('id')}")
            print(f"    教练: {apt.get('coach_name')}")
            print(f"    用户: {apt.get('user_id')}")
            print(f"    状态: {apt.get('approval_status', 'pending')}")
            print(f"    类型: {apt.get('type', 'unknown')}")

    except Exception as e:
        print(f"读取文件失败: {e}")

def main():
    print("开始测试管理员预约审核API...")

    # 检查预约文件
    check_appointments_file()

    # 管理员登录
    token = login_admin()

    # 测试获取不同状态的预约
    test_admin_appointments(token, "pending")
    test_admin_appointments(token, "approved")
    test_admin_appointments(token, "rejected")
    test_admin_appointments(token, "revoked")

    print("\n测试完成")

if __name__ == "__main__":
    main()
