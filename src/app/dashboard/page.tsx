'use client'

import Link from 'next/link'
import { AreaChart } from '@/components/charts'
import { PageHead, Skeleton, useLoad } from '@/components/dash'
import { Icon } from '@/components/icons'
import { StatusBadge } from '@/components/orders'
import { Card, ProductImage, Stat } from '@/components/ui'
import { getOrders, getOverview, getProducts } from '@/lib/api'
import { compact, naira, pct, timeAgo } from '@/lib/format'
import type { Order, Overview, Product } from '@/lib/types'

export default function OverviewPage() {
  const [ov, , loading] = useLoad<Overview | null>(getOverview, null)
  const [products] = useLoad<Product[]>(getProducts, [])
  const [orders] = useLoad<Order[]>(getOrders, [])
  const product = (id: string) => products.find((p) => p.id === id)

  if (loading || !ov) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[132px]" />
        ))}
        <Skeleton className="h-[300px] sm:col-span-2 xl:col-span-3" />
        <Skeleton className="h-[300px]" />
      </div>
    )
  }

  const maxTop = Math.max(...ov.topProducts.map((t) => t.orders))
  return (
    <>
      <PageHead title="Welcome back" sub="Here’s how your assistant did over the last 14 days." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Chat queries" value={compact(ov.queries)} delta={ov.deltas.queries} />
        <Stat label="Orders" value={String(ov.orders)} delta={ov.deltas.orders} />
        <Stat label="Revenue" value={naira(ov.revenue)} delta={ov.deltas.revenue} />
        <Stat label="Answered by AI" value={pct(ov.answeredRate)} delta={ov.deltas.answeredRate} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] text-muted">Chat queries per day</p>
              <p className="mt-1 text-[22px] font-medium tracking-tight tabular-nums">{ov.series[ov.series.length - 1]} today</p>
            </div>
            <Link href="/dashboard/analytics" className="flex h-9 items-center gap-1.5 rounded-pill bg-mist px-3.5 text-[13px] transition-colors hover:bg-line">
              Insights <Icon name="arrowUpRight" size={14} />
            </Link>
          </div>
          <div className="mt-6">
            <AreaChart data={ov.series} labels={['2 weeks ago', '1 week ago', 'Today']} />
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-[13px] text-muted">Top products</p>
          <ul className="mt-4 flex flex-col gap-3">
            {ov.topProducts.map((t, i) => {
              const p = product(t.productId)
              return (
                <li key={t.productId} className="flex items-center gap-3">
                  <span className="w-4 font-mono text-xs text-muted">{i + 1}</span>
                  {p && <ProductImage name={p.name} image={p.image} tint={p.tint} className="size-11 rounded-[12px]" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px]">{p?.name}</span>
                    <span className="mt-1.5 block h-1.5 overflow-hidden rounded-pill bg-mist">
                      <span className="block h-full rounded-pill bg-lime-2" style={{ width: `${(t.orders / maxTop) * 100}%` }} />
                    </span>
                  </span>
                  <span className="text-[13px] tabular-nums text-ink-2">{t.orders}</span>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <Card className="mt-4 p-0">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <p className="text-[15px] font-medium">Latest orders</p>
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-[13px] text-ink-2 hover:text-ink">
            All orders <Icon name="arrow" size={14} />
          </Link>
        </div>
        <ul>
          {orders.slice(0, 5).map((o) => (
            <li key={o.id}>
              <Link href={`/dashboard/orders?open=${o.id}`} className="flex items-center gap-4 border-t border-line/70 px-6 py-3.5 transition-colors hover:bg-mist/60">
                <span className="w-[86px] shrink-0 font-mono text-[13px]">{o.id}</span>
                <span className="min-w-0 flex-1 truncate text-[14px]">{o.customer}</span>
                <span className="hidden text-[13px] text-muted sm:block">{o.channel}</span>
                <span className="hidden w-12 text-right text-[13px] text-muted sm:block">{timeAgo(o.updatedAt)}</span>
                <span className="w-[92px] text-right text-[14px] tabular-nums">{naira(o.total)}</span>
                <StatusBadge status={o.status} />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
