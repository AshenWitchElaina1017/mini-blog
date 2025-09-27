# Mini Blog

一个用于练习与演示的全栈迷你博客项目。前端由 React 19 + Vite 构建，后端使用 Go + Gin 提供 RESTful API，数据持久化落地到本地 SQLite。系统支持文章的创建、阅读、更新、删除（CRUD），配合 Markdown 正文、图片预览、作者信息，以及注册/登录获取 JWT 令牌的认证流程。

## 功能亮点
- 文章管理：列表、详情、Markdown 渲染、配图放大、编辑与删除一次到位。
- 账号体系：注册后使用 JWT 登录，前端将令牌保存在 `localStorage` 并在写操作时自动附带到请求头。
- 体验优化：Tailwind 4 原子类快速构建响应式界面，基于 `react-markdown` + `remark-gfm` 支持 GFM 语法。
- 数据安全：后端使用 bcrypt 哈希密码、Gin 中间件解析 JWT（示例默认仅保护写操作，可扩展为全局校验）。

## 技术栈
- 前端：React 19、TypeScript 5.8、React Router 7、Tailwind CSS 4、Vite 7、pnpm 9。
- 后端：Go 1.24、Gin、GORM、SQLite、bcrypt、golang-jwt。
- 支撑工具：ESLint、SWC、Tailwind Vite 插件。

## 系统结构
```
front-end/ (React SPA)
        │  fetch JSON over HTTP
        ▼
backend/ (Go + Gin API) ── GORM ──> SQLite (mini-blog.db)
```

## 目录概览
```
.
├── README.md             # 根目录说明（本文件）
├── backend/              # Go + Gin 后端服务
│   ├── main.go           # HTTP 入口、CORS、路由注册
│   ├── db/db.go          # 数据库连接与 AutoMigrate
│   ├── handlers/         # 业务控制器（文章与认证）
│   ├── middleware/       # JWT 校验中间件
│   ├── models/           # GORM 模型定义
│   └── mini-blog.db      # SQLite 数据文件（运行时生成）
└── front-end/            # React 单页应用
    ├── src/              # 业务源码
    │   ├── App.tsx       # 根组件与导航
    │   ├── main.tsx      # 路由配置
    │   ├── lib/api.ts    # API 封装与类型
    │   └── components/   # 页面与 UI 组件
    └── package.json
```

> 更细节的说明请参考 `backend/README.md` 与 `front-end/README.md`。

## 环境准备
- Node.js 20 或更高版本，建议执行 `corepack enable pnpm` 启用 pnpm 9。
- Go 1.24 及以上。
- SQLite 随 `gorm.io/driver/sqlite` 自动下载，无需额外安装。
- 默认端口：前端 5173，后端 8080。

## 本地快速体验
1. 启动后端服务：
   ```bash
   cd backend
   go run main.go
   ```
   首次运行会在 `backend/` 目录生成 `mini-blog.db` 并自动迁移 `Post`、`User` 模型。

2. 启动前端应用：
   ```bash
   cd front-end
   pnpm install
   pnpm dev
   ```
   打开 `http://127.0.0.1:5173/posts` 即可访问文章列表。

保持两个终端同时运行，前端通过 `http://localhost:8080/api` 请求后端 API。

## 常用命令速查
| 目录 | 命令 | 说明 |
| ---- | ---- | ---- |
| `backend/` | `go run main.go` | 启动开发服务器 |
| `backend/` | `go build -o mini-blog-server` | 构建可执行文件 |
| `front-end/` | `pnpm dev` | 启动 Vite 开发服务器 |
| `front-end/` | `pnpm build` | 打包静态文件到 `dist/` |
| `front-end/` | `pnpm preview` | 本地预览生产构建 |
| `front-end/` | `pnpm lint` | 运行 ESLint |

## API 速览
| 方法 | 路径 | 描述 | 请求体/响应 |
| ---- | ---- | ---- | ---- |
| POST | `/api/register` | 注册用户 | `{"username":"emma","password":"pass"}` → `{"message":"Registration successful"}` |
| POST | `/api/login` | 登录返回 JWT | `{"username":"emma","password":"pass"}` → `{"token":"<jwt>"}` |
| GET | `/api/posts` | 获取文章列表 | 返回 `Post[]` |
| POST | `/api/posts` | 创建文章 | 需要 `Authorization` 头，返回新建 `Post` |
| GET | `/api/posts/:id` | 获取文章详情 | 返回单个 `Post` |
| PUT | `/api/posts/:id` | 更新文章 | 需要 `Authorization` 头，返回更新后的 `Post` |
| DELETE | `/api/posts/:id` | 删除文章 | 需要 `Authorization` 头，返回 `{"message":"Post deleted"}` |

> 当前示例后端已通过 `middleware.AuthMiddleware` 保护写操作，若要拓展权限策略可在 `backend/middleware` 目录继续增强。

## 数据模型速记
**Post**
- `ID int` 自增主键
- `Title string` 标题（必填）
- `Description *string` 摘要（可空）
- `Content string` Markdown 正文
- `Author *string` 作者（可空）
- `Image *string` 图片 URL（可空）
- `CreatedAt/UpdatedAt time.Time` 自动维护

**User**
- `ID uint` 自增主键
- `Username string` 唯一索引
- `Password string` bcrypt 哈希，响应中省略
- `CreatedAt/UpdatedAt time.Time`

## 可配置项
- CORS：`backend/main.go` 中的 `config.AllowOrigins`、`AllowMethods`、`AllowHeaders`。
- JWT 密钥：`backend/handlers/auth.go` 的 `jwtKey`，生产模式应改为读取环境变量。
- 数据库：`backend/db/db.go` 默认使用 SQLite，可替换为 MySQL/PostgreSQL 驱动及 DSN。
- API Base URL：`front-end/src/lib/api.ts` 的 `API_URL`，部署时调整为对应域名或代理路径。

## 开发与部署建议
- 后端：使用 `go build` 生成二进制，结合 systemd 或 Docker/Nginx 部署，并配置专用日志与密钥管理。
- 前端：执行 `pnpm build` 后将 `front-end/dist` 托管到静态资源服务（Nginx、Vercel、Netlify 等）。
- 反向代理：生产环境推荐将前端与后端置于同一域名，通过代理转发 `/api` 请求以简化 CORS。
