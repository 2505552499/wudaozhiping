# 武道智评系统 API 接口文档

*版本: v2.0*  
*最后更新时间: 2025-01-20*

## 目录

- [接口规范](#接口规范)
  - [基础URL](#基础url)
  - [认证机制](#认证机制)
  - [响应格式](#响应格式)
  - [状态码](#状态码)
  - [错误处理](#错误处理)
- [用户认证模块](#用户认证模块)
- [动作分析模块](#动作分析模块)
- [教练管理模块](#教练管理模块)
- [预约管理模块](#预约管理模块)
- [支付系统模块](#支付系统模块)
- [课程管理模块](#课程管理模块)
- [论坛系统模块](#论坛系统模块)
- [批注系统模块](#批注系统模块)
- [消息系统模块](#消息系统模块)
- [管理员模块](#管理员模块)

---

## 接口规范

### 基础URL

**开发环境**: `http://localhost:5000`  
**生产环境**: `https://api.wudao.250555.xyz`

### 认证机制

系统使用 **JWT (JSON Web Token)** 进行身份认证：

1. 通过 `/api/auth/login` 获取访问令牌
2. 在后续请求的 HTTP 头部添加：`Authorization: Bearer <token>`
3. 令牌有效期：24小时
4. 支持游客模式：用户名 `guest`，密码 `guest`

### 响应格式

所有API响应均为JSON格式：

```json
{
  "success": true,              // 布尔值，操作是否成功
  "message": "操作成功",        // 字符串，操作结果描述
  "data": {},                   // 对象/数组，响应数据（可选）
  "errors": [],                 // 数组，详细错误信息（可选）
  "total": 100,                 // 数字，分页时的总记录数（可选）
  "page": 1,                    // 数字，当前页码（可选）
  "per_page": 10                // 数字，每页记录数（可选）
}
```

### 状态码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证或令牌过期 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

### 错误处理

错误响应示例：

```json
{
  "success": false,
  "message": "用户名或密码错误",
  "errors": [
    {
      "field": "password",
      "code": "INVALID_CREDENTIALS",
      "message": "密码不正确"
    }
  ]
}
```

---

## 用户认证模块

### 用户注册

**接口**: `POST /api/auth/register`  
**描述**: 创建新用户账户  
**认证**: 无需认证

**请求参数**:
```json
{
  "username": "string",         // 必填，4-20字符，用户名
  "password": "string",         // 必填，最少8字符，密码
  "role": "string"              // 可选，用户角色 (user/coach/admin)，默认user
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "注册成功",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "username": "testuser",
  "role": "user"
}
```

**错误场景**:
- 用户名已存在 (400)
- 用户名长度不符合要求 (400)
- 密码长度不足 (400)

---

### 用户登录

**接口**: `POST /api/auth/login`  
**描述**: 用户登录获取访问令牌  
**认证**: 无需认证

**请求参数**:
```json
{
  "username": "string",         // 必填，用户名
  "password": "string"          // 必填，密码
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "登录成功",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "username": "testuser",
  "role": "user",
  "login_count": 15,
  "last_login": "2025-01-20T10:30:00"
}
```

---

### 获取当前用户信息

**接口**: `GET /api/auth/user`  
**描述**: 获取当前登录用户的详细信息  
**认证**: 需要JWT令牌

**响应示例**:
```json
{
  "success": true,
  "data": {
    "username": "testuser",
    "role": "user",
    "created_at": "2025-01-15T08:30:00",
    "last_login": "2025-01-20T10:30:00",
    "login_count": 15
  }
}
```

---

## 动作分析模块

### 获取支持的姿势列表

**接口**: `GET /api/poses`  
**描述**: 获取系统支持的所有武术姿势  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "name": "马步",
      "english_name": "horse_stance",
      "description": "武术基本桩功"
    },
    {
      "name": "弓步",
      "english_name": "bow_stance", 
      "description": "前腿屈膝后腿直立"
    }
  ]
}
```

---

### 获取姿势角度数据

**接口**: `GET /api/angles/<pose_name>`  
**描述**: 获取特定姿势的关键角度数据  
**认证**: 无需认证

**路径参数**:
- `pose_name`: 姿势名称（如：horse_stance）

**响应示例**:
```json
{
  "success": true,
  "data": {
    "pose_name": "horse_stance",
    "angles": {
      "knee_left": 90,
      "knee_right": 90,
      "ankle_left": 90,
      "ankle_right": 90
    },
    "tolerances": {
      "knee_left": 10,
      "knee_right": 10
    }
  }
}
```

---

### 获取姿势关键点数据

**接口**: `GET /api/pose_keypoints/<pose_name>`  
**描述**: 获取姿势的关键点坐标信息  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "pose_name": "horse_stance",
    "keypoints": {
      "nose": [x, y],
      "left_shoulder": [x, y],
      "right_shoulder": [x, y]
    }
  }
}
```

---

### 获取姿势详情

**接口**: `GET /api/poses/<pose_name>`  
**描述**: 获取姿势的完整详细信息  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "name": "马步",
    "english_name": "horse_stance",
    "description": "武术基本桩功，锻炼下肢力量",
    "instructions": [
      "双脚平行站立，距离约为肩宽的1.5倍",
      "屈膝下蹲，大腿与地面平行"
    ],
    "key_points": [
      "保持背部挺直",
      "膝盖不要超过脚尖"
    ]
  }
}
```

---

### 图像动作分析

**接口**: `POST /api/analysis/image`  
**描述**: 分析上传图像中的武术动作  
**认证**: 需要JWT令牌  
**Content-Type**: `multipart/form-data`

**请求参数**:
- `image`: 图像文件 (支持: png, jpg, jpeg, gif, bmp)
- `posture`: 要分析的姿势名称

**响应示例**:
```json
{
  "success": true,
  "message": "图像分析完成",
  "data": {
    "posture": "horse_stance",
    "score": 85,
    "analysis": {
      "pose_detected": true,
      "accuracy": 85.2,
      "feedback": "整体姿势良好，建议调整膝盖角度"
    },
    "processed_image_url": "/img/analyzed_123456.jpg"
  }
}
```

---

### 视频动作分析

**接口**: `POST /api/analysis/video`  
**描述**: 分析上传视频中的武术动作  
**认证**: 需要JWT令牌  
**Content-Type**: `multipart/form-data`

**请求参数**:
- `video`: 视频文件 (支持: mp4, avi, mov, wmv, flv, mkv)
- `posture`: 要分析的姿势名称

**响应示例**:
```json
{
  "success": true,
  "message": "视频分析完成",
  "data": {
    "posture": "horse_stance",
    "average_score": 82,
    "frame_count": 150,
    "analysis_results": [
      {
        "frame": 1,
        "timestamp": 0.033,
        "score": 85,
        "feedback": "姿势良好"
      }
    ],
    "processed_video_url": "/img/analyzed_video_123456.mp4"
  }
}
```

---

### 实时摄像头分析

**接口**: `POST /api/analysis/camera`  
**描述**: 分析实时摄像头帧数据  
**认证**: 需要JWT令牌

**请求参数**:
```json
{
  "frame_data": "base64_encoded_image",  // Base64编码的图像数据
  "posture": "horse_stance"             // 要分析的姿势
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "pose_detected": true,
    "score": 88,
    "feedback": "姿势标准",
    "keypoints": {
      "nose": [320, 240],
      "left_shoulder": [280, 300]
    },
    "angles": {
      "knee_left": 95,
      "knee_right": 92
    }
  }
}
```

---

## 教练管理模块

### 获取教练列表

**接口**: `GET /api/coaches`  
**描述**: 获取所有教练信息  
**认证**: 无需认证

**查询参数**:
- `skill`: 按技能筛选
- `city`: 按城市筛选  
- `district`: 按区域筛选

**响应示例**:
```json
{
  "success": true,
  "data": {
    "coaches": [
      {
        "id": "coach_001",
        "name": "李大师",
        "avatar": "/uploads/avatars/coach_001.jpg",
        "skills": ["太极拳", "八卦掌"],
        "location": {
          "city": "北京",
          "districts": ["朝阳区", "海淀区"]
        },
        "rating": 4.8,
        "price": 300,
        "experience": "20年教学经验",
        "certification": "国家一级教练"
      }
    ]
  }
}
```

---

### 获取特定教练信息

**接口**: `GET /api/coaches/<coach_id>`  
**描述**: 获取指定教练的详细信息  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "coach_001",
    "name": "李大师",
    "avatar": "/uploads/avatars/coach_001.jpg",
    "skills": ["太极拳", "八卦掌"],
    "location": {
      "city": "北京",
      "districts": ["朝阳区", "海淀区"]
    },
    "rating": 4.8,
    "price": 300,
    "bio": "从事武术教学20年...",
    "achievements": ["全国武术冠军", "优秀教练员"],
    "available_times": ["周一 9:00-12:00", "周三 14:00-17:00"]
  }
}
```

---

### 教练筛选

**接口**: `GET /api/coaches/filter`  
**描述**: 根据条件筛选教练  
**认证**: 无需认证

**查询参数**:
- `skills[]`: 技能列表
- `city`: 城市
- `district`: 区域
- `min_rating`: 最低评分
- `max_price`: 最高价格

---

### 教练个人资料管理

**接口**: `GET /api/coach/profile`  
**描述**: 获取教练个人资料  
**认证**: 需要JWT令牌（教练角色）

**接口**: `PUT /api/coach/profile`  
**描述**: 更新教练个人资料  
**认证**: 需要JWT令牌（教练角色）

**请求参数**:
```json
{
  "name": "李大师",
  "bio": "个人简介",
  "skills": ["太极拳", "八卦掌"],
  "location": {
    "city": "北京",
    "districts": ["朝阳区"]
  },
  "price": 300,
  "available_times": ["周一 9:00-12:00"]
}
```

---

### 教练头像上传

**接口**: `POST /api/coach/avatar`  
**描述**: 上传教练头像  
**认证**: 需要JWT令牌（教练角色）  
**Content-Type**: `multipart/form-data`

**请求参数**:
- `avatar`: 头像图片文件

**响应示例**:
```json
{
  "success": true,
  "message": "头像上传成功",
  "avatar_url": "/uploads/avatars/coach_001.jpg"
}
```

---

## 预约管理模块

### 获取用户预约列表

**接口**: `GET /api/user/appointments`  
**描述**: 获取当前用户的所有预约  
**认证**: 需要JWT令牌

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "appt_001",
      "coach_id": "coach_001",
      "coach_name": "李大师",
      "date": "2025-01-25",
      "time": "10:00",
      "duration": 60,
      "price": 300,
      "status": "confirmed",
      "location": "朝阳区体育馆",
      "created_at": "2025-01-20T10:00:00"
    }
  ]
}
```

---

### 创建预约

**接口**: `POST /api/appointments`  
**描述**: 创建新的预约  
**认证**: 需要JWT令牌

**请求参数**:
```json
{
  "coach_id": "coach_001",
  "date": "2025-01-25",
  "time": "10:00", 
  "duration": 60,
  "location": "朝阳区体育馆",
  "notes": "初学者，需要基础指导"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "预约创建成功",
  "data": {
    "id": "appt_001",
    "status": "pending",
    "total_price": 300
  }
}
```

---

### 更新预约

**接口**: `PUT /api/appointments/<appointment_id>`  
**描述**: 更新预约信息  
**认证**: 需要JWT令牌

**请求参数**:
```json
{
  "date": "2025-01-26",
  "time": "14:00",
  "notes": "更新备注"
}
```

---

### 取消预约

**接口**: `DELETE /api/appointments/<appointment_id>`  
**描述**: 取消预约  
**认证**: 需要JWT令牌

**响应示例**:
```json
{
  "success": true,
  "message": "预约已取消"
}
```

---

### 教练预约管理

**接口**: `GET /api/coach/appointments`  
**描述**: 获取教练的预约列表  
**认证**: 需要JWT令牌（教练角色）

**接口**: `GET /api/coach/appointments/with_status`  
**描述**: 获取带状态的教练预约列表  
**认证**: 需要JWT令牌（教练角色）

**接口**: `POST /api/coach/create_appointment`  
**描述**: 教练创建可预约时段  
**认证**: 需要JWT令牌（教练角色）

---

## 支付系统模块

### 创建支付订单

**接口**: `POST /api/payments/create`  
**描述**: 为预约创建支付订单  
**认证**: 需要JWT令牌

**请求参数**:
```json
{
  "appointment_id": "appt_001",
  "price": 300.00,
  "duration": 60
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "支付订单创建成功",
  "data": {
    "out_trade_no": "PAY_20250120_001",
    "total_amount": 300.00,
    "payment_url": "https://api.wudao.250555.xyz/api/payment/alipay/gateway?out_trade_no=PAY_20250120_001"
  }
}
```

---

### 查询支付状态

**接口**: `GET /api/payments/<out_trade_no>/status`  
**描述**: 查询支付订单状态  
**认证**: 需要JWT令牌（可选）

**响应示例**:
```json
{
  "success": true,
  "data": {
    "out_trade_no": "PAY_20250120_001",
    "status": "paid",
    "paid_at": "2025-01-20T10:30:00",
    "amount": 300.00
  }
}
```

---

### 获取用户支付记录

**接口**: `GET /api/payment/user/records`  
**描述**: 获取用户的支付历史记录  
**认证**: 需要JWT令牌

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "out_trade_no": "PAY_20250120_001",
      "amount": 300.00,
      "status": "paid",
      "appointment_id": "appt_001", 
      "created_at": "2025-01-20T10:00:00",
      "paid_at": "2025-01-20T10:30:00"
    }
  ]
}
```

---

### 支付宝网关

**接口**: `GET /api/payment/alipay/gateway`  
**描述**: 支付宝支付页面  
**认证**: 无需认证

**查询参数**:
- `out_trade_no`: 订单号

---

### 支付宝回调

**接口**: `POST /api/payment/alipay/notify`  
**描述**: 支付宝异步通知回调  
**认证**: 无需认证

**接口**: `GET /api/payment/alipay/return`  
**描述**: 支付宝同步返回  
**认证**: 无需认证

---

## 课程管理模块

### 获取课程列表

**接口**: `GET /api/courses`  
**描述**: 获取所有课程信息  
**认证**: 无需认证

**查询参数**:
- `type`: 课程类型筛选

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "course_001",
      "title": "太极拳入门班",
      "type": "基础课程",
      "price": 1200,
      "duration": "4周",
      "date_range": "2025-02-01 至 2025-02-28",
      "description": "适合零基础学员的太极拳课程",
      "max_participants": 20,
      "current_participants": 8,
      "status": "开放报名",
      "cover_image": "/uploads/courses/taiji_basic.jpg"
    }
  ]
}
```

---

### 获取课程详情

**接口**: `GET /api/courses/<course_id>`  
**描述**: 获取特定课程的详细信息  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "course_001",
    "title": "太极拳入门班",
    "type": "基础课程",
    "price": 1200,
    "duration": "4周",
    "description": "详细课程描述...",
    "content": ["基础动作", "套路学习"],
    "benefits": ["提高身体协调性", "增强体质"],
    "target_audience": "零基础学员",
    "daily_schedule": [
      "第一周：基础站桩",
      "第二周：基本动作"
    ],
    "location": "朝阳区武术馆",
    "max_participants": 20,
    "current_participants": 8
  }
}
```

---

### 检查课程报名状态

**接口**: `GET /api/courses/<course_id>/check-enrollment`  
**描述**: 检查用户是否已报名该课程  
**认证**: 需要JWT令牌

**响应示例**:
```json
{
  "success": true,
  "data": {
    "enrolled": true,
    "enrollment_id": "enroll_001",
    "status": "confirmed"
  }
}
```

---

### 报名课程

**接口**: `POST /api/courses/<course_id>/enroll`  
**描述**: 报名参加课程  
**认证**: 需要JWT令牌

**请求参数**:
```json
{
  "contact_phone": "13800138000",
  "emergency_contact": "张三",
  "notes": "备注信息"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "报名成功",
  "data": {
    "enrollment_id": "enroll_001",
    "status": "pending"
  }
}
```

---

### 管理员课程管理

**接口**: `POST /api/admin/courses`  
**描述**: 创建新课程  
**认证**: 需要JWT令牌（管理员角色）

**接口**: `PUT /api/admin/courses/<course_id>`  
**描述**: 更新课程信息  
**认证**: 需要JWT令牌（管理员角色）

**接口**: `DELETE /api/admin/courses/<course_id>`  
**描述**: 删除课程  
**认证**: 需要JWT令牌（管理员角色）

---

## 论坛系统模块

### 获取帖子列表

**接口**: `GET /api/forum/posts`  
**描述**: 获取已审核的帖子列表  
**认证**: 无需认证

**查询参数**:
- `page`: 页码（默认1）
- `per_page`: 每页记录数（默认10）

**响应示例**:
```json
{
  "success": true,
  "total": 50,
  "page": 1,
  "per_page": 10,
  "posts": [
    {
      "id": "post_001",
      "title": "太极拳学习心得",
      "content": "最近练习太极拳的一些体会...",
      "author": "用户A",
      "created_at": "2025-01-20T10:00:00",
      "likes": 15,
      "views": 120,
      "comment_count": 8,
      "tags": ["太极拳", "心得"]
    }
  ]
}
```

---

### 创建帖子

**接口**: `POST /api/forum/posts`  
**描述**: 创建新帖子  
**认证**: 需要JWT令牌

**请求参数**:
```json
{
  "title": "帖子标题",
  "content": "帖子内容",
  "tags": ["标签1", "标签2"]
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "帖子创建成功，等待管理员审核",
  "post_id": "post_001"
}
```

---

### 获取帖子详情

**接口**: `GET /api/forum/posts/<post_id>`  
**描述**: 获取特定帖子的详细信息  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "post_001",
    "title": "太极拳学习心得",
    "content": "详细内容...",
    "author": "用户A",
    "created_at": "2025-01-20T10:00:00",
    "updated_at": "2025-01-20T10:00:00",
    "likes": 15,
    "views": 121,
    "tags": ["太极拳", "心得"],
    "comments": [
      {
        "id": "comment_001",
        "content": "很棒的分享！",
        "author": "用户B",
        "created_at": "2025-01-20T11:00:00",
        "likes": 3
      }
    ]
  }
}
```

---

### 帖子点赞

**接口**: `POST /api/forum/posts/<post_id>/like`  
**描述**: 给帖子点赞  
**认证**: 需要JWT令牌

---

### 添加评论

**接口**: `POST /api/forum/posts/<post_id>/comments`  
**描述**: 给帖子添加评论  
**认证**: 需要JWT令牌

**请求参数**:
```json
{
  "content": "评论内容"
}
```

---

### 评论点赞

**接口**: `POST /api/forum/comments/<comment_id>/like`  
**描述**: 给评论点赞  
**认证**: 需要JWT令牌

---

### 获取用户帖子

**接口**: `GET /api/forum/posts/user`  
**描述**: 获取当前用户发布的帖子  
**认证**: 需要JWT令牌

---

### 管理员论坛管理

**接口**: `GET /api/forum/posts/pending`  
**描述**: 获取待审核帖子列表  
**认证**: 需要JWT令牌（管理员角色）

**接口**: `POST /api/forum/posts/<post_id>/review`  
**描述**: 审核帖子  
**认证**: 需要JWT令牌（管理员角色）

**请求参数**:
```json
{
  "action": "approve",    // approve 或 reject
  "reason": "审核原因"     // 拒绝时必填
}
```

---

## 批注系统模块

### 获取视频批注

**接口**: `GET /api/annotations/<video_id>`  
**描述**: 获取指定视频的所有批注  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "annotations": [
    {
      "id": "anno_001",
      "video_id": "video_123",
      "timestamp": "00:01:30",
      "time_seconds": 90,
      "type": "text",
      "content": "注意这里的手部动作",
      "drawing_data": null,
      "frame_image": "data:image/jpeg;base64,...",
      "created_at": 1642684800
    }
  ]
}
```

---

### 添加批注

**接口**: `POST /api/annotations`  
**描述**: 为视频添加新批注  
**认证**: 无需认证

**请求参数**:
```json
{
  "video_id": "video_123",
  "timestamp": "00:01:30",
  "time_seconds": 90,
  "type": "text",                    // text, drawing, highlight
  "content": "批注内容",
  "drawing_data": {},               // 绘图数据（可选）
  "frame_image": "base64_data"      // 帧图像（可选）
}
```

**响应示例**:
```json
{
  "success": true,
  "annotation": {
    "id": "anno_001",
    "video_id": "video_123",
    "timestamp": "00:01:30",
    "type": "text",
    "content": "批注内容",
    "created_at": 1642684800
  }
}
```

---

### 删除批注

**接口**: `DELETE /api/annotations/<annotation_id>`  
**描述**: 删除指定批注  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true
}
```

---

## 消息系统模块

### 发送消息

**接口**: `POST /api/messages`  
**描述**: 发送消息给其他用户  
**认证**: 需要JWT令牌

**请求参数**:
```json
{
  "recipient": "目标用户名",
  "subject": "消息主题",
  "content": "消息内容",
  "type": "private"              // private, system, notification
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "消息发送成功",
  "message_id": "msg_001"
}
```

---

### 获取消息列表

**接口**: `GET /api/messages`  
**描述**: 获取当前用户的消息列表  
**认证**: 需要JWT令牌

**查询参数**:
- `type`: 消息类型筛选
- `status`: 消息状态筛选

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "msg_001",
      "sender": "用户A",
      "recipient": "用户B", 
      "subject": "消息主题",
      "content": "消息内容",
      "type": "private",
      "status": "unread",
      "created_at": "2025-01-20T10:00:00"
    }
  ]
}
```

---

### 标记消息为已读

**接口**: `PUT /api/messages/<message_id>/read`  
**描述**: 将消息标记为已读  
**认证**: 需要JWT令牌

**响应示例**:
```json
{
  "success": true,
  "message": "消息已标记为已读"
}
```

---

## 管理员模块

### 获取待审核预约

**接口**: `GET /api/admin/appointments`  
**描述**: 获取待审核的预约列表  
**认证**: 需要JWT令牌（管理员角色）

**接口**: `GET /api/admin/appointments/pending`  
**描述**: 获取待审核预约列表（详细版）  
**认证**: 需要JWT令牌（管理员角色）

---

### 审核预约

**接口**: `POST /api/admin/appointments/<appointment_id>/review`  
**描述**: 审核预约申请  
**认证**: 需要JWT令牌（管理员角色）

**请求参数**:
```json
{
  "action": "approve",        // approve 或 reject
  "reason": "审核说明"        // 可选
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "预约审核完成"
}
```

---

### 撤销预约

**接口**: `POST /api/admin/appointments/<appointment_id>/revoke`  
**描述**: 管理员撤销预约  
**认证**: 需要JWT令牌（管理员角色）

---

### 删除预约

**接口**: `DELETE /api/admin/appointments/<appointment_id>`  
**描述**: 管理员删除预约  
**认证**: 需要JWT令牌（管理员角色）

---

### 获取所有报名记录

**接口**: `GET /api/admin/enrollments`  
**描述**: 获取所有课程报名记录  
**认证**: 需要JWT令牌（管理员角色）

---

### 获取课程报名记录

**接口**: `GET /api/admin/courses/<course_id>/enrollments`  
**描述**: 获取特定课程的报名记录  
**认证**: 需要JWT令牌（管理员角色）

---

### 更新报名状态

**接口**: `PUT /api/admin/enrollments/<enrollment_id>`  
**描述**: 更新学员报名状态  
**认证**: 需要JWT令牌（管理员角色）

**请求参数**:
```json
{
  "status": "confirmed",      // confirmed, rejected, cancelled
  "notes": "审核备注"
}
```

---

## 工具接口

### 获取城市列表

**接口**: `GET /api/cities`  
**描述**: 获取支持的城市列表  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": ["北京", "上海", "广州", "深圳"]
}
```

---

### 获取区域列表

**接口**: `GET /api/districts/<city>`  
**描述**: 获取指定城市的区域列表  
**认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": ["朝阳区", "海淀区", "丰台区"]
}
```

