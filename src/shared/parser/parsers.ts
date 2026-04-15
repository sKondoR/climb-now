import { parse } from 'parse5'

import { leadQualConfig, leadQualResultsConfig, leadFinalConfig, boulderQualConfig, boulderFinalConfig } from '@/shared/tables.configs'

import type { Parse5Document, Parse5Element, Parse5Node, Parse5DocumentFragment, Parse5ChildNode } from './parsers.types'

import { Group, LeadQualItem, LeadQualResultItem, SubGroupData, Results, LeadFinalsItem, Discipline, BoulderQualItem, BoulderFinalItem } from '@/shared/types'
import { DISCIPLINES, STATUSES } from '../constants'

export const parseFragment = (html: string): Parse5DocumentFragment => {
  const document = parse(html, { sourceCodeLocationInfo: true })
  return document as unknown as Parse5DocumentFragment
}

export const parseResults = (html: string): Discipline[] | null => {
  try {
    const document = parseFragment(html)
    
    const documentTitle = getTextContent(findElementsByTag(document, 'h1')[0]).toLowerCase()
    const isNotFound = documentTitle.includes('404')

    if (isNotFound) return null
   
    const disciplines = getDisciplines(document)
    const disciplineColumns = findElementsByTag(document as unknown as Parse5Document, 'td')

    const data = [] as Discipline[]

    disciplines.forEach((discipline, index) => {
      const groups: Group[] = []
      const column = disciplineColumns[index]

      const elements = findElementsByTag(column, 'div').filter(el => hasClass(el, 'g_title') || hasClass(el, 'p_l'))
      let currentGroup: Group | null = null
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        const title = getTextContent(element) || `Группа ${i + 1}`

        if (hasClass(element, 'p_l') && currentGroup?.subgroups) {
          const linkEl = findElementsByTag(element, 'a')[0]
          if (!linkEl) continue
          const statusEl = findElementsByTag(linkEl as Parse5Element, 'div')[0]
          if (!statusEl) continue
          const statusClass = statusEl.attrs.find((a: { name: string; value: string }) => a.name === 'class')?.value
          if (!statusClass) continue
          currentGroup.subgroups.push({
            id: `subgroup-${i}`,
            title,
            link: linkEl.attrs.find((a: { name: string; value: string }) => a.name === 'href')?.value.replace('.html', '') || '',
            status: statusClass === 'l_pas' ? STATUSES.PASSED : (statusClass === 'l_run' ? STATUSES.ONLINE : STATUSES.PENDING),
            results: [],
          })
        } else if (hasClass(element, 'g_title')) {
          if (currentGroup) {
            groups.push(currentGroup)
          }
          currentGroup = {
            id: `group-${i}`,
            title,
            isOnline: hasClass(element, 'l_run'),
            subgroups: []
          }
        }
      }
      if (currentGroup) {
        groups.push(currentGroup)
        currentGroup = null
      }
      data.push({
        discipline,
        groups,
      })
    })
    
    return data
    
  } catch (error) {
    console.error('Error parsing HTML:', error)
    return null
  }
}

export const parseResultsTable = (html: string): SubGroupData => {
  const document = parseFragment(html)
  const documentTitle = getTextContent(findElementsByTag(document as unknown as Parse5Document, 'h1')[0]).toLowerCase()
  const isLead = documentTitle.includes('трудность')
  const isBoulder = documentTitle.includes('боулдеринг')
  const isQualResult = documentTitle.includes('сводный')
  const isFinal = documentTitle.includes('финал')

  const result = {
    isLead,
    isBoulder,
    isQualResult,
    isFinal,
    data: [] as Results,
  }
  if (isLead && isQualResult && !isFinal) {
    result.data = parseLeadQualResults(document as unknown as Parse5DocumentFragment)
  }
  if (isLead && !isQualResult && !isFinal) {
    result.data = parseLeadQual(document)
  }
  if (isLead && isFinal) {
    result.data = parseLeadFinal(document)
  }
  if (isBoulder && !isFinal) {
    result.data = parseBoulderQual(document)
  }
  if (isBoulder && isFinal) {
    result.data = parseBoulderFinal(document)
  }
  return result
}

