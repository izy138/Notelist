import { NavLink } from 'react-router-dom'
import { List, Pin } from 'lucide-react'

export default function BottomNav() {
  return (
    <>
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
