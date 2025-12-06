# InterviewPrep Manager

一个用于管理面试准备的Windows桌面应用，包含面试题库、知识点库、刷题库和进度看板功能。

## 📋 项目概述

InterviewPrep Manager是一款专为技术面试准备设计的桌面应用，帮助自己系统化地管理和复习面试相关的知识和题目。

## 🛠️ 技术栈

### 后端
- **框架**: FastAPI
- **服务器**: Uvicorn
- **ORM**: SQLAlchemy
- **数据库**: SQLite
- **语言**: Python 3.11

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **桌面应用**: Electron
- **UI组件库**: Ant Design
- **HTTP客户端**: Axios
- **Markdown编辑器**: @uiw/react-markdown-editor
- **Markdown渲染**: react-markdown

## 📁 项目结构

```
project-root/
├─ backend/                 # 后端代码
│   ├─ main.py             # FastAPI应用入口
│   ├─ database.py         # 数据库配置
│   ├─ models/             # 数据库模型
│   │   ├─ interview_question.py  # 面试题库模型
│   │   ├─ knowledge_point.py     # 知识点库模型
│   │   └─ coding_question.py     # 刷题题库模型
│   ├─ routes/             # API路由
│   │   ├─ interview_question.py  # 面试题库路由
│   │   ├─ knowledge_point.py     # 知识点库路由
│   │   ├─ coding_question.py     # 刷题题库路由
│   │   └─ dashboard.py           # 仪表盘路由
│   ├─ schemas/            # Pydantic模型
│   └─ requirements.txt    # 后端依赖
├─ frontend/               # 前端代码
│   ├─ src/                # 源代码
│   │   ├─ pages/          # 页面组件
│   │   ├─ services/       # API服务
│   │   ├─ types/          # TypeScript类型定义
│   │   ├─ App.tsx         # 应用主组件
│   │   └─ main.tsx        # 应用入口
│   ├─ electron/           # Electron相关代码
│   │   └─ main.cjs        # Electron主进程
│   ├─ public/             # 静态资源
│   ├─ package.json        # 前端依赖
│   ├─ tsconfig.json       # TypeScript配置
│   └─ vite.config.js      # Vite配置
├─ data/                   # 数据库文件目录
│   └─ interview.db        # SQLite数据库文件
└─ README.md               # 项目说明文档
```

## 🚀 安装和运行

### 环境要求
- Python 3.11+
- Node.js 16+
- npm 8+

### 安装步骤

#### 1. 克隆项目
```bash
git clone <项目地址>
cd interviewprep-manager
```

#### 2. 安装后端依赖
```bash
# 创建虚拟环境
python -m venv venv311

# 激活虚拟环境（Windows）
venv311\Scripts\activate

# 安装依赖
pip install -r backend/requirements.txt
```

#### 3. 安装前端依赖
```bash
cd frontend
npm install
```

### 运行项目

#### 方式1：开发模式（推荐）

1. **启动后端服务器**：
```bash
# 在项目根目录
venv311\Scripts\python.exe -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

2. **启动前端开发服务器**：
```bash
# 在frontend目录
npm run dev
```

3. **启动Electron应用**：
```bash
# 在frontend目录
npm run electron:dev
```

#### 方式2：构建生产版本
```bash
# 在frontend目录
npm run build
npm run electron:build
```

## 🧠 核心功能

### 1. 面试题库模块
- 新增、编辑、删除面试题目
- 支持按分类、状态、标签筛选
- 搜索功能
- 状态管理：未学 / 已掌握 / 需要复习 / 重要

### 2. 知识点库模块
- Markdown编辑器支持
- 收藏功能（starred）
- 分类和状态筛选
- 状态管理：未学 / 掌握 / 重看

### 3. 刷题题库模块
- 题目管理（新增、编辑、删除）
- 支持添加来源链接
- 状态管理：未做 / 已做 / 复盘

### 4. 进度看板（Dashboard）
- 总体完成度统计
- 各类题库的数量和状态分布
- 今日任务列表
- 可视化图表展示

## 📊 API文档

启动后端服务器后，可以通过以下地址访问API文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 主要API端点

#### 面试题库
- `GET /interview-questions` - 获取所有面试题目
- `POST /interview-questions` - 创建面试题目
- `GET /interview-questions/{id}` - 获取单个面试题目
- `PUT /interview-questions/{id}` - 更新面试题目
- `DELETE /interview-questions/{id}` - 删除面试题目

#### 知识点库
- `GET /knowledge-points` - 获取所有知识点
- `POST /knowledge-points` - 创建知识点
- `PATCH /knowledge-points/{id}/star` - 收藏/取消收藏知识点

#### 刷题题库
- `GET /coding-questions` - 获取所有编程题目
- `POST /coding-questions` - 创建编程题目

#### 仪表盘
- `GET /dashboard/stats` - 获取统计数据
- `GET /dashboard/today-tasks` - 获取今日任务

## 🔧 配置说明

### 后端配置
- 数据库路径：`data/interview.db`
- API端口：8000
- CORS配置：允许所有来源（开发环境）

### 前端配置
- 开发端口：3000
- API基础URL：http://localhost:8000
- Electron窗口大小：1200x800

## 🤝 贡献

欢迎提交Issue和Pull Request来帮助改进这个项目。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目地址：[<项目GitHub地址>](https://github.com/kl3223/InterviewPrep-Manager)

## 📝 更新日志

### v1.0.0 (2025-12-06)
- 初始版本发布
- 实现所有核心功能模块
- 支持Windows桌面应用
