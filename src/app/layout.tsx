import { Inter } from 'next/font/google'

import { RootStoreProvider } from '@/src/store/RootStoreProvider'
import QueryClientProviderWrapper from '@/src/shared/query/QueryClientProvider'
import '@/src/app/globals.css'

import YandexMetrika from '@/src/shared/components/YandexMetrika/YandexMetrika'
import { YandexMetrikaTracker } from '@/src/shared/components/YandexMetrika/YandexMetrikaTracker'

const inter = Inter({ 
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

export const metadata = {
  title: 'ClimbNow - Соревнования ФСР онлайн',
  description: 'Веб-приложение для отображения соревнований с сайта Федерации Скалолазания России https://c-f-r.ru. Приложение позволяет пользователям одновременно просматривать таблицы результатов по различным дисциплинам, фильтровать и подсвечивать скалолазов своей команды.',
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
          <YandexMetrikaTracker />
          <YandexMetrika counterId={YANDEX_METRIKA_ID} />
        </>)}
      </body>
    </html>
  )
}