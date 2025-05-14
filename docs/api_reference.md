# 武道智评系统 API 接口文档

*最后更新时间: 2025-05-14*

## 目录

- [接口规范](#接口规范)
  - [命名规范](#命名规范)
  - [请求方法](#请求方法)
  - [响应格式](#响应格式)
  - [状态码](#状态码)
  - [认证机制](#认证机制)
- [用户认证接口](#用户认证接口)
- [教练相关接口](#教练相关接口)
- [预约相关接口](#预约相关接口)
- [支付相关接口](#支付相关接口)
- [武友论坛接口](#武友论坛接口)
- [动作分析接口](#动作分析接口)
- [文件上传接口](#文件上传接口)
- [消息系统接口](#消息系统接口)

## 接口规范

### 命名规范

所有 API 路由应遵循以下命名规范:

1. **基础路径**: 所有 API 请求以 `/api` 开头
2. **资源分类**:
   - 用户相关: `/api/user/`
   - 教练相关: `/api/coach/`
   - 管理员相关: `/api/admin/`
   - 通用资源: `/api/资源名称复数形式/`

3. **路径命名**:
   - 使用小写字母
   - 单词之间用下划线连接
   - 资源名称使用复数形式 (例如 `/api/appointments/`)
   - 参数使用尖括号标注 (例如 `/api/appointments/<appointment_id>`)

4. **版本控制** (未来扩展):
   - 若需版本控制，在基础路径后添加版本号: `/api/v1/user/...`

### 请求方法

- `GET`: 获取资源
- `POST`: 创建资源
- `PUT`: 完全更新资源
- `PATCH`: 部分更新资源
- `DELETE`: 删除资源

### 响应格式

所有 API 响应应返回 JSON 格式，结构如下:

```json
{
  "success": true/false,         // 操作是否成功
  "message": "操作结果说明",       // 用户友好的消息
  "data": {},                    // 响应数据 (可选)
  "errors": []                   // 详细错误信息 (可选)
}
```

### 状态码

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未认证
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误

### 认证机制

本系统使用 JWT (JSON Web Token) 进行认证:

1. 客户端通过 `/api/auth/login` 获取 token
2. 后续请求在 HTTP 头部的 `Authorization` 字段中添加: `Bearer <token>`

## 用户认证接口

### 注册用户

- **路径**: `/api/auth/register`
- **方法**: `POST`
- **描述**: 创建新用户
- **请求参数**:
  ```json
  {
    "username": "用户名",
    "password": "密码",
    "email": "邮箱",
    "role": "用户角色 (user/coach/admin)"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "注册成功",
    "data": {
      "user_id": "用户ID",
      "username": "用户名",
      "role": "user"
    }
  }
  ```

### 用户登录

- **路径**: `/api/auth/login`
- **方法**: `POST`
- **描述**: 用户登录获取 token
- **请求参数**:
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "token": "JWT令牌",
      "user": {
        "username": "用户名",
        "role": "user"
      }
    }
  }
  ```

### 获取当前用户信息

- **路径**: `/api/auth/user`
- **方法**: `GET`
- **描述**: 获取当前登录用户信息
- **认证**: 需要 JWT 令牌
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "username": "用户名",
      "email": "邮箱",
      "role": "角色"
    }
  }
  ```

## 教练相关接口

### 获取所有教练列表

- **路径**: `/api/coaches`
- **方法**: `GET`
- **描述**: 获取所有教练信息
- **查询参数**:
  - `skill` (可选): 按技能筛选
  - `city` (可选): 按城市筛选
  - `district` (可选): 按区域筛选
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "coaches": [
        {
          "id": "教练ID",
          "name": "姓名",
          "avatar": "头像URL",
          "skills": ["技能1", "技能2"],
          "location": {
            "city": "城市",
            "districts": ["区域1", "区域2"]
          },
          "rating": 4.5,
          "price": 200
        }
      ]
    }
  }
  ```

### 获取特定教练信息

- **路径**: `/api/coaches/<coach_id>`
- **方法**: `GET`
- **描述**: 获取特定教练详细信息
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "教练ID",
      "name": "姓名",
      "avatar": "头像URL",
      "skills": ["技能1", "技能2"],
      "location": {
        "city": "城市",
        "districts": ["区域1", "区域2"]
      },
      "rating": 4.5,
      "price": 200,
      "description": "详细介绍",
      "years_of_experience": 5
    }
  }
  ```

### 获取教练个人资料 (教练用户)

- **路径**: `/api/coach/profile`
- **方法**: `GET`
- **描述**: 教练获取自己的资料
- **认证**: 需要 JWT 令牌 (教练角色)
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "教练ID",
      "username": "用户名",
      "name": "姓名",
      "avatar": "头像URL",
      "skills": ["技能1", "技能2"],
      "location": {...},
      "description": "详细介绍",
      "contact": "联系方式",
      "price": 200
    }
  }
  ```

### 更新教练资料

- **路径**: `/api/coach/profile`
- **方法**: `PUT`
- **描述**: 更新教练个人资料
- **认证**: 需要 JWT 令牌 (教练角色)
- **请求参数**:
  ```json
  {
    "name": "姓名",
    "skills": ["技能1", "技能2"],
    "location": {
      "city": "城市",
      "districts": ["区域1", "区域2"]
    },
    "description": "详细介绍",
    "contact": "联系方式",
    "price": 200
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "资料更新成功",
    "data": {...更新后的资料}
  }
  ```

### 上传教练头像

- **路径**: `/api/coach/avatar`
- **方法**: `POST`
- **描述**: 上传更新教练头像
- **认证**: 需要 JWT 令牌 (教练角色)
- **请求参数**: `multipart/form-data` 形式的图片文件
- **响应**:
  ```json
  {
    "success": true,
    "message": "头像上传成功",
    "data": {
      "avatar_url": "头像URL"
    }
  }
  ```

## 预约相关接口

### 获取用户的预约列表

- **路径**: `/api/user/appointments`
- **方法**: `GET`
- **描述**: 获取当前用户的所有预约
- **认证**: 需要 JWT 令牌
- **响应**:
  ```json
  {
    "appointments": [
      {
        "id": "预约ID",
        "coach_id": "教练ID",
        "coach_name": "教练姓名",
        "coach_avatar": "教练头像URL",
        "date": "2025-05-14",
        "time": "14:30",
        "location": "北京 海淀区",
        "skill": "太极拳",
        "duration": 1,
        "status": "pending/confirmed/completed/cancelled",
        "payment_status": "unpaid/paid",
        "created_at": "2025-05-10T08:30:00Z"
      }
    ]
  }
  ```

### 创建用户预约

- **路径**: `/api/user/appointments`
- **方法**: `POST`
- **描述**: 用户创建新预约
- **认证**: 需要 JWT 令牌
- **请求参数**:
  ```json
  {
    "coach_id": "教练ID",
    "date": "2025-05-20",
    "time": "15:00",
    "skill": "太极拳",
    "duration": 1,
    "location": "北京 海淀区"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "预约创建成功",
    "appointment": {
      "id": "预约ID",
      "coach_id": "教练ID",
      "coach_name": "教练姓名",
      "date": "2025-05-20",
      "time": "15:00",
      "status": "pending",
      ...
    }
  }
  ```

### 取消预约

- **路径**: `/api/appointments/<appointment_id>`
- **方法**: `DELETE`
- **描述**: 取消指定的预约
- **认证**: 需要 JWT 令牌
- **响应**:
  ```json
  {
    "success": true,
    "message": "预约取消成功"
  }
  ```

### 获取教练的预约列表

- **路径**: `/api/coach/appointments`
- **方法**: `GET`
- **描述**: 获取当前教练的所有预约
- **认证**: 需要 JWT 令牌 (教练角色)
- **响应**:
  ```json
  {
    "appointments": [
      {
        "id": "预约ID",
        "user_id": "用户ID",
        "user_name": "用户姓名",
        "date": "2025-05-14",
        "time": "14:30",
        "location": "北京 海淀区",
        "skill": "太极拳",
        "duration": 1,
        "status": "pending/confirmed/completed/cancelled",
        "created_at": "2025-05-10T08:30:00Z"
      }
    ]
  }
  ```

### 教练确认预约

- **路径**: `/api/coach/appointments/<appointment_id>/confirm`
- **方法**: `POST`
- **描述**: 教练确认预约
- **认证**: 需要 JWT 令牌 (教练角色)
- **响应**:
  ```json
  {
    "success": true,
    "message": "预约已确认",
    "data": {
      "appointment_id": "预约ID",
      "status": "confirmed"
    }
  }
  ```

### 完成预约

- **路径**: `/api/appointments/<appointment_id>/complete`
- **方法**: `POST`
- **描述**: 标记预约为已完成
- **认证**: 需要 JWT 令牌
- **响应**:
  ```json
  {
    "success": true,
    "message": "预约已完成",
    "data": {
      "appointment_id": "预约ID",
      "status": "completed"
    }
  }
  ```

## 支付相关接口

### 创建支付订单

- **路径**: `/api/payments/create`
- **方法**: `POST`
- **描述**: 为预约创建支付订单
- **认证**: 需要 JWT 令牌
- **请求参数**:
  ```json
  {
    "appointment_id": "预约ID",
    "payment_method": "alipay",
    "amount": 200.00
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "支付订单创建成功",
    "data": {
      "payment_id": "支付ID",
      "pay_url": "支付跳转URL",
      "amount": 200.00,
      "status": "pending"
    }
  }
  ```

### 查询支付状态

- **路径**: `/api/payments/<payment_id>/status`
- **方法**: `GET`
- **描述**: 查询支付订单状态
- **认证**: 需要 JWT 令牌
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "payment_id": "支付ID",
      "status": "pending/paid/failed/cancelled",
      "paid_at": "2025-05-14T10:30:00Z",
      "appointment_id": "预约ID"
    }
  }
  ```

### 支付回调接口

- **路径**: `/api/payments/callback`
- **方法**: `POST`
- **描述**: 支付平台回调通知接口
- **请求参数**: 根据支付平台定义
- **响应**:
  ```
  success
  ```

## 武友论坛接口

### 获取论坛帖子列表

- **路径**: `/api/forum/posts`
- **方法**: `GET`
- **描述**: 获取论坛帖子列表
- **查询参数**:
  - `page` (可选): 页码
  - `limit` (可选): 每页条数
  - `category` (可选): 分类
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "posts": [
        {
          "id": "帖子ID",
          "title": "标题",
          "content_preview": "内容预览...",
          "author": "作者用户名",
          "created_at": "2025-05-10T08:30:00Z",
          "likes_count": 10,
          "comments_count": 5
        }
      ],
      "total": 100,
      "page": 1,
      "limit": 20
    }
  }
  ```

### 获取帖子详情

- **路径**: `/api/forum/posts/<post_id>`
- **方法**: `GET`
- **描述**: 获取特定帖子详情
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "帖子ID",
      "title": "标题",
      "content": "完整内容...",
      "author": "作者用户名",
      "author_avatar": "作者头像URL",
      "created_at": "2025-05-10T08:30:00Z",
      "likes_count": 10,
      "comments": [
        {
          "id": "评论ID",
          "content": "评论内容",
          "author": "评论者用户名",
          "created_at": "2025-05-11T10:15:00Z",
          "likes_count": 2
        }
      ]
    }
  }
  ```

### 创建帖子

- **路径**: `/api/forum/posts`
- **方法**: `POST`
- **描述**: 创建新帖子
- **认证**: 需要 JWT 令牌
- **请求参数**:
  ```json
  {
    "title": "帖子标题",
    "content": "帖子内容",
    "category": "分类"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "帖子发布成功",
    "data": {
      "post_id": "帖子ID",
      "status": "待审核状态"
    }
  }
  ```

### 评论帖子

- **路径**: `/api/forum/posts/<post_id>/comments`
- **方法**: `POST`
- **描述**: 在帖子下发表评论
- **认证**: 需要 JWT 令牌
- **请求参数**:
  ```json
  {
    "content": "评论内容"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "评论发布成功",
    "data": {
      "comment_id": "评论ID"
    }
  }
  ```

### 点赞帖子

- **路径**: `/api/forum/posts/<post_id>/like`
- **方法**: `POST`
- **描述**: 给帖子点赞
- **认证**: 需要 JWT 令牌
- **响应**:
  ```json
  {
    "success": true,
    "message": "点赞成功",
    "data": {
      "likes_count": 11
    }
  }
  ```

## 动作分析接口

### 上传图片分析

- **路径**: `/api/analysis/image`
- **方法**: `POST`
- **描述**: 上传图片进行姿势分析
- **认证**: 需要 JWT 令牌
- **请求参数**: `multipart/form-data` 形式的图片文件及分析参数
  ```
  image: 图片文件
  posture: 姿势名称
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "score": 85,
      "feedback": ["动作点1不标准", "动作点2基本正确"],
      "image_url": "处理后的图片URL",
      "angle_data": {...角度数据}
    }
  }
  ```

### 上传视频分析

- **路径**: `/api/analysis/video`
- **方法**: `POST`
- **描述**: 上传视频进行姿势分析
- **认证**: 需要 JWT 令牌
- **请求参数**: `multipart/form-data` 形式的视频文件及分析参数
  ```
  video: 视频文件
  posture: 姿势名称
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "job_id": "分析任务ID",
      "status": "processing"
    }
  }
  ```

### 获取视频分析结果

- **路径**: `/api/analysis/video/<job_id>`
- **方法**: `GET`
- **描述**: 获取视频分析结果
- **认证**: 需要 JWT 令牌
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "status": "completed/processing/failed",
      "score": 78,
      "feedback": ["动作序列评价1", "动作序列评价2"],
      "result_video_url": "分析后的视频URL",
      "frames_data": [...关键帧数据]
    }
  }
  ```

### 获取可用姿势列表

- **路径**: `/api/analysis/postures`
- **方法**: `GET`
- **描述**: 获取系统支持的姿势列表
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "postures": [
        {
          "id": "姿势ID",
          "name": "太极起势",
          "category": "太极拳",
          "description": "太极拳的开始动作...",
          "thumbnail": "缩略图URL"
        }
      ]
    }
  }
  ```

### 获取特定姿势详情

- **路径**: `/api/analysis/postures/<posture_id>`
- **方法**: `GET`
- **描述**: 获取特定姿势的详细信息
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "姿势ID",
      "name": "太极起势",
      "category": "太极拳",
      "description": "详细描述...",
      "tutorial": "教学内容...",
      "key_points": ["要点1", "要点2"],
      "standard_images": ["标准图片1URL", "标准图片2URL"]
    }
  }
  ```

## 文件上传接口

### 上传图片

- **路径**: `/api/uploads/images`
- **方法**: `POST`
- **描述**: 上传图片文件
- **认证**: 需要 JWT 令牌
- **请求参数**: `multipart/form-data` 形式的图片文件
- **响应**:
  ```json
  {
    "success": true,
    "message": "图片上传成功",
    "data": {
      "url": "图片URL",
      "filename": "文件名"
    }
  }
  ```

### 上传视频

- **路径**: `/api/uploads/videos`
- **方法**: `POST`
- **描述**: 上传视频文件
- **认证**: 需要 JWT 令牌
- **请求参数**: `multipart/form-data` 形式的视频文件
- **响应**:
  ```json
  {
    "success": true,
    "message": "视频上传成功",
    "data": {
      "url": "视频URL",
      "filename": "文件名"
    }
  }
  ```

## 消息系统接口

### 获取用户消息列表

- **路径**: `/api/user/messages`
- **方法**: `GET`
- **描述**: 获取当前用户的消息列表
- **认证**: 需要 JWT 令牌
- **查询参数**:
  - `page` (可选): 页码
  - `limit` (可选): 每页条数
  - `read` (可选): 是否已读 (true/false)
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "messages": [
        {
          "id": "消息ID",
          "title": "消息标题",
          "content": "消息内容",
          "sender": "发送者",
          "sender_type": "system/user/coach",
          "created_at": "2025-05-10T08:30:00Z",
          "read": false
        }
      ],
      "total": 15,
      "unread_count": 3
    }
  }
  ```

### 发送消息

- **路径**: `/api/messages`
- **方法**: `POST`
- **描述**: 发送消息给特定用户
- **认证**: 需要 JWT 令牌
- **请求参数**:
  ```json
  {
    "recipient_id": "接收者ID",
    "title": "消息标题",
    "content": "消息内容"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "消息发送成功",
    "data": {
      "message_id": "消息ID"
    }
  }
  ```

### 标记消息为已读

- **路径**: `/api/user/messages/<message_id>/read`
- **方法**: `POST`
- **描述**: 标记特定消息为已读
- **认证**: 需要 JWT 令牌
- **响应**:
  ```json
  {
    "success": true,
    "message": "消息已标记为已读"
  }
  ```

### 标记所有消息为已读

- **路径**: `/api/user/messages/read-all`
- **方法**: `POST`
- **描述**: 标记所有消息为已读
- **认证**: 需要 JWT 令牌
- **响应**:
  ```json
  {
    "success": true,
    "message": "所有消息已标记为已读",
    "data": {
      "count": 3
    }
  }
  ```