export const parseTable = <T>(document: Parse5DocumentFragment, config: Array<{ prop: keyof T }>): T[] => {
  const tbody = findElementsByTag(document, 'tbody')[0]
  const rows = findElementsByTag(tbody, 'tr')

  const results: T[] = []
  
  rows.forEach((row: Parse5Element) => {
    const isHighlighted = hasClass(row, 'q')
    const cells = findElementsByTag(row, 'td')
    // if (cells.length < config.length) return
    let boulderCount = 0
    let boulderResult = false
    const data = config.reduce((acc: Partial<T>, key: { prop: keyof T }, i: number) => {
      if (!key.prop || boulderResult) return acc
      const cell = cells[i]      
      if (hasClass(cell, 'route')) {
        boulderCount++
        return ({ ...acc, [`r${boulderCount}`]: parseRouteCell(cell) })
      } else if (boulderCount > 0) {
        boulderResult = true
        return ({ ...acc, score: getTextContent(cell) })
      }
      return ({ ...acc, [key.prop]: getTextContent(cell) })
    }, {}) as T
    results.push(isHighlighted ? { ...data, isHighlighted } : data)
  })
  
  return results
}

export const parseLeadQual = (document: Parse5DocumentFragment): LeadQualItem[] => {
  return parseTable<LeadQualItem>(document, leadQualConfig as Array<{ prop: keyof LeadQualItem }>)
}

export const parseLeadQualResults = (document: Parse5DocumentFragment): LeadQualResultItem[] => {
  return parseTable<LeadQualResultItem>(document, leadQualResultsConfig as Array<{ prop: keyof LeadQualResultItem }>)
}

export const parseLeadFinal = (document: Parse5DocumentFragment): LeadFinalsItem[] => {
  return parseTable<LeadFinalsItem>(document, leadFinalConfig as Array<{ prop: keyof LeadFinalsItem }>)
}

export const parseBoulderQual = (document: Parse5DocumentFragment): BoulderQualItem[] => {
  return parseTable<BoulderQualItem>(document, boulderQualConfig as Array<{ prop: keyof BoulderQualItem }>)
}

export const parseBoulderFinal = (document: Parse5DocumentFragment): BoulderFinalItem[] => {
  return parseTable<BoulderFinalItem>(document, boulderFinalConfig as Array<{ prop: keyof BoulderFinalItem }>)
}

export const findElementsByTag = (node: Parse5Node | null | undefined, tagName: string): Parse5Element[] => {
  const result: Parse5Element[] = []
  
  if (!node) return result
  
  const traverse = (node: Parse5Node) => {
    if (node.nodeName === tagName) {
      result.push(node as Parse5Element)
    }
    if ('childNodes' in node && node.childNodes) {
      node.childNodes.forEach((child: Parse5ChildNode) => traverse(child))
    }
  }
  
  traverse(node)
  return result
}

export const getTextContent = (node: Parse5Node | null | undefined): string => {
  if (!node) return ''

  let text = ''

  const traverse = (node: Parse5Node) => {
    if (node.nodeName === '#text' && 'value' in node) {
      text += node.value
    } else if ('childNodes' in node && node.childNodes) {
      node.childNodes.forEach((child: Parse5ChildNode) => traverse(child))
    }
  }

  traverse(node)
  return text.trim()
}

export const hasClass = (node: Parse5Node | null | undefined, className: string): boolean => {
  if (!node || !('attrs' in node)) return false
  const attrs = (node as Parse5Element).attrs
  if (!attrs) return false
  const classAttr = attrs.find((attr: { name: string; value: string }) => attr.name === 'class')
  return classAttr?.value?.split(' ').includes(className) || false
}

export const getDisciplines = (document: Parse5DocumentFragment) => {
  return findElementsByTag(document as unknown as Parse5Document, 'th').map((th: Parse5Element) => {
    let current = ''
    Object.values(DISCIPLINES).forEach((value) => {
      if(getTextContent(th).toLowerCase().includes(value.toLowerCase())) {
        current = value
      }
    })
    return current || getTextContent(th).toLowerCase()
  })
}

export const parseRouteCell = (node: Parse5Node | null | undefined): string => {
  if (!node) return ''
  
  const values: string[] = []
  
  const traverse = (node: Parse5Node) => {
    if (hasClass(node, 'r_2')) {
      if ('childNodes' in node && Array.isArray(node.childNodes)) {
        node.childNodes.forEach((routeChild: Parse5ChildNode) => {
          if (routeChild.nodeName === '#text' && 'value' in routeChild) {
            const text = routeChild.value.trim()
            if (text) {
              values.push(text)
            } else {
              values.push(' ')
            }
          }
        })
      }
    } else if (hasClass(node, 'r_0')) {
      values.push(' ', ' ');
    } else if (hasClass(node, 'r_1')) {
      values.push(' ', getTextContent(node));
    }
    else if ('childNodes' in node && node.childNodes) {
      node.childNodes.forEach((child: Parse5ChildNode) => traverse(child))
    }
  }
  
    traverse(node)
  return values.join('/')
}
