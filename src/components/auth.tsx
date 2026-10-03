'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { business } from '@/lib/mock'
import { Field } from './landing'
import { Button, Logo, Orb } from './ui'

/**
 * DEMO ONLY: there is no authentication. Any details let you in, and the
 * business name is kept in localStorage so the dashboard can greet you.
 * Replace `enter()` with a call to the real auth endpoint.
 */
export function enter(router: ReturnType<typeof useRouter>, name?: string) {
  try {
    localStorage.setItem('mira-owner', JSON.stringify({ business: name || business.name }))
  } catch {}
  router.push('/dashboard')
}

function Shell({ title, sub, children, foot }: { title: string; sub: string; children: ReactNode; foot: ReactNode }) {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <Orb className="pointer-events-none absolute -top-24 -right-24 size-[420px] opacity-90" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-24 size-[420px] rounded-full bg-lime blur-3xl" />
      <div className="glass relative w-full max-w-[420px] rounded-[32px] p-7 shadow-float animate-pop sm:p-9">
        <Link href="/" aria-label="Mira home">
          <Logo />
        </Link>
        <h1 className="mt-8 text-[30px] leading-tight font-medium tracking-[-0.03em]">{title}</h1>
        <p className="mt-1.5 text-[15px] text-ink-2">{sub}</p>
        <div className="mt-7">{children}</div>
        <p className="mt-6 text-center text-[13px] text-muted">{foot}</p>
      </div>
      <p className="relative mt-6 text-center text-xs text-muted">Design preview with no real accounts. Any details will open the demo dashboard.</p>
    </main>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  return (
    <Shell
      title="Welcome back"
      sub="Log in to your business dashboard."
      foot={
        <>
          New to Mira?{' '}
          <Link href="/signup" className="font-medium text-ink underline-offset-2 hover:underline">
            Start a free trial
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          setBusy(true)
          enter(router)
        }}
      >
        <Field name="email" type="email" label="Email" defaultValue="owner@adirelane.ng" />
        <Field name="password" type="password" label="Password" defaultValue="demo-password" />
        <Button type="submit" size="lg" className="mt-2" disabled={busy} icon="arrow">
          {busy ? 'Opening dashboard…' : 'Log in'}
        </Button>
      </form>
    </Shell>
  )
}

export function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [busy, setBusy] = useState(false)
  return (
    <Shell
      title="Start your free trial"
      sub="Set up your assistant, then add your products."
      foot={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-ink underline-offset-2 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          setBusy(true)
          enter(router, String(new FormData(e.currentTarget).get('business') || ''))
        }}
      >
        <Field name="business" label="Business name" defaultValue="" />
        <label className="flex flex-col gap-1.5 text-[13px] text-muted">
          Industry
          <select name="industry" className="h-11 rounded-[14px] bg-mist px-3.5 text-[15px] text-ink outline-none">
            {['Fashion', 'Bank / fintech', 'School', 'Hospital / clinic', 'Restaurant', 'Other'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <Field name="email" type="email" label="Work email" defaultValue={params.get('email') ?? ''} />
        <Field name="password" type="password" label="Password" />
        <Button type="submit" size="lg" className="mt-2" disabled={busy} icon="arrow">
          {busy ? 'Creating your workspace…' : 'Create account'}
        </Button>
        <p className="text-center text-xs text-muted">₦50,000/month after your trial. Cancel any time.</p>
      </form>
    </Shell>
  )
}
