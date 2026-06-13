import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

const LIST_TYPES = {
  grocery: { label: 'Grocery', emoji: '🛒', color: '#16a34a' },
  todo: { label: 'To-Do', emoji: '✅', color: '#2C3E6B' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: '#9333ea' },
  future: { label: 'Someday', emoji: '🗓️', color: '#E8A030' },
  custom: { label: 'Custom', emoji: '📝', color: '#6b7280' },
}

export { LIST_TYPES }

const useListStore = create(
  persist(
    (set, get) => ({
      lists: [],
      
      addList: ({ name, type = 'todo', emoji, color, dueDate }) => {
        const typeDefaults = LIST_TYPES[type] || LIST_TYPES.custom
        set(state => ({
          lists: [
            {
              id: nanoid(),
              name,
              type,
              emoji: emoji || typeDefaults.emoji,
              color: color || typeDefaults.color,
              dueDate: dueDate || null,
              createdAt: Date.now(),
              items: [],
              archivedItems: [],
            },
            ...state.lists,
          ]
        }))
      },

      updateList: (listId, updates) =>
        set(state => ({
          lists: state.lists.map(l => l.id === listId ? { ...l, ...updates } : l)
        })),

      deleteList: (listId) =>
        set(state => ({ lists: state.lists.filter(l => l.id !== listId) })),

      duplicateList: (listId) => {
        const list = get().lists.find(l => l.id === listId)
        if (!list) return null
        const newId = nanoid()
        const copy = {
          ...list,
          id: newId,
          name: `${list.name} (copy)`,
          createdAt: Date.now(),
          items: list.items.map(item => ({
            ...item,
            id: nanoid(),
            createdAt: Date.now(),
          })),
          archivedItems: [],
        }
        set(state => ({ lists: [copy, ...state.lists] }))
        return newId
      },

      addItem: (listId, text) => {
        if (!text.trim()) return
        set(state => ({
          lists: state.lists.map(l =>
            l.id === listId
              ? { ...l, items: [...l.items, { id: nanoid(), text: text.trim(), note: '', checked: false, createdAt: Date.now() }] }
              : l
          )
        }))
      },

      updateItem: (listId, itemId, updates) =>
        set(state => ({
          lists: state.lists.map(l =>
            l.id === listId
              ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
              : l
          )
        })),

      toggleItemCheck: (listId, itemId) =>
        set(state => ({
          lists: state.lists.map(l =>
            l.id === listId
              ? {
                  ...l,
                  items: l.items.map(i =>
                    i.id === itemId ? { ...i, checked: !i.checked } : i
                  ),
                }
              : l
          )
        })),

      deleteItem: (listId, itemId) =>
        set(state => ({
          lists: state.lists.map(l =>
            l.id === listId
              ? { ...l, items: l.items.filter(i => i.id !== itemId) }
              : l
          )
        })),

      reorderItems: (listId, newItems) =>
        set(state => ({
          lists: state.lists.map(l =>
            l.id === listId ? { ...l, items: newItems } : l
          )
        })),
    }),
    {
      name: 'scrapbook-lists',
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0 && persistedState?.lists) {
          return {
            ...persistedState,
            lists: persistedState.lists.map(l => ({
              ...l,
              items: [
                ...l.items,
                ...(l.archivedItems || []).map(i => ({
                  ...i,
                  checked: true,
                  archivedAt: undefined,
                })),
              ],
              archivedItems: [],
            })),
          }
        }
        return persistedState
      },
    }
  )
)

export default useListStore
