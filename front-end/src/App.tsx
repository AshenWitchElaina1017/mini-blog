import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { type User } from './lib/api';
import Notification from './components/Notification';
import { notificationService } from './lib/notification';

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    notificationService.show('已成功退出登录', 'success');
    setCurrentUser(null);
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Notification />
      <header className="border-b border-neutral-200 bg-white">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/posts" className="text-xl font-semibold text-blue-600">
            E.M的博客
          </Link>
          <div className="flex gap-4 text-sm font-medium">
            <Link to="/posts" className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-500">
              所有文章
            </Link>
            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin/users"
                    className="rounded bg-purple-600 px-3 py-1 text-white hover:bg-purple-500"
                  >
                    用户管理
                  </Link>
                )}
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
                <Link to="/login" className="text-neutral-700 hover:text-blue-600">
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

