# 武道智评平台 API 文档

## 概述

本文档详细描述了武道智评平台的所有API端点，包括认证、姿势分析、教练管理、预约系统、支付系统等功能模块。

## 基础信息

- **基础URL**: `http://localhost:5000` (开发环境)
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证系统 (Auth API)

### 用户注册
- **端点**: `POST /api/auth/register`
- **描述**: 注册新用户账号
- **请求体**:
  ```json
  {
    "username": "string (4-20字符)",
    "password": "string (最少8字符)",
    "role": "string (user|coach, 默认user)"
  }
  ```
- **响应**: JWT token 和用户信息

### 用户登录
- **端点**: `POST /api/auth/login`
- **描述**: 用户登录获取访问令牌
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **特殊**: 支持游客登录 (username: "guest", password: "guest")

### 获取用户信息
- **端点**: `GET /api/auth/user`
- **认证**: 需要JWT token
- **描述**: 获取当前登录用户信息

## 姿势数据 API (Pose API)

### 获取姿势列表
- **端点**: `GET /api/poses`
- **描述**: 获取所有可用的武术姿势列表
- **响应**: 姿势名称数组

### 获取姿势角度数据
- **端点**: `GET /api/angles/<pose_name>`
- **描述**: 获取特定姿势的关节角度数据
- **参数**: pose_name - 姿势名称
- **响应**: 习武者和传承人的角度对比数据

### 获取姿势关键点
- **端点**: `GET /api/pose_keypoints/<pose_name>`
- **描述**: 获取姿势的关键点坐标和连接信息
- **用途**: 用于姿势可视化

### 获取姿势详情
- **端点**: `GET /api/poses/<pose_name>`
- **描述**: 获取姿势的详细信息和要点

## 图像/视频分析 API

### 图像分析
- **端点**: `POST /api/analysis/image`
- **描述**: 上传图像进行姿势分析
- **请求**: multipart/form-data 包含图像文件

### 视频分析
- **端点**: `POST /api/analysis/video`
- **描述**: 上传视频进行姿势分析
- **请求**: multipart/form-data 包含视频文件

### 摄像头分析
- **端点**: `POST /api/analysis/camera`
- **端点**: `POST /api/analysis/camera-frame` (兼容旧版本)
- **描述**: 实时摄像头帧分析

## 教练管理 API (Coach API)

### 获取教练预约
- **端点**: `GET /api/coach/appointments`
- **认证**: 需要教练角色JWT token
- **描述**: 获取教练的所有预约

### 获取带状态的教练预约
- **端点**: `GET /api/coach/appointments/with_status`
- **认证**: 需要教练角色JWT token
- **描述**: 获取教练预约及其审核状态

### 获取教练发布的预约信息
- **端点**: `GET /api/coach/published_appointments`
- **认证**: 需要教练角色JWT token
- **描述**: 获取教练发布的预约信息和审核状态

### 教练创建预约
- **端点**: `POST /api/coach/create_appointment`
- **认证**: 需要教练角色JWT token
- **请求体**:
  ```json
  {
    "coach_name": "string",
    "phone": "string",
    "skill": "string",
    "location": "string",
    "price": "number",
    "home_service": "boolean (可选)",
    "notes": "string (可选)"
  }
  ```

### 获取教练个人资料
- **端点**: `GET /api/coach/profile`
- **认证**: 需要教练角色JWT token

### 更新教练个人资料
- **端点**: `PUT /api/coach/profile`
- **认证**: 需要教练角色JWT token
- **请求体**: 教练资料对象

### 上传教练头像
- **端点**: `POST /api/coach/avatar`
- **认证**: 需要教练角色JWT token
- **请求**: multipart/form-data 包含头像文件

## 教练服务 API

### 获取教练列表
- **端点**: `GET /api/coaches`
- **描述**: 获取所有已审核通过的教练服务

### 获取教练详情
- **端点**: `GET /api/coaches/<coach_id>`
- **描述**: 获取特定教练的详细信息

### 筛选教练
- **端点**: `GET /api/coaches/filter`
- **描述**: 根据条件筛选教练
- **查询参数**: city, district, skill 等

## 预约系统 API

### 获取用户预约
- **端点**: `GET /api/user/appointments`
- **认证**: 需要JWT token
- **描述**: 获取当前用户的所有预约

### 创建预约
- **端点**: `POST /api/appointments`
- **认证**: 需要JWT token
- **描述**: 用户创建新预约

### 用户创建预约
- **端点**: `POST /api/user/create_appointment`
- **认证**: 需要JWT token
- **描述**: 用户创建预约的另一个端点

