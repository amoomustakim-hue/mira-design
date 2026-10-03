import { Suspense } from 'react'
import { SignupForm } from '@/components/auth'

export const metadata = { title: 'Start your free trial — Mira' }

export default function Signup() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
