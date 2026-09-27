import { Inter } from 'next/font/google'

import { RootStoreProvider } from '@/src/store/RootStoreProvider'
import QueryClientProviderWrapper from '@/src/shared/query/QueryClientProvider'
import '@/src/app/globals.css'

import YandexMetrika from '@/src/shared/components/YandexMetrika/YandexMetrika'

const inter = Inter({ 
  // Интерфейс на русском: без cyrillic буквы рендерятся фолбэком. Вариативный файл без weight — все начертания (500/600/700) настоящие, не синтезированные
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

export const metadata = {
  title: 'ClimbNow - Соревнования ФСР онлайн',
  description: 'Веб-приложение для отображения соревнований с сайта Федерации Скалолазания России https://c-f-r.ru. Приложение позволяет пользователям одновременно просматривать таблицы результатов по различным дисциплинам, фильтровать и подсвечивать скалолазов своей команды.',
}

// Цвет панели браузера на телефоне совпадает с белой шапкой
export const viewport = {
  themeColor: '#ffffff',
}

export const dynamic = 'force-dynamic';
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '';
  return (
    <html lang="ru">
      <head>
      </head>
      <body className={inter.className}>
        <QueryClientProviderWrapper>
          <RootStoreProvider>
            {children}
          </RootStoreProvider>
        </QueryClientProviderWrapper>
        {YANDEX_METRIKA_ID && (<>
          <YandexMetrika counterId={YANDEX_METRIKA_ID} />
        </>)}
      </body>
    </html>
  )
}