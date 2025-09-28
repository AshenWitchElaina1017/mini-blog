import { useEffect, useState } from 'react';
import { getUsers, promoteUser, demoteUser, type User } from '../lib/api';
import { notificationService } from '../lib/notification';
import { useAuthStore } from '../lib/store';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  // 从 Zustand store 中获取当前登录的用户信息
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        notificationService.show(errorMessage, 'error');
      }
    };
    void fetchUsers();
  }, []);

  const handlePromote = async (id: number) => {
    if (window.confirm('确定要将该用户提升为管理员吗？')) {
      try {
        const updatedUser = await promoteUser(id);
        setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
        notificationService.show('提权成功', 'success');
      } catch (err) {
        notificationService.show('操作失败: ' + (err as Error).message, 'error');
      }
    }
  };
  
  // 新增 handleDemote 函数，用于处理降级逻辑
  const handleDemote = async (id: number) => {
    if (window.confirm('确定要将该管理员降为普通用户吗？')) {
      try {
        // 调用 demoteUser API
        const updatedUser = await demoteUser(id);
        // 更新本地 state
        setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
        notificationService.show('降级成功', 'success');
      } catch (err) {
        notificationService.show('操作失败: ' + (err as Error).message, 'error');
      }
    }
  };

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">用户管理</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户名
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                注册时间
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const roleClasses =
                user.role === 'admin'
                  ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
                  : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';

              return (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={roleClasses}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    {user.role !== 'admin' && (
                      <button onClick={() => void handlePromote(user.id)} className="text-indigo-600 hover:text-indigo-900">
                        提升为管理员
                      </button>
                    )}
                    {/* 添加降级按钮的条件渲染逻辑 */}
                    {/* 1. 当前登录用户是超级管理员 (ID=1) */}
                    {/* 2. 列表中的这个用户是管理员 */}
                    {/* 3. 列表中的这个用户不是超级管理员自己 */}
                    {currentUser?.id === 1 && user.role === 'admin' && user.id !== 1 && (
                       <button onClick={() => void handleDemote(user.id)} className="text-red-600 hover:text-red-900 hover:cursor-pointer">
                        降为普通用户
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}