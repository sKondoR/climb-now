import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { copyToClipboard, getShareUrl, sanitizeEventCode } from './forms.utils'


describe('sanitizeEventCode', () => {
  it('should return null when input is null', () => {
    expect(sanitizeEventCode(null)).toBeNull()
  })

  it('should return null when input is empty string', () => {
    expect(sanitizeEventCode('')).toBeNull()
  })

  it('should return the same string for valid alphanumeric characters', () => {
    expect(sanitizeEventCode('ABC123')).toBe('ABC123')
  })

  it('should allow hyphens and underscores', () => {
    expect(sanitizeEventCode('ABC-123_DEF')).toBe('ABC-123_DEF')
  })

  it('should remove invalid special characters', () => {
    expect(sanitizeEventCode('ABC@123#')).toBeNull()
  })

  it('should return null when sanitization removes all characters', () => {
    expect(sanitizeEventCode('@#$%')).toBeNull()
  })

  it('should return null when sanitized value differs from original', () => {
    expect(sanitizeEventCode('ABC!123')).toBeNull()
  })

  it('should handle mixed valid and invalid characters', () => {
    expect(sanitizeEventCode('ABC-123_!@#DEF')).toBeNull()
  })

  it('should handle strings with only valid characters', () => {
    expect(sanitizeEventCode('valid-code_123')).toBe('valid-code_123')
  })

  it('should handle very long strings', () => {
    const longString = 'a'.repeat(1000)
    expect(sanitizeEventCode(longString)).toBe(longString)
  })

  it('should handle strings with only hyphens', () => {
    expect(sanitizeEventCode('---')).toBe('---')
  })

  it('should handle strings with only underscores', () => {
    expect(sanitizeEventCode('___')).toBe('___')
  })

  it('should handle strings with mixed case', () => {
    expect(sanitizeEventCode('AbC-123_DeF')).toBe('AbC-123_DeF')
  })

  it('should handle strings with numbers only', () => {
    expect(sanitizeEventCode('123456')).toBe('123456')
  })

  it('should handle strings with whitespace', () => {
    expect(sanitizeEventCode('test code')).toBeNull()
  })
})

describe('getShareUrl', () => {
  const originalLocation = window.location

  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com?existing=param'),
      writable: true
    })
  })

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true
    })
  })

  it('should create a URL with names parameter', () => {
    const result = getShareUrl('John,Doe')
    const url = new URL(result)
    expect(url.searchParams.get('names')).toBe('John,Doe')
  })

  it('should remove existing names parameter', () => {
    // Set up URL with existing names parameter
    window.location.href = 'https://example.com?names=oldname&other=value'
    
    const result = getShareUrl('John,Doe')
    const url = new URL(result)
    expect(url.searchParams.get('names')).toBe('John,Doe')
    expect(url.searchParams.get('other')).toBe('value')
  })

  it('should preserve other URL parameters', () => {
    window.location.href = 'https://example.com?page=1&sort=asc'
    
    const result = getShareUrl('John,Doe')
    const url = new URL(result)
    expect(url.searchParams.get('page')).toBe('1')
    expect(url.searchParams.get('sort')).toBe('asc')
    expect(url.searchParams.get('names')).toBe('John,Doe')
  })

  it('should handle empty current URL parameters', () => {
    window.location.href = 'https://example.com'
    
    const result = getShareUrl('John,Doe')
    const url = new URL(result)
    expect(url.searchParams.get('names')).toBe('John,Doe')
    expect(url.searchParams.toString()).toBe('names=John%2CDoe')
  })

  it('should handle extremely long names parameter', () => {
    const longNames = 'a'.repeat(5000)
    const result = getShareUrl(longNames)
    expect(result).toContain(encodeURIComponent(longNames))
  })

  it('should handle names with URL-sensitive characters', () => {
    const testCases = [
      'John&Doe',
      'John=Doe',
      'John?Doe',
      'John#Doe',
      'John%20Doe',
      'John+Doe'
    ]

    testCases.forEach(names => {
      const result = getShareUrl(names)
      const url = new URL(result)
      expect(url.searchParams.get('names')).toBe(names)
    })
  })

  it('should handle empty string as names parameter', () => {
    const result = getShareUrl('')
    const url = new URL(result)
    expect(url.searchParams.get('names')).toBe('')
  })
})

describe('copyToClipboard', () => {
  it('should call clipboard writeText with provided text', async () => {
    // Mock clipboard API
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    })

    const text = 'test text'
    copyToClipboard(text)

    expect(writeTextMock).toHaveBeenCalledWith(text)
    expect(writeTextMock).toHaveBeenCalledTimes(1)
  })

  it.skip('should handle clipboard API errors', async () => {
    // Mock clipboard API to throw error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard error'))
    
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    })

    const text = 'test text'
    
    // The function doesn't handle errors, so it should throw
    await expect(copyToClipboard(text)).rejects.toThrow('Clipboard error')
    
    consoleSpy.mockRestore()
  })

  it('should work with empty string', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    })

    copyToClipboard('')
    expect(writeTextMock).toHaveBeenCalledWith('')
  })
})