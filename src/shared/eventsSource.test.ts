import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'

import { clearLinkOverrides, getEvents, patchEventLink } from './eventsSource'
import { clearBackendCache } from './backendCache'
import { clearUpstreamCache } from './upstreamCache'
import { mockEventsHtml } from './parser/mocks/mockEventsHtml'
import { mockHtmlWith404 } from './parser/mocks/mockHtml'

vi.mock('axios')

const competitionHtml = '<html><body><h1>Соревнование</h1><table><tr><td></td></tr></table></body></html>'

const mockSites = (competitions: Record<string, string>) => {
  vi.mocked(axios.get).mockImplementation(async (url: string) => {
    if (url.startsWith('https://www.rusclimbing.ru/')) return { data: mockEventsHtml }
    const code = url.match(/live\/([^/]+)\//)?.[1] ?? ''
    if (code in competitions) return { data: competitions[code] }
    throw new Error('404')
  })
}

const getEventId = async (link: string) => (await getEvents()).find(event => event.link === link)!.id

describe('eventsSource', () => {
  beforeEach(() => {
    mockSites({ '2501vrn_vs': competitionHtml, '2501vrn_ch': mockHtmlWith404 })
  })

  afterEach(() => {
    clearBackendCache()
    clearUpstreamCache()
    clearLinkOverrides()
    vi.resetAllMocks()
  })

  describe('getEvents', () => {
    it('returns events sorted by link with stable ids', async () => {
      const events = await getEvents()
      expect(events.map(event => event.link)).toStrictEqual(['2501vrn', '2511kem_perv'])

      clearBackendCache()
      const reloaded = await getEvents()
      expect(reloaded.map(event => event.id)).toStrictEqual(events.map(event => event.id))
    })

    it('filters by start and end dates', async () => {
      expect((await getEvents('2025-02-01', null)).map(event => event.link)).toStrictEqual(['2511kem_perv'])
      expect((await getEvents(null, '2025-11-30')).map(event => event.link)).toStrictEqual(['2501vrn'])
    })
  })

  describe('patchEventLink', () => {
    it('stores a suffixed link that exists on c-f-r.ru', async () => {
      const id = await getEventId('2501vrn')
      expect((await patchEventLink(id, '2501vrn_vs'))?.link).toBe('2501vrn_vs')

      const event = (await getEvents()).find(item => item.id === id)
      expect(event?.link).toBe('2501vrn_vs')
    })

    it('keeps the id after patching, so the link can be patched again', async () => {
      const id = await getEventId('2501vrn')
      await patchEventLink(id, '2501vrn_vs')
      expect((await getEvents()).some(event => event.id === id)).toBe(true)
    })

    it('rejects links that are not a suffix variant of the original', async () => {
      const id = await getEventId('2501vrn')
      await expect(patchEventLink(id, '2511kem_perv')).rejects.toMatchObject({ statusCode: 400 })
      await expect(patchEventLink(id, '2501vrn_evil')).rejects.toMatchObject({ statusCode: 400 })
    })

    it('rejects a link whose c-f-r.ru page is a 404 page', async () => {
      const id = await getEventId('2501vrn')
      await expect(patchEventLink(id, '2501vrn_ch')).rejects.toMatchObject({ statusCode: 400 })
      expect((await getEvents()).find(event => event.id === id)?.link).toBe('2501vrn')
    })

    it('does not store the link when c-f-r.ru request fails', async () => {
      const id = await getEventId('2501vrn')
      await expect(patchEventLink(id, '2501vrn_perv')).rejects.toThrow()
      expect((await getEvents()).find(event => event.id === id)?.link).toBe('2501vrn')
    })

    it('returns null for an unknown id', async () => {
      expect(await patchEventLink(1, '2501vrn_vs')).toBeNull()
    })
  })
})
