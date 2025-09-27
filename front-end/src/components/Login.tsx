import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/api';

/**
 * Login 组件
 * @returns {JSX.Element} - 返回一个用于用户登录的表单界面的 JSX 元素。
 * 该组件提供了一个表单，让已注册的用户通过输入用户名和密码进行登录。
 * 登录成功后，它会将从后端获取的 JWT (JSON Web Token) 存储在浏览器的 localStorage 中，
 * 并将用户重定向到文章列表页面。
 */
export default function Login() {
  // 获取 navigate 函数，用于编程式地导航到其他路由
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 处理表单提交事件
   * @param {React.FormEvent<HTMLFormElement>} e - 表单的 submit 事件对象
   *
   * 当用户点击登录按钮时，此函数会被调用。
   * 它会阻止表单的默认提交行为，然后调用 login API。
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // 清空之前的错误信息
    setIsSubmitting(true); // 开始提交，禁用提交按钮

    try {
      const data = await login({ username, password });
      // 登录成功，将后端返回的 token 存储到浏览器的 localStorage 中
      localStorage.setItem('token', data.token);
      alert('登录成功！');
      navigate('/posts');
      // 强制刷新整个页面，以确保 App 组件能重新检查 token 状态并更新导航栏等UI
      window.location.reload(); 
    } catch (err) {
      console.error("登录失败:", err);
      setError((err as Error).message);
    } finally {
        // 无论成功还是失败，最后都将提交状态设置为 false
        setIsSubmitting(false);
    }
  };
  const inputClasses = "block w-full px-4 py-2 text-zinc-900 bg-white border border-zinc-300 rounded-md shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";
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
          {isSubmitting ? "登录中..." : "立即登录"}
        </button>
      </form>
    </div>
  );
}