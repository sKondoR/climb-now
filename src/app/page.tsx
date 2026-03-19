import PageContent from '@/src/components/PageContent'
import Header from '@/src/components/layout/Header'

export default function HomePage() {
  return (
    <div id="page-scroll" className="h-screen min-h-screen bg-gray-50 overflow-auto">
      <Header />  
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-8">
        <PageContent />
      </main>
    </div>
  )
}