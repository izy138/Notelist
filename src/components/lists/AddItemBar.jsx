import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import useListStore from '../../store/useListStore'

export default function AddItemBar({ listId, listColor }) {
  const addItem = useListStore(s => s.addItem)
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const handleAdd = () => {
    if (!text.trim()) return
    addItem(listId, text)
    setText('')
    inputRef.current?.focus()
  }

  return (
    <div className="sticky bottom-0 pb-safe"
      style={{ background: 'rgba(250,248,245,0.97)', backdropFilter: 'blur(8px)', borderTop: '1px solid #e8e4de' }}>
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={handleAdd}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ background: listColor }}>
          <Plus size={16} className="text-white" strokeWidth={2.5} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add an item..."
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#d1d5db]"
          autoFocus
        />
        {text.trim() && (
          <button
            onClick={handleAdd}
            className="text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-all"
            style={{ background: listColor }}>
            Add
          </button>
        )}
      </div>
    </div>
  )
}
