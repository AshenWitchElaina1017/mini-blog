# Mini Blog

Mini Blog 是一个全栈示例项目，用于练习基于 Go + Gin 的 RESTful API 与 React 19 前端的协同开发。项目提供完整的博客内容管理流程，包括文章的创建、编辑、筛选、删除，Markdown 渲染，图片放大预览，以及基于 JWT 的身份认证与角色管理。

## 功能亮点
- 文章 CRUD、权重排序、标签筛选、Markdown 正文与封面图展示
- 基于 JWT 的注册 / 登录流程，令牌与用户信息持久化在浏览器 localStorage
- Tailwind CSS 4 + React 19 构建的响应式界面，使用 react-markdown 与 remark-gfm 支持 GFM 语法
- 后端使用 Gin、GORM 与 SQLite，提供 JWT 中间件与管理员权限校验
- 全局通知服务，统一展示成功 / 失败提示

## 技术栈
- 前端：React 19、TypeScript 5.8、React Router 7、Vite 7、Tailwind CSS 4、pnpm 9
- 后端：Go 1.24、Gin、GORM、SQLite、bcrypt、golang-jwt
- 开发工具：SWC、ESLint、Tailwind Vite 插件

## 目录结构
    .
    ├── README.md
    ├── backend/          # Go + Gin 后端服务
    │   ├── main.go       # 入口、CORS、路由注册
    │   ├── db/           # 数据库连接与 AutoMigrate
    │   ├── handlers/     # 业务处理逻辑 (文章 / 认证 / 管理)
    │   ├── middleware/   # JWT 与管理员权限中间件
    │   ├── models/       # GORM 模型定义
    │   └── mini-blog.db  # SQLite 数据库 (运行时生成)
    └── front-end/        # React 单页应用
        ├── src/          # 前端业务代码
        └── package.json

更多细节可参考 backend/README.md 与 front-end/README.md。

## 环境准备
- Node.js 20+，执行 corepack enable pnpm 安装 pnpm 9
- Go 1.24+
- SQLite 驱动由 gorm.io/driver/sqlite 自动拉取
- 默认端口：前端 5173，后端 8080

## 快速启动
1. 启动后端

       cd backend
       go run main.go

   首次运行会在 backend 目录生成 mini-blog.db 并自动迁移 Post、User、Tag 模型。

2. 启动前端

       cd front-end
       pnpm install
       pnpm dev

   在浏览器访问 http://127.0.0.1:5173/posts 查看文章列表。

前后端同时运行时，前端通过 http://localhost:8080/api 访问后端 API。

## 常用脚本
| 目录 | 命令 | 说明 |
| ---- | ---- | ---- |
| backend/ | go run main.go | 启动后端开发服务器 |
| backend/ | go build -o mini-blog-server | 打包后端二进制 |
| front-end/ | pnpm dev | 启动 Vite 开发服务器 |
| front-end/ | pnpm build | 产出静态资源到 dist |
| front-end/ | pnpm preview | 预览生产构建 |
| front-end/ | pnpm lint | 运行 ESLint |

## API 概览
| 方法 | 路径 | 描述 |
| ---- | ---- | ---- |
| POST | /api/register | 用户注册 |
| POST | /api/login | 用户登录并获得 JWT |
| GET | /api/posts | 获取文章列表 |
| GET | /api/posts/:id | 获取文章详情 |
| GET | /api/posts/tag/:name | 根据标签筛选文章 |
| POST | /api/posts | 创建文章 (需授权) |
| PUT | /api/posts/:id | 更新文章 (需授权) |
| DELETE | /api/posts/:id | 删除文章 (需授权) |
| GET | /api/tags | 获取标签列表 |
| GET | /api/admin/users | 管理员查看用户列表 |
| POST | /api/admin/users/:id/promote | 管理员提升用户权限 |

## 配置说明
- CORS：backend/main.go 中的 config.AllowOrigins、AllowMethods、AllowHeaders
- JWT 密钥：backend/handlers/auth.go 的 jwtKey，生产环境应改为读取环境变量
- 数据库：backend/db/db.go 默认使用 SQLite，可替换成其他数据库驱动
- API Base URL：front-end/src/lib/api.ts 的 API_URL

## 部署建议
- 后端：go build 生成可执行文件后配合 systemd、Docker 或 Nginx 部署
- 前端：执行 pnpm build 后将 front-end/dist 中的静态资源部署至任意静态服务器
- 若前后端共用域名，可在反向代理层将 /api 路由转发至后端，避免额外的 CORS 配置

