import { DashboardShell } from '@/components/dash'

export const metadata = { title: 'Dashboard — Mira' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
