import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { fetchPreview } from '../utils/fetchPreview'

export const PIN_TYPES = {
  link: { label: 'Link', emoji: '🔗' },
  note: { label: 'Note', emoji: '📝' },
  tweet: { label: 'Tweet', emoji: '🐦' },
  bookmark: { label: 'Bookmark', emoji: '🔖' },
}

function detectPinType(url) {
  if (!url) return 'note'
  try {
    const u = new URL(url)
    const host = u.hostname.replace('www.', '')
    if (host === 'twitter.com' || host === 'x.com') return 'tweet'
    return 'link'
  } catch {
    return 'note'
  }
}

function extractTweetId(url) {
  try {
    const match = url.match(/\/status\/(\d+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

const useClipboardStore = create(
  persist(
    (set, get) => ({
      pins: [],
      tags: ['recipes', 'inspo', 'work', 'later', 'read'],

      addPin: ({ content, type, title, tags = [], color }) => {
        const resolvedType = type || detectPinType(content)
        const tweetId = resolvedType === 'tweet' ? extractTweetId(content) : null
        const id = nanoid()
        set(state => ({
          pins: [
            {
              id,
              content,
              type: resolvedType,
              title: title || '',
              tweetId,
              tags,
              color: color || null,
              pinnedAt: Date.now(),
              preview: null,
              previewLoading: resolvedType === 'link' || resolvedType === 'tweet' || resolvedType === 'bookmark',
              previewFetched: false,
            },
            ...state.pins,
          ]
        }))
        return id
      },

      fetchPinPreview: async (pinId) => {
        const pin = get().pins.find(p => p.id === pinId)
        if (!pin || pin.previewFetched || pin.previewLoading || !pin.content) return

        set(state => ({
          pins: state.pins.map(p =>
            p.id === pinId ? { ...p, previewLoading: true } : p
          )
        }))

        const preview = await fetchPreview(pin.content, pin.type)

        set(state => ({
          pins: state.pins.map(p =>
            p.id === pinId ? { ...p, preview, previewLoading: false, previewFetched: true } : p
          )
        }))
      },

      updatePin: (pinId, updates) =>
        set(state => ({
          pins: state.pins.map(p => p.id === pinId ? { ...p, ...updates } : p)
        })),

      deletePin: (pinId) =>
        set(state => ({ pins: state.pins.filter(p => p.id !== pinId) })),

      addTag: (tag) =>
        set(state => ({
          tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag]
        })),
    }),
    { name: 'scrapbook-clipboard' }
  )
)

export { detectPinType, extractTweetId }
export default useClipboardStore
