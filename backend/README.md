# Mini Blog 后端

该后端基于 Go 1.24、Gin 与 GORM，提供 Mini Blog 前端所需的认证、文章管理和标签筛选接口。系统默认使用本地 SQLite 文件，零配置即可启动，适合学习与二次开发。

## 功能特性
- 提供 /api/posts 系列 REST 接口，实现文章的创建、读取、更新、删除
- /api/register 与 /api/login 支持用户注册与登录，返回 JWT 令牌
- 通过 AuthMiddleware 校验 Bearer Token，并在 Gin 上下文携带用户信息
- bcrypt 对密码进行哈希存储，JWT 默认 24 小时过期
- CORS 默认允许 http://localhost:5173 便于前端联调

## 目录结构
    backend/
    ├── main.go            # 入口：CORS、路由、分组中间件
    ├── db/db.go           # 连接 SQLite 并自动迁移模型
    ├── handlers/auth.go   # 注册、登录、JWT 相关逻辑
    ├── handlers/post.go   # 文章 CRUD 与标签处理
    ├── middleware/auth.go # 验证 JWT 并注入用户上下文
    ├── middleware/admin.go# 校验管理员角色
    ├── models/            # GORM 模型定义
    └── mini-blog.db       # 数据库文件 (运行时生成)

## 环境要求
- Go 1.24 或以上
- 工作目录具有写权限，用于创建 mini-blog.db
- 若需跨平台部署，可直接在 Windows、macOS、Linux 上构建

## 启动与构建
开发模式

    cd backend
    go run main.go

首次运行会在当前目录生成 mini-blog.db 并迁移 Post、User、Tag 模型。

生产编译

    cd backend
    go build -o mini-blog-server
    ./mini-blog-server    # Linux 或 macOS
    mini-blog-server.exe  # Windows

默认监听 http://127.0.0.1:8080。

## 关键模块
- db.Connect 初始化全局数据库连接并执行 AutoMigrate
- handlers/auth.go 负责注册、登录、JWT 结构体与签名逻辑
- handlers/post.go 负责文章 CRUD 与标签管理
- middleware/auth.go 验证 Authorization: Bearer token
- middleware/admin.go 确认用户角色为 admin

## API 摘要
| 方法 | 路径 | 说明 | 认证 |
| ---- | ---- | ---- | ---- |
| POST | /api/register | 注册新用户 | 否 |
| POST | /api/login | 登录并获取 JWT | 否 |
| GET | /api/posts | 获取文章列表 | 否 |
| GET | /api/posts/:id | 获取文章详情 | 否 |
| GET | /api/posts/tag/:name | 通过标签过滤文章 | 否 |
| POST | /api/posts | 创建文章 | 是 |
| PUT | /api/posts/:id | 更新文章 | 是 |
| DELETE | /api/posts/:id | 删除文章 | 是 |
| GET | /api/tags | 获取全部标签 | 否 |
| GET | /api/admin/users | 查看用户列表 | 是 (需 admin) |
| POST | /api/admin/users/:id/promote | 提升用户为管理员 | 是 (需 admin) |

常见错误说明：
- 400 表示参数缺失或格式错误
- 401 表示令牌缺失、过期或无效
- 404 表示资源不存在
- 500 表示服务器内部错误 (数据库、加密等)

## 配置选项
- CORS：main.go 中 config.AllowOrigins、AllowMethods、AllowHeaders 控制跨域策略
- JWT 密钥：handlers/auth.go 的 jwtKey，生产环境建议改为读取环境变量
- 数据库：db/db.go 默认使用 sqlite.Open('mini-blog.db')，可替换为其他驱动
- 日志：如需详细 SQL，可在 gorm.Open 时设置 logger.LogMode(logger.Info)

## 调试建议
- curl 示例：curl http://localhost:8080/api/posts
- 删除 mini-blog.db 可重置数据
- 若需在测试中使用内存数据库，可将连接改为 sqlite.Open('file::memory:?cache=shared')

更多与前端集成的信息，请参阅根目录 README.md 以及 front-end/README.md。

