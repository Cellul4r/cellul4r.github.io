import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

export function useMatchingPlayback(duration: number, assetSources: string[]) {
  const sceneRef = useRef<HTMLElement>(null)
  const visible = useInView(sceneRef, { amount: .5 })
  const reduced = Boolean(useReducedMotion())
  const [assetsReady, setAssetsReady] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const elapsedRef = useRef(0)
  const [run, setRun] = useState(0)
  const complete = reduced || elapsed >= duration
  const playing = visible && tabVisible && assetsReady && !paused && !complete

  useEffect(() => {
    let disposed = false
    const images = assetSources.map(src => {
      const image = new Image()
      image.src = src
      return image
    })
    // Failed images must not prevent the algorithm demonstration.
    void Promise.allSettled(images.map(image => image.decode())).then(() => { if (!disposed) setAssetsReady(true) })
    const timeout = window.setTimeout(() => { if (!disposed) setAssetsReady(true) }, 5000)
    return () => { disposed = true; clearTimeout(timeout) }
  }, [assetSources])

  useEffect(() => {
    const update = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!playing) return
    let request = 0
    let last = performance.now()
    let published = last
    const tick = (now: number) => {
      elapsedRef.current = Math.min(duration, elapsedRef.current + Math.min(now - last, 100))
      last = now
      if (now - published >= 32 || elapsedRef.current >= duration) {
        published = now
        setElapsed(elapsedRef.current)
      }
      if (elapsedRef.current < duration) request = requestAnimationFrame(tick)
    }
    request = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(request)
  }, [playing, duration, run])

  function restart() {
    elapsedRef.current = 0
    setElapsed(0)
    setPaused(false)
    setRun(value => value + 1)
  }

  return { sceneRef, reduced, elapsed: reduced ? duration : elapsed, playing, paused, complete, run, restart, togglePause: () => setPaused(value => !value) }
}
