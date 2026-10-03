'use client'

import { useState } from 'react'
import { PageHead, Saved } from '@/components/dash'
import { Icon } from '@/components/icons'
import { Field } from '@/components/landing'
import { Button, Card, Logo } from '@/components/ui'
import { business } from '@/lib/mock'
import { cx } from '@/lib/format'

const SWATCHES = ['#111112', '#1f3b2d', '#23315f', '#7a2e2e', '#b9d03a', '#c26b2b']

export default function SettingsPage() {
  const [color, setColor] = useState(business.brandColor)
  const [greeting, setGreeting] = useState(business.greeting)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const snippet = `<script src="https://miraapp.com.ng/widget.js" data-business="adire-lane" data-color="${color}" defer></script>`

  return (
    <>
      <PageHead
        title="Settings"
        sub="Your business profile and how the chat widget looks on your site."
        action={
          <div className="flex items-center gap-3">
            <Saved show={saved} />
            <Button
              onClick={() => {
                setSaved(true)
                setTimeout(() => setSaved(false), 1600)
              }}
            >
              Save
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-4">
          <Card className="grid gap-3 p-6 sm:grid-cols-2">
            <p className="text-[15px] font-medium sm:col-span-2">Business</p>
            <Field name="name" label="Business name" defaultValue={business.name} />
            <Field name="industry" label="Industry" defaultValue={business.industry} />
            <Field name="city" label="City" defaultValue={business.city} />
            <Field name="site" label="Website" defaultValue="adirelane.ng" />
          </Card>

          <Card className="flex flex-col gap-4 p-6">
            <p className="text-[15px] font-medium">Chat widget</p>
            <div>
              <p className="mb-2 text-[13px] text-muted">Brand colour</p>
              <div className="flex flex-wrap items-center gap-2">
                {SWATCHES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setColor(s)}
                    className={cx('size-9 rounded-full ring-offset-2 transition-shadow', color === s && 'ring-2 ring-ink')}
                    style={{ background: s }}
                    aria-label={`Use ${s}`}
                  />
                ))}
                <label className="flex h-9 items-center gap-2 rounded-pill bg-mist pr-3 pl-1 text-[13px]">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="size-7 cursor-pointer rounded-full border-0 bg-transparent" aria-label="Custom colour" />
                  {color}
                </label>
              </div>
            </div>
            <label className="flex flex-col gap-1.5 text-[13px] text-muted">
              Greeting
              <textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} rows={2} className="resize-none rounded-[14px] bg-mist px-4 py-3 text-[14px] text-ink outline-none" />
            </label>
          </Card>

          <Card className="flex flex-col gap-3 p-6">
            <p className="text-[15px] font-medium">Add Mira to your website</p>
            <p className="text-[13px] text-ink-2">Paste this line before the closing &lt;/body&gt; tag.</p>
            <code className="block overflow-x-auto rounded-[16px] bg-ink p-4 font-mono text-[12px] leading-relaxed whitespace-pre text-lime">{snippet}</code>
            <Button
              variant="soft"
              className="self-start"
              onClick={() => {
                navigator.clipboard?.writeText(snippet)
                setCopied(true)
                setTimeout(() => setCopied(false), 1600)
              }}
            >
              <Icon name={copied ? 'check' : 'copy'} size={15} />
              {copied ? 'Copied' : 'Copy code'}
            </Button>
          </Card>
        </div>

        {/* Live preview of the widget */}
        <Card className="sticky top-24 flex h-fit flex-col gap-4 bg-mist p-5">
          <p className="text-[13px] text-muted">Preview</p>
          <div className="overflow-hidden rounded-[24px] bg-surface shadow-float">
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full text-white" style={{ background: color }}>
                <Logo wordmark={false} className="scale-75" />
              </span>
              <span className="text-[14px] font-medium">{business.name} assistant</span>
            </div>
            <div className="flex flex-col gap-2.5 p-4">
              <span className="max-w-[85%] rounded-[18px] rounded-bl-md bg-mist px-3.5 py-2.5 text-[14px]">{greeting}</span>
              <span className="max-w-[85%] self-end rounded-[18px] rounded-br-md px-3.5 py-2.5 text-[14px] text-white" style={{ background: color }}>
                Do you deliver to Abuja?
              </span>
            </div>
          </div>
          <span className="grid size-14 place-items-center self-end rounded-full text-white shadow-float transition-colors duration-200" style={{ background: color }}>
            <Icon name="chat" size={22} />
          </span>
        </Card>
      </div>
    </>
  )
}
