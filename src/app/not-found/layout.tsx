import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
})

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
