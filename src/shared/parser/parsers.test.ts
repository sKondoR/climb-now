import { describe, it, expect } from 'vitest'

import { parseResults, parseResultsTable,
  parseLeadQual,
  parseLeadQualResults,
  parseLeadFinal,
  parseBoulderQual,
  parseBoulderFinal,
  parseRouteCell,
  parseFragment,
  getTextContent,
  hasClass,
  getDisciplines,
  findElementsByTag
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
          isHighlighted: true,
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
          isHighlighted: true,
          name: 'Доброва Ксения',
          qRank: '3',
          rank: '1',
          score: '29+',
          stRank: '8',
        },
        {
          command: 'СПБ',
          isHighlighted: true,
          name: 'Зырянова Станислава',
          qRank: '6',
          rank: '2',
          score: '29+',
          stRank: '5',
        },
        {
          command: 'МСК',
          isHighlighted: true,
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
          isHighlighted: true,
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
          isHighlighted: true,
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
          isHighlighted: true,
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
          isHighlighted: true,
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
          isHighlighted: true,
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
          isHighlighted: true,
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
      const html = '<div class="r_2">1<br>2</div>'
      const fragment = parseFragment(html)
      const result = parseRouteCell(fragment) 
      expect(result).toBe('1/2')
    })

    it('should parse route cell with r_1 class', () => {
      const html = '<div class="r_1"><br>1</div>'
      const fragment = parseFragment(html)
      const result = parseRouteCell(fragment)
      expect(result).toBe(' /1')
    })

    it('should parse route cell with r_0 class', () => {
      const html = '<div class="r_0"><br></div>'
      const fragment = parseFragment(html)
      const result = parseRouteCell(fragment)
      expect(result).toBe(' / ')
    })

    it('should handle empty or null input', () => {
      expect(parseRouteCell(null)).toBe('')
      expect(parseRouteCell(undefined)).toBe('')
    })

    it('should handle complex route cell structure', () => {
      const html = '<div class="r_2">2<br>2</div>'
      const fragment = parseFragment(html)
      const result = parseRouteCell(fragment)
      expect(result).toBe('2/2')
    })
  })

  describe('getTextContent', () => {
    it('should extract text content from element', () => {
      const html = '<div>Test Content</div>'
      const fragment = parseFragment(html)
      const result = getTextContent(fragment)
      expect(result).toBe('Test Content')
    })

    it('should extract text content from nested elements', () => {
      const html = '<div><span>Hello</span> <b>World</b></div>'
      const fragment = parseFragment(html)
      const result = getTextContent(fragment)
      expect(result).toBe('Hello World')
    })

    it('should handle empty element', () => {
      const html = '<div></div>'
      const fragment = parseFragment(html)
      const result = getTextContent(fragment)
      expect(result).toBe('')
    })

    it('should handle null input', () => {
      expect(getTextContent(null)).toBe('')
    })

    it('should handle undefined input', () => {
      expect(getTextContent(undefined)).toBe('')
    })

    it('should handle text-only node', () => {
      const html = 'Just text'
      const result = getTextContent(parseFragment(html))
      expect(result).toBe('Just text')
    })
  })

  describe('hasClass', () => {
    it('should return true when class exists', () => {
      const html = '<div class="test-class">Content</div>'
      const element =  findElementsByTag(parseFragment(html), 'div')[0]
      const result = hasClass(element, 'test-class')
      expect(result).toBe(true)
    })

    it('should return false when class does not exist', () => {
      const html = '<div class="other-class">Content</div>'
      const element =  findElementsByTag(parseFragment(html), 'div')[0]
      const result = hasClass(element, 'missing-class')
      expect(result).toBe(false)
    })

    it('should return false for null input', () => {
      expect(hasClass(null, 'test-class')).toBe(false)
    })

    it('should return false for undefined input', () => {
      expect(hasClass(undefined, 'test-class')).toBe(false)
    })

    it('should return false when node has no attrs', () => {
      const html = '<div>Content</div>'
      const element =  findElementsByTag(parseFragment(html), 'div')[0]
      const result = hasClass(element, 'test-class')
      expect(result).toBe(false)
    })

    it('should handle multiple classes', () => {
      const html = '<div class="class1 class2 class3">Content</div>'
      const element =  findElementsByTag(parseFragment(html), 'div')[0]
      expect(hasClass(element, 'class1')).toBe(true)
      expect(hasClass(element, 'class2')).toBe(true)
      expect(hasClass(element, 'class3')).toBe(true)
      expect(hasClass(element, 'class4')).toBe(false)
    })

    it('should handle class with hyphen', () => {
      const html = '<div class="my-class">Content</div>'
      const element =  findElementsByTag(parseFragment(html), 'div')[0]
      const result = hasClass(element, 'my-class')
      expect(result).toBe(true)
    })
  })

  describe('getDisciplines', () => {
    it('should extract disciplines from table headers', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Трудность</th>
              <th>Боулдеринг</th>
              <th>Скорость</th>
            </tr>
          </thead>
        </table>
      `
      const fragment = parseFragment(html)
      const result = getDisciplines(fragment)
      expect(result).toHaveLength(3)
      expect(result[0]).toBe('трудность')
      expect(result[1]).toBe('боулдеринг')
      expect(result[2]).toBe('скорость')
    })

    it('should return empty array when no disciplines found', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Other Header</th>
            </tr>
          </thead>
        </table>
      `
      const fragment = parseFragment(html)
      const result = getDisciplines(fragment)
      expect(result).toHaveLength(1)
      expect(result[0]).toBe('other header')
    })

    it('should handle case-insensitive matching', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>ТРУДНОСТЬ</th>
              <th>БОУЛДЕРИНГ</th>
            </tr>
          </thead>
        </table>
      `
      const fragment = parseFragment(html)
      const result = getDisciplines(fragment)
      expect(result).toHaveLength(2)
      expect(result[0]).toBe('трудность')
      expect(result[1]).toBe('боулдеринг')
    })

    it('should return lowercase text when no discipline found', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Some Discipline Name</th>
            </tr>
          </thead>
        </table>
      `
      const fragment = parseFragment(html)
      const result = getDisciplines(fragment)
      expect(result[0]).toBe('some discipline name')
    })

    it('should handle multiple discipline headers', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Трудность</th>
              <th>Боулдеринг</th>
              <th>Абсолют</th>
            </tr>
          </thead>
        </table>
      `
      const fragment = parseFragment(html)
      const result = getDisciplines(fragment)
      expect(result).toHaveLength(3)
      expect(result).toContain('трудность')
      expect(result).toContain('боулдеринг')
      expect(result).toContain('абсолют')
    })

    it('should handle empty document', () => {
      const html = ''
      const fragment = parseFragment(html)
      const result = getDisciplines(fragment)
      expect(result).toHaveLength(0)
    })
  })
})