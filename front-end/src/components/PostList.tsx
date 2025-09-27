// 导入 Markdown 组件，用于渲染 Markdown 格式的文本
import Markdown from "react-markdown"
// 导入 Link 组件，用于客户端路由导航
import { Link } from "react-router-dom"
// 导入 Post 类型定义和 API 函数
import { type Post, getPosts, deletePost } from "../lib/api"
// 导入 React 的钩子函数
import { useEffect, useState } from "react"

/**
 * PostList 组件
 * @description 用于展示文章列表，并提供编辑和删除功能。
 * @returns {JSX.Element} 渲染出的文章列表组件
 */
export default function PostList() {
  // 使用 useState 定义一个状态，用于存储从后端获取的文章列表
  const [articles, setArticles] = useState<Post[]>([])

  // 使用 useEffect 在组件首次挂载时获取文章列表
  useEffect(() => {
    // 调用 getPosts API 获取所有文章
    getPosts().then(res => setArticles(res))
  }, []) // 空依赖数组表示这个 effect 只在组件挂载时运行一次

  /**
   * handleDelete 函数
   * @description 处理删除文章的逻辑
   * @param {number} id - 需要删除的文章的 ID
   */
  const handleDelete = async (id: number) => {
    // 弹出确认框，防止用户误操作
    if (window.confirm("确定要删除这篇文章吗？")) {
      try {
        // 调用 api.ts 中定义的 deletePost 函数，向后端发送删除请求
        await deletePost(id);
        // 如果 API 调用成功，说明后端已经删除了数据
        // 接下来需要更新前端界面，从 articles 状态中过滤掉被删除的文章
        setArticles(articles.filter((a) => a.id !== id));
        // 提示用户删除成功
        alert("文章删除成功！");
      } catch (error) {
        // 如果删除过程中出现错误，打印错误信息并提示用户
        console.error("删除文章失败:", error);
        alert(`删除失败: ${(error as Error).message}`);
      }
    }
  };

  return (
    <div className="">
      {/* 遍历 articles 数组，为每篇文章渲染一个卡片 */}
      {articles.map((a) => (
        <div key={a.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          {/* 整体卡片链接到详情页 */}
          <Link to={`/posts/${a.id}`}>
            <h2 className="text-xl font-bold mb-2 hover:text-blue-600">{a.title}</h2>
            {/* a.image存在时才渲染图片 */}
            {a.image && <img src={a.image} alt={a.title} className="w-full h-auto rounded-md mb-4" />}
            {/* 文章简短描述 */}
            {a.description && <Markdown>{a.description}</Markdown>}
          </Link>
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              {/* 作者信息，如果不存在则显示'匿名' */}
              <span>作者: {a.author || '匿名'}</span>
              <span className="mx-2">·</span>
              {/* 将 ISO 格式的日期转换为本地化的日期字符串 */}
              <span>{new Date(a.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/posts/edit/${a.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                // 阻止事件冒泡，防止点击编辑按钮时触发外层 Link 的跳转
                onClick={(e) => e.stopPropagation()}
              >
                编辑
              </Link>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                // 点击按钮时，调用 handleDelete 函数并传入当前文章的 id
                onClick={(e) => {
                  e.stopPropagation(); // 同样阻止事件冒泡
                  handleDelete(a.id);
                }}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}