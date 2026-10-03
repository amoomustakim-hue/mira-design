'use client'

import { useMemo, useState } from 'react'
import { PageHead, Sheet, Skeleton, useLoad } from '@/components/dash'
import { Icon } from '@/components/icons'
import { Field } from '@/components/landing'
import { Badge, Button, Card, ProductImage, Toggle } from '@/components/ui'
import { createProduct, getProducts, updateProduct } from '@/lib/api'
import { cx, naira } from '@/lib/format'
import type { Product } from '@/lib/types'

export default function CatalogPage() {
  const [products, setProducts, loading] = useLoad<Product[]>(getProducts, [])
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const [adding, setAdding] = useState(false)

  const cats = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products])
  const shown = products.filter((p) => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(query.toLowerCase()))

  const patch = async (id: string, change: Partial<Product>) => {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...change } : p))) // optimistic
    await updateProduct(id, change)
  }

  return (
    <>
      <PageHead
        title="Catalog"
        sub={`${products.length} products · the assistant only offers what’s available.`}
        action={
          <Button icon="plus" onClick={() => setAdding(true)}>
            Add product
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="glass flex h-11 items-center gap-2 rounded-pill px-4 sm:w-[280px]">
          <Icon name="search" size={16} className="text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted" aria-label="Search products" />
        </label>
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cx('h-9 shrink-0 rounded-pill px-4 text-[13px] transition-colors duration-[var(--duration-fast)]', c === cat ? 'bg-ink text-white' : 'bg-white/70 text-ink-2 hover:bg-white')}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <Card className="py-16 text-center text-[14px] text-muted">No products match “{query}”.</Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {shown.map((p) => {
            const out = !p.available || p.stock === 0
            return (
              <Card key={p.id} className={cx('flex flex-col gap-0 overflow-hidden p-0 transition-opacity duration-200', !p.available && 'opacity-60')}>
                <div className="relative">
                  <ProductImage name={p.name} image={p.image} tint={p.tint} className="aspect-[4/3] w-full" />
                  <span className="absolute top-3 left-3">
                    {out ? <Badge tone="danger">{p.stock === 0 ? 'Sold out' : 'Hidden'}</Badge> : p.stock <= 5 ? <Badge tone="lime">Low stock</Badge> : null}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <p className="text-xs text-muted">{p.category}</p>
                    <p className="mt-0.5 line-clamp-2 text-[14px] leading-snug font-medium">{p.name}</p>
                  </div>
                  <p className="text-[17px] tabular-nums">{naira(p.price)}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/70 pt-3">
                    <span className="flex items-center gap-1">
                      <button type="button" className="grid size-7 place-items-center rounded-full bg-mist text-sm transition-colors hover:bg-line" onClick={() => patch(p.id, { stock: Math.max(0, p.stock - 1) })} aria-label={`One less ${p.name}`}>
                        −
                      </button>
                      <span className="w-8 text-center text-[13px] tabular-nums" aria-label="Stock">
                        {p.stock}
                      </span>
                      <button type="button" className="grid size-7 place-items-center rounded-full bg-mist text-sm transition-colors hover:bg-line" onClick={() => patch(p.id, { stock: p.stock + 1 })} aria-label={`One more ${p.name}`}>
                        +
                      </button>
                    </span>
                    <Toggle checked={p.available} onChange={(v) => patch(p.id, { available: v })} label={`${p.name} available`} />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {adding && (
        <Sheet title="Add product" onClose={() => setAdding(false)}>
          <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              const created = await createProduct({
                name: String(f.get('name') || 'New product'),
                category: String(f.get('category') || 'Other'),
                price: Number(f.get('price') || 0),
                stock: Number(f.get('stock') || 0),
                available: true,
                tint: 'lime',
              })
              setProducts((ps) => [created, ...ps])
              setAdding(false)
            }}
          >
            <Field name="name" label="Name" />
            <div className="grid grid-cols-2 gap-3">
              <Field name="price" type="number" label="Price (₦)" />
              <Field name="stock" type="number" label="Stock" />
            </div>
            <Field name="category" label="Category" />
            <div className="grid h-28 place-items-center rounded-[18px] border border-dashed border-ink/20 text-[13px] text-muted">Drop a photo here or tap to upload</div>
            <Button type="submit" size="lg" className="mt-1">
              Add to catalog
            </Button>
          </form>
        </Sheet>
      )}
    </>
  )
}
