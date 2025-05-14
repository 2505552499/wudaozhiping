"""
代理服务器，将前端的API请求重定向到后端服务
"""

from flask import Flask, request, Response
import requests

app = Flask(__name__)

@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy(path):
    # 将请求转发到后端服务
    url = f'http://localhost:5000/{path}'
    
    # 转发请求头
    headers = {key: value for key, value in request.headers if key != 'Host'}
    
    # 转发请求体
    data = request.get_data()
    
    # 发送请求
    resp = requests.request(
        method=request.method,
        url=url,
        headers=headers,
        data=data,
        cookies=request.cookies,
        allow_redirects=False
    )
    
    # 创建响应对象
    response = Response(resp.content, resp.status_code)
    
    # 转发响应头
    for key, value in resp.headers.items():
        if key.lower() != 'content-length':
            response.headers[key] = value
    
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