---

## 静态文件服务

### 上传文件访问

**接口**: `GET /uploads/<path:filename>`  
**描述**: 访问上传的文件  
**认证**: 无需认证

### 处理后文件访问

**接口**: `GET /img/<path:filename>`  
**描述**: 访问处理后的图像/视频文件  
**认证**: 无需认证

---

## 技术规范

### 文件上传限制

- **图像文件**: png, jpg, jpeg, gif, bmp
- **视频文件**: mp4, avi, mov, wmv, flv, mkv
- **最大文件大小**: 100MB（视频），10MB（图像）

### 数据存储

- **用户数据**: `data/users.json`
- **教练数据**: `data/coaches.json`
- **预约数据**: `data/appointments.json`
- **课程数据**: `data/courses.json`
- **论坛数据**: `data/forum_posts.json`, `data/forum_comments.json`
- **批注数据**: `annotations.json`
- **消息数据**: `messages.json`

### 依赖组件

- **Web框架**: Flask 2.3.3
- **认证**: Flask-JWT-Extended 4.5.3
- **跨域**: Flask-CORS 4.0.0
- **计算机视觉**: OpenCV 4.8.0, MediaPipe 0.10.8
- **图像处理**: Pillow 10.0.0
- **数值计算**: NumPy 1.26.0

### 部署信息

- **开发端口**: 5000
- **生产服务器**: Gunicorn
- **前端支持**: React SPA静态文件服务

---

*此文档基于代码分析自动生成，如有问题请联系开发团队。*
