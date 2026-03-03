import { Inter } from 'next/font/google';
import './globals.css';
import { RootStoreProvider } from '@/lib/store/RootStoreProvider';
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
          <RootStoreProvider>
            {children}
          </RootStoreProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  )
}