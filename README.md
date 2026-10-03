# Mira — design front-end

A clickable, deployable design for **Mira**, the AI customer-service SaaS:
the landing page with a live demo chat, a simple login, the business dashboard
and the chat widget. It runs entirely on sample data so it can be reviewed
before it is connected to the real backend.

**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS. No other UI
frameworks, chart or icon libraries.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Deploy: import the repo in Vercel. There are no environment variables.

## What's in it

| Route | Screen |
| --- | --- |
| `/` | Landing: centred hero over drifting colour fields, the live demo chat inside a phone mockup that stands up as you scroll, floating glass cards, industries, features, pricing (₦50,000/month + free trial), contact and signup footer, floating chat widget |
| `/login`, `/signup` | **No real authentication** — any details open the dashboard |
| `/dashboard` | Overview: queries, orders, revenue, answered rate, daily chart, top products, latest orders |
| `/dashboard/chat` | Inbox and threads; the owner can step in, AI replies toggle per chat |
| `/dashboard/analytics` | Insights: recurring complaints, most-asked questions, hot vs least-demanded products |
| `/dashboard/catalog` | Product cards with price, stock stepper and availability toggle; add product |
| `/dashboard/orders` | Status pipeline cart → placed → shipped → delivered; order drawer to move an order on |
| `/dashboard/faqs`, `policies`, `hours`, `promotions`, `settings` | Editable business data; widget colour, greeting and embed code with a live preview |
| `/design` | Design notes: colours, type, spacing, motion specs, component list and every chat-widget state |

On phones the dashboard uses a bottom tab bar with Overview, Chat, Catalog and
Orders one tap away, and everything else under More.

## Connecting the backend

All screens read and write through **one file: `src/lib/api.ts`**. Each
function is commented with a suggested endpoint (for example
`PATCH /api/orders/:id`). Replace the bodies with `fetch` calls and the screens
keep working, as long as responses match the types in `src/lib/types.ts`.

- `sendChat(message, history)` is the visitor-facing assistant. In this design
  it is faked by a keyword matcher (`src/lib/assistant.ts`) so the widget can be
  tried; the real endpoint should answer only from the business's own data.
- `enter()` in `src/components/auth.tsx` is where real login/signup goes.
- `src/lib/mock.ts` is the sample business (Adire Lane, a fictional Lagos
  fashion store). Delete it once everything comes from the API.
- Product images: send an `image` URL per product; without one the UI draws a
  soft placeholder.

## Theming

Every colour, radius, shadow and animation timing is a token at the top of
`src/app/globals.css`. Change them there and the landing page, dashboard and
widget all follow. Palette, type, spacing and motion rules are documented at
`/design`.

## Notes

- All numbers, customers, orders and stats are sample data. Marketing copy and
  figures (e.g. "96% answered without a human") are placeholders to be replaced
  with real ones.
- Transitions run 160–280ms and animate only opacity and transform; glass falls
  back to solid white where `backdrop-filter` isn't supported; reduced-motion
  is respected.
