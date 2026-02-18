import { parse } from 'parse5';
import { ApiResponse, Group, QualItem, QualResultItem, SubGroupData, Results } from '@/types';

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

export const parseResultsTable = (html: string): SubGroupData => {
  const document = parseFragment(html);
  const documentTitle = getTextContent(findElementsByTag(document, 'h1')[0]).toLowerCase();
  const isLead = documentTitle.includes('трудность');
  const isQualResult = documentTitle.includes('квалификация сводный');

  console.log('> ', documentTitle);
  const result = {
    isLead,
    isQualResult,
    data: [] as Results,
  }
  if (isLead && isQualResult) {
    result.data = parseQualSummaryResults(document);
  }
  if (isLead) {
    result.data = parseQualResults(document);
  }
  return result;
};

export const parseQualResults = (document: any): QualItem[] => {
  const rows = findElementsByTag(document, 'tr');
  const results: QualItem[] = [];
  
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

export const parseQualSummaryResults = (document: any): QualResultItem[] => {
  const rows = findElementsByTag(document, 'tr');
  const results: QualResultItem[] = [];
  
  rows.forEach((row, index) => {
    if (index === 0) return; // Пропускаем заголовок
    
    const cells = findElementsByTag(row, 'td');
    if (cells.length < 5) return;
    
    const rank = getTextContent(cells[0]) || '';
    const name = getTextContent(cells[2]) || '-';
    const score1 = getTextContent(cells[3]) || '';
    const command = getTextContent(cells[4]) || '';
    const mark1 = getTextContent(cells[5]) || '';
    const score2 = getTextContent(cells[6]) || '';
    const mark2 = getTextContent(cells[7]) || '';
    const mark = getTextContent(cells[8]) || '';
    
    results.push({
      rank,
      name,
      command,
      score1,
      mark1,
      score2,
      mark2,
      mark,
    });
  });
  
  return results;
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