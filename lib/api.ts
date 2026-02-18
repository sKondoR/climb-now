import { ApiResponse, Group, Qualification, Result } from '@/types'
import { GroupUpdate } from '@/types/api'

export const fetchResults = async (urlCode: string): Promise<ApiResponse | null> => {
  try {
    const response = await fetch(`/api/results?urlCode=${urlCode}`)
    
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    
    const data = await response.json();
    return data as ApiResponse
    
  } catch (error) {
    console.error('Error fetching results:', error)
    return null
  }
}

const parseResults = (html: string, urlCode: string): ApiResponse | null => {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    // Парсинг групп
    const groupElements = doc.querySelectorAll('.g_title')
    const groups: Group[] = []
    
    groupElements.forEach((groupEl, index) => {
      const title = groupEl.textContent?.trim() || `Группа ${index + 1}`
      
      // Парсинг ссылок на квалификации
      const links = groupEl.nextElementSibling?.querySelectorAll('.p_l a') || []
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
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  const rows = doc.querySelectorAll('table tr')
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

export const updateAllGroupTables = (groups: Group[]): void => {
  console.log('data.groups: ', groups);
  groups.forEach(group => {
    // Логика обновления таблиц групп
    // В реальной реализации здесь 
    // будет логика обновления данных в таблицах
    console.log('Updating group table:', group.title)
    
    // Пример обновления данных в таблице
    // В реальной приложении здесь 
    // будет логика обновления DOM элементов
    
    // Пример структуры данных для обновления
    const groupData: GroupUpdate = {
      id: group.id,
      title: group.title,
      qualification1: group.qualification1,
      qualification2: group.qualification2,
      final: group.final
    }
    
    // Отправка данных на сервер для обновления
    // fetch('/api/update-group', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(groupData),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Group updated:', data)
    // })
    // .catch(error => {
    //   console.error('Error updating group:', error)
    // })
  })
}