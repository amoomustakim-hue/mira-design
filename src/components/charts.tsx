import { cx } from '@/lib/format'

/** Smooth area chart of a single series. Lightweight SVG, no chart library. */
export function AreaChart({ data, labels, height = 180 }: { data: number[]; labels?: string[]; height?: number }) {
  const w = 600
  const h = height
  const pad = 8
  const max = Math.max(...data) * 1.1
  const pts = data.map((v, i) => [pad + (i * (w - pad * 2)) / (data.length - 1), h - pad - (v / max) * (h - pad * 2)] as const)
  const line = pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x},${y}`
    const [px, py] = pts[i - 1]
    const cx1 = px + (x - px) / 2
    return `${d} C${cx1},${py} ${cx1},${y} ${x},${y}`
  }, '')
  const last = pts[pts.length - 1]
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none" role="img" aria-label="Chart">
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-lime-2)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-lime-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="var(--color-line)" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={`${line} L${last[0]},${h} L${pts[0][0]},${h} Z`} fill="url(#area)" />
        <path d={line} fill="none" stroke="var(--color-ink)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      {labels && (
        <div className="mt-2 flex justify-between text-[11px] text-muted">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Horizontal bar, for ranked lists. */
export function Bar({ value, max, tone = 'lime', delay = 0 }: { value: number; max: number; tone?: 'lime' | 'ink' | 'mist'; delay?: number }) {
  return (
    <span className="block h-2 w-full overflow-hidden rounded-pill bg-white/70">
      <span
        className={cx('grow-x block h-full rounded-pill', tone === 'ink' ? 'bg-ink' : tone === 'lime' ? 'bg-[linear-gradient(90deg,#e5f186,#b9d03a)]' : 'bg-[linear-gradient(90deg,#dcdce2,#b9b9c2)]')}
        style={{ width: `${Math.max(3, (value / max) * 100)}%`, animationDelay: `${delay}ms` }}
      />
    </span>
  )
}
