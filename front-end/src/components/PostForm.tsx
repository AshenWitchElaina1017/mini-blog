import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPost, editPost, getPostById, type Post } from "../lib/api";

export default function PostForm() {
  // 从URL中获取id，用于判断是新建还是编辑
  const { id } = useParams<{ id: string }>();
  // 获取导航函数，用于提交后跳转
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    author: '',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isEditMode = Boolean(id);
  // 如果是编辑模式，在组件加载时获取文章数据
  useEffect(() => {
    if (isEditMode && id) {
      getPostById(id)
        .then(post => {
          // 将获取到的数据填充到表单中
          setFormData({
            title: post.title,
            description: post.description || '',
            content: post.content,
            author: post.author || '',
            image: post.image || '',
          });
        })
        .catch(error => {
          console.error("获取文章失败:", error);
          alert("无法加载文章数据！");
        })
        .finally(() => setIsLoading(false));
    } else {
      // 如果是新建模式，直接完成加载
      setIsLoading(false);
    }
  }, [id, isEditMode]);
  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("标题和内容不能为空！");
      return;
    }
    setIsSubmitting(true);
    // 准备提交的数据
    const postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
    };
    try {
      if (isEditMode && id) {
        // 编辑模式：调用 editPost API
        const updatedPost = await editPost(id, postData as Post);
        alert(`文章 "${updatedPost.title}" 更新成功！`);
        // 更新成功后跳转到文章详情页
        navigate(`/posts/${updatedPost.id}`);
      } else {
        // 创建模式：调用 createPost API
        const createdPost = await createPost(postData as Post);
        alert(`文章 "${createdPost.title}" 创建成功！`);
        navigate(`/posts/${createdPost.id}`);
      }
    } catch (error) {
      console.error("操作失败:", error);
      alert(`操作失败: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const inputClasses = "block w-full px-4 py-2 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";
  if (isLoading) {
    return <div className="text-center mt-10">正在加载文章数据...</div>;
  }
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 sm:p-8 bg-white dark:bg-zinc-900 shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
        {isEditMode ? "编辑文章" : "创建新文章"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300 mb-2">
            标题
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="请输入文章标题"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300 mb-2">
            简短描述
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="一句话描述你的文章"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300 mb-2">
            内容 (支持 Markdown)
          </label>
          <textarea
            name="content"
            id="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="在这里开始写作..."
            rows={12}
            className={inputClasses}
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-6 sm:space-y-0">
          <div className="flex-1">
            <label htmlFor="author" className="block text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300 mb-2">
              作者
            </label>
            <input
              type="text"
              name="author"
              id="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="你的笔名"
              className={inputClasses}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="image" className="block text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300 mb-2">
              图片 URL
            </label>
            <input
              type="text"
              name="image"
              id="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={inputClasses}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isSubmitting ? (isEditMode ? "正在更新..." : "发布中...") : (isEditMode ? "确认更新" : "立即发布")}
        </button>
      </form>
    </div>
  );
}