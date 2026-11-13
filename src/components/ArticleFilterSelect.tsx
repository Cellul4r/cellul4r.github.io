import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import './ArticleFilterSelect.css'

type Option = { value: string; label: string }

interface ArticleFilterSelectProps {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  icon?: ReactNode
}

export function ArticleFilterSelect({ label, value, options, onChange, icon }: ArticleFilterSelectProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ text: '', time: 0 })
  const id = useId()
  const selected = Math.max(0, options.findIndex(option => option.value === value))

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  useEffect(() => {
    if (!open || !list.current) return
    const item = list.current.children[highlighted] as HTMLElement | undefined
    if (!item) return
    const top = item.offsetTop
    const bottom = top + item.offsetHeight
    if (top < list.current.scrollTop) list.current.scrollTop = top
    else if (bottom > list.current.scrollTop + list.current.clientHeight) list.current.scrollTop = bottom - list.current.clientHeight
  }, [open, highlighted])

  function choose(index: number) {
    onChange(options[index].value)
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape') {
      if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false) }
    } else if (event.key === 'Tab') {
      setOpen(false)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted(open ? (highlighted + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length : selected)
      setOpen(true)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setHighlighted(event.key === 'Home' ? 0 : options.length - 1)
      setOpen(true)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) choose(highlighted)
      else { setHighlighted(selected); setOpen(true) }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      const now = Date.now()
      const text = now - typeahead.current.time < 600 ? typeahead.current.text + event.key : event.key
      typeahead.current = { text, time: now }
      const match = options.findIndex(option => option.label.toLocaleLowerCase().startsWith(text.toLocaleLowerCase()))
      if (match >= 0) { setHighlighted(match); setOpen(true) }
    }
  }

  return (
    <div className="article-filter-select" ref={root} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
    }}>
      <span id={`${id}-label`} className="sr-only">{label}</span>
      <button ref={trigger} type="button" role="combobox" className="article-filter-trigger" aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? `${id}-list` : undefined} aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined} onKeyDown={onKeyDown} onClick={() => { setHighlighted(selected); setOpen(!open) }}>
        {icon}
        <span id={`${id}-value`}>{options[selected].label}</span>
        <ChevronDown className="article-filter-chevron" size={16} aria-hidden="true" />
      </button>
      {open && <ul ref={list} id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className="article-filter-options">
        {options.map((option, index) => <li key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === value} className={highlighted === index ? 'is-highlighted' : undefined} onPointerDown={event => event.preventDefault()} onMouseEnter={() => setHighlighted(index)} onClick={() => choose(index)}>
          <span>{option.label}</span><Check size={16} aria-hidden="true" className={option.value === value ? 'is-selected' : undefined} />
        </li>)}
      </ul>}
    </div>
  )
}
