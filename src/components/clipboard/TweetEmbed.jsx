import { useEffect, useRef } from 'react'

export default function TweetEmbed({ tweetId }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!tweetId || !containerRef.current) return

    containerRef.current.innerHTML = `
      <blockquote class="twitter-tweet" data-theme="light" data-dnt="true">
        <a href="https://twitter.com/i/web/status/${tweetId}"></a>
      </blockquote>
    `

    if (window.twttr?.widgets) {
      window.twttr.widgets.load(containerRef.current)
    } else {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.charset = 'utf-8'
      document.head.appendChild(script)
      script.onload = () => window.twttr?.widgets?.load(containerRef.current)
    }
  }, [tweetId])

  return (
    <div ref={containerRef} className="w-full overflow-hidden" />
  )
}
