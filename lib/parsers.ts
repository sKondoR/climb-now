import { parse } from 'parse5';
import { ApiResponse, Group, Qualification, Result } from '@/types';

const parseFragment = (html: string) => {
  const document = parse(html, { sourceCodeLocationInfo: true });
  return document;
};

export const parseResults = (html: string, urlCode: string): ApiResponse | null => {
  try {
    const document = parseFragment(html);
    const groups: Group[] = [];
    
   
    // Найдем все ссылки на квалификации
    const elements = findElementsByTag(document, 'div').filter(el => hasClass(el, 'g_title') || hasClass(el, 'p_l'));
    
    let currentGroup: Group | null = null;
    elements.forEach((element, index) => {
      const title = getTextContent(element) || `Группа ${index + 1}`;
      

      if (hasClass(element, 'p_l') && currentGroup?.subgroups) {
        currentGroup.subgroups.push({
          id: `subgroup-${index}`,
          title,
          link: findElementsByTag(element, 'a')[0].attrs.find((a: any) => a.name === 'href').value || '',
          results: []
        });
      } else if (hasClass(element, 'g_title')) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          id: `group-${index}`,
          title,
          isOnline: hasClass(element, 'l_run'),
          subgroups: []
        }
      }
    });
    if (currentGroup) {
      groups.push(currentGroup);
      currentGroup = null;
    }
    
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
  if (!link || !link.attrs) {
    return {
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      link: '',
      results: []
    };
  }
  
  const href = link.attrs?.find((a: any) => a.name === 'href')?.value || '';
  const results: Result[] = [];
  
  return {
    id: href.replace(/\.html$/, ''),
    link: href,
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
    
    const rank = getTextContent(cells[0]) || '';
    const stRank = getTextContent(cells[2]) || '';
    const name = getTextContent(cells[3]) || '-';
    const command = getTextContent(cells[4]) || '';
    const score = getTextContent(cells[5]) || '';
    
    results.push({
      rank,
      stRank,
      name,
      command,
      score,
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