import { ChatWidget } from '@/components/chat'
import { Features, Footer, Hero, Industries, Nav, Preloader, Pricing, Steps } from '@/components/landing'

export default function Landing() {
  return (
    <>
      <Preloader />
      <div className="relative min-h-dvh overflow-x-clip bg-surface sm:m-3 sm:rounded-[32px] sm:pt-3">
        {/* The inspo's faint lime contour lines */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[900px] w-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1440 900">
          <path d="M-40 260C220 180 420 420 720 300s520-40 760 60" fill="none" stroke="var(--color-lime-2)" strokeWidth="1.2" />
          <path d="M-40 640c300-90 520 120 820 20s460-180 700-60" fill="none" stroke="var(--color-line)" strokeWidth="1.2" />
        </svg>
        <Nav />
        <main className="relative">
          <Hero />
          <Industries />
          <Features />
          <Steps />
          <Pricing />
        </main>
        <Footer />
      </div>
      <ChatWidget />
    </>
  )
}