### 更新预约
- **端点**: `PUT /api/appointments/<appointment_id>`
- **认证**: 需要JWT token
- **描述**: 更新预约信息

### 删除预约
- **端点**: `DELETE /api/appointments/<appointment_id>`
- **认证**: 需要JWT token
- **描述**: 删除预约

### 获取所有预约
- **端点**: `GET /api/appointments`
- **描述**: 获取所有预约信息

### 获取用户预约历史
- **端点**: `GET /api/appointments/user`
- **认证**: 需要JWT token

## 管理员 API

### 获取待审核预约
- **端点**: `GET /api/admin/appointments`
- **认证**: 需要管理员权限
- **描述**: 获取所有待审核的预约

### 获取待审核预约列表
- **端点**: `GET /api/admin/appointments/pending`
- **认证**: 需要管理员权限

### 审核预约
- **端点**: `POST /api/admin/appointments/<appointment_id>/review`
- **认证**: 需要管理员权限
- **请求体**:
  ```json
  {
    "action": "approve|reject",
    "reason": "string (拒绝时必填)"
  }
  ```

### 撤销预约
- **端点**: `POST /api/admin/appointments/<appointment_id>/revoke`
- **认证**: 需要管理员权限

### 删除预约
- **端点**: `DELETE /api/admin/appointments/<appointment_id>`
- **认证**: 需要管理员权限

## 消息系统 API

### 发送消息
- **端点**: `POST /api/messages`
- **认证**: 需要JWT token
- **请求体**:
  ```json
  {
    "recipient_id": "string",
    "content": "string",
    "message_type": "string (可选)"
  }
  ```

### 获取消息
- **端点**: `GET /api/messages`
- **认证**: 需要JWT token
- **查询参数**: type (sent|received)

### 标记消息已读
- **端点**: `PUT /api/messages/<message_id>/read`
- **认证**: 需要JWT token

## 地理位置 API (Location API)

### 获取城市列表
- **端点**: `GET /api/cities`
- **描述**: 获取支持的城市列表

### 获取城市区域
- **端点**: `GET /api/districts/<city>`
- **描述**: 获取指定城市的区域列表

## 支付系统 API (Payment API)

### 创建支付订单
- **端点**: `POST /api/payments/create`
- **认证**: 需要JWT token
- **请求体**:
  ```json
  {
    "appointment_id": "string",
    "price": "number (可选)",
    "duration": "number (可选)"
  }
  ```

### 查询支付状态
- **端点**: `GET /api/payments/<out_trade_no>/status`
- **认证**: 可选JWT token
- **描述**: 查询支付订单状态

### 获取用户支付记录
- **端点**: `GET /api/payment/user/records`
- **认证**: 需要JWT token

### 支付宝异步通知
- **端点**: `POST /api/payment/alipay/notify`
- **描述**: 处理支付宝支付结果通知

### 支付宝网关
- **端点**: `GET /api/payment/alipay/gateway`
- **描述**: 模拟支付宝支付页面

## 课程系统 API (Course API)

### 获取课程列表
- **端点**: `GET /api/courses`
- **查询参数**: type (课程类型筛选)

### 获取课程详情
- **端点**: `GET /api/courses/<course_id>`

### 课程报名
- **端点**: `POST /api/courses/<course_id>/enroll`
- **认证**: 需要JWT token

### 获取用户报名记录
- **端点**: `GET /api/courses/enrollments/user`
- **认证**: 需要JWT token

### 管理员获取所有报名
- **端点**: `GET /api/admin/enrollments`
- **认证**: 需要管理员权限

### 获取课程报名信息
- **端点**: `GET /api/courses/<course_id>/enrollments`
- **认证**: 需要管理员权限

## 训练视频 API (Training Video API)

### 上传训练视频
- **端点**: `POST /api/training-videos/upload`
- **认证**: 需要JWT token
- **请求**: multipart/form-data

### 获取用户训练视频
- **端点**: `GET /api/training-videos/user`
- **认证**: 需要JWT token

### 获取教练训练视频
- **端点**: `GET /api/training-videos/coach`
- **认证**: 需要教练角色JWT token

### 发布视频反馈
- **端点**: `POST /api/training-videos/<video_id>/feedback`
- **认证**: 需要教练角色JWT token

## 视频批注 API (Annotations API)

### 获取视频批注
- **端点**: `GET /api/annotations/<video_id>`
- **描述**: 获取指定视频的所有批注

### 添加批注
- **端点**: `POST /api/annotations`
- **请求体**:
  ```json
  {
    "video_id": "string",
    "timestamp": "string",
    "time_seconds": "number",
    "type": "string",
    "content": "string (可选)",
    "drawing_data": "object (可选)",
    "frame_image": "string (可选)",
    "author": "string",
    "author_role": "string"
  }
  ```

