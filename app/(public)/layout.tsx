import type React from 'react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar logo="John Portfolio" />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
