import type HawkCatcher from '@hawk.so/browser'

// Промис, а не экземпляр: ошибки, пойманные до загрузки SDK, дождутся его, а повторный вызов в StrictMode не создаст второй экземпляр
let hawk: Promise<HawkCatcher> | undefined

export function initHawk(token: string, release?: string) {
  hawk ??= import('@hawk.so/browser').then(({ default: Catcher }) => new Catcher({ token, release }))
}

export function sendToHawk(error: Error) {
  void hawk?.then((catcher) => catcher.send(error))
}
