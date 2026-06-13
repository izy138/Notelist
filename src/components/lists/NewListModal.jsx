import { useState } from 'react'
import { X } from 'lucide-react'
import useListStore, { LIST_TYPES } from '../../store/useListStore'

const EMOJIS = ['🛒', '✅', '🛍️', '🗓️', '📝', '🏠', '💪', '🎯', '🌿', '📚', '💊', '🎁', '✈️', '🍳', '💡']
const COLORS = ['#2C3E6B', '#16a34a', '#9333ea', '#E8A030', '#dc2626', '#0891b2', '#be185d', '#6b7280']

export default function NewListModal({ onClose }) {
  const addList = useListStore(s => s.addList)
  const [name, setName] = useState('')
  const [type, setType] = useState('todo')
  const [emoji, setEmoji] = useState('✅')
  const [color, setColor] = useState('#2C3E6B')
  const [dueDate, setDueDate] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    addList({ name: name.trim(), type, emoji, color, dueDate: dueDate || null })
    onClose()
  }

  const handleTypeSelect = (t) => {
    setType(t)
    setEmoji(LIST_TYPES[t].emoji)
    setColor(LIST_TYPES[t].color)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="slide-up notebook-card w-full md:w-[480px] mx-0 md:mx-4 rounded-t-2xl md:rounded-2xl p-6 pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl italic">New List</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#f0ece6] transition-colors">
            <X size={18} className="text-[#6b7280]" />
          </button>
        </div>

        {/* Emoji + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl"
            style={{ background: color + '18' }}>
            {emoji}
          </div>
          <input
            type="text"
            placeholder="List name..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
            className="flex-1 text-base font-medium bg-transparent outline-none placeholder:text-[#d1d5db]"
            style={{ borderBottom: '2px solid #e8e4de', paddingBottom: '6px' }}
          />
        </div>

        {/* Type selector */}
        <div className="mb-4">
          <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-wide mb-2">Type</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LIST_TYPES).map(([key, val]) => (
              <button key={key}
                onClick={() => handleTypeSelect(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  type === key ? 'border-transparent text-white' : 'border-[#e8e4de] text-[#6b7280] hover:border-[#d1d5db]'
                }`}
                style={type === key ? { background: val.color } : {}}>
                {val.emoji} {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji picker */}
        <div className="mb-4">
          <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-wide mb-2">Icon</p>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map(e => (
              <button key={e}
                onClick={() => setEmoji(e)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg transition-all ${
                  emoji === e ? 'ring-2 ring-offset-1' : 'hover:bg-[#f0ece6]'
                }`}
                style={emoji === e ? { background: color + '18', ringColor: color } : {}}>
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-5">
          <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-wide mb-2">Color</p>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2' : 'hover:scale-110'}`}
                style={{ background: c, ringColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Due date */}
        <div className="mb-6">
          <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-wide mb-2">Due Date (optional)</p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="text-sm bg-transparent outline-none text-[#6b7280] rounded-lg px-3 py-2 border border-[#e8e4de] focus:border-[#2C3E6B] transition-colors"
            />
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="text-xs text-[#9ca3af] hover:text-red-500 transition-colors">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Create button */}
        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: color }}>
          Create List
        </button>
      </div>
    </div>
  )
}
