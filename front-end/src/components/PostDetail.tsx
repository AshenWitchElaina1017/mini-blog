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
    return <div className="text-center py-10">加载中...</div>;
  }
  // 如果加载完成但没有获取到文章数据，则显示未找到提示
  if (!post) {
    return <div className="text-center py-10">文章未找到</div>;
  }
  return (
    <div>
      {post.image && (
        <div className="mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto object-cover rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => handleImageClick(post.image!)}
          />
        </div>
      )}
      <div className="max-w-3xl mx-auto">
        {/* <h1 className="text-4xl font-extrabold text-zinc-900 mb-4 tracking-tight">{post.title}</h1> */}
        <div className="text-sm text-gray-500 mb-8 border-b pb-4">
            <span>作者: {post.author || '匿名'}</span>
            <span className="mx-2">·</span>
            <span>发布于: {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose prose-lg break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className="rounded-md shadow-md cursor-pointer transition-shadow hover:shadow-xl"
                  onClick={() => handleImageClick(props.src!)}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
      <ImageModal imageUrl={modalImageUrl} onClose={handleCloseModal} />
    </div>
  );
}