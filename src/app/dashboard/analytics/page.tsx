'use client'

import { Bar } from '@/components/charts'
import { CountUp, Gauge } from '@/components/fx'
import { PageHead, Skeleton, useLoad } from '@/components/dash'
import { Icon } from '@/components/icons'
import { Badge, Card, ProductImage } from '@/components/ui'
import { getInsights, getProducts } from '@/lib/api'
import { cx, pct } from '@/lib/format'
import type { Insights, Product } from '@/lib/types'

export default function AnalyticsPage() {
  const [ins, , loading] = useLoad<Insights | null>(getInsights, null)
  const [products] = useLoad<Product[]>(getProducts, [])
  const product = (id: string) => products.find((p) => p.id === id)

  if (loading || !ins) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[320px]" />
        <Skeleton className="h-[320px]" />
        <Skeleton className="h-[360px] lg:col-span-2" />
      </div>
    )
  }

  // Hot: most orders. Least demanded: fewest asks + orders. Missed: asked about a lot, never bought.
  const byOrders = [...ins.demand].sort((a, b) => b.orders - a.orders)
  const hot = byOrders.slice(0, 3)
  const cold = [...ins.demand].sort((a, b) => a.asks + a.orders * 5 - (b.asks + b.orders * 5)).slice(0, 3)
  const missed = ins.demand.filter((d) => d.asks > 100 && d.orders === 0)
  const maxQ = Math.max(...ins.questions.map((q) => q.count))
  const maxC = Math.max(...ins.complaints.map((c) => c.count))

  return (
    <>
      <PageHead title="Insights" sub="What customers ask, complain about and want, from every conversation." />

      <div className="mb-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Card className="flex items-center gap-4 animate-rise">
          <Gauge value={0.96} size={96} />
          <span className="text-[13px] leading-snug text-ink-2">
            <span className="block text-[15px] font-medium text-ink">Answered automatically</span>
            The rest were handed to you.
          </span>
        </Card>
        <Card className="flex flex-col justify-between gap-3 animate-rise" style={{ animationDelay: '60ms' }}>
          <span className="text-[13px] text-muted">Questions turned into orders</span>
          <span className="text-[34px] leading-none font-medium tracking-tight tabular-nums">
            <CountUp value={11.4} format={(n) => `${n.toFixed(1)}%`} />
          </span>
          <Bar value={11.4} max={20} tone="ink" delay={200} />
        </Card>
        <Card className="flex flex-col justify-between gap-3 animate-rise" style={{ animationDelay: '120ms' }}>
          <span className="text-[13px] text-muted">Complaints this fortnight</span>
          <span className="flex items-end gap-2">
            <span className="text-[34px] leading-none font-medium tracking-tight tabular-nums">
              <CountUp value={ins.complaints.reduce((a, c) => a + c.count, 0)} />
            </span>
            <Badge tone="lime">−9% vs before</Badge>
          </span>
          <Bar value={52} max={100} tone="mist" delay={260} />
        </Card>
      </div>

      {missed.map((d) => (
        <div key={d.productId} className="glass-lime mb-4 flex items-center gap-3 rounded-card p-4 pr-5 animate-rise">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface">
            <Icon name="bolt" />
          </span>
          <p className="flex-1 text-[14px] leading-snug">
            <span className="font-medium">{product(d.productId)?.name}</span> was asked about {d.asks} times but is sold out. Restocking could turn those questions into orders.
          </p>
        </div>
      ))}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-[15px] font-medium">Most-asked questions</p>
          <p className="text-[13px] text-muted">Add these to your FAQs so answers stay consistent.</p>
          <ol className="mt-5 flex flex-col gap-4">
            {ins.questions.map((q, i) => (
              <li key={q.question} className="flex flex-col gap-2">
                <span className="flex items-baseline justify-between gap-3 text-[14px]">
                  <span>
                    <span className="mr-2 font-mono text-xs text-muted">{i + 1}</span>
                    {q.question}
                  </span>
                  <span className="tabular-nums text-ink-2">{q.count}</span>
                </span>
                <Bar value={q.count} max={maxQ} tone={i === 0 ? 'ink' : 'lime'} delay={150 + i * 70} />
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-6">
          <p className="text-[15px] font-medium">Recurring complaints</p>
          <p className="text-[13px] text-muted">Grouped from chats where customers were unhappy.</p>
          <ul className="mt-5 flex flex-col gap-4">
            {ins.complaints.map((c) => (
              <li key={c.label} className="flex flex-col gap-2">
                <span className="flex items-baseline justify-between gap-3 text-[14px]">
                  {c.label}
                  <span className="flex items-center gap-2">
                    <span className="tabular-nums text-ink-2">{c.count}</span>
                    <Badge tone={c.change > 0 ? 'danger' : 'lime'}>{pct(c.change, true)}</Badge>
                  </span>
                </span>
                <Bar value={c.count} max={maxC} tone="mist" delay={150} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <p className="text-[15px] font-medium">Demand</p>
          <p className="text-[13px] text-muted">How often each product comes up in chat, and how often it sells.</p>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {[
              { title: 'Hot right now', items: hot, tone: 'glass-lime' },
              { title: 'Least demanded', items: cold, tone: 'bg-white/45' },
            ].map((col) => (
              <div key={col.title} className={cx('rounded-[22px] p-4', col.tone)}>
                <p className="mb-3 flex items-center gap-2 text-[13px] font-medium">
                  <Icon name={col.title.startsWith('Hot') ? 'trend' : 'clock'} size={16} /> {col.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.items.map((d) => {
                    const p = product(d.productId)
                    return (
                      <li key={d.productId} className="flex items-center gap-3 rounded-[16px] bg-white/75 p-2.5 pr-4 transition-transform duration-[var(--duration-base)] hover:-translate-y-0.5">
                        {p && <ProductImage name={p.name} image={p.image} tint={p.tint} className="size-11 rounded-[12px]" />}
                        <span className="min-w-0 flex-1 truncate text-[14px]">{p?.name}</span>
                        <span className="text-right text-xs leading-tight text-muted">
                          <span className="block text-[14px] text-ink tabular-nums">{d.orders} orders</span>
                          {d.asks} asks
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
