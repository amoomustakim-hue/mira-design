'use client'

import { useState } from 'react'
import { PageHead, Saved, Skeleton, useLoad } from '@/components/dash'
import { Button, Card } from '@/components/ui'
import { getPolicies, savePolicies } from '@/lib/api'
import type { Policy } from '@/lib/types'

export default function PoliciesPage() {
  const [policies, setPolicies, loading] = useLoad<Policy[]>(getPolicies, [])
  const [saved, setSaved] = useState(false)

  return (
    <>
      <PageHead
        title="Policies"
        sub="Returns, delivery and privacy. The assistant quotes these when customers ask."
        action={
          <div className="flex items-center gap-3">
            <Saved show={saved} />
            <Button
              onClick={async () => {
                await savePolicies(policies)
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
        <Skeleton className="h-[420px]" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {policies.map((p) => (
            <Card key={p.id} className="flex flex-col gap-3 p-6">
              <p className="text-[15px] font-medium">{p.title}</p>
              <textarea
                value={p.body}
                onChange={(e) => setPolicies((ps) => ps.map((x) => (x.id === p.id ? { ...x, body: e.target.value } : x)))}
                rows={5}
                className="resize-none rounded-[16px] bg-mist px-4 py-3 text-[14px] leading-relaxed outline-none focus:bg-line/60"
                aria-label={p.title}
              />
              <p className="text-xs text-muted">{p.body.length} characters</p>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
