# Mini Blog 前端

基于 Vite 构建的 React 19 单页应用，涵盖文章列表、详情和表单三类核心页面，演示如何在同一代码库内完成前后端分离开发。

## 快速了解
- 技术栈：React 19、TypeScript 5.8、React Router 7、Vite 7、Tailwind CSS 4。
- 数据来源：后端服务默认运行在 http://localhost:8080，通过 REST 接口提供文章数据。
- 构建目标：pnpm build 产出位于 dist 目录的静态资源，可部署到任意支持静态文件托管的环境。

## 前置条件
- Node.js 20 或更高版本（建议使用 corepack 管理 pnpm）。
- pnpm 9（执行 corepack enable pnpm 或 npm install -g pnpm）。
- 已启动后端服务，或确保 front-end/src/lib/api.ts 中的 API_URL 指向可用接口地址。

## 安装与常用脚本
在仓库根目录打开终端后执行：

        cd front-end
        pnpm install

常用脚本如下：

| 脚本 | 说明 |
| ---- | ---- |
| pnpm dev | 启动开发服务器（默认端口 5173），支持热更新与路由回退 |
| pnpm build | 运行 TypeScript 编译与 Vite 打包，输出到 dist 目录 |
| pnpm preview | 启动本地静态预览，模拟生产构建后的访问效果 |
| pnpm lint | 使用 ESLint 进行代码质量检查 |

## 目录结构速览
    front-end/
    ├── README.md            # 本说明文档
    ├── src/
    │   ├── App.tsx          # 应用框架与导航
    │   ├── main.tsx         # 入口文件，挂载 RouterProvider
    │   ├── components/
    │   │   ├── PostList.tsx    # 文章列表和删除逻辑
    │   │   ├── PostDetail.tsx  # 文章详情与 Markdown 渲染
    │   │   └── PostForm.tsx    # 创建与编辑表单
    │   └── lib/api.ts       # 对后端接口的封装
    ├── index.html
    ├── package.json
    └── vite.config.ts

## 路由与页面说明
- 根路由使用 App.tsx 提供统一的导航和布局。
- main.tsx 中定义 BrowserRouter：
  - /posts （以及 /）映射到 PostList.tsx。
  - /posts/new 映射到 PostForm.tsx，进入创建模式。
  - /posts/edit/:id 同样复用 PostForm.tsx，但会在挂载时加载现有数据。
  - /posts/:id 映射到 PostDetail.tsx，并通过 URL 参数请求文章详情。

## 数据请求与错误处理
- front-end/src/lib/api.ts 统一维护 Post 类型定义和全部请求函数（getPosts、getPostById、createPost、editPost、deletePost）。
- handleResponse 针对非 2xx 响应抛出 Error，并优先解析返回体的 error 字段，保证组件侧能展示清晰提示。
- 组件按需调用这些函数，并结合 useState 与 useEffect 管理加载状态。

## 样式体系
- Tailwind CSS 4 以原子类覆盖布局与主题，无需单独配置 tailwind.config.js（Vite 插件已内置）。
- index.css 中可放置全局覆写，例如字体或背景色。
- 表单和按钮示例展示了浅色与深色模式的兼容写法，可根据需要扩展。

## 与后端联调
- 默认允许来自 http://localhost:5173 的跨域请求，确保后端 main.go 中的 CORS 配置与前端端口一致。
- 如果需要连接远程接口，修改 front-end/src/lib/api.ts 的 API_URL 常量并重启开发服务器。
- 注意在删除或编辑文章时的窗口确认，这些交互直接调用后端接口，建议先在本地数据库中测试。

## 构建与部署建议
1. 执行 pnpm build 生成 dist 目录。
2. 将 dist 内容上传到任意静态资源服务（Nginx、Vercel、Netlify 等）。
3. 部署到自有服务器时，可通过 Nginx 反向代理将 /api 请求转发到后端服务，避免浏览器跨域问题。

## 代码质量与扩展方向
- 当前未引入单元测试，可根据需求选择 Vitest 或 React Testing Library。
- 建议为 API 层补充错误监控与重试策略，并结合 Suspense 或全局状态管理系统（如 Zustand）优化数据共享。
- 如需国际化或深色模式开关，可在 App.tsx 中扩展全局上下文。

祝开发顺利，更多问题欢迎查看根目录 README 或后端文档。
