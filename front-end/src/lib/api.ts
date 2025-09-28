export const API_URL = 'http://localhost:8080/api';

export type Tag = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  userId: number;
  title: string;
  description?: string;
  content: string;
  author: string;
  image?: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
};

export type AuthCredentials = {
  username: string;
  password: string;
};

export type User = {
  id: number;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = (errorData as { error?: string }).error || '请求失败，状态码: ' + response.status;
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: 'Bearer ' + token } : {};
};

export const getPosts = async (): Promise<Post[]> => {
  return fetch(API_URL + '/posts').then(handleResponse);
};

export const getPostById = async (id: number | string): Promise<Post> => {
  return fetch(API_URL + '/posts/' + id).then(handleResponse);
};

export const createPost = async (post: Partial<Post> & { tags: string[] }): Promise<Post> => {
  return fetch(API_URL + '/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(post),
  }).then(handleResponse);
};

export const editPost = async (id: number | string, post: Partial<Post> & { tags: string[] }): Promise<Post> => {
  return fetch(API_URL + '/posts/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(post),
  }).then(handleResponse);
};

export const deletePost = async (id: number | string): Promise<void> => {
  return fetch(API_URL + '/posts/' + id, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  }).then(handleResponse);
};

export const register = async (credentials: AuthCredentials): Promise<{ message: string }> => {
  return fetch(API_URL + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(handleResponse);
};

export const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  return fetch(API_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(handleResponse);
};

export const getUsers = async (): Promise<User[]> => {
  return fetch(API_URL + '/admin/users', {
    headers: { ...getAuthHeaders() },
  }).then(handleResponse);
};

export const promoteUser = async (id: number | string): Promise<User> => {
  return fetch(API_URL + '/admin/users/' + id + '/promote', {
    method: 'POST',
    headers: { ...getAuthHeaders() },
  }).then(handleResponse);
};

export const getTags = async (): Promise<Tag[]> => {
  return fetch(API_URL + '/tags').then(handleResponse);
};

export const getPostsByTag = async (tagName: string): Promise<Post[]> => {
  return fetch(API_URL + '/posts/tag/' + encodeURIComponent(tagName)).then(handleResponse);
};

