#!/usr/bin/env python3
"""
测试coach2用户登录流程
"""
import requests
import json

# 配置
BASE_URL = "http://localhost:5000"
USERNAME = "coach2"
PASSWORD = "12345678"

def test_login():
    """测试登录接口"""
    print("=== 测试登录接口 ===")

    login_data = {
        "username": USERNAME,
        "password": PASSWORD
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            proxies={"http": None, "https": None}  # 禁用代理
        )

        print(f"登录请求状态码: {response.status_code}")
        print(f"登录响应内容: {response.text}")

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

def test_user_info(token):
    """测试获取用户信息接口"""
    print("\n=== 测试用户信息接口 ===")

    if not token:
        print("没有有效的token，跳过用户信息测试")
        return

    try:
        response = requests.get(
            f"{BASE_URL}/api/auth/user",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            proxies={"http": None, "https": None}  # 禁用代理
        )

        print(f"用户信息请求状态码: {response.status_code}")
        print(f"用户信息响应内容: {response.text}")

        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"获取用户信息成功: {data.get('username')}")
            else:
                print(f"获取用户信息失败: {data.get('message')}")
        else:
            print(f"用户信息请求失败，状态码: {response.status_code}")

    except Exception as e:
        print(f"用户信息请求异常: {e}")

def main():
    print("开始测试coach2用户登录流程...")

    # 测试登录
    token = test_login()

    # 测试用户信息获取
    test_user_info(token)

    print("\n测试完成")

if __name__ == "__main__":
    main()
