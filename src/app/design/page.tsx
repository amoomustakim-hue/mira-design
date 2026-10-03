'use client'

import Link from 'next/link'
import { Bubble, TypingIndicator } from '@/components/chat'
import { Icon } from '@/components/icons'
import { StatusBadge } from '@/components/orders'
import { Badge, Button, Card, Chip, Logo, Orb, Stat, Toggle } from '@/components/ui'
import { products } from '@/lib/mock'
import type { ChatMessage } from '@/lib/types'

const COLORS = [
  ['canvas', '#ececec', 'Page background behind sheets'],
  ['surface', '#ffffff', 'Cards, sheets, inputs on canvas'],
  ['mist', '#f5f5f7', 'Inputs, soft buttons, assistant bubbles'],
  ['line', '#e8e8ec', 'Hairlines and dividers'],
  ['ink', '#111112', 'Text, primary buttons, visitor bubbles'],
  ['ink-2', '#3c3c40', 'Secondary text'],
  ['muted', '#77777d', 'Captions, placeholders'],
  ['lime', '#f4f9cf', 'Accent panels, highlights'],
  ['lime-2', '#e5f186', 'Accent fills, chart areas, active tab'],
  ['lime-3', '#b9d03a', 'Accent dots, online status'],
  ['danger', '#c9472f', 'Errors and sold-out only'],
]

const TYPE = [
  ['Display', '64 / 1.02 / −3.5%', 'Hero headline (42 on phones)'],
  ['H2', '48 / 1.05 / −3%', 'Section headings (34 on phones)'],
  ['H3', '36 / 1.1 / −2.5%', 'Feature panel titles'],
  ['Page title', '32 / 1.2 / −3%', 'Dashboard page headings'],
  ['Body L', '17 / 1.6', 'Hero and section intros'],
  ['Body', '14–15 / 1.5', 'Dashboard and chat text'],
  ['Caption', '13 / 1.4', 'Labels, meta'],
  ['Mono', '12', 'IDs, codes, counters'],
]

const MOTION = [
  ['Button press', 'scale 0.97', '160ms', 'ease-out (0.22, 1, 0.36, 1)'],
  ['Hover colour / toggle', 'background, translate', '160–240ms', 'ease-out'],
  ['Message entrance', 'opacity 0→1, y 8→0', '280ms', 'ease-out'],
  ['Product card / sheet / panel open', 'opacity, y 10→0, scale .96→1', '260ms', 'ease-out'],
  ['Overlay fade', 'opacity', '220ms', 'ease-out'],
  ['Page change (dashboard)', 'opacity, y 8→0', '280ms', 'ease-out'],
  ['Typing dots', 'y −3px, opacity, staggered 140ms', '1s loop', 'ease-in-out'],
  ['Preloader (first visit only)', 'counter 0→100%', '900ms', 'ease-out cubic'],
]

const COMPONENTS = [
  ['Logo', 'Three soft bars; lime bar is the accent'],
  ['Button', 'ink · soft · ghost · lime; sm 32 / md 40 / lg 48; pill'],
  ['Chip', 'Outlined label above headings'],
  ['Badge', 'neutral · lime · ink · danger; 24 high'],
  ['Card', 'White, 28 radius, soft shadow'],
  ['Glass', 'glass (20px blur) · glass-strong (28px, floating) · glass-lime (tinted panels); solid fallbacks without backdrop-filter'],
  ['Aurora', 'Slow-drifting colour fields behind glass; radial gradients, transform-only, no blur filter'],
  ['Phone mockup', 'Flagship-size frame with island, status bar and home indicator; stands up from a 26° tilt as you scroll'],
  ['Floating cards', 'Glass stat cards around the phone; drift with the cursor (desktop only)'],
  ['Toggle', 'Ink track with a lime dot when on'],
  ['Orb', 'Frosted sphere used in the loader and auth'],
  ['Stat', 'Label, number, change vs last period'],
  ['Product image', 'Photo, or a soft clay placeholder by tint'],
  ['Status badge / track', 'cart → placed → shipped → delivered'],
  ['Chat panel', 'Header, thread, typing, suggestions, composer, product preview'],
  ['Chat widget', 'Bubble 56, nudge, panel 380×620 (full width on phones)'],
  ['Sheet', 'Bottom sheet on phones, side drawer on desktop'],
  ['Sidebar / tab bar', 'Desktop sidebar; phone tab bar with Catalog and Orders one tap away'],
]

