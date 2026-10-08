import Footer from '@/components/layout/Footer'
import PageContent from '@/src/components/PageContent'
import Header from '@/src/components/layout/Header'
import YandexRtb from '@/src/shared/components/YandexRtb/YandexRtb'

// Реклама РСЯ временно отключена
const SHOW_ADS = false

export default function HomePage() {
  return (
    // relative: абсолютные элементы внутри (sr-only подписи, иконки) позиционируются от прокручиваемого блока, а не от документа — иначе они растягивали body и появлялась вторая полоса прокрутки
    <div id="page-scroll" className="relative flex flex-col h-screen supports-[height:100dvh]:h-dvh bg-gray-50 overflow-auto">
      <Header />  
      <main className="w-full flex-1 mx-auto px-3 sm:px-6 lg:px-8 pt-2 flex flex-col">
        {/* Заголовок страницы для экранного чтеца: логотип живёт в сворачиваемой (inert) части шапки */}
        <h1 className="sr-only">ClimbNow — результаты соревнований ФСР онлайн</h1>
        <PageContent footer={<>{SHOW_ADS && <YandexRtb blockId="R-A-20201132-1" />}<Footer /></>} />
      </main>
    </div>
  )
}