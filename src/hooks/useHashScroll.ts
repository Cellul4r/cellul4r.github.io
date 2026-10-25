import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'
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
  const reducedMotion = useReducedMotion()
  const behavior: ScrollBehavior = reducedMotion ? 'instant' : 'smooth'
  const lastScroll = useRef<{ key: string; target: HTMLElement; behavior: ScrollBehavior } | null>(null)
  const targetId = getTargetId(hash)
  const scrollToHash = useCallback(() => {
    if (!targetId) return false
    const target = document.getElementById(targetId)
    if (!target) return false
    if (lastScroll.current?.key === key && lastScroll.current.target === target && lastScroll.current.behavior === behavior) return true
    target.scrollIntoView({ block: 'start', behavior })
    lastScroll.current = { key, target, behavior }
    return true
  }, [key, targetId, behavior])

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
