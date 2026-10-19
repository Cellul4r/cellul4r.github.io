import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent, KeyboardEvent } from 'react'
import { animate, useMotionValue, useReducedMotion } from 'framer-motion'

const DRAG_THRESHOLD = 6
const DIZZY_AFTER_MS = 1000

export function useAnyaInteraction(pictureCount: number) {
  const reduceMotion = useReducedMotion()
  const rotation = useMotionValue(0)
  const [picture, setPicture] = useState(0)
  const [dizzy, setDizzy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const recovery = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const suppressClick = useRef(false)
  const activity = useRef({ start: 0, last: 0 })
  const pointer = useRef<{
    id: number; x: number; y: number; cx: number; cy: number; angle: number; moved: boolean
  } | null>(null)

  useEffect(() => () => {
    clearTimeout(recovery.current)
    rotation.stop()
  }, [rotation])

  function recordRotation() {
    const now = performance.now()
    if (!activity.current.start || now - activity.current.last > 180) activity.current.start = now
    activity.current.last = now
    if (now - activity.current.start >= DIZZY_AFTER_MS) setDizzy(true)
  }

  function finishRotation() {
    pointer.current = null
    activity.current = { start: 0, last: 0 }
    setDragging(false)
    rotation.stop()
    animate(rotation, Math.round(rotation.get() / 360) * 360, {
      duration: reduceMotion ? 0 : .35,
      ease: 'easeOut',
    })
    clearTimeout(recovery.current)
    recovery.current = setTimeout(() => setDizzy(false), 2000)
  }

  function changePicture(event: MouseEvent<HTMLButtonElement>) {
    if (event.detail !== 0 && suppressClick.current && event.currentTarget.classList.contains('anya-spin-button')) {
      suppressClick.current = false
      return
    }
    clearTimeout(recovery.current)
    setDizzy(false)
    setPicture((value) => (value + 1) % pictureCount)
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return
    rotation.stop()
    clearTimeout(recovery.current)
    suppressClick.current = false
    activity.current = { start: 0, last: 0 }
    const rect = event.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    pointer.current = {
      id: event.pointerId, x: event.clientX, y: event.clientY, cx, cy,
      angle: Math.atan2(event.clientY - cy, event.clientX - cx), moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    const current = pointer.current
    if (!current || current.id !== event.pointerId) return
    if (!current.moved && Math.hypot(event.clientX - current.x, event.clientY - current.y) < DRAG_THRESHOLD) return
    current.moved = true
    suppressClick.current = true
    setDragging(true)
    const angle = Math.atan2(event.clientY - current.cy, event.clientX - current.cx)
    const delta = Math.atan2(Math.sin(angle - current.angle), Math.cos(angle - current.angle)) * 180 / Math.PI
    current.angle = angle
    if (Math.abs(delta) > .1) {
      if (!reduceMotion) rotation.set(rotation.get() + delta)
      recordRotation()
    }
  }

  function onPointerEnd(event: PointerEvent<HTMLButtonElement>) {
    if (pointer.current?.id !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    finishRotation()
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape') finishRotation()
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    clearTimeout(recovery.current)
    rotation.stop()
    if (!reduceMotion) rotation.set(rotation.get() + (event.key === 'ArrowLeft' ? -20 : 20))
    recordRotation()
  }

  function onKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') finishRotation()
  }

  return {
    picture, dizzy, dragging, rotation, reduceMotion, changePicture,
    handlers: {
      onPointerDown, onPointerMove, onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd, onLostPointerCapture: onPointerEnd,
      onKeyDown, onKeyUp, onBlur: finishRotation,
    },
  }
}
