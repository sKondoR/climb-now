import Footer from '@/components/layout/Footer'
import PageContent from '@/src/components/PageContent'
import Header from '@/src/components/layout/Header'

export default function HomePage() {
  return (
    <div id="page-scroll" className="flex flex-col h-screen min-h-screen bg-gray-50 overflow-auto">
      <Header />  
      <main className="w-full flex-1 mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 md:py-8 relative">
        <PageContent />
        <Footer />
      </main>
    </div>
  )
}