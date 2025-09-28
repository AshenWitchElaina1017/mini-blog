import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import Login from './components/Login';
import Register from './components/Register';
import UserList from './components/UserList';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <PostList /> },
      { path: 'posts', element: <PostList /> },
      { path: 'posts/new', element: <PostForm /> },
      { path: 'posts/:id', element: <PostDetail /> },
      { path: 'posts/edit/:id', element: <PostForm /> },
      { path: 'posts/tag/:tagName', element: <PostList /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'admin/users', element: <UserList /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);

