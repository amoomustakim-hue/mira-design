'use client'

import { useEffect, useRef, useState } from 'react'
import { Bubble } from '@/components/chat'
import { PageHead, Skeleton, useLoad } from '@/components/dash'
import { Icon } from '@/components/icons'
import { Badge, Card, Toggle } from '@/components/ui'
import { getConversations, getProducts, sendOwnerReply } from '@/lib/api'
import { cx, timeAgo } from '@/lib/format'
import type { Conversation, Product } from '@/lib/types'

export default function ChatPage() {
  const [convos, setConvos, loading] = useLoad<Conversation[]>(getConversations, [])
  const [products] = useLoad<Product[]>(getProducts, [])
  const [openId, setOpenId] = useState<string | null>(null)
  const [aiOn, setAiOn] = useState<Record<string, boolean>>({})
  const [text, setText] = useState('')
  const thread = useRef<HTMLDivElement>(null)
  const open = convos.find((c) => c.id === openId)

  useEffect(() => {
    // Desktop opens the first conversation; phones start on the list.
    if (!openId && convos.length && window.matchMedia('(min-width: 1024px)').matches) setOpenId(convos[0].id)
  }, [convos, openId])

  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight, behavior: 'smooth' })
  }, [open?.messages.length, openId])

  const select = (id: string) => {
    setOpenId(id)
    setConvos((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
  }

  const reply = async () => {
    if (!open || !text.trim()) return
    const m = await sendOwnerReply(open.id, text.trim())
    setConvos((cs) => cs.map((c) => (c.id === open.id ? { ...c, messages: [...c.messages, m] } : c)))
    setText('')
  }

  if (loading) return <Skeleton className="h-[640px]" />

  return (
    <>
      <PageHead title="Chat" sub="Every conversation your assistant is having. Step in any time." />
      <Card className="grid h-[calc(100dvh-230px)] min-h-[520px] overflow-hidden p-0 lg:grid-cols-[340px_1fr]">
        {/* Inbox */}
        <ul className={cx('overflow-y-auto border-line/70 lg:block lg:border-r', open && 'hidden')}>
          {convos.map((c) => {
            const last = c.messages[c.messages.length - 1]
            return (
              <li key={c.id}>
                <button type="button" onClick={() => select(c.id)} className={cx('flex w-full gap-3 border-b border-line/70 px-4 py-4 text-left transition-colors', c.id === openId ? 'bg-lime/70' : 'hover:bg-mist/60')}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-[13px] font-medium">{c.customer.slice(0, 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[14px] font-medium">{c.customer}</span>
                      <span className="shrink-0 text-xs text-muted">{timeAgo(last.at)}</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{last.text}</span>
                      {c.unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-pill bg-ink px-1.5 text-[11px] text-white">{c.unread}</span>}
                    </span>
                    <span className="mt-2 flex gap-1.5">
                      <Badge>{c.channel}</Badge>
                      {c.resolved && <Badge tone="lime">Resolved</Badge>}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Thread */}
        {open ? (
          <div className="flex min-h-0 flex-col">
            <div className="flex items-center gap-3 border-b border-line/70 px-4 py-3">
              <button type="button" onClick={() => setOpenId(null)} className="grid size-9 place-items-center rounded-full bg-mist lg:hidden" aria-label="Back to inbox">
                <Icon name="arrow" size={16} className="rotate-180" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium">{open.customer}</p>
                <p className="text-xs text-muted">{open.channel}</p>
              </div>
              <label className="flex items-center gap-2 text-[13px] text-ink-2">
                <span className="hidden sm:inline">Auto-replies</span>
                <Toggle checked={aiOn[open.id] ?? true} onChange={(v) => setAiOn((a) => ({ ...a, [open.id]: v }))} label="Auto-replies in this chat" />
              </label>
            </div>
            <div ref={thread} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-mist/40 px-4 py-5">
              {open.messages.map((m) => (
                <div key={m.id} className={cx('flex flex-col', m.from === 'customer' ? 'items-start' : 'items-end')}>
                  <span className="mb-1 px-1 text-[11px] text-muted">{m.from === 'customer' ? open.customer : m.from === 'owner' ? 'You' : 'Assistant'}</span>
                  {/* In the owner's view, the customer is on the left */}
                  <Bubble m={{ ...m, from: m.from === 'customer' ? 'assistant' : m.from === 'owner' ? 'owner' : 'customer' }} products={products} onOpen={() => {}} />
                </div>
              ))}
            </div>
            <form
              className="flex items-center gap-2 border-t border-line/70 p-3"
              onSubmit={(e) => {
                e.preventDefault()
                reply()
              }}
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={aiOn[open.id] ?? true ? 'Reply yourself — the assistant will pause' : 'Write a reply'}
                className="h-11 min-w-0 flex-1 rounded-pill bg-mist px-4 text-[14px] outline-none placeholder:text-muted"
                aria-label="Reply"
              />
              <button type="submit" disabled={!text.trim()} className="grid size-11 place-items-center rounded-full bg-ink text-white transition-opacity disabled:opacity-30" aria-label="Send reply">
                <Icon name="send" size={17} />
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden place-items-center text-[14px] text-muted lg:grid">Pick a conversation</div>
        )}
      </Card>
    </>
  )
}
