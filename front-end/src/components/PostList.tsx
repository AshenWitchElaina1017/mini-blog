import Markdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import { type Post, getPosts, deletePost, getPostsByTag } from '../lib/api';
import { useEffect, useMemo, useState } from 'react';
import remarkGfm from 'remark-gfm';
import { notificationService } from '../lib/notification';
import { useAuthStore } from '../lib/store';

export default function PostList() {
  const { tagName } = useParams<{ tagName: string }>();
  const [articles, setArticles] = useState<Post[]>([]);
  // 从 store 获取当前用户信息
  const currentUser = useAuthStore((state) => state.currentUser);
  const [sortKey, setSortKey] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchArticles = tagName ? getPostsByTag(tagName) : getPosts();

    fetchArticles
      .then((res) => setArticles(res))
      .catch((error) => {
        console.error('获取文章列表失败:', error);
        notificationService.show('获取文章失败: ' + (error as Error).message, 'error');
      })
      .finally(() => setIsLoading(false));
  }, [tagName]);

  const sortedArticles = useMemo(() => {
    const sorted = [...articles];
    switch (sortKey) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'default':
      default:
        return articles;
    }
  }, [articles, sortKey]);

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await deletePost(id);
        setArticles(articles.filter((a) => a.id !== id));
        notificationService.show('文章删除成功', 'success');
      } catch (error) {
        console.error('删除文章失败:', error);
        notificationService.show('删除失败: ' + (error as Error).message, 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-600">加载文章中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {tagName ? '标签 "' + tagName + '" 的文章' : '所有文章'}
        </h1>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 transition duration-200"
        >
          <option value="default">默认排序 (置顶优先)</option>
          <option value="newest">最新发布</option>
          <option value="oldest">最早发布</option>
        </select>
      </div>
      <div className="grid gap-6">
        {sortedArticles.map((a) => (
          <article key={a.id} className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Link to={'/posts/' + a.id} className="block">
              {a.image && (
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 text-slate-900 hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                  {a.title}
                </h2>
                {a.description && (
                  <div className="prose prose-sm text-slate-600 mb-4 line-clamp-3">
                    <Markdown remarkPlugins={[remarkGfm]}>{a.description}</Markdown>
                  </div>
                )}
              </div>
            </Link>
            <div className="px-6 pb-6">
              {a.tags && a.tags.length > 0 && (
                <div className="pb-4 flex flex-wrap items-center gap-2">
                  {a.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={'/posts/tag/' + tag.name}
                      className="inline-block bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-slate-200 transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      # {tag.name}
                    </Link>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <div className="flex items-center text-sm text-slate-500 space-x-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {a.author || '匿名'}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {currentUser && (currentUser.role === 'admin' || currentUser.id === a.userId) && (
                  <div className="flex items-center gap-2">
                    <Link
                      to={'/posts/edit/' + a.id}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      编辑
                    </Link>
                    <button
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded-lg hover:bg-red-200 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDelete(a.id);
                      }}
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" />
                      </svg>
                      删除
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}