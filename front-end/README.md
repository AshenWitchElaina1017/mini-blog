# Mini Blog 前端

该子项目基于 React 19、TypeScript 与 Vite 7，负责提供文章列表、详情、编辑表单以及登录注册流程。界面使用 Tailwind CSS 4 构建，所有数据通过 fetch 请求后端 Gin API。

## 功能概览
- React Router 7 维护单页路由：文章列表、详情、创建、编辑、登录、注册、用户管理
- 支持 Markdown 正文展示与图片放大预览，文章列表可根据标签过滤或按时间排序
- 登录成功后在浏览器 localStorage 保存 token 与用户信息，后续请求自动附带 Authorization 头
- 使用全局通知服务，在页面右上角展示成功或失败提示
- Tailwind CSS 4 原子类结合自定义工具类，快速构建响应式界面

## 环境要求
- Node.js 20 或以上
- pnpm 9 (建议执行 corepack enable pnpm 来启用)
- 后端服务默认监听 http://localhost:8080/api，请先启动 backend

## 安装与启动

    cd front-end
    pnpm install
    pnpm dev

开发服务器默认运行在 http://127.0.0.1:5173，并支持热更新。

## 常用脚本
| 命令 | 说明 |
| ---- | ---- |
| pnpm dev | 启动 Vite 开发服务器 |
| pnpm build | 产出生产环境资源到 dist 目录 |
| pnpm preview | 启动本地静态服务器预览 dist |
| pnpm lint | 执行 ESLint 检查 |

## 目录结构
    src/
    ├── App.tsx           # 顶层布局与导航
    ├── main.tsx          # 入口文件，定义路由与挂载节点
    ├── index.css         # Tailwind 引导与全局样式
    ├── lib/
    │   ├── api.ts        # API 封装、数据类型、错误处理
    │   └── notification.ts # 通知服务单例
    └── components/
        ├── PostList.tsx      # 文章列表 + 标签筛选 + 排序
        ├── PostDetail.tsx    # 文章详情 + Markdown 渲染 + 图片放大
        ├── PostForm.tsx      # 创建/编辑文章表单
        ├── Login.tsx         # 登录表单
        ├── Register.tsx      # 注册表单
        ├── UserList.tsx      # 管理员用户列表与提权按钮
        ├── Notification.tsx  # 全局通知展示
        └── ImageModal.tsx    # 图片模态框

## 数据交互
- API 基础地址在 lib/api.ts 中通过常量 API_URL 声明，默认指向 http://localhost:8080/api
- api.ts 内统一封装 fetch 与错误处理，非 2xx 响应会抛出 Error 供组件捕获
- 登录成功后写入 localStorage (token 与 user)，删除或过期后需要重新登录
- 文章删除、编辑等写操作完成后会直接更新本地状态或导航至目标页面，确保界面同步

## 样式与交互细节
- 组件中复用 inputClasses、contentInputClasses 等字符串，保持表单控件一致
- 详情页面在模态框打开时向 body 添加 overflow-hidden，关闭时恢复，避免背景滚动
- 标签筛选通过路由参数 tagName 触发 useEffect 重新请求列表
- 删除文章与提升管理员操作均会弹出原生确认框，成功后刷新本地状态并显示通知

## 构建与部署

    pnpm build

完成后 dist 目录包含可直接部署的静态资源，可按需上传至任意静态站点 (Nginx、Vercel、Netlify 等)。上线前请确认：
- API_URL 指向正式环境后端地址
- 后端已允许前端域名的 CORS 或通过反向代理解决跨域
- 如需 HTTPS，请同步更新后端或代理配置

## 调试提示
- 若接口请求失败，确认 backend 是否运行并监听 8080 端口
- 401 或 403 通常由 token 缺失或过期导致，可尝试重新登录并刷新页面
- 若端口冲突，可在运行时使用 pnpm dev -- --host --port 5174 指定新的端口

更多使用说明可参考根目录 README.md 以及 backend/README.md。

