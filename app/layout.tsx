import { Inter } from 'next/font/google';
import './globals.css';
import { UrlAwareMobxStoreProvider } from '@/lib/store/UrlAwareMobxStoreProvider';
import QueryClientProviderWrapper from '@/lib/query/QueryClientProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ClimbNow - Соревнования ФСР онлайн',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <QueryClientProviderWrapper>
          <UrlAwareMobxStoreProvider>
            {children}
          </UrlAwareMobxStoreProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  )
}