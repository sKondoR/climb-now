import { JSDOM } from 'jsdom';
import { ApiResponse, Group, Qualification, Result } from '@/types/api'

export const parseResults = (html: string, urlCode: string): ApiResponse | null => {
  try {
    const dom = new JSDOM(html)
    const doc = dom.window.document
    
    // Парсинг групп
    const groupElements = doc.querySelectorAll('.g_title') as NodeListOf<HTMLElement>
    const groups: Group[] = []
    
    groupElements.forEach((groupEl, index) => {
      const title = groupEl.textContent?.trim() || `Группа ${index + 1}`
      
      // Парсинг ссылок на квалификации
      const links = groupEl.nextElementSibling?.querySelectorAll('.p_l a') as NodeListOf<HTMLElement> || []
      const qualification1 = parseQualification(links[0], 'Квалификация 1')
      const qualification2 = parseQualification(links[1], 'Квалификация 2')
      const final = parseQualification(links[2], 'Квалификация сводный')
      
      groups.push({
        id: `group-${index}`,
        title,
        link: links[0]?.getAttribute('href') || '',
        isOnline: groupEl.classList.contains('l_run'),
        qualification1,
        qualification2,
        final
      })
    })
    
    return {
      groups,
      url: urlCode,
      city: ''
    }
    
  } catch (error) {
    console.error('Error parsing HTML:', error)
    return null
  }
}

const parseQualification = (link: Element | null, title: string): Qualification => {
  if (!link) {
    return {
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      results: []
    }
  }
  
  const href = link.getAttribute('href') || ''
  const results: Result[] = []
  
  // Заглушка для парсинга результатов
  // В реальности здесь будет логика парсинга таблицы результатов
  // Например, fetch(`https://c-f-r.ru/live/${urlCode}/${href}`)
  
  return {
    id: href.replace(/\.html$/, ''),
    title,
    results
  }
}

export const parseResultTable = (html: string): Result[] => {
  const dom = new JSDOM(html)
  const doc = dom.window.document
  
    const rows = doc.querySelectorAll('table tr') as NodeListOf<HTMLElement>
  const results: Result[] = []
  
  rows.forEach((row, index) => {
    if (index === 0) return // Пропускаем заголовок
    
    const cells = row.querySelectorAll('td')
    if (cells.length < 5) return
    
    const rank = parseInt(cells[0].textContent?.trim() || '0')
    const name = cells[1].textContent?.trim() || ''
    const city = cells[2].textContent?.trim() || ''
    const points = parseFloat(cells[3].textContent?.trim() || '0')
    const attempts = cells[4].textContent?.trim() || ''
    
    results.push({
      rank,
      name,
      city,
      points,
      attempts
    })
  })
  
  return results
}