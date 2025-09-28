import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPost, editPost, getPostById } from '../lib/api';
import { notificationService } from '../lib/notification';
import { useAuthStore } from '../lib/store';

type FormState = {
  title: string;
  description: string;
  content: string;
  author: string;
  image: string;
  weight: number;
  tags: string;
};

export default function PostForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // 从 store 获取当前用户信息
  const currentUser = useAuthStore((state) => state.currentUser);
  const [formData, setFormData] = useState<FormState>({
    title: '',
    description: '',
    content: '',
    author: '',
    image: '',
    weight: 0,
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      getPostById(id)
        .then((post) => {
          setFormData({
            title: post.title,
            description: post.description || '',
            content: post.content,
            author: post.author || '',
            image: post.image || '',
            weight: post.weight || 0,
            tags: post.tags.map((t) => t.name).join(', '),
          });
        })
        .catch((error) => {
          console.error('获取文章失败:', error);
          notificationService.show('无法加载文章数据！', 'error');
        })
        .finally(() => setIsLoading(false));
    } else {
      if (currentUser) {
        setFormData((prevData) => ({
          ...prevData,
          author: currentUser.username,
        }));
      }
      setIsLoading(false);
    }
  }, [id, isEditMode, currentUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      notificationService.show('标题和内容不能为空！', 'error');
      return;
    }

    setIsSubmitting(true);

    const postData = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      if (isEditMode && id) {
        const updatedPost = await editPost(id, postData);
        notificationService.show('文章 "' + updatedPost.title + '" 更新成功！', 'success');
        navigate('/posts/' + updatedPost.id);
      } else {
        const createdPost = await createPost(postData);
        notificationService.show('文章 "' + createdPost.title + '" 创建成功！', 'success');
        navigate('/posts/' + createdPost.id);
      }
    } catch (error) {
      console.error('操作失败:', error);
      notificationService.show('操作失败: ' + (error as Error).message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const baseInputClasses = 'block w-full px-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200';
  const authorInputClasses = currentUser?.role !== 'admin' ? baseInputClasses + ' bg-slate-100 cursor-not-allowed' : baseInputClasses;
  const contentInputClasses = baseInputClasses + ' resize-y min-h-[200px]';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-600">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl border border-slate-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{isEditMode ? '编辑文章' : '创建新文章'}</h1>
        <p className="text-slate-600">{isEditMode ? '修改您的文章内容' : '分享您的想法和见解'}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold leading-6 text-slate-700 mb-2">
            文章标题
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="请输入文章标题"
            className={baseInputClasses}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-semibold leading-6 text-slate-700 mb-2">
            简短描述
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="一句话描述您的文章"
            className={baseInputClasses}
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-semibold leading-6 text-slate-700 mb-2">
            内容
            <span className="text-xs text-slate-500 font-normal">(支持 Markdown 语法)</span>
          </label>
          <textarea
            name="content"
            id="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="在这里开始写作您的精彩内容..."
            rows={14}
            className={contentInputClasses}
            required
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-semibold leading-6 text-slate-700 mb-2">
            标签
            <span className="text-xs text-slate-500 font-normal ml-2">(用逗号分隔)</span>
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="例如: Go, React, Web开发"
            className={baseInputClasses}
          />
        </div>
        {currentUser?.role === 'admin' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <label htmlFor="weight" className="block text-sm font-semibold leading-6 text-slate-700 mb-2">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                权重设置
              </span>
              <span className="text-xs text-slate-500 font-normal block mt-1">数字越大越靠前显示，默认为 0</span>
            </label>
            <input
              type="number"
              name="weight"
              id="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="例如: 100"
              className={baseInputClasses}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="author" className="block text-sm font-semibold leading-6 text-slate-700 mb-2">
              作者
              {currentUser?.role !== 'admin' && <span className="text-xs text-slate-500 font-normal ml-2">(只读)</span>}
            </label>
            <input
              type="text"
              name="author"
              id="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="您的笔名"
              className={authorInputClasses}
              disabled={currentUser?.role !== 'admin'}
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-semibold leading-6 text-slate-700 mb-2">
              封面图片
              <span className="text-xs text-slate-500 font-normal ml-2">(可选)</span>
            </label>
            <input
              type="text"
              name="image"
              id="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={baseInputClasses}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-6 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditMode ? '正在更新...' : '发布中...'}
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {isEditMode ? '确认更新' : '立即发布'}
            </span>
          )}
        </button>
      </form>
    </div>
  );
}