import { Link, Outlet } from 'react-router-dom'
export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/posts" className="text-xl font-semibold text-blue-600">
            简易博客
          </Link>
          <div className="flex gap-4 text-sm font-medium">
            <Link to="/posts" className="text-neutral-700 hover:text-blue-600">
              所有文章
            </Link>
            <Link
              to="/posts/new"
              className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-500"
            >
              新建文章
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
