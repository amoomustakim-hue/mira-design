import { cx } from '@/lib/format'
import type { OrderStatus } from '@/lib/types'

export const STATUSES: OrderStatus[] = ['cart', 'placed', 'shipped', 'delivered']
export const STATUS_LABEL: Record<OrderStatus, string> = { cart: 'In cart', placed: 'Placed', shipped: 'Shipped', delivered: 'Delivered' }

export function StatusBadge({ status }: { status: OrderStatus }) {
  const tone = {
    cart: 'bg-mist text-ink-2',
    placed: 'bg-lime text-ink [box-shadow:inset_0_0_0_1px_var(--color-lime-2)]',
    shipped: 'bg-lime-2 text-ink',
    delivered: 'bg-ink text-white',
  }[status]
  return <span className={cx('inline-flex h-6 w-[78px] shrink-0 items-center justify-center rounded-pill text-xs font-medium', tone)}>{STATUS_LABEL[status]}</span>
}

/** Four-step progress, cart → placed → shipped → delivered. */
export function StatusTrack({ status }: { status: OrderStatus }) {
  const at = STATUSES.indexOf(status)
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {STATUSES.map((s, i) => (
        <div key={s} className="flex flex-col gap-2">
          <span className={cx('h-1.5 rounded-pill transition-colors duration-300', i <= at ? 'bg-ink' : 'bg-line')} />
          <span className={cx('text-[11px]', i <= at ? 'text-ink' : 'text-muted')}>{STATUS_LABEL[s]}</span>
        </div>
      ))}
    </div>
  )
}
