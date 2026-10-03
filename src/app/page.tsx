import { ChatWidget } from '@/components/chat'
import { Hero } from '@/components/hero'
import { Features, Footer, Industries, Nav, Preloader, Pricing, Steps } from '@/components/landing'

export default function Landing() {
  return (
    <>
      <Preloader />
      <div className="relative min-h-dvh overflow-x-clip bg-surface sm:m-3 sm:rounded-[32px]">
        
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
