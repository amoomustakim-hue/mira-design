'use client'

import { useState } from 'react'
import { PageHead, Saved, Skeleton, useLoad } from '@/components/dash'
import { Icon } from '@/components/icons'
import { Button, Card } from '@/components/ui'
import { getFaqs, saveFaqs } from '@/lib/api'
import { cx } from '@/lib/format'
import type { Faq } from '@/lib/types'

export default function FaqsPage() {
  const [faqs, setFaqs, loading] = useLoad<Faq[]>(getFaqs, [])
  const [open, setOpen] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const edit = (id: string, change: Partial<Faq>) => setFaqs((fs) => fs.map((f) => (f.id === id ? { ...f, ...change } : f)))
  const save = async () => {
    await saveFaqs(faqs)
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <>
      <PageHead
        title="FAQs"
        sub="The assistant answers these word for word."
        action={
          <div className="flex items-center gap-3">
            <Saved show={saved} />
            <Button variant="soft" icon="plus" onClick={() => {
              const id = `f${Date.now()}`
              setFaqs((fs) => [...fs, { id, question: '', answer: '' }])
              setOpen(id)
            }}>
              Add
            </Button>
            <Button onClick={save}>Save</Button>
          </div>
        }
      />
      {loading ? (
        <Skeleton className="h-[360px]" />
      ) : (
        <div className="flex flex-col gap-2">
          {faqs.map((f) => {
            const isOpen = open === f.id
            return (
              <Card key={f.id} className="p-0">
                <button type="button" onClick={() => setOpen(isOpen ? null : f.id)} className="flex w-full items-center gap-3 px-5 py-4 text-left" aria-expanded={isOpen}>
                  <span className="flex-1 text-[15px] font-medium">{f.question || 'New question'}</span>
                  <Icon name="plus" size={16} className={cx('transition-transform duration-[var(--duration-base)]', isOpen && 'rotate-45')} />
                </button>
                {isOpen ? (
                  <div className="flex flex-col gap-3 px-5 pb-5 animate-fade">
                    <input value={f.question} onChange={(e) => edit(f.id, { question: e.target.value })} placeholder="Question" className="h-11 rounded-[14px] bg-mist px-4 text-[14px] outline-none" aria-label="Question" />
                    <textarea value={f.answer} onChange={(e) => edit(f.id, { answer: e.target.value })} placeholder="Answer" rows={3} className="resize-none rounded-[14px] bg-mist px-4 py-3 text-[14px] outline-none" aria-label="Answer" />
                    <button type="button" onClick={() => setFaqs((fs) => fs.filter((x) => x.id !== f.id))} className="self-start text-[13px] text-danger">
                      Delete
                    </button>
                  </div>
                ) : (
                  <p className="-mt-2 px-5 pb-4 text-[14px] text-ink-2">{f.answer}</p>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
