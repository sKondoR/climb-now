import { parse } from 'parse5';
import { ApiResponse, Group, QualItem, QualResultItem, SubGroupData, Results } from '@/types';
import { leadQualConfig, leadQualResultsConfig } from '@/components/tables/configs';
import { STATUSES } from './constants';

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
        const linkEl = findElementsByTag(element, 'a')[0]
        const statusEl = findElementsByTag(linkEl, 'div')[0]
        const statusClass = statusEl?.attrs.find((a: any) => a.name === 'class').value;
        currentGroup.subgroups.push({
          id: `subgroup-${index}`,
          title,
          link: linkEl?.attrs.find((a: any) => a.name === 'href').value.replace('.html', '') || '',
          status: statusClass === 'l_pas' ? STATUSES.PASSED : (statusClass === 'l_run' ? STATUSES.ONLINE : STATUSES.PENDING),
          results: []
        });
      } else if (hasClass(element, 'g_title')) {
        if (currentGroup) {
          groups.push(currentGroup)
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
  const isQualResult = documentTitle.includes('сводный');

  const result = {
    isLead,
    isQualResult,
    data: [] as Results,
  }
  if (isLead && isQualResult) {
    result.data = parseLeadQualResults(document);
  }
  if (isLead && !isQualResult) {
    result.data = parseLeadQual(document);
  }
  return result;
};

export const parseLeadQual = (document: any): QualItem[] => {
  const rows = findElementsByTag(document, 'tr');
  const results: QualItem[] = [];
  
  const config = leadQualConfig;
  rows.forEach((row, index) => {
    if (index === 0) return; // Пропускаем заголовок
    
    const cells = findElementsByTag(row, 'td');
    if (cells.length < config.length) return;
    const data = config.reduce((acc, key, i) => ({ ...acc, [key.prop]: getTextContent(cells[key.parserId]) }), {}) as QualItem;  
    results.push(data);
  });
  
  return results;
};

export const parseLeadQualResults = (document: any): QualResultItem[] => {
    const rows = findElementsByTag(document, 'tr');
  const results: QualResultItem[] = [];
  
  const config = leadQualResultsConfig;
  rows.forEach((row, index) => {
    if (index === 0) return;
    
    const cells = findElementsByTag(row, 'td');
    if (cells.length < config.length) return;
    const data = config.reduce((acc, key, i) => ({ ...acc, [key.prop]: getTextContent(cells[key.parserId]) }), {}) as QualResultItem;  
    results.push(data);
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