import { Inter } from 'next/font/google';
import './globals.css';
import { MobxStoreProvider } from '@/lib/store/MobxStoreProvider';

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
        <MobxStoreProvider>
          {children}
        </MobxStoreProvider>
      </body>
    </html>
  )
}