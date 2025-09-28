import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../lib/api';
import { notificationService } from '../lib/notification';
import { useAuthStore } from '../lib/store';

export default function Login() {
  const navigate = useNavigate();
  // 从 store 中获取 login 方法，注意这里我们只获取 action
  const loginAction = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 调用 API 进行登录
      const data = await apiLogin({ username, password });
      // 调用 store 的 action 来更新状态并持久化 token
      loginAction(data.user, data.token);
      notificationService.show('登录成功！', 'success');
      // 导航到文章列表页
      navigate('/posts');
      // 重新加载页面以确保所有组件（包括导航栏）都获得最新的登录状态
      window.location.reload();
    } catch (err) {
      console.error('登录失败:', err);
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      notificationService.show(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'block w-full px-4 py-2 text-zinc-900 bg-white border border-zinc-300 rounded-md shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';

  return (
    <div className="max-w-md mx-auto mt-10 p-6 sm:p-8 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6 text-center">
        登录您的账户
      </h1>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-6">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium leading-6 text-zinc-700 mb-2">
            用户名
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入您的用户名"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-700 mb-2">
            密码
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入您的密码"
            className={inputClasses}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isSubmitting ? '登录中...' : '立即登录'}
        </button>
      </form>
    </div>
  );
}