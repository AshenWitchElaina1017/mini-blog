## 安装
```
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get gorm.io/driver/sqlite
```

## Apifox 接口测试用例
- 在 `backend` 目录执行 `go run main.go` 启动服务，默认监听 `http://127.0.0.1:8080`。
- Apifox 项目基础地址设置为 `http://127.0.0.1:8080`，路径统一使用 `/api/...`。

### 用例 1：创建文章 (POST /api/posts)
- 目的：验证文章可以成功创建并返回主键 ID。
- 请求头：`Content-Type: application/json`
- 请求体
```json
{
  "title": "第一篇博客",
  "content": "你好，Mini Blog"
}
```
- 期望断言：
  - 状态码 `200`。
  - `title` 等于 `"第一篇博客"`，`content` 等于 `"你好，Mini Blog"`。
  - `id` 字段存在且为数字。
- 后置脚本示例（保存 `postId` 供后续用例使用）：
```javascript
const body = pm.response.json();
pm.expect(body.id).to.be.a("number");
Apifox.setVariable("postId", body.id);
```

### 用例 2：获取文章详情 (GET /api/posts/{{postId}})
- 前置条件：已执行“创建文章”并保存变量 `postId`。
- 期望断言：
  - 状态码 `200`。
  - `id` 等于 `{{postId}}`。
  - `title`、`content` 字段不为空。
- 脚本断言示例：
```javascript
const body = pm.response.json();
pm.expect(body.id).to.eql(Number(pm.variables.get("postId")));
pm.expect(body.title).to.be.a("string").and.not.empty;
pm.expect(body.content).to.be.a("string").and.not.empty;
```

### 用例 3：更新文章 (PUT /api/posts/{{postId}})
- 请求头：`Content-Type: application/json`
- 请求体
```json
{
  "title": "更新后的标题",
  "content": "更新后的正文"
}
```
- 期望断言：
  - 状态码 `200`。
  - 返回对象中 `title`、`content` 被更新。
  - `updatedAt` 时间戳发生变化。
- 脚本断言示例：
```javascript
const body = pm.response.json();
pm.expect(body.title).to.eql("更新后的标题");
pm.expect(body.content).to.eql("更新后的正文");
```

### 用例 4：获取文章列表 (GET /api/posts)
- 期望断言：
  - 状态码 `200`。
  - 响应为数组且至少包含一条数据。
- 脚本断言示例：
```javascript
const body = pm.response.json();
pm.expect(Array.isArray(body)).to.be.true;
pm.expect(body.length).to.be.at.least(1);
```

### 用例 5：删除文章 (DELETE /api/posts/{{postId}})
- 期望断言：
  - 状态码 `200`。
  - 响应 JSON 含 `{"message": "Post deleted"}`。
- 后置操作：删除成功后可再次调用“获取文章详情”，预期返回 `404` 与 `{"error": "Post not found"}`，以验证删除生效。
