import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getPostById, type Post } from '../lib/api';
import remarkGfm from 'remark-gfm';
import ImageModal from './ImageModal';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalImageUrl, setModalImageUrl] = useState('');

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const data = await getPostById(id);
          setPost(data);
        } catch (error) {
          console.error('获取文章详情失败:', error);
        } finally {
          setLoading(false);
        }
      };
      void fetchPost();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setModalImageUrl('');
  };

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
      <div className="flex items-center justify-center mt-20">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-slate-900 mb-2">文章未找到</h3>
        <p className="text-slate-500">您要查找的文章不存在或已被删除。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <article className="max-w-4xl mx-auto">
        {post.image && (
          <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-96 object-cover cursor-pointer transition-all duration-500 hover:scale-105"
              onClick={() => handleImageClick(post.image!)}
            />
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-8 py-10">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-sm text-slate-600 space-x-6 pb-6 border-b border-slate-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{post.author || '匿名'}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>发布于 {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-600">标签:</span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={'/posts/tag/' + tag.name}
                      className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors duration-200"
                    >
                      # {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </header>
            <div className="prose prose-lg prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node: _node, ...props }) => (
                    <img
                      {...props}
                      className="rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] mx-auto"
                      onClick={() => handleImageClick(props.src!)}
                    />
                  ),
                  h1: ({ node: _node, ...props }) => (
                    <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4" {...props} />
                  ),
                  h2: ({ node: _node, ...props }) => (
                    <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-3" {...props} />
                  ),
                  h3: ({ node: _node, ...props }) => (
                    <h3 className="text-xl font-semibold text-slate-800 mt-5 mb-2" {...props} />
                  ),
                  blockquote: ({ node: _node, ...props }) => (
                    <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50 italic text-slate-700 my-4" {...props} />
                  ),
                  code: ({ node: _node, inline, ...props }) => (
                    inline ? (
                      <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                    ) : (
                      <code className="block bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto" {...props} />
                    )
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </article>
      <ImageModal imageUrl={modalImageUrl} onClose={handleCloseModal} />
    </div>
  );
}

