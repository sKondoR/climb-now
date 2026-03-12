import { describe, it, expect } from 'vitest'

import { parseResults, parseResultsTable,
  parseLeadQual, 
  parseLeadQualResults,
  parseLeadFinal,
  parseBoulderQual,
  parseBoulderFinal,
  parseRouteCell,
  parseFragment
} from './parsers'
import {
  mockHtmlWith404,
  mockParsedLeadQual,
  mockParsedLeadQualResults,
  mockParsedLeadFinal,
  mockParsedBoulderQual,
  mockParsedBoulderFinal,
} from './mocks/mockHtml'

describe('parsers', () => {
  describe('parseResults', () => {
    it('should return null for 404 page', () => {
      const result = parseResults(mockHtmlWith404)
      expect(result).toBeNull()
    })
    it('should handle empty HTML gracefully', () => {
      const result = parseResults('')
      expect(result).toStrictEqual([])
    })
  })

  describe('parseResultsTable', () => {
    it('should detect lead qualification results', () => {
      const result = parseResultsTable(`
        <!DOCTYPE html>
        <html>
        <head><title>Сводный результат трудность</title></head>
        <body>
          <h1>Сводный результат трудность</h1>
        </body>
        </html>
      `)
      expect(result.isLead).toBe(true)
      expect(result.isQualResult).toBe(true)
      expect(result.isFinal).toBe(false)
    })

    it('should detect lead qualification', () => {
      const result = parseResultsTable(`
        <!DOCTYPE html>
        <html>
        <head><title>Результаты трудность</title></head>
        <body>
          <h1>Результаты трудность</h1>
        </body>
        </html>
      `)
      expect(result.isLead).toBe(true)
      expect(result.isQualResult).toBe(false)
      expect(result.isFinal).toBe(false)
    })

    it('should detect boulder qualification', () => {
      const result = parseResultsTable(`
        <!DOCTYPE html>
        <html>
        <head><title>Результаты боулдеринг</title></head>
        <body>
          <h1>Результаты боулдеринг</h1>
        </body>
        </html>
      `)
      expect(result.isBoulder).toBe(true)
      expect(result.isFinal).toBe(false)
    })

    it('should detect boulder final', () => {
      const result = parseResultsTable(`
        <!DOCTYPE html>
        <html>
        <head><title>Финал боулдеринг</title></head>
        <body>
          <h1>Финал боулдеринг</h1>
        </body>
        </html>
      `)
      expect(result.isBoulder).toBe(true)
      expect(result.isFinal).toBe(true)
    })

    it('should handle empty HTML gracefully', () => {
      const result = parseResultsTable('')
      expect(result.isLead).toBe(false)
      expect(result.isBoulder).toBe(false)
      expect(result.isQualResult).toBe(false)
      expect(result.isFinal).toBe(false)
    })
  })

  describe('parseLeadQual', () => {
    it('should parse lead qualification table', () => {
      const result = parseLeadQual(mockParsedLeadQual)
      expect(result).toStrictEqual([
        {
          command: 'КЛНД',
          name: 'Татищева Ксения',
          rank: '1',
          score: '31+',
          stRank: '19',
        },
        {
          command: 'СПБ',
          name: 'Зырянова Станислава',
          rank: '2',
          score: '30+',
          stRank: '18',
        },
        {
          command: 'МСК',
          name: 'Евдокимова Елена',
          rank: '2',
          score: '30+',
          stRank: '53',
        },
      ])
    })
  })

  describe('parseLeadQualResults', () => {
    it('should parse lead qualification results table', () => {
      const result = parseLeadQualResults(mockParsedLeadQualResults)
      expect(result).toStrictEqual([
        {
          command: 'КЛНД',
          mark: '2,24',
          mark1: '1',
          mark2: '5',
          name: 'Татищева Ксения',
          rank: '1',
          score1: '31+',
          score2: '27+',
        },
        {
          command: 'МСК',
          mark: '2,24',
          mark1: '2,5',
          mark2: '2',
          name: 'Евдокимова Елена',
          rank: '1',
          score1: '30+',
          score2: '31+',
        },
        {
          command: 'ВРНЖ',
          mark: '2,65',
          mark1: '7',
          mark2: '1',
          name: 'Доброва Ксения',
          rank: '3',
          score1: '25+',
          score2: '34',
        },
      ])
    })
  })

  describe('parseLeadFinal', () => {
    it('should parse lead final table', () => {
      const result = parseLeadFinal(mockParsedLeadFinal)
      expect(result).toStrictEqual([
        {
          command: 'ВРНЖ',
          name: 'Доброва Ксения',
          qRank: '3',
          rank: '1',
          score: '29+',
          stRank: '8',
        },
        {
          command: 'СПБ',
          name: 'Зырянова Станислава',
          qRank: '6',
          rank: '2',
          score: '29+',
          stRank: '5',
        },
        {
          command: 'МСК',
          name: 'Евдокимова Елена',
          qRank: '1',
          rank: '3',
          score: '28+',
          stRank: '10',
        },
      ])
    })
  })

  describe('parseBoulderQual', () => {
    it('should parse boulder qualification table', () => {
      const result = parseBoulderQual(mockParsedBoulderQual)
      expect(result).toStrictEqual([
        {
          command: 'КЛНД',
          name: 'Боровков Арсений',
          r1: '2/2',
          r2: '2/2',
          r3: ' /1',
          r4: '1/1',
          r5: '1/1',
          rank: '1',
          score: '109,8',
          stRank: '1',
        },
        {
          command: 'СВРД',
          name: 'Шулев Гавриил',
          r1: '1/1',
          r2: ' / ',
          r3: '1/1',
          r4: '1/1',
          r5: '6/6',
          rank: '2',
          score: '99,5',
          stRank: '2',
        },
        {
          command: 'ТЮМН',
          name: 'Асташкин Елисей',
          r1: '2/1',
          r2: '6/3',
          r3: ' /2',
          r4: '1/1',
          r5: ' /1',
          rank: '3',
          score: '94,3',
          stRank: '18',
        },
      ])
    })
  })

  describe('parseBoulderFinal', () => {
    it('should parse boulder final table', () => {
      const result = parseBoulderFinal(mockParsedBoulderFinal)
      expect(result).toStrictEqual([
{
          command: 'ЛЕНГ',
          name: 'Нагорничных Яромир',
          qRank: '4',
          r1: '4/4',
          r2: ' /2',
          r3: ' /1',
          r4: ' /1',
          rank: '1',
          score: '54,6',
          stRank: '9',
        },
        {
          command: 'КЛНД',
          name: 'Боровков Арсений',
          qRank: '1',
          r1: ' / ',
          r2: ' /7',
          r3: '4/1',
          r4: ' /1',
          rank: '2',
          score: '44,1',
          stRank: '12',
        },
        {
          command: 'ЛЕНГ',
          name: 'Ганичев Максим',
          qRank: '12',
          r1: ' / ',
          r2: ' /8',
          r3: ' /1',
          r4: ' /1',
          rank: '3',
          score: '29,3',
          stRank: '1',
        },
      ])
    })
  })

  describe('parseRouteCell', () => {
    it('should parse route cell with r_2 class', () => {
      // Используем parseFragment для создания реального элемента
      const html = '<div class="r_2">1<br>2</div>';
      const fragment = parseFragment(html);
      const result = parseRouteCell(fragment); 
      expect(result).toBe('1/2');
    })

    it('should parse route cell with r_1 class', () => {
      const html = '<div class="r_1"><br>1</div>';
      const fragment = parseFragment(html);
      const result = parseRouteCell(fragment);
      expect(result).toBe(' /1');
    })

    it('should parse route cell with r_0 class', () => {
      const html = '<div class="r_0"><br></div>';
      const fragment = parseFragment(html);
      const result = parseRouteCell(fragment);
      expect(result).toBe(' / ');
    })

    it('should handle empty or null input', () => {
      expect(parseRouteCell(null)).toBe('');
      expect(parseRouteCell(undefined)).toBe('');
    })

    it('should handle complex route cell structure', () => {
      const html = '<div class="r_2">2<br>2</div>';
      const fragment = parseFragment(html);
      const result = parseRouteCell(fragment);
      expect(result).toBe('2/2');
    })
  })
})