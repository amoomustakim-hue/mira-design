'use client'

import { useState } from 'react'
import { PageHead, Saved, Skeleton, useLoad } from '@/components/dash'
import { Button, Card, Toggle } from '@/components/ui'
import { getHours, saveHours } from '@/lib/api'
import { cx } from '@/lib/format'
import type { DayHours } from '@/lib/types'

export default function HoursPage() {
  const [hours, setHours, loading] = useLoad<DayHours[]>(getHours, [])
  const [saved, setSaved] = useState(false)
  const edit = (day: string, change: Partial<DayHours>) => setHours((hs) => hs.map((h) => (h.day === day ? { ...h, ...change } : h)))

  return (
    <>
      <PageHead
        title="Opening hours"
        sub="The assistant still answers when you’re closed, and says when you’ll be back."
        action={
          <div className="flex items-center gap-3">
            <Saved show={saved} />
            <Button
              onClick={async () => {
                await saveHours(hours)
                setSaved(true)
                setTimeout(() => setSaved(false), 1600)
              }}
            >
              Save
            </Button>
          </div>
        }
      />
      {loading ? (
        <Skeleton className="h-[460px]" />
      ) : (
        <Card className="max-w-[720px] p-2">
          {hours.map((h, i) => (
            <div key={h.day} className={cx('flex flex-wrap items-center gap-3 px-4 py-3.5', i > 0 && 'border-t border-line/70')}>
              <span className="w-28 text-[14px] font-medium">{h.day}</span>
              <Toggle checked={!h.closed} onChange={(v) => edit(h.day, { closed: !v, open: h.open || '09:00', close: h.close || '18:00' })} label={`Open on ${h.day}`} />
              {h.closed ? (
                <span className="text-[14px] text-muted">Closed</span>
              ) : (
                <span className="flex items-center gap-2 text-[14px]">
                  <input type="time" value={h.open} onChange={(e) => edit(h.day, { open: e.target.value })} className="h-10 rounded-[12px] bg-mist px-3 outline-none" aria-label={`${h.day} opens`} />
                  <span className="text-muted">to</span>
                  <input type="time" value={h.close} onChange={(e) => edit(h.day, { close: e.target.value })} className="h-10 rounded-[12px] bg-mist px-3 outline-none" aria-label={`${h.day} closes`} />
                </span>
              )}
            </div>
          ))}
        </Card>
      )}
    </>
  )
}
