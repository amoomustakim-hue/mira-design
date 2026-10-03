'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { business } from '@/lib/mock'
import { cx } from '@/lib/format'
import { Icon, type IconName } from './icons'
import { Logo } from './ui'

export const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/dashboard', label: 'Overview', icon: 'home' },
  { href: '/dashboard/chat', label: 'Chat', icon: 'chat' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'chart' },
  { href: '/dashboard/catalog', label: 'Catalog', icon: 'box' },
  { href: '/dashboard/orders', label: 'Orders', icon: 'cart' },
  { href: '/dashboard/faqs', label: 'FAQs', icon: 'help' },
  { href: '/dashboard/policies', label: 'Policies', icon: 'shield' },
  { href: '/dashboard/hours', label: 'Hours', icon: 'clock' },
  { href: '/dashboard/promotions', label: 'Promotions', icon: 'tag' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'gear' },
]

/** Phone tab bar: the screens owners open most, one tap each. */
const TABS = ['/dashboard', '/dashboard/chat', '/dashboard/catalog', '/dashboard/orders']

/** Load data through the API seam once, with a loading flag. */
export function useLoad<T>(load: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let live = true
    load().then((d) => {
      if (live) {
        setData(d)
        setLoading(false)
      }
    })
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [data, setData, loading] as const
}

function useOwner() {
  const [name, setName] = useState(business.name)
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem('mira-owner') ?? 'null')
      if (v?.business) setName(v.business)
    } catch {}
  }, [])
  return name
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const path = usePathname()
  const router = useRouter()
  const owner = useOwner()
  const [more, setMore] = useState(false)
  const active = (href: string) => (href === '/dashboard' ? path === href : path.startsWith(href))

  useEffect(() => setMore(false), [path])

  const logout = () => {
    try {
      localStorage.removeItem('mira-owner')
    } catch {}
    router.push('/login')
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-1 p-3 lg:flex">
        <div className="glass flex h-full flex-col rounded-[28px] p-3">
          <Link href="/" className="px-3 pt-2 pb-5" aria-label="Mira home">
            <Logo />
          </Link>
          <nav className="flex flex-col gap-0.5" aria-label="Dashboard">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  'flex h-10 items-center gap-3 rounded-pill px-3.5 text-[14px] transition-colors duration-[var(--duration-fast)]',
                  active(n.href) ? 'bg-ink text-white' : 'text-ink-2 hover:bg-white/80 hover:text-ink',
                )}
              >
                <Icon name={n.icon} />
                {n.label}
                {n.label === 'Chat' && <span className={cx('ml-auto grid h-5 min-w-5 place-items-center rounded-pill px-1.5 text-[11px]', active(n.href) ? 'bg-lime-2 text-ink' : 'bg-lime text-ink')}>3</span>}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-[20px] bg-lime p-4">
            <p className="text-[13px] font-medium">Free trial</p>
            <p className="mt-1 text-xs leading-snug text-ink-2">Your assistant is live. ₦50,000/month when the trial ends.</p>
          </div>
          <button type="button" onClick={logout} className="mt-2 flex h-10 items-center gap-3 rounded-pill px-3.5 text-[14px] text-muted transition-colors hover:bg-white/80 hover:text-ink">
            <Icon name="logout" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 pt-3 pb-2 sm:px-6 lg:pt-5">
          <div className="glass flex h-14 w-full items-center gap-3 rounded-pill pr-2 pl-4">
            <Link href="/dashboard" className="lg:hidden" aria-label="Overview">
              <Logo wordmark={false} />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium">{owner}</p>
              <p className="truncate text-xs text-muted">{NAV.find((n) => active(n.href))?.label ?? 'Dashboard'}</p>
            </div>
            <Link href="/" className="hidden h-9 items-center gap-1.5 rounded-pill bg-white/70 px-3.5 text-[13px] text-ink-2 transition-colors hover:bg-white sm:flex">
              <span className="size-1.5 rounded-full bg-lime-3" /> Assistant live
            </Link>
            <span className="grid size-10 place-items-center rounded-full bg-ink text-sm font-medium text-white" aria-hidden="true">
              {owner.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 pt-3 pb-28 sm:px-6 lg:pb-10">
          <div className="mx-auto w-full max-w-[1180px] animate-rise" key={path}>
            {children}
          </div>
        </main>
      </div>

      {/* Bottom tabs (phones) */}
      <nav className="glass fixed inset-x-3 bottom-3 z-40 grid h-16 grid-cols-5 rounded-[24px] px-1 shadow-float lg:hidden" aria-label="Dashboard">
        {TABS.map((href) => {
          const n = NAV.find((x) => x.href === href)!
          return (
            <Link key={href} href={href} className={cx('flex flex-col items-center justify-center gap-1 text-[11px] transition-colors', active(href) ? 'text-ink' : 'text-muted')}>
              <span className={cx('grid h-7 w-12 place-items-center rounded-pill transition-colors duration-[var(--duration-fast)]', active(href) && 'bg-lime-2')}>
                <Icon name={n.icon} size={19} />
              </span>
              {n.label}
            </Link>
          )
        })}
        <button type="button" onClick={() => setMore(true)} className={cx('flex flex-col items-center justify-center gap-1 text-[11px]', more ? 'text-ink' : 'text-muted')} aria-expanded={more}>
          <span className="grid h-7 w-12 place-items-center rounded-pill">
            <Icon name="dots" size={19} />
          </span>
          More
        </button>
      </nav>

      {more && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="More">
          <button type="button" className="absolute inset-0 bg-ink/20 animate-fade" onClick={() => setMore(false)} aria-label="Close" />
          <div className="glass absolute inset-x-3 bottom-3 rounded-[28px] p-3 shadow-float animate-pop">
            <div className="grid grid-cols-3 gap-2">
              {NAV.filter((n) => !TABS.includes(n.href)).map((n) => (
                <Link key={n.href} href={n.href} className={cx('flex flex-col items-center gap-2 rounded-[20px] py-4 text-[13px]', active(n.href) ? 'bg-ink text-white' : 'bg-white/70')}>
                  <Icon name={n.icon} size={20} />
                  {n.label}
                </Link>
              ))}
            </div>
            <button type="button" onClick={logout} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[18px] text-[14px] text-muted">
              <Icon name="logout" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[28px] leading-tight font-medium tracking-[-0.03em] sm:text-[32px]">{title}</h1>
        {sub && <p className="mt-1 text-[14px] text-ink-2">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

/** Skeleton block for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('animate-pulse rounded-card bg-white/70', className)} />
}

export function Saved({ show }: { show: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-[13px] text-ink-2 transition-opacity duration-200', show ? 'opacity-100' : 'opacity-0')} aria-live="polite">
      <Icon name="check" size={15} /> Saved
    </span>
  )
}

/** Bottom sheet on phones, side drawer on desktop. */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label={title}>
      <button type="button" className="absolute inset-0 bg-ink/20 animate-fade" onClick={onClose} aria-label="Close" />
      <div className="glass absolute inset-x-2 bottom-2 max-h-[88dvh] overflow-y-auto rounded-[28px] p-6 shadow-float animate-pop sm:inset-y-3 sm:right-3 sm:left-auto sm:max-h-none sm:w-[440px]">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-lg font-medium">{title}</p>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-white/80" aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
