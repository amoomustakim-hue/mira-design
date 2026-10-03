'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { PageHead, Sheet, Skeleton, useLoad } from '@/components/dash'
import { Icon } from '@/components/icons'
import { STATUSES, STATUS_LABEL, StatusBadge, StatusTrack } from '@/components/orders'
import { Button, Card, ProductImage } from '@/components/ui'
import { getOrders, getProducts, updateOrderStatus } from '@/lib/api'
import { cx, naira, timeAgo } from '@/lib/format'
import type { Order, OrderStatus, Product } from '@/lib/types'

export default function OrdersPage() {
  return (
    <Suspense>
      <Orders />
    </Suspense>
  )
}

function Orders() {
  const params = useSearchParams()
  const [orders, setOrders, loading] = useLoad<Order[]>(getOrders, [])
  const [products] = useLoad<Product[]>(getProducts, [])
  const [tab, setTab] = useState<OrderStatus | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => setOpenId(params.get('open')), [params])

  const shown = tab === 'all' ? orders : orders.filter((o) => o.status === tab)
  const open = orders.find((o) => o.id === openId)
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length

  const advance = async (o: Order) => {
    const next = STATUSES[STATUSES.indexOf(o.status) + 1]
    if (!next) return
    setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: next, updatedAt: new Date().toISOString() } : x)))
    await updateOrderStatus(o.id, next)
  }

  return (
    <>
      <PageHead title="Orders" sub="Every order from chat, WhatsApp and Instagram, from cart to doorstep." />

      {/* The pipeline at a glance: each stage's share of orders */}
      <div className="glass-card mb-3 flex h-3 overflow-hidden rounded-pill p-0.5">
        {STATUSES.map((st, i) => (
          <span
            key={st}
            className={cx('grow-x h-full rounded-pill first:rounded-l-pill', ['bg-[#d9d9e0]', 'bg-lime-2', 'bg-lime-3', 'bg-ink'][i])}
            style={{ width: `${(count(st) / Math.max(1, orders.length)) * 100}%`, animationDelay: `${i * 120}ms` }}
            title={`${STATUS_LABEL[st]}: ${count(st)}`}
          />
        ))}
      </div>

      {/* Pipeline summary doubles as the filter */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(['all', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={cx(
              'flex items-center justify-between rounded-[20px] px-4 py-3 text-left transition-[transform,background-color,color] duration-[var(--duration-base)] ease-[var(--ease-out)] active:scale-[0.97]',
              tab === s ? 'bg-ink text-white shadow-float' : 'glass-card hover:-translate-y-0.5',
              s === 'all' && 'col-span-2 sm:col-span-1',
            )}
          >
            <span className="text-[13px]">{s === 'all' ? 'All orders' : STATUS_LABEL[s]}</span>
            <span className="text-lg tabular-nums">{s === 'all' ? orders.length : count(s)}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton className="h-[420px]" />
      ) : (
        <Card className="p-0">
          {shown.length === 0 && <p className="py-14 text-center text-[14px] text-muted">No orders here yet.</p>}
          <ul>
            {shown.map((o, i) => (
              <li key={o.id}>
                <button type="button" onClick={() => setOpenId(o.id)} className={cx('flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/50 animate-rise', i > 0 && 'border-t border-ink/5')} style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[13px]">{o.id}</span>
                      <span className="text-xs text-muted">· {timeAgo(o.updatedAt)}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[14px]">
                      {o.customer} <span className="text-muted">· {o.channel}</span>
                    </span>
                  </span>
                  <span className="text-[14px] tabular-nums">{naira(o.total)}</span>
                  <StatusBadge status={o.status} />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {open && (
        <Sheet title={open.id} onClose={() => setOpenId(null)}>
          <div className="flex flex-col gap-5">
            <StatusTrack status={open.status} />
            <div className="rounded-[20px] bg-white/80 p-4">
              <p className="text-[13px] text-muted">Customer</p>
              <p className="mt-1 text-[15px] font-medium">{open.customer}</p>
              <p className="text-[13px] text-ink-2">
                {open.phone} · via {open.channel}
              </p>
            </div>
            <ul className="flex flex-col gap-2">
              {open.items.map((it) => {
                const p = products.find((x) => x.id === it.productId)
                return (
                  <li key={it.productId} className="flex items-center gap-3 rounded-[18px] bg-white/80 p-2.5 pr-4">
                    {p && <ProductImage name={p.name} image={p.image} tint={p.tint} className="size-12 rounded-[12px]" />}
                    <span className="min-w-0 flex-1 truncate text-[14px]">
                      {p?.name} <span className="text-muted">× {it.qty}</span>
                    </span>
                    <span className="text-[14px] tabular-nums">{p ? naira(p.price * it.qty) : ''}</span>
                  </li>
                )
              })}
            </ul>
            <p className="flex items-center justify-between border-t border-line pt-4 text-[15px]">
              Total <span className="text-lg font-medium tabular-nums">{naira(open.total)}</span>
            </p>
            {open.status !== 'delivered' ? (
              <Button size="lg" onClick={() => advance(open)} icon="arrow">
                Mark as {STATUS_LABEL[STATUSES[STATUSES.indexOf(open.status) + 1]].toLowerCase()}
              </Button>
            ) : (
              <p className="flex items-center justify-center gap-2 rounded-pill bg-lime py-3 text-[14px]">
                <Icon name="check" size={16} /> Delivered. The customer has been told.
              </p>
            )}
            <p className="text-center text-xs text-muted">Status changes are shared with the customer in chat automatically.</p>
          </div>
        </Sheet>
      )}
    </>
  )
}
