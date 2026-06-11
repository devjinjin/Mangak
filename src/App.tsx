import { HashRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TopicList from './pages/TopicList'
import TopicDetail from './pages/TopicDetail'
import TopicEdit from './pages/TopicEdit'
import Review from './pages/Review'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Categories from './pages/Categories'

const NAV = [
  { to: '/', label: '홈' },
  { to: '/topics', label: '토픽' },
  { to: '/review', label: '복습' },
  { to: '/stats', label: '통계' },
  { to: '/settings', label: '설정' }
]

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen max-w-3xl mx-auto px-4 pb-24">
        <header className="py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight">
            TechMaster <span className="text-sky-400">Recall</span>
          </Link>
          <Link to="/topics/new" className="btn-primary text-xs">
            + 새 토픽
          </Link>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/topics" element={<TopicList />} />
            <Route path="/topics/new" element={<TopicEdit />} />
            <Route path="/topics/:id" element={<TopicDetail />} />
            <Route path="/topics/:id/edit" element={<TopicEdit />} />
            <Route path="/review" element={<Review />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800">
          <div className="max-w-3xl mx-auto grid grid-cols-5">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `py-3 text-center text-sm font-medium ${
                    isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </HashRouter>
  )
}
