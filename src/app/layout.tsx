import { Inter } from 'next/font/google'

import { RootStoreProvider } from '@/src/store/RootStoreProvider'
import QueryClientProviderWrapper from '@/src/shared/query/QueryClientProvider'
import '@/src/app/globals.css'

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      </body>
    </html>
  )
}