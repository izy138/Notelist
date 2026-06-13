import { useState } from 'react'
import { Plus, X, Link, FileText, Bookmark, Bird } from 'lucide-react'
import useClipboardStore, { detectPinType } from '../../store/useClipboardStore'

const ALL_TAGS = ['recipes', 'inspo', 'work', 'later', 'read', 'design', 'dev', 'finance']

export default function AddPinBar() {
  const { addPin, tags: storeTags, fetchPinPreview } = useClipboardStore()
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  const detectedType = content ? detectPinType(content) : null

  const typeIcon = {
    tweet: <Bird size={14} className="text-blue-400" />,
    link: <Link size={14} className="text-green-500" />,
    bookmark: <Bookmark size={14} className="text-purple-500" />,
    note: <FileText size={14} className="text-amber-500" />,
  }

  const handleAdd = () => {
    if (!content.trim()) return
    const pinId = addPin({ content: content.trim(), title: title.trim(), tags: selectedTags })
    if (detectPinType(content.trim()) !== 'note') fetchPinPreview(pinId)
    setContent('')
    setTitle('')
    setSelectedTags([])
    setOpen(false)
  }

  const toggleTag = (tag) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-white"
        style={{ background: '#E8A030', boxShadow: '0 2px 8px rgba(232,160,48,0.35)' }}>
        <Plus size={16} />
        Add Pin
      </button>
    )
  }

  return (
    <div className="notebook-card p-4 mb-4 fade-in"
      style={{ border: '1px solid #fde68a', background: '#fffbeb' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {detectedType && typeIcon[detectedType]}
          <span className="text-xs font-medium text-[#9ca3af] uppercase tracking-wide">
            {detectedType ? `Detected: ${detectedType}` : 'New Pin'}
          </span>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 hover:bg-[#fde68a] rounded transition-colors">
          <X size={14} className="text-[#9ca3af]" />
        </button>
      </div>

      {/* Content input */}
      <textarea
        placeholder="Paste a URL, tweet link, or write a note..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={2}
        autoFocus
        className="w-full text-sm bg-transparent outline-none resize-none placeholder:text-[#d1d5db] mb-3"
        style={{ borderBottom: '1px solid #fde68a', paddingBottom: '8px' }}
      />

      {/* Title (for links/bookmarks) */}
      {(detectedType === 'link' || detectedType === 'bookmark') && (
        <input
          placeholder="Label (optional)..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full text-sm bg-transparent outline-none mb-3 placeholder:text-[#d1d5db]"
          style={{ borderBottom: '1px solid #fde68a', paddingBottom: '8px' }}
        />
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {ALL_TAGS.map(tag => (
          <button key={tag}
            onClick={() => toggleTag(tag)}
            className={`text-xs px-2 py-1 rounded-full border transition-all ${
              selectedTags.includes(tag)
                ? 'bg-[#E8A030] text-white border-[#E8A030]'
                : 'border-[#fde68a] text-[#9ca3af] hover:border-[#E8A030]'
            }`}>
            #{tag}
          </button>
        ))}
      </div>

      <button
        onClick={handleAdd}
        disabled={!content.trim()}
        className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40"
        style={{ background: '#E8A030' }}>
        Pin it
      </button>
    </div>
  )
}
