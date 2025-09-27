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
    <div className="">
      {articles.map((a) => (
        <div key={a.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <Link to={`/posts/${a.id}`}>
            <h2 className="text-xl font-bold mb-2 hover:text-blue-600">{a.title}</h2>
            {a.image && (
            <div className="w-full h-64 overflow-hidden rounded-md mb-4">
                <img
                src={a.image}
                alt={a.title}
                className="w-full h-full object-cover object-center"
                />
            </div>
            )}
            {a.description && <Markdown remarkPlugins={[remarkGfm]}>{a.description}</Markdown>}
          </Link>
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              <span>作者: {a.author || '匿名'}</span>
              <span className="mx-2">·</span>
              <span>{new Date(a.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/posts/edit/${a.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                编辑
              </Link>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
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