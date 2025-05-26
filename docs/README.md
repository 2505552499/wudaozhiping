# 武道智评平台 - 文档目录

本目录包含武道智评平台的所有技术文档和相关资料。

## 📚 文档列表

### 📖 API文档
- **[api_reference.md](./api_reference.md)** - 完整的API接口文档
  - 包含所有API端点的详细说明
  - 请求/响应格式示例
  - 认证和权限说明
  - 功能验证状态

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - 详细的API文档
  - 按模块组织的API说明
  - 测试示例和验证脚本
  - 错误码和数据格式说明

### 🔧 技术文档
- **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - 代码重构总结
  - 重构前后对比
  - 模块化架构说明
  - 代码优化成果

- **[PROJECT_STATUS_REPORT.md](./PROJECT_STATUS_REPORT.md)** - 项目状态报告
  - 功能完整性验证
  - 技术特性说明
  - 部署建议和发展规划

### 🧪 测试工具
- **[test_api_functionality.py](./test_api_functionality.py)** - API功能测试脚本
  - 自动化测试所有核心API
  - 功能完整性验证
  - 测试结果统计

## 🎯 文档使用指南

### 开发者
- 查看 `api_reference.md` 了解完整的API接口
- 使用 `test_api_functionality.py` 验证API功能
- 参考 `REFACTORING_SUMMARY.md` 了解代码架构

### 前端开发者
- 主要参考 `api_reference.md` 进行接口集成
- 查看 `API_DOCUMENTATION.md` 获取详细的请求示例

### 项目管理者
- 查看 `PROJECT_STATUS_REPORT.md` 了解项目整体状态
- 参考功能验证状态进行项目规划

### 运维人员
- 查看部署相关信息和技术规范
- 使用测试脚本验证系统功能

## 📊 文档状态

| 文档 | 状态 | 最后更新 | 说明 |
|------|------|----------|------|
| api_reference.md | ✅ 最新 | 2025-05-27 | 主要API文档 |
| API_DOCUMENTATION.md | ✅ 最新 | 2025-05-27 | 详细API说明 |
| REFACTORING_SUMMARY.md | ✅ 最新 | 2025-05-27 | 重构总结 |
| PROJECT_STATUS_REPORT.md | ✅ 最新 | 2025-05-27 | 项目状态 |
| test_api_functionality.py | ✅ 最新 | 2025-05-27 | 测试脚本 |

## 🚀 快速开始

### 1. 查看API文档
```bash
# 查看主要API文档
cat docs/api_reference.md

# 查看详细API文档
cat docs/API_DOCUMENTATION.md
```

### 2. 运行API测试
```bash
# 确保应用正在运行
python app.py

# 在另一个终端运行测试
python docs/test_api_functionality.py
```

### 3. 了解项目状态
```bash
# 查看重构总结
cat docs/REFACTORING_SUMMARY.md

# 查看项目状态报告
cat docs/PROJECT_STATUS_REPORT.md
```

## 📝 文档维护

### 更新原则
- 所有API变更必须同步更新文档
- 新功能添加需要更新功能验证状态
- 重大变更需要更新版本号和更新日志

### 文档格式
- 使用Markdown格式
- 遵循统一的文档结构
- 包含完整的示例代码

### 版本控制
- 文档版本与API版本保持一致
- 重大更新记录在更新日志中
- 保持向后兼容性说明

## 🔗 相关链接

- **项目根目录**: `../README.md`
- **源代码**: `../app.py`
- **配置文件**: `../config/`
- **API模块**: `../api/`
- **工具函数**: `../utils/`

---

*文档目录最后更新: 2025-05-27*  
*如有问题请联系开发团队*
