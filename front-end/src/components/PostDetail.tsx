import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getPostById, type Post } from "../lib/api";
import remarkGfm from "remark-gfm";
import ImageModal from "./ImageModal";

/**
 * PostDetail 组件
 * @returns {JSX.Element} - 返回文章详情页面的 JSX 元素。
 *
 * 该组件负责根据 URL 中的 ID 获取并展示单篇文章的详细内容。
 */
export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  // 状态：存储当前正在放大的图片的 URL。为空字符串时，模态框不显示。
  const [modalImageUrl, setModalImageUrl] = useState('');
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const data = await getPostById(id);
          setPost(data);
        } catch (error) {
          console.error("获取文章详情失败:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id]);
  /**
   * 处理图片点击事件的函数
   * @param {string} imageUrl - 被点击图片的 URL
   */
  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };
  /**
   * 关闭图片模态框的函数
   */
  const handleCloseModal = () => {
    setModalImageUrl('');
  };
  // Effect Hook: 用于在模态框打开时禁止页面滚动
  useEffect(() => {
    if (modalImageUrl) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [modalImageUrl]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <svg className="animate-spin w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">正在加载文章内容...</p>
        </div>
      </div>
    );
  }
  // 如果加载完成但没有获取到文章数据，则显示未找到提示
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 mb-6">
            <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">文章未找到</h3>
          <p className="text-gray-600 dark:text-gray-400">您要查看的文章可能已被删除或不存在。</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto">
      <article className="glass-effect rounded-2xl backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden">
        {post.image && (
          <div className="relative">
            <div className="h-64 md:h-80 lg:h-96 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover object-center cursor-pointer transition-all duration-500 hover:scale-105"
                onClick={() => handleImageClick(post.image!)}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}

        <div className="p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 p-6 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">作者</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{post.author || '匿名'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">发布时间</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert prose-gray max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    className="rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                    onClick={() => handleImageClick(props.src!)}
                  />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-2" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 py-2 px-4 rounded-r-lg my-4 italic" {...props} />
                ),
                code: ({ node, inline, ...props }) => (
                  inline ? (
                    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                  ) : (
                    <code className="block bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm" {...props} />
                  )
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      <ImageModal imageUrl={modalImageUrl} onClose={handleCloseModal} />
    </div>
  );
}