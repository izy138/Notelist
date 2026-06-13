import { useState, useEffect } from 'react'
import { Trash2, ExternalLink, X } from 'lucide-react'
import useClipboardStore from '../../store/useClipboardStore'
import TweetEmbed from './TweetEmbed'
import LinkPreview from './LinkPreview'

const PIN_COLORS = {
  tweet: { bg: '#f0f9ff', border: '#bae6fd', pin: '#0284c7' },
  link: { bg: '#f0fdf4', border: '#bbf7d0', pin: '#16a34a' },
  bookmark: { bg: '#fdf4ff', border: '#e9d5ff', pin: '#9333ea' },
  note: { bg: '#fffbeb', border: '#fde68a', pin: '#E8A030' },
}

export default function PinCard({ pin }) {
  const deletePin = useClipboardStore(s => s.deletePin)
  const fetchPinPreview = useClipboardStore(s => s.fetchPinPreview)
  const [expanded, setExpanded] = useState(false)

  const colors = PIN_COLORS[pin.type] || PIN_COLORS.note
  const showPreview = pin.type === 'link' || pin.type === 'bookmark' || pin.type === 'tweet'
  const useTweetEmbed = pin.type === 'tweet' && pin.tweetId && !pin.preview?.image && !pin.preview?.description

  useEffect(() => {
    if (showPreview && !pin.previewFetched && pin.content) {
      fetchPinPreview(pin.id)
    }
  }, [pin.id, pin.content, pin.previewFetched, showPreview, fetchPinPreview])

  const isUrl = pin.type === 'link' || pin.type === 'tweet' || pin.type === 'bookmark'
  const displayUrl = isUrl ? (() => {
    try { return new URL(pin.content).hostname.replace('www.', '') } catch { return pin.content }
  })() : null

  return (
    <>
      <div
        className="notebook-card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform relative group fade-in"
        onClick={() => setExpanded(true)}
        style={{ border: `1px solid ${colors.border}`, background: colors.bg }}>

        {/* Pin dot */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: colors.pin }} />
        </div>

        {/* Content */}
        <div className="px-3 pb-3">
          {pin.previewLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-24 rounded-lg bg-[#e8e4de]/60" />
              <div className="h-3 rounded bg-[#e8e4de]/60 w-3/4" />
              <div className="h-3 rounded bg-[#e8e4de]/60 w-1/2" />
            </div>
          ) : pin.preview ? (
            <LinkPreview preview={pin.preview} pin={pin} compact />
          ) : useTweetEmbed ? (
            <div className="pointer-events-none scale-[0.85] origin-top -mx-2">
              <TweetEmbed tweetId={pin.tweetId} />
            </div>
          ) : pin.type === 'note' ? (
            <p className="text-sm text-[#1a1a1a] leading-relaxed line-clamp-4 font-serif italic">
              {pin.content}
            </p>
          ) : (
            <div>
              {pin.title && (
                <p className="text-sm font-medium text-[#1a1a1a] mb-1 line-clamp-2">{pin.title}</p>
              )}
              <div className="flex items-center gap-1 text-xs text-[#9ca3af]">
                <ExternalLink size={10} />
                <span className="truncate">{displayUrl}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          {pin.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {pin.tags.map(tag => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: colors.border, color: colors.pin }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Delete button on hover */}
        <button
          className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all z-10"
          onClick={e => { e.stopPropagation(); deletePin(pin.id) }}>
          <Trash2 size={12} className="text-red-400" />
        </button>
      </div>

      {/* Expanded modal */}
      {expanded && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setExpanded(false)}>
          <div className="slide-up notebook-card w-full md:max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: colors.pin }} />
                  <span className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: colors.pin }}>{pin.type}</span>
                </div>
                <button onClick={() => setExpanded(false)}
                  className="p-1.5 rounded-lg hover:bg-[#f0ece6] transition-colors">
                  <X size={16} className="text-[#6b7280]" />
                </button>
              </div>

              {pin.preview ? (
                <>
                  <LinkPreview preview={pin.preview} pin={pin} />
                  {isUrl && (
                    <a href={pin.content} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-sm text-blue-600 hover:underline">
                      <ExternalLink size={14} />
                      {pin.type === 'tweet' ? 'View on X' : 'Open link'}
                    </a>
                  )}
                </>
              ) : pin.type === 'tweet' && pin.tweetId ? (
                <>
                  <TweetEmbed tweetId={pin.tweetId} />
                  <a href={pin.content} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-blue-600 hover:underline">
                    <ExternalLink size={14} />
                    View on X
                  </a>
                </>
              ) : pin.type === 'note' ? (
                <p className="text-base leading-relaxed font-serif italic text-[#1a1a1a] whitespace-pre-wrap">
                  {pin.content}
                </p>
              ) : (
                <div>
                  {pin.title && <h3 className="text-lg font-medium mb-2">{pin.title}</h3>}
                  <a href={pin.content} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline break-all">
                    <ExternalLink size={14} />
                    {pin.content}
                  </a>
                </div>
              )}

              {pin.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {pin.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full"
                      style={{ background: colors.border, color: colors.pin }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-[#e8e4de] flex justify-end">
                <button onClick={() => { deletePin(pin.id); setExpanded(false) }}
                  className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Trash2 size={14} />
                  Remove pin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
