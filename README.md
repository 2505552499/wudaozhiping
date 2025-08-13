# 琪武智创-动作评估教练预约平台 - 智能武术姿势分析平台

<div align="center">

![琪武智创](https://img.shields.io/badge/琪武智创-v2.2-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.3.3-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**🥋 专业武术动作智能分析平台 | AI驱动的姿态评估与教学辅助系统**

[在线体验](http://localhost:3001) | [API文档](docs/api_reference.md) | [项目状态](docs/PROJECT_STATUS_REPORT.md) | [技术文档](docs/)

</div>

---

## 📖 项目简介

琪武智创是一款**专业的AI武术动作分析平台**，融合先进的计算机视觉、深度学习和人体姿态估计技术，为武术爱好者、教练和学习者提供精准的动作分析、评价和改进建议。平台集成了智能分析、教练预约、在线学习、社区交流等多项功能，打造完整的武术学习生态系统。

### 🌟 核心特色

- **🤖 AI智能分析**: 基于MediaPipe和OpenCV的专业姿态识别引擎
- **🎯 多维度评估**: 角度分析、动作轨迹、时序评估的综合评价体系
- **📱 全平台支持**: 图像、视频、实时摄像头多种分析模式
- **👨‍🏫 专业教学**: 完整的教练预约、课程管理、论坛交流生态
- **💰 支付集成**: 支付宝完整支付流程，支持预约付费
- **🎨 现代设计**: 采用Ant Design和现代UI设计理念
- **📚 完整学习体系**: 从基础课程到专业技巧的全方位学习平台

---

## 🚀 技术架构

### 🏗️ 系统架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (React)   │────│   后端 (Flask)   │────│  AI分析引擎     │
│                │    │                │    │                │
│ • React 18.2    │    │ • Flask 2.3.3   │    │ • MediaPipe     │
│ • Tailwind CSS  │    │ • JWT认证       │    │ • OpenCV        │
│ • 现代渐变UI     │    │ • 模块化蓝图     │    │ • 姿态估计       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └─────────────────────────────────────────────────┘
                              │
                    ┌─────────────────┐
                    │   支付 & 存储    │
                    │                │
                    │ • 支付宝SDK     │
                    │ • JSON存储      │
                    │ • 文件管理       │
                    └─────────────────┘
```

### 💻 技术栈详情

**后端技术栈**
- **Web框架**: Flask 2.3.3 + 蓝图模块化设计
- **认证系统**: Flask-JWT-Extended (JWT令牌)
- **AI引擎**: MediaPipe 0.10.8 + OpenCV 4.8.0
- **跨域处理**: Flask-CORS 4.0.0
- **图像处理**: Pillow 10.0.0 + NumPy 1.26.0
- **支付集成**: 支付宝SDK + 自定义支付管理器
- **Web服务器**: Gunicorn (生产环境)

**前端技术栈**
- **框架**: React 18.2.0 + React Router
- **UI样式**: Tailwind CSS + 现代渐变设计系统
- **状态管理**: React Hooks + Context API
- **HTTP客户端**: Axios
- **摄像头集成**: React Webcam
- **动画效果**: Framer Motion + CSS动画

**开发工具**
- **包管理**: npm/yarn (前端) + pip (后端)
- **代码规范**: ESLint + Prettier
- **构建工具**: Create React App + Webpack
- **版本控制**: Git + GitHub

---

## 🎯 功能模块

### 🔐 **用户认证系统**
- 用户注册/登录 (支持多角色：用户/教练/管理员)
- JWT令牌认证机制
- 游客模式支持 (guest/guest)
- 个人资料管理和头像上传
- 角色权限控制 (RBAC)

### 🥋 **AI动作分析引擎**
- **图像分析**: 单张图片姿态评估，支持多种格式
- **视频分析**: 连续动作序列分析，逐帧检测
- **实时分析**: 摄像头实时姿态评估，毫秒级响应
- **多维评估**: 角度、坐标、时序综合分析
- **智能反馈**: AI生成改进建议和技术指导
- **标准姿势库**: 支持太极拳、形意拳、八卦掌等多种武术

### 👨‍🏫 **教练管理系统**
- 教练资料管理 (技能、地区、价格、经验)
- 教练头像上传和个人展示
- 预约时段发布和管理
- 学员管理和教学记录
- 教练评价和反馈系统

### 📅 **预约管理系统**
- 在线预约教练，支持时间选择
- 预约状态管理 (待审核/已确认/已完成/已取消)
- 预约修改/取消功能
- 管理员审核机制
- 预约历史查询和统计

### 💰 **支付系统**
- 支付宝集成支付，安全可靠
- 订单管理和状态跟踪
- 支付状态查询和验证
- 支付记录查询和导出
- 费用结算和分成管理

### 📚 **课程学习中心**
- **基础课程**: 入门级武术课程体系
- **进阶课程**: 高级技巧和深度学习
- **专业技巧**: 实战技击、表演艺术、教练培训
- **在线报名**: 课程报名和学习进度跟踪
- **学习管理**: 个人学习记录和成就系统
- **VIP课程**: 专享高级课程和一对一指导

### 💬 **武友社区论坛**
- 帖子发布与管理，支持图文并茂
- 评论互动功能，实时交流
- 点赞系统和用户互动
- 内容审核机制，保证社区质量
- 分类讨论和专题交流
- 经验分享和技巧交流

### 📝 **训练视频批注系统**
- 视频上传和管理
- 时间点标注和绘图批注
- 教练专业批注和反馈
- 协作学习和团队批注
- 批注管理和历史记录
- 多类型标注支持 (文字、语音、绘图)

### 📨 **消息通知系统**
- 站内消息和系统通知
- 预约提醒和状态更新
- 课程通知和学习提醒
- 消息状态管理 (已读/未读)
- 消息分类和筛选

### 🛡️ **管理员系统**
- 用户管理和权限控制
- 内容审核和质量管理
- 预约审核和状态管理
- 课程管理和发布
- 系统配置和参数设置
- 数据统计和分析报表

### 🎯 **动作指导系统**
- 线下指导和技巧分享
- 动作要领和注意事项
- 常见错误和纠正方法
- 练习建议和进阶路径

### 📖 **知识库系统**
- 武术理论和历史文化
- 技术文档和教学资料
- 常见问题和解答
- 学习资源和参考资料

---

## 📁 项目结构

```
wudaozhiping/
├── 📁 config/                    # 配置模块
│   ├── 🔧 settings.py            # 应用配置
│   └── � __init__.py            # 模块初始化
│
├── 📁 utils/                     # 工具模块
│   ├── 🔐 auth_utils.py          # 认证工具
│   ├── 📁 file_utils.py          # 文件处理工具
│   └── 📁 __init__.py            # 模块初始化
│
├── 📁 api/                       # API模块
│   ├── 🔐 auth_api.py            # 认证API
│   ├── 🥋 pose_api.py            # 姿势分析API
│   ├── 🌍 location_api.py        # 地理位置API
│   ├── 👨‍🏫 coach_api.py           # 教练管理API
│   ├── 📁 static_files_api.py    # 静态文件API
│   └── 📁 __init__.py            # 模块初始化
│
├── 🐍 app.py                     # Flask应用入口 (1361行 ↓37%)
├── 🧠 model.py                   # AI分析核心引擎 (692行)
├── 🌐 web_model.py               # Web版分析模型 (896行)
├── 🥋 martial_arts_analyzer.py   # 武术动作分析器 (1165行)
├── 🔐 user_auth.py               # 用户认证模块 (281行)
├── 💰 payment_api.py             # 支付系统API (582行)
├── 📚 course_api.py              # 课程管理API (609行)
├── 💬 forum_api.py               # 论坛系统API (513行)
├── 📝 annotations_api.py         # 批注系统API (113行)
├── 🎥 training_video_api.py      # 训练视频API (新增)
└── 📊 coordinate_master.py       # 姿态坐标管理 (158行)
│
├── 📁 frontend/                  # 前端应用
│   ├── 📁 public/                # 静态资源
│   │   ├── �️ index.html         # 主页面
│   │   └── �📁 img/               # 图片资源
│   ├── 📁 src/
│   │   ├── 📁 components/        # React组件
│   │   │   ├── � MainLayout.js  # 主布局组件
│   │   │   ├── 🧭 Navigation.js  # 导航组件
│   │   │   └── 📁 ...            # 其他组件
│   │   ├── 📁 pages/             # 页面组件 (40+页面)
│   │   │   ├── 🏠 HomePage.js    # 首页
│   │   │   ├── � Dashboard.js   # 仪表板
│   │   │   ├── 📚 CourseList.js  # 课程列表
│   │   │   ├── 🥋 ProfessionalSkills.js # 专业技巧
│   │   │   ├── 🎥 VideoAnalysis.js # 视频分析
│   │   │   ├── � CameraAnalysis.js # 摄像头分析
│   │   │   ├── 👨‍🏫 CoachTeam.js    # 教练团队
│   │   │   ├── 💬 ForumList.js   # 论坛列表
│   │   │   └── 📁 ...            # 其他页面
│   │   ├── 📁 api/               # API接口
│   │   │   └── 🔗 api.js         # API配置和请求
│   │   ├── 📁 services/          # 服务层
│   │   ├── 🎨 App.css            # 全局样式
│   │   ├── ⚙️ index.js           # 应用入口
│   │   └── ⚙️ config.js          # 前端配置
│   ├── 📦 package.json           # 前端依赖
│   ├── 🔧 package-lock.json      # 锁定版本
│   └── ⚙️ tailwind.config.js     # Tailwind配置
│
├── 📁 data/                      # 数据存储
│   ├── 👥 users.db               # 用户数据库
│   ├── 👥 users.json             # 用户数据 (备份)
│   ├── 👨‍🏫 coaches.json          # 教练数据
│   ├── 📅 appointments.json      # 预约数据
│   ├── 📚 courses.json           # 课程数据
│   ├── 📚 enrollments.json       # 报名数据
│   ├── 💬 forum_posts.json       # 论坛帖子
│   ├── 💬 forum_comments.json    # 论坛评论
│   ├── 📨 messages.json          # 消息数据
│   ├── 💰 payments.json          # 支付数据
│   ├── 💰 settlements.json       # 结算数据
│   └── 🎥 training_videos.json   # 训练视频数据
│
├── 📁 uploads/                   # 上传文件
│   ├── 📁 images/                # 图片文件
│   ├── 📁 videos/                # 视频文件
│   ├── 📁 training_videos/       # 训练视频
│   └── 📁 avatars/               # 头像文件
│
├── 📁 img/                       # 处理后文件
├── 📁 static/                    # 静态文件
│   └── 📁 avatars/               # 头像静态文件
│
├── 📁 docs/                      # 项目文档 (完善)
│   ├── 📖 README.md              # 文档目录
│   ├── 📖 api_reference.md       # API接口文档 (1500+行)
│   ├── 📋 API_DOCUMENTATION.md   # 详细API文档
│   ├── 📊 PROJECT_STATUS_REPORT.md # 项目状态报告
│   ├── 🔧 REFACTORING_SUMMARY.md # 重构总结
│   ├── ✅ COMPLETION_SUMMARY.md  # 完成总结
│   ├── 📚 course_center_implementation.md # 课程中心实现
│   ├── 🔧 course_study_fix.md    # 课程学习修复
│   └── 🧪 test_api_functionality.py # API测试脚本
│
├── 📋 requirements.txt           # Python依赖
├── 📖 README.md                  # 项目说明 (本文档)
├── 🚀 run.py                     # 启动脚本
├── 🔧 run_wudao.ps1              # Windows启动脚本
├── 🔧 run_wudao_app.bat          # Windows批处理启动
└── 🔧 install_deps.bat           # 依赖安装脚本
```

### 🎯 v2.1 重构亮点

- **📉 代码减少37%**: 主文件从2152行减少到1361行
- **🏗️ 模块化架构**: 新增config/、utils/、api/模块
- **🔧 重复代码清理**: 删除所有重复路由定义
- **📚 文档完善**: 提供完整的API文档和测试脚本
- **✅ 功能验证**: 100%通过率的自动化测试

---

## ⚡ 快速开始

### 📋 环境要求

- **Python**: 3.8+
- **Node.js**: 16.0+
- **npm**: 8.0+
- **系统**: Windows/macOS/Linux

### 🔧 安装与配置

#### 1️⃣ 克隆项目

```bash
git clone https://github.com/your-repo/qiwuzhichuang.git
cd qiwuzhichuang
```

#### 2️⃣ 后端环境设置

```bash
# 安装Python依赖
pip install -r requirements.txt

# 创建必要目录
mkdir -p uploads/images uploads/videos img data

# 启动后端服务
python app.py
```

**后端服务**: http://localhost:5000

#### 3️⃣ 前端环境设置

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

**前端服务**: http://localhost:3001

#### 4️⃣ 生产环境构建

```bash
# 前端构建
cd frontend
npm run build

# 后端生产启动
cd ..
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 🎮 使用指南

### 🔑 登录系统

```
游客账号: guest / guest
管理员账号: admin / adminpassword
```

### 📸 图像分析

1. **登录系统** → 选择"图像分析"
2. **选择姿势** → 选择要分析的武术动作
3. **上传图片** → 支持 PNG/JPG/JPEG/GIF/BMP
4. **开始分析** → 获取AI评分和建议

### 🎥 视频分析

1. **选择视频分析** → 上传武术动作视频
2. **选择动作类型** → 系统支持10+种武术动作
3. **分析处理** → AI逐帧分析，生成评分曲线
4. **查看结果** → 平均分、关键帧、改进建议

### 📹 实时摄像头分析

1. **摄像头权限** → 允许浏览器访问摄像头
2. **姿势准备** → 确保全身在摄像头视野内
3. **实时反馈** → 查看实时姿态评分和建议

### 👨‍🏫 教练预约

1. **浏览教练** → 查看教练技能、评分、价格
2. **选择时段** → 预约可用的时间段
3. **在线支付** → 支付宝支付完成预约
4. **预约管理** → 查看预约状态，支持修改/取消

---

## 🛠️ 开发指南

### 📝 代码规范

**Python 后端**
```python
# 使用类型提示
def analyze_pose(image: np.ndarray) -> Dict[str, Any]:
    """分析姿态函数"""
    pass

# 错误处理
try:
    result = pose_analyzer.analyze(image)
    return jsonify({"success": True, "data": result})
except Exception as e:
    return jsonify({"success": False, "message": str(e)}), 500
```

**React 前端**
```jsx
// 使用函数组件和Hooks
const AnalysisPage = () => {
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      const result = await api.analyzeImage(formData);
      // 处理结果
    } catch (error) {
      // 错误处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-modern min-h-screen">
      {/* 组件内容 */}
    </div>
  );
};
```

### 🔄 API开发规范

```python
@app.route('/api/resource', methods=['POST'])
@jwt_required()
def create_resource():
    """创建资源API"""
    try:
        data = request.get_json()
        # 验证数据
        if not data or 'required_field' not in data:
            return jsonify({
                'success': False,
                'message': '缺少必要字段'
            }), 400

        # 业务逻辑
        result = process_data(data)

        return jsonify({
            'success': True,
            'message': '操作成功',
            'data': result
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'服务器错误: {str(e)}'
        }), 500
```

### 🧪 测试

```bash
# 后端测试
python -m pytest tests/

# 前端测试
cd frontend
npm test

# API测试
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"guest","password":"guest"}'
```

---

## 🚀 部署指南

### 🐳 Docker部署

```dockerfile
# Dockerfile
FROM python:3.9

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

```bash
# 构建和运行
docker build -t qiwuzhichuang .
docker run -p 5000:5000 qiwuzhichuang
```

### ☁️ 生产环境部署

**使用 Nginx + Gunicorn**

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /path/to/frontend/build/static;
    }
}
```

```bash
# 启动服务
gunicorn -w 4 -b 127.0.0.1:5000 app:app --daemon
```

### 🔧 环境变量配置

```bash
# .env 文件
FLASK_ENV=production
JWT_SECRET_KEY=your-secret-key
ALIPAY_APP_ID=your-alipay-app-id
ALIPAY_PRIVATE_KEY=your-private-key
```

---

## 📊 性能指标

| 指标 | 值 | 说明 |
|------|----|----- |
| 🎯 姿态识别准确率 | 95%+ | MediaPipe引擎准确率 |
| ⚡ 图像分析速度 | < 2秒 | 单张图片处理时间 |
| 🎥 视频分析速度 | 0.5x实时 | 1分钟视频需2分钟 |
| 📱 实时分析延迟 | < 100ms | 摄像头到结果显示 |
| 🔄 API响应时间 | < 200ms | 平均API响应时间 |
| 👥 并发用户数 | 100+ | 推荐并发处理能力 |

---

## 🤝 贡献指南

我们欢迎社区贡献！请查看以下指南：

### 📝 贡献流程

1. **Fork** 项目仓库
2. **创建** 功能分支 (`git checkout -b feature/AmazingFeature`)
3. **提交** 更改 (`git commit -m 'Add some AmazingFeature'`)
4. **推送** 到分支 (`git push origin feature/AmazingFeature`)
5. **创建** Pull Request

### 🐛 问题报告

使用 [GitHub Issues](https://github.com/your-repo/qiwuzhichuang/issues) 报告问题：

- **Bug报告**: 使用Bug模板
- **功能请求**: 使用Feature模板
- **问题讨论**: 使用Discussion

### 📋 开发待办

- [ ] 🧠 **AI模型优化**: 提升识别准确率和速度
- [ ] 📱 **移动端适配**: 响应式设计优化
- [ ] 🌐 **国际化支持**: 多语言界面
- [ ] 🔧 **数据库集成**: 替换JSON文件存储
- [ ] 📊 **数据可视化**: 训练进度图表
- [ ] 🎮 **3D可视化**: 3D姿态展示
- [ ] 🤖 **智能推荐**: 个性化训练方案

---

## 📞 支持与联系

### 📧 联系方式

- **项目主页**: [https://github.com/your-repo/wudaozhiping](https://github.com/your-repo/wudaozhiping)
- **在线演示**: [https://wudao.250555.xyz](https://wudao.250555.xyz)
- **API文档**: [https://api.wudao.250555.xyz/docs](https://api.wudao.250555.xyz/docs)
- **技术支持**: [support@wudao.com](mailto:support@wudao.com)

### 💬 社区

- **技术讨论**: [GitHub Discussions](https://github.com/your-repo/wudaozhiping/discussions)
- **问题反馈**: [GitHub Issues](https://github.com/your-repo/wudaozhiping/issues)
- **功能建议**: [Feature Requests](https://github.com/your-repo/wudaozhiping/issues/new?template=feature_request.md)

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

```
MIT License

Copyright (c) 2025 琪武智创团队

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 致谢

感谢以下开源项目和贡献者：

- **[MediaPipe](https://mediapipe.dev/)** - Google出品的跨平台机器学习框架
- **[OpenCV](https://opencv.org/)** - 开源计算机视觉库
- **[Flask](https://flask.palletsprojects.com/)** - 轻量级Python Web框架
- **[React](https://reactjs.org/)** - 用户界面构建库
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的CSS框架

特别感谢所有为项目贡献代码、提出建议和报告问题的社区成员！

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个Star！⭐**

**🥋 让AI助力武道传承，让技术服务传统文化！🥋**

---

*Made with ❤️ by 琪武智创团队*

</div>
