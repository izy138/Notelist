import { NavLink } from 'react-router-dom'
import { List, Pin } from 'lucide-react'

export default function HomeTabNav() {
  return (
    <nav className="flex md:hidden gap-1 p-1 mb-5 rounded-xl bg-[#f0ece6]">
      <NavLink to="/lists" className={({ isActive }) =>
        `flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-white text-[#2C3E6B] shadow-sm' : 'text-[#9ca3af]'}`
      }>
        <List size={16} />
        Lists
      </NavLink>
      <NavLink to="/clipboard" className={({ isActive }) =>
        `flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-white text-[#E8A030] shadow-sm' : 'text-[#9ca3af]'}`
      }>
        <Pin size={16} />
        Clipboard
      </NavLink>
    </nav>
  )
}
