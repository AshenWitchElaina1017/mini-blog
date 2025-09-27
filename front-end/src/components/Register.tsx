import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../lib/api";

/**
 * Register 组件
 * @returns {JSX.Element} - 返回一个用于用户注册的表单界面的 JSX 元素。
 *
 * 该组件提供了一个表单，允许新用户通过输入用户名和密码来创建一个新账户。
 * 它会处理表单的提交，调用后端 API，并根据 API 的响应结果处理成功或失败的逻辑。
 */
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  /**
   * 处理输入框变化事件
   * @param {React.ChangeEvent<HTMLInputElement>} e - 输入框的 change 事件对象
   *
   * 当用户在输入框中输入内容时，此函数会更新 formData 状态。
   * 它通过事件目标的 name 属性来动态更新对应的字段。
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * 处理表单提交事件
   * @param {React.FormEvent<HTMLFormElement>} e - 表单的 submit 事件对象
   *
   * 当用户点击提交按钮时，此函数会被调用。
   * 它会阻止表单的默认提交行为，然后调用 register API。
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("用户名和密码不能为空！");
      return;
    }
    setIsSubmitting(true);
    setError(''); 
    try {
      await register(formData);
      alert("注册成功！现在您可以登录了。");
      navigate("/login");
    } catch (err) {
      console.error("注册失败:", err);
      setError((err as Error).message || "注册过程中发生未知错误");
    } finally {
      setIsSubmitting(false);
    }
  };
  const inputClasses = "block w-full px-4 py-2 text-zinc-900 bg-white border border-zinc-300 rounded-md shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

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
          disabled={isSubmitting} // 当正在提交时，禁用按钮
          className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isSubmitting ? "注册中..." : "立即注册"}
        </button>
      </form>
    </div>
  );
}