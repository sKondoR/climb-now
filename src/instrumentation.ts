import type { Instrumentation } from 'next'

// Ошибки рендера, API-роутов и proxy, которые поймал сам Next.js
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const { sendToHawk } = await import('@/src/shared/hawk.server')
  sendToHawk(error, {
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
  })
}
