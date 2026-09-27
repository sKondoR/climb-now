import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BACKEND_CACHE_TTL, cachedWithFallback, clearBackendCache } from './backendCache'

describe('cachedWithFallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    clearBackendCache()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('serves a fresh value without calling the loader again', async () => {
    const loader = vi.fn().mockResolvedValue('a')
    await cachedWithFallback('k', loader)
    expect(await cachedWithFallback('k', loader)).toBe('a')
    expect(loader).toHaveBeenCalledTimes(1)
  })

  it('refetches after TTL', async () => {
    const loader = vi.fn().mockResolvedValueOnce('a').mockResolvedValueOnce('b')
    await cachedWithFallback('k', loader)
    vi.advanceTimersByTime(BACKEND_CACHE_TTL)
    expect(await cachedWithFallback('k', loader)).toBe('b')
  })

  it('serves the stale value when the loader fails after TTL', async () => {
    await cachedWithFallback('k', () => Promise.resolve('a'))
    vi.advanceTimersByTime(BACKEND_CACHE_TTL * 100)
    expect(await cachedWithFallback('k', () => Promise.reject(new Error('down')))).toBe('a')
  })

  it('throws when the loader fails and nothing is cached', async () => {
    await expect(cachedWithFallback('k', () => Promise.reject(new Error('down')))).rejects.toThrow('down')
  })

  it('keeps keys separate', async () => {
    await cachedWithFallback('k1', () => Promise.resolve('a'))
    expect(await cachedWithFallback('k2', () => Promise.resolve('b'))).toBe('b')
  })
})
