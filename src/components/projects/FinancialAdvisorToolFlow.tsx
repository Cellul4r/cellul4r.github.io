import { useId, useLayoutEffect, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { useSummerMotion } from '../summer/SummerMotion'
import { FinanceDiagram, FinanceNode } from './FinancialAdvisorDiagramParts'

const nodes = {
  interface: { title: 'Streamlit', detail: 'Question + conversation history' },
  model: { title: 'Model via LiteLLM', detail: 'Reads the conversation, tool schemas, and any returned results' },
  request: { title: 'Function request', detail: 'Function name + JSON arguments' },
  executor: { title: 'Shared ToolExecutor', detail: 'Looks up and calls the registered function' },
  tool: { title: 'Python financial tool', detail: 'Runs the coded calculation' },
  result: { title: 'Tool result', detail: 'Added to conversation history, then sent back to the model' },
  response: { title: 'Final text response', detail: 'Explains tool results when available, or answers directly without a tool call' },
}
type NodeId = keyof typeof nodes
type FlowPath = 'function' | 'direct'
interface TraceStep { node: NodeId; label?: string }
const traces: Record<FlowPath, TraceStep[]> = {
  function: [
    { node: 'interface' }, { node: 'model' }, { node: 'request' }, { node: 'executor' }, { node: 'tool' }, { node: 'result' },
    { node: 'model', label: 'Model reads the tool result' }, { node: 'request', label: 'Another function request' },
    { node: 'executor' }, { node: 'tool' }, { node: 'result' },
    { node: 'model', label: 'Model reads the next tool result' }, { node: 'response', label: 'Final explanation' },
  ],
  direct: [{ node: 'interface' }, { node: 'model' }, { node: 'response' }],
}
const edges: [NodeId, NodeId][] = [
  ['interface', 'model'], ['model', 'request'], ['model', 'response'],
  ['request', 'executor'], ['executor', 'tool'], ['tool', 'result'], ['result', 'model'],
]
interface Wire { id: string; path: string; loop: boolean }

export function ToolCallingDiagram() {
  const { enabled, active } = useSummerMotion()
  const ref = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const nodeElements = useRef<Partial<Record<NodeId, HTMLDivElement>>>({})
  const inView = useInView(ref, { amount: .15 })
  const markerId = useId().replace(/:/g, '')
  const [geometry, setGeometry] = useState({ width: 0, height: 0, wires: [] as Wire[] })
  const [walkthrough, setWalkthrough] = useState({ path: 'function' as FlowPath, step: -1, playing: false, started: false, run: 0 })
  const trace = traces[walkthrough.path]
  const current = trace[walkthrough.step]
  const visited = new Set(trace.slice(0, walkthrough.step + 1).map(step => step.node))
  const finished = walkthrough.step === trace.length - 1
  const playing = walkthrough.playing && enabled
  const previous = trace[walkthrough.step - 1]
  const currentEdge = previous && current ? `${previous.node}-${current.node}` : undefined

  useLayoutEffect(() => {
    const element = canvas.current
    if (!element) return
    const measure = () => {
      const bounds = element.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      const rects = Object.fromEntries(Object.entries(nodeElements.current).map(([id, node]) => {
        const rect = node.getBoundingClientRect()
        return [id, { left: rect.left - bounds.left, right: rect.right - bounds.left, top: rect.top - bounds.top, bottom: rect.bottom - bounds.top, x: rect.left - bounds.left + rect.width / 2, y: rect.top - bounds.top + rect.height / 2 }]
      })) as Record<NodeId, { left: number; right: number; top: number; bottom: number; x: number; y: number }>
      const stacked = rects.response.top > rects.result.top
      const wires = edges.map(([from, to]) => {
        const start = rects[from]
        const end = rects[to]
        let path: string
        if (from === 'result') {
          path = `M ${start.left} ${start.y} H 12 V 12 H ${end.x} V ${end.top - 4}`
        } else if (from === 'interface' && Math.abs(start.y - end.y) < 8) {
          path = `M ${start.right} ${start.y} H ${end.left - 4}`
        } else if (from === 'model' && to === 'response' && stacked) {
          path = `M ${start.x} ${start.bottom} V ${start.bottom + 24} H ${bounds.width - 12} V ${end.top - 24} H ${end.x} V ${end.top - 4}`
        } else {
          const bend = from === 'model' ? start.bottom + 24 : (start.bottom + end.top) / 2
          path = `M ${start.x} ${start.bottom} V ${bend} H ${end.x} V ${end.top - 4}`
        }
        return { id: `${from}-${to}`, path, loop: from === 'result' }
      })
      setGeometry({ width: bounds.width, height: bounds.height, wires })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    Object.values(nodeElements.current).forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (enabled && active && inView && !walkthrough.started) {
      setWalkthrough(previous => ({ ...previous, step: 0, playing: true, started: true, run: previous.run + 1 }))
    }
  }, [enabled, active, inView, walkthrough.started])

  useEffect(() => {
    if (!enabled) setWalkthrough(previous => previous.playing ? { ...previous, playing: false } : previous)
  }, [enabled])

  useEffect(() => {
    if (!playing || !active || !inView) return
    const timer = window.setTimeout(() => {
      setWalkthrough(previous => finished ? { ...previous, playing: false } : { ...previous, step: previous.step + 1 })
    }, 720)
    return () => window.clearTimeout(timer)
  }, [playing, active, inView, finished, walkthrough.step, walkthrough.path, walkthrough.run])

  function selectPath(path: FlowPath) {
    setWalkthrough(previous => ({ path, step: 0, playing: enabled, started: true, run: previous.run + 1 }))
  }

  function advance() {
    setWalkthrough(previous => {
      if (!enabled) return { ...previous, started: true, step: finished ? 0 : previous.step + 1, playing: false }
      if (previous.playing) return { ...previous, playing: false }
      return { ...previous, started: true, step: finished || previous.step < 0 ? 0 : previous.step, playing: true, run: previous.run + 1 }
    })
  }

  function node(id: NodeId) {
    return <div key={id} className="finance-graph-node" data-flow-node={id} ref={element => { if (element) nodeElements.current[id] = element }}><FinanceNode step={nodes[id]} current={current?.node === id} visited={visited.has(id)} /></div>
  }

  const ControlIcon = !enabled ? finished ? RotateCcw : StepForward : playing ? Pause : finished ? RotateCcw : Play
  const controlLabel = !enabled ? finished ? 'Restart walkthrough' : 'Next step' : playing ? 'Pause walkthrough' : finished ? 'Replay walkthrough' : 'Play walkthrough'

  return (
    <div ref={ref}>
      <FinanceDiagram
        label="Schematic tool-calling flow: a question and history pass from Streamlit to the model through LiteLLM. Two branching arrows show its decision: a function request passes through the shared ToolExecutor to a Python tool, then a tool-result arrow loops back to the model. The model may request another tool or give a final text response. With no function request, it returns direct text without executing a tool. The client allows up to 10 model turns; an outer tool-calling error can fall back to ordinary chat."
        caption="Schematic of the shared team architecture. The function walkthrough illustrates two tool calls before a final reply; the actual client is capped at 10 model turns."
        controls={<div className="finance-walkthrough-controls">
          <div className="finance-walkthrough-paths" role="group" aria-label="Walkthrough path">
            <button type="button" aria-pressed={walkthrough.path === 'function'} onClick={() => selectPath('function')}>Function path</button>
            <button type="button" aria-pressed={walkthrough.path === 'direct'} onClick={() => selectPath('direct')}>Direct response</button>
          </div>
          <button className="finance-playback" type="button" onClick={advance}><ControlIcon size={16} aria-hidden="true" />{controlLabel}</button>
          <p className="finance-walkthrough-status" role="status" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">{!current ? 'Schematic walkthrough · follow either response path.' : `Schematic walkthrough · Step ${walkthrough.step + 1} of ${trace.length}: ${current.label ?? nodes[current.node].title}${finished ? ' · Complete' : ''}`}</p>
        </div>}
      >
        <div ref={canvas} className="finance-flow-canvas">
          <svg className="finance-flow-wires" viewBox={`0 0 ${geometry.width || 1} ${geometry.height || 1}`} aria-hidden="true">
            <defs>
              <marker id={`${markerId}-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7 Z" fill="var(--summer-olive)" /></marker>
              <marker id={`${markerId}-active`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7 Z" fill="var(--accent-burgundy)" /></marker>
            </defs>
            {geometry.wires.map(wire => <motion.path key={wire.id} data-flow-edge={wire.id} d={wire.path} fill="none" stroke={wire.id === currentEdge ? 'var(--accent-burgundy)' : 'var(--summer-olive)'} strokeWidth={wire.id === currentEdge ? 2 : 1.25} strokeDasharray={wire.loop ? '5 5' : undefined} markerEnd={`url(#${markerId}-${wire.id === currentEdge ? 'active' : 'arrow'})`} initial={false} animate={{ opacity: wire.id === currentEdge ? 1 : .65, pathLength: enabled && wire.id === currentEdge ? [0, 1] : 1 }} transition={{ duration: enabled ? .5 : 0 }} />)}
          </svg>
          <div className="finance-flow-intake">{node('interface')}{node('model')}</div>
          <div className="finance-branches">
            <div className="finance-branch">
              <p className="finance-path-label">Function requested</p>
              <div className="finance-flow-stack">{node('request')}{node('executor')}{node('tool')}{node('result')}</div>
              <p className="finance-loop-note"><RotateCcw size={17} aria-hidden="true" />Return to the model. It can request another tool or finish with text.</p>
            </div>
            <div className="finance-branch finance-branch-direct">
              <p className="finance-path-label">No function requested</p>
              {node('response')}
              <p className="finance-branch-note">No Python tool executes on the direct-response path. After tool calls, this same branch carries the final explanation.</p>
              <p className="finance-branch-note">The client can also fall back to ordinary chat after an outer tool-calling error.</p>
            </div>
          </div>
        </div>
      </FinanceDiagram>
    </div>
  )
}
