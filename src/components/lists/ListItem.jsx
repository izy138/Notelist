import { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Check } from 'lucide-react'
import useListStore from '../../store/useListStore'

export default function ListItem({ item, listId, listColor }) {
  const toggleItemCheck = useListStore(s => s.toggleItemCheck)
  const deleteItem = useListStore(s => s.deleteItem)
  const updateItem = useListStore(s => s.updateItem)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.text)
  const inputRef = useRef(null)
  const isChecked = item.checked

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  const handleCheck = () => toggleItemCheck(listId, item.id)

  const handleSave = () => {
    if (draft.trim()) updateItem(listId, item.id, { text: draft.trim() })
    else setDraft(item.text)
    setEditing(false)
  }

  return (
    <div ref={setNodeRef} style={style}
      className="ruled-item flex items-center gap-3 py-3 px-1 group">

      {/* Drag handle */}
      <button {...attributes} {...listeners}
        className="touch-none opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing flex-shrink-0">
        <GripVertical size={16} className="text-[#9ca3af]" />
      </button>

      {/* Custom checkbox */}
      <button
        onClick={handleCheck}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          isChecked ? 'scale-105' : 'hover:scale-105'
        }`}
        style={{ borderColor: isChecked ? listColor : '#d1d5db', background: isChecked ? listColor : 'transparent' }}>
        {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
      </button>

      {/* Text */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setDraft(item.text); setEditing(false) } }}
          className="flex-1 text-sm bg-transparent outline-none border-b border-[#2C3E6B]"
        />
      ) : (
        <span
          className="flex-1 text-sm leading-relaxed"
          onDoubleClick={() => !isChecked && setEditing(true)}>
          <span className={isChecked ? 'strikethrough text-[#1a1a1a]' : 'text-[#1a1a1a]'}>
            {item.text}
          </span>
        </span>
      )}

      {/* Delete */}
      <button
        onClick={() => deleteItem(listId, item.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-all">
        <Trash2 size={14} className="text-red-400" />
      </button>
    </div>
  )
}
