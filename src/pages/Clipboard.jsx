import { useState } from 'react'
import { Pin } from 'lucide-react'
import useClipboardStore from '../store/useClipboardStore'
import PinCard from '../components/clipboard/PinCard'
import AddPinBar from '../components/clipboard/AddPinBar'

const TYPE_FILTERS = [
  { key: null, label: 'All' },
  { key: 'tweet', label: '🐦 Tweets' },
  { key: 'link', label: '🔗 Links' },
  { key: 'bookmark', label: '🔖 Bookmarks' },
  { key: 'note', label: '📝 Notes' },
]

export default function Clipboard() {
  const pins = useClipboardStore(s => s.pins)
  const [typeFilter, setTypeFilter] = useState(null)
  const [tagFilter, setTagFilter] = useState(null)

  const allTags = [...new Set(pins.flatMap(p => p.tags || []))]

  const filtered = pins.filter(p => {
    if (typeFilter && p.type !== typeFilter) return false
    if (tagFilter && !(p.tags || []).includes(tagFilter)) return false
    return true
  })

  return (
    <div className="min-h-full px-4 pt-6 pb-32 md:pb-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="font-serif text-3xl italic text-[#1a1a1a]">Clipboard</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">
            {pins.length === 0 ? 'Nothing pinned yet' : `${pins.length} pin${pins.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <AddPinBar />
      </div>

      {/* Type filters */}
      {pins.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
          {TYPE_FILTERS.map(f => (
            <button key={String(f.key)}
              onClick={() => setTypeFilter(typeFilter === f.key ? null : f.key)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                typeFilter === f.key
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'border-[#e8e4de] text-[#6b7280] hover:border-[#9ca3af]'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
          {allTags.map(tag => (
            <button key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full border transition-all ${
                tagFilter === tag
                  ? 'bg-[#E8A030] text-white border-[#E8A030]'
                  : 'border-[#fde68a] text-[#9ca3af] hover:border-[#E8A030]'
              }`}>
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {pins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">📌</div>
          <h2 className="font-serif text-xl italic text-[#9ca3af] mb-2">Your clipboard is empty</h2>
          <p className="text-sm text-[#d1d5db] mb-2">Pin links, tweets, notes, or bookmarks</p>
          <p className="text-xs text-[#e8e4de]">Paste a Twitter/X URL to embed a tweet</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-[#9ca3af]">No pins match this filter</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {filtered.map(pin => (
            <PinCard key={pin.id} pin={pin} />
          ))}
        </div>
      )}
    </div>
  )
}
