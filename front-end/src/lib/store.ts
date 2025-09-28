// 导入 zustand 的 create 函数，用于创建 store
import { create } from 'zustand';
// 导入 persist 中间件，用于将 store 的状态持久化到 localStorage
import { persist } from 'zustand/middleware';
// 导入用户类型定义
import { type User } from './api';

// 定义 store 的状态类型
type AuthState = {
  // 当前登录的用户信息，可能为 null
  currentUser: User | null;
  // 登录操作，接受一个用户对象作为参数
  login: (user: User, token: string) => void;
  // 退出登录操作
  logout: () => void;
};

// 使用 create 函数创建一个名为 useAuthStore 的 hook
export const useAuthStore = create<AuthState>()(
  // 使用 persist 中间件来持久化状态
  persist(
    // set 函数用于更新状态
    (set) => ({
      // 初始化 currentUser 状态为 null
      currentUser: null,
      // 定义 login 方法
      login: (user, token) => {
        // 将 token 存入 localStorage，供 API 请求使用
        localStorage.setItem('token', token);
        // 更新 store 中的 currentUser 状态
        set({ currentUser: user });
      },
      // 定义 logout 方法
      logout: () => {
        // 从 localStorage 中移除 token
        localStorage.removeItem('token');
        // 将 store 中的 currentUser 状态重置为 null
        set({ currentUser: null });
      },
    }),
    {
      // persist 中间件的配置
      // name 是存储在 localStorage 中的 key
      name: 'auth-storage',
      // partialize 函数用于指定只持久化 state 中的某些字段
      // 这里我们只持久化 currentUser，避免将 login 和 logout 函数存入 localStorage
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);