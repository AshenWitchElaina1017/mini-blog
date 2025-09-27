export const API_URL='http://localhost:8080/api'

export type Post = {
  id: number
  title: string
  description?: string
  content: string
  author?: string
  image?: string
  createdAt: string
  updatedAt: string
}

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

export const getPosts = async (): Promise<Post[]> => {
  return fetch(`${API_URL}/posts`).then(handleResponse);
};
export const getPostById = async (id: number | string): Promise<Post> => {
    return fetch(`${API_URL}/posts/${id}`).then(handleResponse);
};
export const createPost = async (post: Post): Promise<Post> => {
    return fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    }).then(handleResponse);
}
export const editPost = async (id: number | string, post: Post): Promise<Post> => {
    return fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    }).then(handleResponse);
}
export const deletePost = async (id: number | string): Promise<void> => {
    return fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
    }).then(handleResponse);
}