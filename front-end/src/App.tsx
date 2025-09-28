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
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/posts" className="text-xl font-semibold text-blue-600">
            E.M的博客
          </Link>
          <div className="flex gap-4 text-sm font-medium">
            <Link to="/posts" className="rounded bg-yellow-600 px-3 py-1 text-white hover:bg-yellow-500">
              所有文章
            </Link>
            {token ? (
              <>
                <Link
                  to="/posts/new"
                  className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-500"
                >
                  新建文章
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-400"
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700">
                  登录
                </Link>
                <Link
                  to="/register"
                  className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-500"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
