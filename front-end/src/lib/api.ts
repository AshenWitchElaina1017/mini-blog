export const API_URL = 'http://localhost:8080/api';

export type Post = {
  id: number;
  title: string;
  description?: string;
  content: string;
  author?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * AuthCredentials 类型定义
 * @description 定义了用户登录或注册时需要提交的凭证结构
 */
export type AuthCredentials = {
  username: string;
  password: string;
};

/**
 * AuthResponse 类型定义
 * @description 定义了登录成功后，后端返回的数据结构，包含一个 JWT
 */
export type AuthResponse = {
  token: string;
};

/**
 * 统一处理 API 响应的辅助函数
 * @param {Response} response - fetch API 返回的原始 Response 对象
 * @returns {Promise<any>} - 返回处理过的 JSON 数据或 null
 * @throws {Error} - 如果响应状态码不是 2xx，则抛出错误
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `请求失败，状态码: ${response.status}`;
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

/**
 * 获取认证请求头的辅助函数
 * @returns {Record<string, string>} - 返回一个包含 Authorization 头的对象，如果 token 存在的话
 * * 通过明确指定返回类型为 Record<string, string>，
 * 我们可以解决 TypeScript 在推断三元表达式返回值时的类型不确定性问题，
 * 从而允许此函数的返回值被安全地扩展到 fetch 的 headers 对象中。
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  // 如果 token 存在，则返回一个包含 'Authorization' 字段的对象，否则返回一个空对象
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
export const getPosts = async (): Promise<Post[]> => {
  return fetch(`${API_URL}/posts`).then(handleResponse);
};
export const getPostById = async (id: number | string): Promise<Post> => {
    return fetch(`${API_URL}/posts/${id}`).then(handleResponse);
};
export const createPost = async (post: Partial<Post>): Promise<Post> => {
    return fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(post),
    }).then(handleResponse);
}
export const editPost = async (id: number | string, post: Partial<Post>): Promise<Post> => {
    return fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(post),
    }).then(handleResponse);
}
export const deletePost = async (id: number | string): Promise<void> => {
    return fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders(),
        },
    }).then(handleResponse);
}
export const register = async (credentials: AuthCredentials): Promise<{ message: string }> => {
  return fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(handleResponse);
};
export const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  return fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(handleResponse);
};