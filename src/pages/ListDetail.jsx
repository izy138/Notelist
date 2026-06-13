import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove
} from '@dnd-kit/sortable'
import { ArrowLeft, Calendar, Pencil, Check, X, Copy } from 'lucide-react'
import { format } from 'date-fns'
import useListStore from '../store/useListStore'
import ListItem from '../components/lists/ListItem'
import AddItemBar from '../components/lists/AddItemBar'

export default function ListDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lists, reorderItems, updateList, duplicateList } = useListStore()
  const list = lists.find(l => l.id === id)

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(list?.name || '')
  const [editingDueDate, setEditingDueDate] = useState(false)
  const [dueDateDraft, setDueDateDraft] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-[#9ca3af]">List not found</p>
        <button onClick={() => navigate('/lists')} className="text-sm text-[#2C3E6B] hover:underline">
          ← Back to lists
        </button>
      </div>
    )
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = list.items.findIndex(i => i.id === active.id)
      const newIndex = list.items.findIndex(i => i.id === over.id)
      reorderItems(list.id, arrayMove(list.items, oldIndex, newIndex))
    }
  }

  const saveTitle = () => {
    if (titleDraft.trim()) updateList(list.id, { name: titleDraft.trim() })
    setEditingTitle(false)
  }

  const startDueDateEdit = () => {
    setDueDateDraft(list.dueDate ? format(new Date(list.dueDate), 'yyyy-MM-dd') : '')
    setEditingDueDate(true)
  }

  const saveDueDate = () => {
    updateList(list.id, { dueDate: dueDateDraft || null })
    setEditingDueDate(false)
  }

  const clearDueDate = () => {
    updateList(list.id, { dueDate: null })
    setDueDateDraft('')
    setEditingDueDate(false)
  }

  const handleDuplicate = () => {
    const newId = duplicateList(list.id)
    if (newId) navigate(`/lists/${newId}`)
  }

  const isOverdue = list.dueDate && new Date(list.dueDate) < new Date() && list.items.some(i => !i.checked)
  const doneCount = list.items.filter(i => i.checked).length

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 pt-4 pb-3"
        style={{ background: 'rgba(250,248,245,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e8e4de' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/lists')}
            className="p-2 -ml-2 rounded-xl hover:bg-[#f0ece6] transition-colors">
            <ArrowLeft size={18} className="text-[#6b7280]" />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-2xl">{list.emoji}</span>
            {editingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={titleDraft}
                  onChange={e => setTitleDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false) }}
                  onBlur={saveTitle}
                  autoFocus
                  className="flex-1 font-serif text-xl italic bg-transparent outline-none border-b-2"
                  style={{ borderColor: list.color }}
                />
                <button onClick={saveTitle}><Check size={16} style={{ color: list.color }} /></button>
                <button onClick={() => setEditingTitle(false)}><X size={16} className="text-[#9ca3af]" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h1 className="font-serif text-xl italic truncate">{list.name}</h1>
                <button onClick={() => { setTitleDraft(list.name); setEditingTitle(true) }}
                  className="flex-shrink-0 p-1 rounded hover:bg-[#f0ece6] transition-colors">
                  <Pencil size={13} className="text-[#9ca3af]" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleDuplicate}
            className="flex-shrink-0 p-2 rounded-xl hover:bg-[#f0ece6] transition-colors"
            title="Duplicate list">
            <Copy size={16} className="text-[#9ca3af]" />
          </button>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-2 ml-10">
          <span className="text-xs text-[#9ca3af]">
            {list.items.length} item{list.items.length !== 1 ? 's' : ''}
          </span>
          {doneCount > 0 && (
            <span className="text-xs text-[#9ca3af]">
              · {doneCount} done
            </span>
          )}
          {editingDueDate ? (
            <div className="flex items-center gap-1.5">
              <Calendar size={11} className="text-[#9ca3af]" />
              <input
                type="date"
                value={dueDateDraft}
                onChange={e => setDueDateDraft(e.target.value)}
                autoFocus
                className="text-xs bg-transparent outline-none text-[#6b7280] rounded px-1.5 py-0.5 border border-[#e8e4de] focus:border-[#2C3E6B] transition-colors"
              />
              <button onClick={saveDueDate} className="p-0.5 rounded hover:bg-[#f0ece6] transition-colors">
                <Check size={12} style={{ color: list.color }} />
              </button>
              <button onClick={() => setEditingDueDate(false)} className="p-0.5 rounded hover:bg-[#f0ece6] transition-colors">
                <X size={12} className="text-[#9ca3af]" />
              </button>
              {(list.dueDate || dueDateDraft) && (
                <button onClick={clearDueDate} className="text-xs text-[#9ca3af] hover:text-red-500 transition-colors">
                  Clear
                </button>
              )}
            </div>
          ) : list.dueDate ? (
            <button
              onClick={startDueDateEdit}
              className={`flex items-center gap-1 text-xs transition-colors hover:opacity-80 ${isOverdue ? 'text-red-500' : 'text-[#9ca3af]'}`}>
              <Calendar size={11} />
              {format(new Date(list.dueDate), 'MMM d, yyyy')}
              <Pencil size={10} className="opacity-60" />
            </button>
          ) : (
            <button
              onClick={startDueDateEdit}
              className="flex items-center gap-1 text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors">
              <Calendar size={11} />
              Add due date
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 px-4 pt-2 pb-4">
        {list.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-3">{list.emoji}</div>
            <p className="text-sm text-[#9ca3af] italic font-serif">List is empty.</p>
            <p className="text-xs text-[#d1d5db] mt-1">Add your first item below</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={list.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {list.items.map(item => (
                <ListItem key={item.id} item={item} listId={list.id} listColor={list.color} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add item bar */}
      <AddItemBar listId={list.id} listColor={list.color} />
    </div>
  )
}
