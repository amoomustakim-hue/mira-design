'use client'

import { useState } from 'react'
import { PageHead, Sheet, Skeleton, useLoad } from '@/components/dash'
import { Field } from '@/components/landing'
import { Badge, Button, Card, Toggle } from '@/components/ui'
import { getPromotions, updatePromotion } from '@/lib/api'
import { cx } from '@/lib/format'
import type { Promotion } from '@/lib/types'

const date = (iso: string) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

export default function PromotionsPage() {
  const [promos, setPromos, loading] = useLoad<Promotion[]>(getPromotions, [])
  const [adding, setAdding] = useState(false)

  return (
    <>
      <PageHead
        title="Promotions"
        sub="Active promotions are offered by the assistant when customers ask about deals."
        action={
          <Button icon="plus" onClick={() => setAdding(true)}>
            New promotion
          </Button>
        }
      />
      {loading ? (
        <Skeleton className="h-[260px]" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {promos.map((p) => (
            <Card key={p.id} className={cx('flex flex-col gap-4 p-6 transition-colors duration-200', p.active ? 'bg-lime' : '')}>
              <div className="flex items-start justify-between gap-3">
                <Badge tone={p.active ? 'ink' : 'neutral'}>{p.active ? 'Live' : 'Paused'}</Badge>
                <Toggle
                  checked={p.active}
                  label={`${p.title} active`}
                  onChange={async (v) => {
                    setPromos((ps) => ps.map((x) => (x.id === p.id ? { ...x, active: v } : x)))
                    await updatePromotion(p.id, { active: v })
                  }}
                />
              </div>
              <div>
                <p className="text-[28px] leading-none font-medium tracking-tight">{p.discount}</p>
                <p className="mt-2 text-[14px] text-ink-2">{p.title}</p>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-4 text-[13px]">
                <span className="rounded-[8px] bg-surface/80 px-2 py-1 font-mono">{p.code}</span>
                <span className="text-muted">Ends {date(p.ends)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
      {adding && (
        <Sheet title="New promotion" onClose={() => setAdding(false)}>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              setPromos((ps) => [
                { id: `pr${Date.now()}`, title: String(f.get('title') || 'New promotion'), code: String(f.get('code') || 'CODE').toUpperCase(), discount: String(f.get('discount') || '10% off'), ends: String(f.get('ends') || new Date().toISOString()), active: true },
                ...ps,
              ])
              setAdding(false)
            }}
          >
            <Field name="title" label="Title" />
            <div className="grid grid-cols-2 gap-3">
              <Field name="discount" label="Discount" defaultValue="10% off" />
              <Field name="code" label="Code" />
            </div>
            <Field name="ends" type="date" label="Ends" />
            <Button type="submit" size="lg" className="mt-1">
              Create promotion
            </Button>
          </form>
        </Sheet>
      )}
    </>
  )
}
