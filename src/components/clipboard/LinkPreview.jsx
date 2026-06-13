import { ExternalLink, Play } from 'lucide-react'

export default function LinkPreview({ preview, pin, compact = false }) {
  if (!preview) return null

  const title = pin.title || preview.title
  const displayUrl = (() => {
    try { return new URL(pin.content).hostname.replace('www.', '') } catch { return pin.content }
  })()
  const linkLabel = pin.type === 'tweet'
    ? 'View on X'
    : `Open ${preview.siteName || displayUrl}`

  const linkProps = pin.content ? {
    href: pin.content,
    target: '_blank',
    rel: 'noopener noreferrer',
    onClick: compact ? e => e.stopPropagation() : undefined,
  } : null

  return (
    <div className={compact ? '' : 'space-y-2'}>
      {preview.image && (
        linkProps ? (
          <a {...linkProps} className={`block relative overflow-hidden rounded-lg bg-[#e8e4de] ${compact ? 'mb-2' : 'mb-3'}`}>
            <img
              src={preview.image}
              alt={title || preview.siteName || 'Preview'}
              className="w-full object-cover"
              style={{ maxHeight: compact ? 140 : 220 }}
              loading="lazy"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
            {preview.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                  <Play size={18} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            )}
          </a>
        ) : (
          <div className={`relative overflow-hidden rounded-lg bg-[#e8e4de] ${compact ? 'mb-2' : 'mb-3'}`}>
            <img
              src={preview.image}
              alt={title || preview.siteName || 'Preview'}
              className="w-full object-cover"
              style={{ maxHeight: compact ? 140 : 220 }}
              loading="lazy"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
            {preview.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                  <Play size={18} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            )}
          </div>
        )
      )}

      {title && (
        <p className={`font-medium text-[#1a1a1a] leading-snug ${compact ? 'text-sm line-clamp-2 mb-1' : 'text-base mb-1'}`}>
          {title}
        </p>
      )}

      {preview.description && (
        <p className={`text-[#6b7280] leading-relaxed ${compact ? 'text-xs line-clamp-3 mb-1' : 'text-sm line-clamp-4 mb-2'}`}>
          {preview.description}
        </p>
      )}

      {linkProps ? (
        <a
          {...linkProps}
          className="flex items-center gap-1 text-xs text-[#9ca3af] hover:text-blue-600 transition-colors">
          <ExternalLink size={10} />
          <span className="truncate">{compact ? (preview.siteName || displayUrl) : linkLabel}</span>
        </a>
      ) : (
        <div className="flex items-center gap-1 text-xs text-[#9ca3af]">
          <ExternalLink size={10} />
          <span className="truncate">{preview.siteName || displayUrl}</span>
        </div>
      )}
    </div>
  )
}