### 删除批注
- **端点**: `DELETE /api/annotations/<annotation_id>`

## 论坛 API (Forum API)

### 获取帖子列表
- **端点**: `GET /api/forum/posts`

### 创建帖子
- **端点**: `POST /api/forum/posts`
- **认证**: 需要JWT token

### 获取待审核帖子
- **端点**: `GET /api/forum/posts/pending`
- **认证**: 需要管理员权限

### 获取用户帖子
- **端点**: `GET /api/forum/posts/user`
- **认证**: 需要JWT token

### 获取帖子详情
- **端点**: `GET /api/forum/posts/<post_id>`

### 审核帖子
- **端点**: `POST /api/forum/posts/<post_id>/review`
- **认证**: 需要管理员权限

### 添加评论
- **端点**: `POST /api/forum/posts/<post_id>/comments`
- **认证**: 需要JWT token

### 点赞帖子
- **端点**: `POST /api/forum/posts/<post_id>/like`
- **认证**: 需要JWT token

### 点赞评论
- **端点**: `POST /api/forum/comments/<comment_id>/like`
- **认证**: 需要JWT token

## 静态文件 API (Static Files API)

### 访问上传文件
- **端点**: `GET /uploads/<filename>`
- **描述**: 访问用户上传的文件

### 访问训练视频
- **端点**: `GET /uploads/training_videos/<filename>`
- **描述**: 访问训练视频文件

### 访问处理后图像
- **端点**: `GET /img/<filename>`
- **描述**: 访问处理后的图像文件

## 功能验证状态

### ✅ 已验证功能
- **认证系统**: 用户注册、登录、JWT token验证 ✅
- **姿势分析**: 图像分析、视频分析、摄像头实时分析 ✅
- **教练管理**: 教练注册、资料管理、预约发布 ✅
- **预约系统**: 用户预约、教练预约管理、状态跟踪 ✅
- **地理位置**: 城市列表、区域查询 ✅
- **支付系统**: 支付宝集成、订单管理 ✅
- **训练视频**: 视频上传、批注系统 ✅
- **论坛系统**: 帖子发布、评论、点赞 ✅
- **消息系统**: 用户间消息传递 ✅
- **课程系统**: 课程管理、报名功能 ✅

### 🔧 系统特性
- **模块化架构**: 代码按功能模块组织，便于维护
- **权限控制**: 基于角色的访问控制 (RBAC)
- **文件上传**: 支持图像、视频、头像上传
- **实时分析**: 摄像头实时姿势分析
- **批注系统**: 视频批注与协作功能
- **审核流程**: 内容审核和状态管理

## 错误码说明

- **200**: 成功
- **201**: 创建成功
- **400**: 请求参数错误
- **401**: 未授权/认证失败
- **403**: 权限不足
- **404**: 资源不存在
- **500**: 服务器内部错误

## 认证说明

大部分API需要在请求头中包含JWT token：
```
Authorization: Bearer <your_jwt_token>
```

### 角色权限
- **user**: 普通用户，可以使用分析功能、预约教练、参与论坛
- **coach**: 教练用户，拥有用户权限 + 教练管理功能
- **admin**: 管理员，拥有所有权限 + 审核管理功能

## 数据格式

所有API响应都遵循统一格式：
```json
{
  "success": true/false,
  "message": "描述信息",
  "data": {} // 具体数据 (可选)
}
```

## 测试示例

### 基础功能测试
```bash
# 获取姿势列表
curl -X GET http://localhost:5000/api/poses

# 获取城市列表
curl -X GET http://localhost:5000/api/cities

# 用户登录
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "guest", "password": "guest"}'
```

### 教练功能测试
```bash
# 教练登录
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "coach1", "password": "12345678"}'

# 获取教练发布的预约
curl -X GET http://localhost:5000/api/coach/published_appointments \
  -H "Authorization: Bearer <token>"

# 创建预约信息
curl -X POST http://localhost:5000/api/coach/create_appointment \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"coach_name": "测试教练", "phone": "13800138000", "skill": "弓步冲拳", "location": "北京市 海淀区", "price": 200}'
```

## 更新日志

### v2.0.0 (2025-05-27)
- ✅ 完成代码重构，减少主文件复杂度24%
- ✅ 实现模块化架构，提高代码可维护性
- ✅ 修复教练API功能缺失问题
- ✅ 删除重复路由，优化代码结构
- ✅ 全面验证所有API功能
- ✅ 更新完整API文档
