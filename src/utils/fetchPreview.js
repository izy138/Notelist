function getYouTubeId(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
  } catch { /* ignore */ }
  return null
}

function getVimeoId(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      return /^\d+$/.test(id) ? id : null
    }
  } catch { /* ignore */ }
  return null
}

async function fetchTwitterPreview(url) {
  const res = await fetch(
    `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true&dnt=true`
  )
  if (!res.ok) return null
  const data = await res.json()

  const doc = new DOMParser().parseFromString(data.html || '', 'text/html')
  const text = doc.querySelector('p')?.textContent?.trim() || ''
  const image = doc.querySelector('img')?.getAttribute('src') || null

  return {
    title: data.author_name ? `@${data.author_name}` : 'Tweet',
    description: text,
    image,
    siteName: 'X',
    isVideo: !!doc.querySelector('a[href*="video"]'),
  }
}

async function fetchMicrolinkPreview(url) {
  const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
  if (!res.ok) return null
  const { data } = await res.json()
  if (!data) return null

  return {
    title: data.title || '',
    description: data.description || '',
    image: data.image?.url || data.logo?.url || null,
    siteName: data.publisher || (() => {
      try { return new URL(url).hostname.replace('www.', '') } catch { return '' }
    })(),
    isVideo: !!data.video?.url,
  }
}

export async function fetchPreview(url, type) {
  if (!url) return null

  try {
    if (type === 'tweet') {
      const twitter = await fetchTwitterPreview(url)
      if (twitter?.image || twitter?.description) return twitter
    }

    const youtubeId = getYouTubeId(url)
    if (youtubeId) {
      return {
        title: '',
        description: '',
        image: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        siteName: 'YouTube',
        isVideo: true,
      }
    }

    const vimeoId = getVimeoId(url)
    if (vimeoId) {
      const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`)
      if (res.ok) {
        const data = await res.json()
        return {
          title: data.title || '',
          description: data.description || '',
          image: data.thumbnail_url || null,
          siteName: 'Vimeo',
          isVideo: true,
        }
      }
    }

    return await fetchMicrolinkPreview(url)
  } catch {
    return null
  }
}
