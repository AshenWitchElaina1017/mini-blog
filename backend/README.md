# Mini Blog 后端

基于 Go 1.24、Gin 和 GORM 构建的 RESTful API，为前端单页应用提供认证与文章管理能力。默认使用 SQLite 本地文件存储，适合快速演示、学习与二次开发。

## 主要特性
- **REST API**：`/api/posts` 系列端点提供文章 CRUD，支持 Markdown 内容、作者、图片链接等字段。
- **JWT 认证**：`/api/register`、`/api/login` 生成并校验 JWT，写操作通过 `middleware.AuthMiddleware` 保护。
- **数据持久化**：GORM 自动迁移 `Post`、`User` 模型至 `mini-blog.db`，零配置即可运行。
- **CORS 支持**：默认放行 `http://localhost:5173`，以便前端开发时跨域访问。
- **安全基线**：bcrypt 哈希密码，JWT 有 24 小时有效期，可按需调整。

## 目录结构
```
backend/
├── main.go            # 入口：CORS、路由、分组中间件
├── db/
│   └── db.go          # 建立 GORM 连接并 AutoMigrate 模型
├── handlers/
│   ├── auth.go        # 注册、登录、JWT 颁发与结构体
│   └── post.go        # 文章增删改查
├── middleware/
│   └── auth.go        # Bearer Token 校验中间件
├── models/
│   ├── post.go        # Post 模型定义
│   └── users.go       # User 模型定义
├── mini-blog.db       # SQLite 数据库文件（运行时生成）
├── go.mod / go.sum
└── README.md
```

## 环境要求
- Go 1.24 或更高版本。
- 具有写权限的工作目录（以创建/更新 `mini-blog.db`）。
- 若需跨平台运行，可在 Mac、Linux、Windows/Powershell 中直接执行。

## 启动与构建
开发模式：
```bash
cd backend
go run main.go
```
默认监听 `http://127.0.0.1:8080`。首次启动会自动创建 `mini-blog.db` 并迁移数据表。

生产构建：
```bash
go build -o mini-blog-server
./mini-blog-server    # Linux / macOS
mini-blog-server.exe  # Windows
```

## 模块说明
- `db.Connect()`：初始化全局 `db.DB`，使用 `gorm.Open(sqlite.Open("mini-blog.db"))`，并自动迁移模型。
- `handlers/auth.go`：
  - `Register`：校验输入、bcrypt 加密密码、写入用户信息。
  - `Login`：匹配用户名、校验密码、签发 24 小时有效的 JWT。
  - `jwtKey`：演示用常量 `your_secret_key`，生产中建议改为环境变量。
- `handlers/post.go`：提供文章 CRUD，`ShouldBindJSON` 解析请求体，GORM 负责读写。
- `middleware/auth.go`：解析 `Authorization: Bearer <token>`，验证签名及过期时间，校验失败返回 401。
- `main.go`：配置 CORS，创建 `/api` 分组，公开注册、登录与读取接口，将写操作挂在使用 `AuthMiddleware` 的子分组下。

## 数据模型
**Post**
- `ID int` 主键，自增
- `Title string` 标题（必填）
- `Description *string` 摘要，可空
- `Content string` Markdown 正文
- `Author *string` 作者，可空
- `Image *string` 图片 URL，可空
- `CreatedAt/UpdatedAt time.Time` 自动维护

**User**
- `ID uint` 主键，自增
- `Username string` 唯一、不为空
- `Password string` bcrypt 哈希，JSON 响应忽略该字段
- `CreatedAt/UpdatedAt time.Time`

## API 速查
| 方法 | 路径 | 描述 | 认证 | 请求体 | 成功响应 |
| ---- | ---- | ---- | ---- | ---- | ---- |
| POST | `/api/register` | 注册新用户 | 否 | `{"username":"emma","password":"pass"}` | `{"message":"Registration successful"}` |
| POST | `/api/login` | 登录获取 JWT | 否 | 同上 | `{"token":"<jwt>"}` |
| GET | `/api/posts` | 获取文章列表 | 否 | — | `Post[]` |
| GET | `/api/posts/:id` | 获取文章详情 | 否 | — | `Post` |
| POST | `/api/posts` | 创建文章 | 是 | `{"title":"...","content":"..."...}` | 新建的 `Post` |
| PUT | `/api/posts/:id` | 更新文章 | 是 | 与 POST 类似 | 更新后的 `Post` |
| DELETE | `/api/posts/:id` | 删除文章 | 是 | — | `{"message":"Post deleted"}` |

常见错误状态：
- `400 Bad Request`：请求体验证失败、用户名重复或 JSON 解析错误。
- `401 Unauthorized`：Token 缺失、格式错误或验证失败。
- `404 Not Found`：目标文章不存在。
- `500 Internal Server Error`：哈希、签名或数据库异常。

## 配置建议
- **CORS**：编辑 `main.go` 中的 `config.AllowOrigins`、`AllowMethods`、`AllowHeaders` 以适配不同前端域名。
- **JWT 密钥**：将 `jwtKey` 替换为 `os.Getenv` 读取，例如：
  ```go
  var jwtKey = []byte(os.Getenv("JWT_SECRET"))
  ```
- **数据库**：如需迁移到 MySQL/PostgreSQL，可更换驱动 `gorm.Open(mysql.Open(dsn))` 并更新连接参数。
- **运行模式**：生产环境建议 `gin.SetMode(gin.ReleaseMode)` 并配置日志输出。

## 调试与排错
- 接口调试可使用 curl、Postman、Apifox 等工具；示例：
  ```bash
  curl http://localhost:8080/api/posts
  ```
- 若数据库锁定或需要清空数据，停止服务后删除 `mini-blog.db` 再启动。
- 调试 SQL 可开启 GORM 日志：
  ```go
  db.DB, err = gorm.Open(sqlite.Open("mini-blog.db"), &gorm.Config{
      Logger: logger.Default.LogMode(logger.Info),
  })
  ```

## 测试思路
- 使用 `net/http/httptest` 构建 handler 单元测试，结合 `github.com/stretchr/testify` 进行断言。
- 抽象数据库访问层，便于替换为内存实现或 mock。
- 运行集成测试时可使用内存 SQLite：`sqlite.Open("file::memory:?cache=shared")`。

## 下一步可扩展
- 增加刷新 Token、密码重置、角色权限等更丰富的认证能力。
- 引入配置管理工具（如 Viper）统一读取环境变量。
- 添加分页、搜索、排序或标签功能，提升文章管理体验。
- 对敏感操作增加审计日志、速率限制等防护措施。
- 编写 CI 流程自动运行测试与安全扫描。

> 与前端的集成说明、使用示例请参见根目录 `README.md` 以及 `front-end/README.md`。
