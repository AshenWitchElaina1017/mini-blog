import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PostForm from './components/PostForm.tsx'
import PostList from './components/PostList.tsx'
import PostDetail from './components/PostDetail.tsx'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'

const routes=createBrowserRouter([
  {
    path: '/',element: <App />,
    children: [
        {index: true, element: <PostList />,},
        {path: 'posts',element: <PostList />,},
        {path: 'posts/new',element: <PostForm />,},
        {path: 'posts/:id',element: <PostDetail />,},
        {path: 'posts/edit/:id',element: <PostForm />,},
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
      ],
    },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
)
