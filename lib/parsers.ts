import { parse } from 'parse5';
import { Group, LeadQualItem, LeadQualResultItem, SubGroupData, Results, LeadFinalsItem, Discipline, BoulderQualItem, BoulderFinalItem } from '@/types';
import { leadQualConfig, leadQualResultsConfig, leadFinalsConfig, boulderQualConfig, boulderFinalsConfig } from '@/components/tables/configs';
import { DISCIPLINES, STATUSES } from './constants';

const parseFragment = (html: string) => {
  const document = parse(html, { sourceCodeLocationInfo: true });
  return document;
};

export const parseResults = (html: string): Discipline[] | null => {
  try {
    const document = parseFragment(html);   
   
    const disciplines = getDisciplines(document);
    const disciplineColumns = findElementsByTag(document, 'td');

    const data = [] as Discipline[];

    disciplines.forEach((discipline, index) => {
      const groups: Group[] = [];
      const column = disciplineColumns[index];

      const elements = findElementsByTag(column, 'div').filter(el => hasClass(el, 'g_title') || hasClass(el, 'p_l'));
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
      data.push({
        discipline,
        groups,
      });
    });
    
    
    
    return data;
    
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return null;
  }
};

export const parseResultsTable = (html: string): SubGroupData => {
  const document = parseFragment(html);
  const documentTitle = getTextContent(findElementsByTag(document, 'h1')[0]).toLowerCase();
  const isLead = documentTitle.includes('трудность');
  const isBoulder = documentTitle.includes('боулдеринг');
  const isQualResult = documentTitle.includes('сводный');
  const isFinal = documentTitle.includes('финал');

  const result = {
    isLead,
    isBoulder,
    isQualResult,
    isFinal,
    data: [] as Results,
  }
  if (isLead && isQualResult && !isFinal) {
    result.data = parseLeadQualResults(document);
  }
  if (isLead && !isQualResult && !isFinal) {
    result.data = parseLeadQual(document);
  }
  if (isLead && isFinal) {
    result.data = parseLeadFinalsResults(document);
  }
  if (isBoulder && !isFinal) {
    result.data = parseBoulderQual(document);
  }
  if (isBoulder && isFinal) {
    result.data = parseBoulderFinal(document);
  }
  return result;
};

export const parseTable = <T>(document: any, config: any): T[] => {
  const rows = findElementsByTag(document, 'tr');
  const results: T[] = [];
  
  rows.forEach((row: any, index: number) => {
    if (index === 0) return; // Пропускаем заголовок
    const cells = findElementsByTag(row, 'td');
    if (cells.length < config.length) return;
    const data = config.reduce((acc: any, key: any, i: number) => {
      const cell = cells[key.parserId];
      if (hasClass(cell, 'route')) {
        return ({ ...acc, [key.prop]: parseRouteCell(cell) })
      }
      return ({ ...acc, [key.prop]: getTextContent(cell) })
    }, {}) as T;   
    results.push(data);
  });
  
  return results;
};

export const parseLeadQual = (document: any): LeadQualItem[] => {
  return parseTable<LeadQualItem>(document, leadQualConfig);
};

export const parseLeadQualResults = (document: any): LeadQualResultItem[] => {
  return parseTable<LeadQualResultItem>(document, leadQualResultsConfig);
};

export const parseLeadFinalsResults = (document: any): LeadFinalsItem[] => {
  return parseTable<LeadFinalsItem>(document, leadFinalsConfig);
};

export const parseBoulderQual = (document: any): BoulderQualItem[] => {
  return parseTable<BoulderQualItem>(document, boulderQualConfig);
};

export const parseBoulderFinal = (document: any): BoulderFinalItem[] => {
  return parseTable<BoulderFinalItem>(document, boulderFinalsConfig);
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

const parseRouteCell = (node: any): string => {
  if (!node || !node.childNodes) return '';
  
  const values: string[] = [];
  node.childNodes.forEach((child: any) => {
    if (hasClass(child, 'r_0')) {
      values.push(' ', ' ');
    }
    if (hasClass(child, 'r_1')) {
      values.push(' ', getTextContent(child));
    }
    if (hasClass(child, 'r_2')) {
      child.childNodes.forEach((routeChild: any) => {
        if (routeChild.value) {
          values.push(routeChild.value.trim() || ' ');
        }
      });
    }
  });
  
  return values.join('/')
};

const hasClass = (node: any, className: string): boolean => {
  if (!node.attrs) return false;
  const classAttr = node.attrs.find((attr: any) => attr.name === 'class');
  return classAttr?.value?.includes(className) || false;
};

const getDisciplines = (document: any) => {
  return findElementsByTag(document, 'th').map(th => {
    let current = '';
    Object.values(DISCIPLINES).forEach((value) => {
      if(getTextContent(th).toLowerCase().includes(value.toLowerCase())) {
        current = value
      }
    })
    return current || getTextContent(th).toLowerCase();
  });
}