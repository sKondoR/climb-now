import { parse } from 'parse5';
import { ApiResponse, Group, Qualification, Result } from '@/types/api';

const parseFragment = (html: string) => {
  const document = parse(html, { sourceCodeLocationInfo: true });
  return document;
};

export const parseResults = (html: string, urlCode: string): ApiResponse | null => {
  try {
    const document = parseFragment(html);
    const groups: Group[] = [];
    
    // Найдем все элементы с классом g_title
    const groupElements = findElementsByClass(document, 'g_title');
    
    groupElements.forEach((groupEl, index) => {
      const title = getTextContent(groupEl) || `Группа ${index + 1}`;
      
      // Найдем ссылки на квалификации
      const links = findElementsByClass(groupEl, 'p_l a');
      const qualification1 = parseQualification(links[0], 'Квалификация 1');
      const qualification2 = parseQualification(links[1], 'Квалификация 2');
      const final = parseQualification(links[2], 'Квалификация сводный');
      
      groups.push({
        id: `group-${index}`,
        title,
        link: links[0]?.attrs?.find(a => a.name === 'href')?.value || '',
        isOnline: hasClass(groupEl, 'l_run'),
        qualification1,
        qualification2,
        final
      });
    });
    
    return {
      groups,
      url: urlCode,
      city: ''
    };
    
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return null;
  }
};

const parseQualification = (link: any, title: string): Qualification => {
  if (!link) {
    return {
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      results: []
    };
  }
  
  const href = link.attrs?.find(a => a.name === 'href')?.value || '';
  const results: Result[] = [];
  
  return {
    id: href.replace(/\.html$/, ''),
    title,
    results
  };
};

export const parseResultTable = (html: string): Result[] => {
  const document = parseFragment(html);
  const rows = findElementsByTag(document, 'tr');
  const results: Result[] = [];
  
  rows.forEach((row, index) => {
    if (index === 0) return; // Пропускаем заголовок
    
    const cells = findElementsByTag(row, 'td');
    if (cells.length < 5) return;
    
    const rank = parseInt(getTextContent(cells[0]) || '0');
    const name = getTextContent(cells[1]) || '';
    const city = getTextContent(cells[2]) || '';
    const points = parseFloat(getTextContent(cells[3]) || '0');
    const attempts = getTextContent(cells[4]) || '';
    
    results.push({
      rank,
      name,
      city,
      points,
      attempts
    });
  });
  
  return results;
};

// Вспомогательные функции для работы с parse5
const findElementsByClass = (node: any, className: string): any[] => {
  const result: any[] = [];
  
  const traverse = (node: any) => {
    if (node.attrs && node.attrs.some((attr: any) => attr.name === 'class' && attr.value.includes(className))) {
      result.push(node);
    }
    if (node.childNodes) {
      node.childNodes.forEach((child: any) => traverse(child));
    }
  };
  
  traverse(node);
  return result;
};

const findElementsByTag = (node: any, tagName: string): any[] => {
  const result: any[] = [];
  
  const traverse = (node: any) => {
    if (node.tagName === tagName) {
      result.push(node);
    }
    if (node.childNodes) {
      node.childNodes.forEach((child: any) => traverse(child));
    }
  };
  
  traverse(node);
  return result;
};

const getTextContent = (node: any): string => {
  if (!node || !node.childNodes) return '';
  
  let text = '';
  node.childNodes.forEach((child: any) => {
    if (child.value) {
      text += child.value;
    } else if (child.childNodes) {
      text += getTextContent(child);
    }
  });
  
  return text.trim();
};

const hasClass = (node: any, className: string): boolean => {
  if (!node.attrs) return false;
  const classAttr = node.attrs.find((attr: any) => attr.name === 'class');
  return classAttr?.value?.includes(className) || false;
};