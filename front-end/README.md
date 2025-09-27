# Mini Blog 前端

基于 Vite 7 与 React 19 构建的单页博客应用，负责呈现文章列表、详情页、创建编辑表单以及登录/注册流程。通过 `fetch` 调用 Go 后端接口，完成整套 CRUD 与认证体验。

## 功能亮点
- 路由驱动：React Router 7 维护多路由 SPA，支持文章列表、文章详情、编辑、登录与注册等页面。
- Markdown 展示：`react-markdown` 搭配 `remark-gfm` 渲染 Markdown 正文与摘要，支持表格、列表等 GFM 语法。
- 图片体验：详情页与列表中的图片支持点击放大，`ImageModal` 组件负责遮罩与滚动锁定。
- 认证集成：登录成功后写入 `localStorage`，写操作自动携带 `Authorization: Bearer <token>` 请求头，登出时清除并刷新状态。
- 样式体系：Tailwind CSS 4 原子类搭配自定义工具类，快速构建浅色主题界面。

## 环境要求
- Node.js 20 或更新版本。
- pnpm 9（建议执行 `corepack enable pnpm`）。
- 后端服务默认运行在 `http://localhost:8080/api`，请先启动 `backend/`。

## 安装与启动
```bash
cd front-end
pnpm install
pnpm dev
```
开发服务器默认监听 `http://127.0.0.1:5173`，支持热更新。

## 可用脚本
| 命令 | 描述 |
| ---- | ---- |
| `pnpm dev` | 启动 Vite 开发服务器 |
| `pnpm build` | TypeScript 项目引用检查 + Vite 打包，产物位于 `dist/` |
| `pnpm preview` | 以本地静态服务器预览生产构建 |
| `pnpm lint` | 使用 ESLint 进行语法与风格检查 |

## 目录结构
```
src/
├── main.tsx            # React 入口 & 路由表
├── App.tsx             # 顶部导航 + Outlet 容器
├── index.css           # Tailwind 引导与全局样式
├── lib/
│   └── api.ts          # API URL、类型定义与 fetch 封装
└── components/
    ├── PostList.tsx    # 列表页，支持删除、缩略图展示
    ├── PostDetail.tsx  # 详情页，Markdown 渲染与图片放大
    ├── PostForm.tsx    # 新建/编辑表单共用组件
    ├── Login.tsx       # 登录表单，提交后存储 token
    ├── Register.tsx    # 注册表单
    └── ImageModal.tsx  # 图片放大遮罩
```

## 路由与页面
`src/main.tsx` 使用 `createBrowserRouter` 定义以下路由：
- `/`、`/posts`：文章列表。
- `/posts/new`：创建文章。
- `/posts/edit/:id`：编辑文章，加载已有数据填充表单。
- `/posts/:id`：文章详情页。
- `/login`、`/register`：认证入口。

`App.tsx` 负责导航栏、登录态按钮切换与登出逻辑（清除 token 并重载页面）。

## 数据获取与状态
- `lib/api.ts` 定义 `API_URL`（默认 `http://localhost:8080/api`）、`Post` 类型，以及 `getPosts`、`createPost` 等封装函数。
- API 封装统一处理响应，通过 `handleResponse` 抛出错误信息，组件内以 `alert` 或局部文案提示用户。
- 组件内部主要使用 `useState`、`useEffect` 管理局部状态，无额外全局状态库。
- 删除、编辑后会在客户端更新列表或导航至文章详情，保持界面同步。

## 样式与交互细节
- Tailwind 原子类搭配少量自定义类名（如统一的 `inputClasses`），保持表单与按钮风格一致。
- 详情页在模态框开启时给 `body` 添加 `overflow-hidden`，避免滚动穿透。
- `ImageModal` 通过比较 `event.target` 与 `event.currentTarget` 判定是否点击遮罩区域，从而决定关闭弹窗。

## 构建与部署
```bash
pnpm build
```
完成后产物位于 `dist/`，可部署到任意静态资源托管（Nginx、Vercel、Netlify 等）。上线前请确保：
- `API_URL` 指向线上后端域名或网关。
- 后端 CORS 允许前端部署域名，或通过反向代理避免跨域。
- 若提供 https 服务，请同步更新后端地址为 https。

## 调试建议
- 若调用接口失败，请确认后端是否已启动并监听 8080 端口。
- 401/403 多为 token 过期或缺失，可尝试重新登录。
- 遇到端口冲突可修改 `vite.config.ts` 中的 `server.port`，或执行 `pnpm dev --port 5174`。

## 后续扩展方向
- 使用 React Query、Zustand 或 Redux Toolkit 缓存文章与用户信息。
- 借助 React Hook Form、Zod 提升表单校验与用户体验。
- 引入 Vitest + Testing Library 编写页面与组件测试。
- 添加分页、标签、搜索、草稿箱等高级功能。
- 支持主题切换、多语言、本地草稿缓存等增强特性。

> 更多关于 API 与系统架构的细节，请查阅根目录 `README.md` 及 `backend/README.md`。
