import { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function getTargetId(hash: string) {
  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    return ''
  }
}

export function useHashScroll() {
  const { key, pathname, hash } = useLocation()
  const targetId = getTargetId(hash)
  const scrollToHash = useCallback(() => {
    if (!targetId) return false
    const target = document.getElementById(targetId)
    if (!target) return false
    target.scrollIntoView({ block: 'start', behavior: 'instant' })
    return true
  }, [targetId])

  useEffect(() => {
    if (!targetId || scrollToHash()) return
    const main = document.getElementById('main-content')
    if (!main) return

    // A route's section may mount after its lazy bundle resolves.
    const observer = new MutationObserver(() => {
      if (scrollToHash()) observer.disconnect()
    })
    observer.observe(main, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [key, pathname, targetId, scrollToHash])

  return scrollToHash
}
