import { Link, Outlet, useNavigate } from 'react-router-dom';
export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('已退出登录');
    navigate('/login');
    window.location.reload();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 text-gray-900 dark:text-gray-100">
      <header className="glass-effect border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-40">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/posts" className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            E.M的博客
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              to="/posts"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800 px-6 py-2.5 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 before:absolute before:inset-0 before:bg-gradient-to-r before:from-gray-700 before:to-gray-800 dark:before:from-gray-600 dark:before:to-gray-700 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200"
            >
              <span className="relative z-10">📚 所有文章</span>
            </Link>
            {token ? (
              <>
                <Link
                  to="/posts/new"
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-700 before:to-blue-800 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200"
                >
                  <span className="relative z-10">✨ 新建文章</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-600 before:to-red-700 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200"
                >
                  <span className="relative z-10">👋 退出</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full">
                  登录
                </Link>
                <Link
                  to="/register"
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-2.5 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-700 before:to-emerald-800 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200"
                >
                  <span className="relative z-10">🚀 注册</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}