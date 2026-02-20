import PageContent from '@/components/PageContent'
import Header from '@/components/layout/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />  
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageContent />
      </main>
    </div>
  )
}