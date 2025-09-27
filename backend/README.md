# Mini Blog 后端

使用 Go 1.24、Gin 和 GORM 实现的 REST API，负责文章的 CRUD 操作并将数据持久化到 SQLite。

## 快速了解
- 服务入口：main.go，默认监听 http://127.0.0.1:8080。
- 数据库：同目录的 mini-blog.db（SQLite）。首次运行时自动创建并迁移 Post 模型。
- 中间件：开启 CORS，允许来自 http://localhost:5173 的前端请求。

## 环境要求
- Go 1.24.4 或更高版本。
- SQLite 动态库由 go-sqlite3 自动链接，无需额外安装。
- Windows 用户建议在 PowerShell 或 WSL 中运行 go 命令。

## 启动步骤
在仓库根目录打开终端后执行：

        cd backend
        go run main.go

服务启动后可通过 curl、Apifox 或浏览器开发者工具访问接口。例如：

        curl http://127.0.0.1:8080/api/posts

若需要生成独立可执行文件：

        go build -o mini-blog-server
        ./mini-blog-server

## 项目结构
    backend/
    ├── main.go           # 程序入口与路由注册
    ├── db/db.go          # 数据库初始化与自动迁移
    ├── handlers/post.go  # 文章增删改查的 HTTP 处理函数
    ├── models/post.go    # GORM 模型定义
    ├── mini-blog.db      # SQLite 数据文件（运行后生成）
    ├── go.mod
    └── go.sum

## 数据模型
Post 结构体包含以下字段：
- ID：主键，自增整数。
- Title：文章标题，字符串。
- Description：可选描述，指针类型允许为空。
- Content：正文文本，支持 Markdown。
- Author：可选作者名称。
- Image：可选封面图片 URL。
- CreatedAt / UpdatedAt：自动维护的时间戳。

## API 说明
| 方法 | 路径 | 描述 | 请求体示例字段 |
| ---- | ---- | ---- | ---- |
| GET | /api/posts | 获取文章列表 | 无 |
| POST | /api/posts | 创建文章 | title、content（必填），description、author、image（可选） |
| GET | /api/posts/:id | 获取指定文章 | 无 |
| PUT | /api/posts/:id | 更新文章（全量） | 与 POST 相同 |
| DELETE | /api/posts/:id | 删除文章 | 无 |

返回体均为 JSON：
- 成功时返回文章对象或 {"message":"Post deleted"}。
- 资源不存在时返回 404 与 {"error":"Post not found"}。
- 参数校验失败返回 400，并包含 error 字段。

Apifox 或 Postman 使用建议：先执行创建文章用例，记录返回的 id，后续详情、更新、删除均复用该值。

## 数据库运维
- 清空数据：停止服务后删除 mini-blog.db，下一次启动会自动重建空表。
- 更换数据库：修改 db/db.go 的 sqlite.Open，替换为 gorm 支持的其他驱动（如 MySQL、PostgreSQL），并调整连接字符串。
- 备份：直接复制 mini-blog.db 文件即可。

## 生产部署提示
- 将 Gin 的运行模式设置为 release（可在 main 函数开头添加 gin.SetMode(gin.ReleaseMode)）。
- 配置环境变量或独立的配置文件以管理数据库路径、监听端口、允许的 CORS 来源。
- 搭配反向代理（Nginx/Traefik）统一处理 HTTPS 和跨域。
- 建议增加日志记录、错误捕获以及单元测试（使用 httptest 和 testify 等工具）。

## 调试技巧
- 使用 go test 构建针对 handlers 包的单元测试，结合 httptest.NewRecorder 模拟请求。
- 借助 SQLite 浏览工具（如 DB Browser for SQLite）查看数据写入情况。
- 若需要临时查看 SQL，可在 db.Connect 中开启 gorm 的 Logger。

祝开发顺利，更多接口细节可参考根目录 README 以及前端文档。
