import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './CaseStudyNavigation.css'

interface CaseStudySection {
  id: string
  label: string
  shortLabel?: string
}

export function CaseStudyNavigation({ sections }: { sections: readonly CaseStudySection[] }) {
  const { hash } = useLocation()
  const ref = useRef<HTMLElement>(null)
  const selectedHash = sections.find(section => `#${section.id}` === hash)?.id ?? sections[0]?.id
  const [current, setCurrent] = useState(selectedHash)

  useEffect(() => { setCurrent(selectedHash) }, [selectedHash])

  useLayoutEffect(() => {
    const outline = ref.current
    if (!outline) return
    const root = document.documentElement
    const previousPadding = root.style.scrollPaddingTop
    const measure = () => {
      const height = outline.getBoundingClientRect().height
      const headerHeight = document.querySelector('.summer-theme-header')?.getBoundingClientRect().height ?? 0
      const sticky = window.matchMedia('(min-width: 48rem)').matches
      root.style.scrollPaddingTop = `${headerHeight + (sticky ? height : 0)}px`
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(outline)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      root.style.scrollPaddingTop = previousPadding
    }
  }, [])

  useEffect(() => {
    let frame: number | null = null
    const update = () => {
      frame = null
      const headerBottom = document.querySelector('.summer-theme-header')?.getBoundingClientRect().bottom ?? 0
      const sticky = window.matchMedia('(min-width: 48rem)').matches
      const boundary = (sticky ? ref.current?.getBoundingClientRect().bottom ?? headerBottom : headerBottom) + 24
      let next = sections[0]?.id
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= boundary) next = section.id
      }
      setCurrent(next)
    }
    const schedule = () => { if (frame === null) frame = window.requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [sections])

  return (
    <nav ref={ref} className="case-study-outline" aria-label="In this case study">
      <div className="container">{sections.map((section, index) => (
        <Link key={section.id} to={`#${section.id}`} onClick={() => setCurrent(section.id)} aria-label={section.label} aria-current={current === section.id ? 'location' : undefined}>
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{section.shortLabel ?? section.label}
        </Link>
      ))}</div>
    </nav>
  )
}
