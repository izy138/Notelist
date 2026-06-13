import { useState } from 'react'
import { Plus } from 'lucide-react'
import useListStore from '../store/useListStore'
import ListCard from '../components/lists/ListCard'
import NewListModal from '../components/lists/NewListModal'
import HomeTabNav from '../components/layout/HomeTabNav'

export default function ListsHome() {
  const lists = useListStore(s => s.lists)
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-full px-4 pt-6 pb-8">
      <HomeTabNav />

      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl italic text-[#1a1a1a]">My Lists</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">
            {lists.length === 0 ? 'No lists yet' : `${lists.length} list${lists.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
          style={{ background: '#2C3E6B', boxShadow: '0 2px 8px rgba(44,62,107,0.3)' }}>
          <Plus size={16} />
          New List
        </button>
      </div>

      {/* Grid */}
      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">📓</div>
          <h2 className="font-serif text-xl italic text-[#9ca3af] mb-2">Start your first list</h2>
          <p className="text-sm text-[#d1d5db] mb-6">Groceries, to-dos, shopping — anything</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: '#2C3E6B' }}>
            <Plus size={16} />
            Create a list
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {lists.map(list => (
            <ListCard key={list.id} list={list} />
          ))}
          {/* Add new card */}
          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl border-2 border-dashed border-[#e8e4de] hover:border-[#2C3E6B] hover:bg-[#e8edf7] transition-all flex flex-col items-center justify-center gap-2 py-8 text-[#9ca3af] hover:text-[#2C3E6B] min-h-[140px]">
            <Plus size={20} />
            <span className="text-xs font-medium">New list</span>
          </button>
        </div>
      )}

      {showModal && <NewListModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
