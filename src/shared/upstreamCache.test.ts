import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cached, clearUpstreamCache, UPSTREAM_CACHE_TTL } from './upstreamCache'

describe('upstreamCache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearUpstreamCache()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shares one upstream request between concurrent callers', async () => {
    const loader = vi.fn().mockResolvedValue('data')
    const results = await Promise.all([cached('a', loader), cached('a', loader), cached('a', loader)])
    expect(results).toEqual(['data', 'data', 'data'])
    expect(loader).toHaveBeenCalledTimes(1)
  })

  it('serves the cached value within TTL and refetches after it', async () => {
    const loader = vi.fn().mockResolvedValueOnce('old').mockResolvedValueOnce('new')
    expect(await cached('a', loader)).toBe('old')

    vi.advanceTimersByTime(UPSTREAM_CACHE_TTL - 1)
    expect(await cached('a', loader)).toBe('old')

    vi.advanceTimersByTime(1)
    expect(await cached('a', loader)).toBe('new')
    expect(loader).toHaveBeenCalledTimes(2)
  })

  it('does not cache failures', async () => {
    const loader = vi.fn().mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce('data')
    await expect(cached('a', loader)).rejects.toThrow('down')
    expect(await cached('a', loader)).toBe('data')
  })

  it('keeps keys independent', async () => {
    const loader = vi.fn((value: string) => Promise.resolve(value))
    expect(await cached('a', () => loader('a'))).toBe('a')
    expect(await cached('b', () => loader('b'))).toBe('b')
    expect(loader).toHaveBeenCalledTimes(2)
  })
})
