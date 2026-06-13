import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/layout/BottomNav'
import ListsHome from './pages/ListsHome'
import ListDetail from './pages/ListDetail'
import Clipboard from './pages/Clipboard'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Desktop sidebar spacer */}
        <div className="hidden md:block w-56 flex-shrink-0" />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Navigate to="/lists" replace />} />
            <Route path="/lists" element={<ListsHome />} />
            <Route path="/lists/:id" element={<ListDetail />} />
            <Route path="/clipboard" element={<Clipboard />} />
          </Routes>
        </main>
      </div>

      <BottomNav />
    </BrowserRouter>
  )
}
