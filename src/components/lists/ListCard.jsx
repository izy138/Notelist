import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { MoreVertical, Trash2, Calendar, Copy } from 'lucide-react'
import { useState } from 'react'
import useListStore from '../../store/useListStore'

export default function ListCard({ list }) {
  const navigate = useNavigate()
  const deleteList = useListStore(s => s.deleteList)
  const duplicateList = useListStore(s => s.duplicateList)
  const [showMenu, setShowMenu] = useState(false)

  const activeCount = list.items.filter(i => !i.checked).length
  const doneCount = list.items.filter(i => i.checked).length
  const totalCount = list.items.length

  const isOverdue = list.dueDate && new Date(list.dueDate) < new Date() && activeCount > 0

  return (
    <div
      className="notebook-card p-4 cursor-pointer active:scale-[0.98] transition-transform relative fade-in"
      onClick={() => navigate(`/lists/${list.id}`)}
    >
      {/* Color accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: list.color }} />

      {/* Menu button */}
      <button
        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[#f0ece6] transition-colors z-10"
        onClick={e => { e.stopPropagation(); setShowMenu(!showMenu) }}>
        <MoreVertical size={15} className="text-[#9ca3af]" />
      </button>

      {showMenu && (
        <div className="absolute top-9 right-3 z-20 notebook-card py-1 min-w-[130px]"
          onClick={e => e.stopPropagation()}>
          <button
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#6b7280] hover:bg-[#f0ece6] transition-colors"
            onClick={() => { duplicateList(list.id); setShowMenu(false) }}>
            <Copy size={14} />
            Duplicate
          </button>
          <button
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            onClick={() => { deleteList(list.id); setShowMenu(false) }}>
            <Trash2 size={14} />
            Delete list
          </button>
        </div>
      )}

      {/* Emoji + Name */}
      <div className="mt-3 mb-3">
        <div className="text-2xl mb-2">{list.emoji}</div>
        <h3 className="font-serif text-lg leading-tight italic text-[#1a1a1a]">{list.name}</h3>
      </div>

      {/* Stats */}
      {totalCount > 0 ? (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] mb-1.5">
            <span className="font-medium" style={{ color: list.color }}>{activeCount}</span> remaining
            {doneCount > 0 && <span>· {doneCount} done</span>}
          </div>
          {totalCount > 0 && (
            <div className="h-1 rounded-full bg-[#e8e4de] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(doneCount / totalCount) * 100}%`, background: list.color }}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-[#d1d5db] mb-3">No items yet</p>
      )}

      {/* Due date */}
      {list.dueDate && (
        <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500' : 'text-[#9ca3af]'}`}>
          <Calendar size={11} />
          {format(new Date(list.dueDate), 'MMM d')}
          {isOverdue && ' · overdue'}
        </div>
      )}
    </div>
  )
}
