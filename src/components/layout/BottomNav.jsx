import { NavLink, useLocation } from 'react-router-dom'
import { List, Pin, BookOpen } from 'lucide-react'

export default function BottomNav() {
  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe"
        style={{ background: 'rgba(250,248,245,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #e8e4de' }}>
        <div className="flex items-center justify-around h-16">
          <NavLink to="/lists" className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all ${isActive ? 'text-[#2C3E6B]' : 'text-[#9ca3af]'}`
          }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-[#e8edf7]' : ''}`}>
                  <List size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[10px] font-medium">Lists</span>
              </>
            )}
          </NavLink>
          <NavLink to="/clipboard" className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all ${isActive ? 'text-[#E8A030]' : 'text-[#9ca3af]'}`
          }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-[#fef3e2]' : ''}`}>
                  <Pin size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[10px] font-medium">Clipboard</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-56 z-40 pt-8 pb-6 px-4"
        style={{ background: '#FAF8F5', borderRight: '1px solid #e8e4de' }}>
        <div className="mb-8 px-2">
          <h1 className="font-serif text-2xl text-[#1a1a1a] italic">Scrapbook</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">Your pocket notebook</p>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/lists" className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[#e8edf7] text-[#2C3E6B]' : 'text-[#6b7280] hover:bg-[#f0ece6] hover:text-[#1a1a1a]'}`
          }>
            <List size={18} />
            Lists
          </NavLink>
          <NavLink to="/clipboard" className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[#fef3e2] text-[#E8A030]' : 'text-[#6b7280] hover:bg-[#f0ece6] hover:text-[#1a1a1a]'}`
          }>
            <Pin size={18} />
            Clipboard
          </NavLink>
        </nav>
      </aside>
    </>
  )
}
