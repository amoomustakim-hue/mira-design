'use client'

import Link from 'next/link'
import { Skeleton, useLoad } from '@/components/dash'
import { CountUp, LiveChart, LiveFeed, LivePulse } from '@/components/fx'
import { Icon } from '@/components/icons'
import { StatusBadge } from '@/components/orders'
import { Card, ProductImage, Stat } from '@/components/ui'
import { getOrders, getOverview, getProducts } from '@/lib/api'
import { compact, naira, pct, timeAgo } from '@/lib/format'
import type { Order, Overview, Product } from '@/lib/types'

const dayLabel = (i: number, n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - (n - 1 - i))
  return i === n - 1 ? 'Today' : d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function OverviewPage() {
  const [ov, , loading] = useLoad<Overview | null>(getOverview, null)
  const [products] = useLoad<Product[]>(getProducts, [])
  const [orders] = useLoad<Order[]>(getOrders, [])
  const product = (id: string) => products.find((p) => p.id === id)

  if (loading || !ov) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-[220px] sm:col-span-2 xl:col-span-4" />
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[140px]" />
        ))}
      </div>
    )
  }

  const s = ov.series
  const scaled = (k: number) => s.map((v) => v * k + (v % 7))
  const maxTop = Math.max(...ov.topProducts.map((t) => t.orders))

  return (
    <>
      {/* Hero: the assistant, live */}
      <section className="glass-lime relative mb-4 overflow-hidden rounded-[32px] p-6 sm:p-8">
        <div aria-hidden="true" className="absolute -right-10 -bottom-24 hidden size-80 rounded-full bg-white/40 sm:block" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <span className="glass inline-flex h-8 w-fit items-center gap-2 rounded-pill px-3 text-[12px]">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-lime-3 opacity-70" />
                <span className="relative size-2 rounded-full bg-lime-3" />
              </span>
              Assistant live · answering 3 chats now
            </span>
            <h1 className="max-w-[560px] text-[30px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px]">
              <CountUp value={ov.queries} /> questions answered in 14 days.
            </h1>
            <p className="max-w-[460px] text-[14px] text-ink-2 sm:text-[15px]">
              {pct(ov.answeredRate)} without you lifting a finger, and {ov.orders} orders came through chat.
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              <Link href="/dashboard/chat" className="inline-flex h-10 items-center gap-2 rounded-pill bg-ink px-4 text-[13px] font-medium text-white transition-transform active:scale-[0.97]">
                Open chats <span className="grid h-5 min-w-5 place-items-center rounded-pill bg-lime-2 px-1.5 text-[11px] text-ink">3</span>
              </Link>
              <Link href="/dashboard/analytics" className="glass inline-flex h-10 items-center gap-1.5 rounded-pill px-4 text-[13px] font-medium transition-transform active:scale-[0.97]">
                See insights <Icon name="arrowUpRight" size={14} />
              </Link>
            </div>
          </div>
          <LivePulse className="hidden size-36 shrink-0 sm:grid lg:mr-8 lg:size-44" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Chat queries" value={ov.queries} format={(n) => compact(Math.round(n))} delta={ov.deltas.queries} spark={s} delay={60} />
        <Stat label="Orders" value={ov.orders} delta={ov.deltas.orders} spark={scaled(0.12)} delay={110} />
        <Stat label="Revenue" value={ov.revenue} format={naira} delta={ov.deltas.revenue} spark={scaled(3)} delay={160} />
        <Stat label="Answered automatically" value={ov.answeredRate * 100} format={(n) => `${Math.round(n)}%`} delta={ov.deltas.answeredRate} spark={[90, 91, 93, 92, 94, 95, 94, 96, 95, 96, 96, 97, 96, 96]} delay={210} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] text-muted">Chat queries per day</p>
              <p className="mt-1 text-[22px] font-medium tracking-tight tabular-nums">
                {s[s.length - 1]} today <span className="ml-1 rounded-pill bg-lime-2/70 px-2 py-0.5 align-middle text-xs font-normal">+{Math.round(((s[s.length - 1] - s[0]) / s[0]) * 100)}% in 2 weeks</span>
              </p>
            </div>
            <span className="hidden text-xs text-muted sm:block">Hover or drag to explore</span>
          </div>
          <div className="mt-10">
            <LiveChart data={s} label={(i) => dayLabel(i, s.length)} unit=" chats" height={210} />
          </div>
        </Card>

        <Card className="flex flex-col p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[15px] font-medium">Live activity</p>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <span className="size-1.5 animate-pulse rounded-full bg-lime-3" /> Updating
            </span>
          </div>
          <LiveFeed />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card className="p-5 sm:p-6">
          <p className="text-[15px] font-medium">Top products</p>
          <ul className="mt-4 flex flex-col gap-3.5">
            {ov.topProducts.map((t, i) => {
              const p = product(t.productId)
              return (
                <li key={t.productId} className="group flex items-center gap-3">
                  <span className="w-4 font-mono text-xs text-muted">{i + 1}</span>
                  {p && <ProductImage name={p.name} image={p.image} tint={p.tint} className="size-12 rounded-[14px] transition-transform duration-[var(--duration-base)] group-hover:scale-105" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px]">{p?.name}</span>
                    <span className="mt-2 block h-2 overflow-hidden rounded-pill bg-white/70">
                      <span className="grow-x block h-full rounded-pill bg-[linear-gradient(90deg,#e5f186,#b9d03a)]" style={{ width: `${(t.orders / maxTop) * 100}%`, animationDelay: `${200 + i * 90}ms` }} />
                    </span>
                  </span>
                  <span className="text-[13px] tabular-nums text-ink-2">{t.orders}</span>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card className="p-0">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 sm:px-6">
            <p className="text-[15px] font-medium">Latest orders</p>
            <Link href="/dashboard/orders" className="flex items-center gap-1 text-[13px] text-ink-2 hover:text-ink">
              All orders <Icon name="arrow" size={14} />
            </Link>
          </div>
          <ul>
            {orders.slice(0, 5).map((o, i) => (
              <li key={o.id} className="animate-rise" style={{ animationDelay: `${150 + i * 50}ms` }}>
                <Link href={`/dashboard/orders?open=${o.id}`} className="flex items-center gap-3 border-t border-ink/5 px-5 py-3.5 transition-colors hover:bg-white/50 sm:gap-4 sm:px-6">
                  <span className="w-[78px] shrink-0 font-mono text-[12px] sm:w-[86px] sm:text-[13px]">{o.id}</span>
                  <span className="min-w-0 flex-1 truncate text-[14px]">{o.customer}</span>
                  <span className="hidden w-12 text-right text-[13px] text-muted sm:block">{timeAgo(o.updatedAt)}</span>
                  <span className="hidden w-[92px] text-right text-[14px] tabular-nums sm:block">{naira(o.total)}</span>
                  <StatusBadge status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