const t = new Date().toISOString()
const m = (from: ChatMessage['from'], text: string, extra: Partial<ChatMessage> = {}): ChatMessage => ({ id: text, from, text, at: t, ...extra })

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border-t border-line pt-8">
      <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

function WidgetFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="text-[13px] text-muted">{label}</figcaption>
      <div className="flex min-h-[220px] flex-col justify-end gap-3 rounded-[24px] bg-mist p-4">{children}</div>
    </figure>
  )
}

export default function DesignNotes() {
  return (
    <main className="min-h-dvh bg-surface sm:m-3 sm:rounded-[32px]">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-12 px-5 py-10 sm:px-8 sm:py-14">
        <header className="flex flex-col gap-4">
          <Link href="/">
            <Logo />
          </Link>
          <h1 className="text-[40px] leading-tight font-medium tracking-[-0.035em] sm:text-[52px]">Design notes</h1>
          <p className="max-w-[640px] text-[16px] leading-relaxed text-ink-2">
            Colours, type, spacing, motion and components for the landing page, dashboard and chat widget. Every value lives as a token in <code className="font-mono text-[14px]">src/app/globals.css</code>, so the product can be re-themed in one place.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button href="/" size="sm" variant="soft">Landing</Button>
            <Button href="/login" size="sm" variant="soft">Login</Button>
            <Button href="/dashboard" size="sm" variant="soft">Dashboard</Button>
          </div>
        </header>

        <Section title="Colour">
          <p className="text-[14px] text-ink-2">White, soft neutrals and one accent. Lime is never used for text; danger only for errors and sold-out.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {COLORS.map(([name, hex, use]) => (
              <div key={name} className="overflow-hidden rounded-[20px] border border-line">
                <div className="h-16" style={{ background: hex }} />
                <div className="p-3">
                  <p className="text-[14px] font-medium">{name}</p>
                  <p className="font-mono text-xs text-muted">{hex}</p>
                  <p className="mt-1 text-xs text-ink-2">{use}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type">
          <p className="text-[14px] text-ink-2">Geist Sans for everything, Geist Mono for IDs and counters. Headings are medium weight with tight tracking.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <tbody>
                {TYPE.map(([n, spec, use]) => (
                  <tr key={n} className="border-t border-line">
                    <td className="py-3 pr-4 font-medium">{n}</td>
                    <td className="py-3 pr-4 font-mono text-[13px]">{spec}</td>
                    <td className="py-3 text-ink-2">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Spacing, radius, elevation">
          <ul className="grid gap-3 text-[14px] text-ink-2 sm:grid-cols-2">
            <li>Spacing on a 4px grid: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 96.</li>
            <li>Page gutters: 20 phones · 32 tablet · max content width 1240 (landing), 1180 (dashboard).</li>
            <li>Radius: pill 999 · card 28 · panel 40 · inputs 14 · bubbles 18 (6 on the tail corner).</li>
            <li>Touch targets at least 40px; primary actions 48px on phones.</li>
            <li>shadow-soft for resting cards, shadow-float for anything floating (widget, sheets, menus).</li>
            <li>Glass: white 66%→34% gradient, 20px blur, 1.6 saturation, 1px white edge with an inner highlight; solid white at 86% without blur support.</li>
          </ul>
          <div className="flex flex-wrap items-end gap-4">
            <Card className="w-40 text-[13px]">shadow-soft</Card>
            <div className="glass w-40 rounded-card p-5 text-[13px] shadow-float">glass + float</div>
            <Orb className="size-28" />
          </div>
        </Section>

        <Section title="Motion">
          <p className="text-[14px] text-ink-2">Every transition finishes under 300ms. Only opacity and transform animate, so it stays smooth on low-end phones. Reduced-motion users get instant changes.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead className="text-[13px] text-muted">
                <tr>
                  <th className="pb-2 font-normal">Interaction</th>
                  <th className="pb-2 font-normal">What moves</th>
                  <th className="pb-2 font-normal">Duration</th>
                  <th className="pb-2 font-normal">Easing</th>
                </tr>
              </thead>
              <tbody>
                {MOTION.map((r) => (
                  <tr key={r[0]} className="border-t border-line">
                    {r.map((c, i) => (
                      <td key={i} className={i === 2 ? 'py-3 pr-4 font-mono text-[13px]' : 'py-3 pr-4'}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Components">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Ink</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="lime">Lime</Button>
            <Button size="sm" icon="arrow">Small</Button>
            <Chip>Chip</Chip>
            <Badge>Neutral</Badge>
            <Badge tone="lime">Lime</Badge>
            <Badge tone="ink">Ink</Badge>
            <Badge tone="danger">Sold out</Badge>
            <Toggle checked onChange={() => {}} label="Demo on" />
            <Toggle checked={false} onChange={() => {}} label="Demo off" />
            <StatusBadge status="cart" />
            <StatusBadge status="placed" />
            <StatusBadge status="shipped" />
            <StatusBadge status="delivered" />
          </div>
          <div className="grid max-w-[520px] grid-cols-2 gap-3">
            <Stat label="Chat queries" value="1,284" delta={0.18} />
            <Stat label="Orders" value="146" delta={-0.04} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <tbody>
                {COMPONENTS.map(([n, d]) => (
                  <tr key={n} className="border-t border-line">
                    <td className="py-3 pr-4 font-medium whitespace-nowrap">{n}</td>
                    <td className="py-3 text-ink-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Chat widget states">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <WidgetFrame label="1 · Closed">
              <span className="relative grid size-14 place-items-center self-end rounded-full bg-ink text-white shadow-float">
                <Icon name="chat" size={22} />
                <span className="absolute top-0.5 right-0.5 size-3.5 rounded-full border-2 border-white bg-lime-3" />
              </span>
            </WidgetFrame>
            <WidgetFrame label="2 · Nudge (after 2.5s, once)">
              <span className="glass max-w-[220px] self-end rounded-[18px] rounded-br-md px-4 py-3 text-[13px] shadow-float">Questions about sizes, delivery or an order? Ask me.</span>
              <span className="grid size-14 place-items-center self-end rounded-full bg-ink text-white shadow-float">
                <Icon name="chat" size={22} />
              </span>
            </WidgetFrame>
            <WidgetFrame label="3 · Open, greeting + suggestions">
              <Bubble m={m('assistant', 'Hi! I’m Adire Lane’s assistant. Ask me about prices, sizes, delivery or your order.')} products={products} onOpen={() => {}} />
              <div className="flex gap-2">
                <span className="h-8 rounded-pill border border-line bg-surface px-3 text-[13px] leading-8">Show me kaftans</span>
                <span className="h-8 rounded-pill border border-line bg-surface px-3 text-[13px] leading-8">Delivery?</span>
              </div>
            </WidgetFrame>
            <WidgetFrame label="4 · Typing">
              <Bubble m={m('customer', 'How much is delivery to Abuja?')} products={products} onOpen={() => {}} />
              <TypingIndicator />
            </WidgetFrame>
            <WidgetFrame label="5 · Answer with product cards">
              <Bubble m={m('assistant', 'Here’s what we have in kaftans:', { products: ['p1', 'p4'] })} products={products} onOpen={() => {}} />
            </WidgetFrame>
            <WidgetFrame label="6 · Not sent (retry)">
              <Bubble m={m('customer', 'Where is MRA-2040?')} products={products} onOpen={() => {}} />
              <span className="self-end text-xs text-danger">
                Not sent. <span className="font-medium underline">Retry</span>
              </span>
            </WidgetFrame>
            <WidgetFrame label="7 · Out of scope (grounded)">
              <Bubble m={m('assistant', 'I don’t have that in this store’s information yet. Try asking about a product, delivery, returns or an order number.')} products={products} onOpen={() => {}} />
            </WidgetFrame>
            <WidgetFrame label="8 · Signup invite (landing demo)">
              <Bubble m={m('assistant', 'That’s Mira, answering from a demo store’s own data. Want this on your website?', { link: { label: 'Start your free trial', href: '/signup' } })} products={products} onOpen={() => {}} />
            </WidgetFrame>
            <WidgetFrame label="9 · Owner stepped in">
              <Bubble m={m('owner', 'Hi Tolu, this is Ada from Adire Lane — I’ll hold the L size for you till 6pm.')} products={products} onOpen={() => {}} />
            </WidgetFrame>
          </div>
        </Section>
      </div>
    </main>
  )
}
