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
    if (isEditMode) {
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
      if (isEditMode) {
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
  const inputClasses = "block w-full px-4 py-3.5 text-gray-900 dark:text-white bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:bg-white dark:hover:bg-gray-800";
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <svg className="animate-spin w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">正在加载文章数据...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-effect rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-gray-700/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {isEditMode ? "编辑文章" : "创建新文章"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isEditMode ? "完善您的文章内容" : "分享您的想法和见解"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              文章标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="给您的文章起个吸引人的标题"
              className={inputClasses}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              简短描述
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="一句话概括文章的主要内容"
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              文章内容 <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">支持 Markdown 语法</span>
            </label>
            <div className="relative">
              <textarea
                name="content"
                id="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="开始创作您的精彩内容...&#10;&#10;支持 Markdown 语法：&#10;# 一级标题&#10;## 二级标题&#10;**粗体文字**&#10;*斜体文字*&#10;- 列表项&#10;[链接文字](链接地址)&#10;![图片描述](图片地址)"
                rows={16}
                className={`${inputClasses} resize-none`}
                required
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                支持 Markdown
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="author" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                作者名称
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="author"
                  id="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="您的笔名或真实姓名"
                  className={inputClasses}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                封面图片 URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="image"
                  id="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/your-image.jpg"
                  className={inputClasses}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {formData.image && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">图片预览</p>
              <div className="w-full h-48 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                <img
                  src={formData.image}
                  alt="封面预览"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="flex-1 sm:flex-none px-6 py-3.5 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 before:absolute before:inset-0 before:bg-white before:opacity-0 hover:before:opacity-10 before:transition-opacity before:duration-200"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? "更新中..." : "发布中..."}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M5 13l4 4L19 7" : "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"} />
                    </svg>
                    {isEditMode ? "确认更新" : "立即发布"}
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}