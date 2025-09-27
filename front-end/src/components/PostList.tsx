import Markdown from "react-markdown"
import { Link } from "react-router-dom"
import { type Post, getPosts, deletePost } from "../lib/api"
import { useEffect, useState } from "react"
import remarkGfm from "remark-gfm"

export default function PostList() {
  const [articles, setArticles] = useState<Post[]>([])
  useEffect(() => {
    getPosts().then(res => setArticles(res))
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm("确定要删除这篇文章吗？")) {
      try {
        await deletePost(id);
        setArticles(articles.filter((a) => a.id !== id));
        alert("文章删除成功！");
      } catch (error) {
        console.error("删除文章失败:", error);
        alert(`删除失败: ${(error as Error).message}`);
      }
    }
  };
  return (
    <div className="space-y-8">
      {articles.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 mb-6">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">暂无文章</h3>
          <p className="text-gray-600 dark:text-gray-400">开始创作您的第一篇文章吧！</p>
        </div>
      ) : (
        articles.map((a) => (
          <article key={a.id} className="card-hover glass-effect rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg">
            <Link to={`/posts/${a.id}`} className="block group">
              <div className="flex flex-col lg:flex-row gap-6">
                {a.image && (
                  <div className="lg:w-72 lg:flex-shrink-0">
                    <div className="h-48 lg:h-32 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                    {a.title}
                  </h2>
                  {a.description && (
                    <div className="prose prose-sm dark:prose-invert prose-gray max-w-none mb-4 text-gray-600 dark:text-gray-400">
                      <Markdown remarkPlugins={[remarkGfm]}>{a.description}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 gap-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">{a.author || '匿名'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>{new Date(a.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/posts/edit/${a.id}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  编辑
                </Link>
                <button
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg border border-red-200 dark:border-red-800 transition-all duration-200 hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(a.id);
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  删除
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  )
}