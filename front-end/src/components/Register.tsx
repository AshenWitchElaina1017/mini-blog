import { type ChangeEvent, type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../lib/api';
import { notificationService } from '../lib/notification';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      const message = '用户名和密码不能为空';
      setError(message);
      notificationService.show(message, 'error');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await register(formData);
      notificationService.show('注册成功！现在您可以登录了', 'success');
      navigate('/login');
    } catch (err) {
      console.error('注册失败:', err);
      const errorMessage = (err as Error).message || '注册过程中发生未知错误';
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
        创建您的账户
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium leading-6 text-zinc-700 mb-2">
            用户名
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
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
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请输入您的密码"
            className={inputClasses}
            required
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isSubmitting ? '注册中...' : '立即注册'}
        </button>
      </form>
    </div>
  );
}

