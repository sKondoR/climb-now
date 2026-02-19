import { LeadResultsItem } from '@/types'
import { leadFinalsConfig, leadQualConfig, leadQualResultsConfig } from './configs'

export const isCityMatch = (city: string, selectedCity: string) => {
    return selectedCity && city.toLowerCase() === selectedCity.toLowerCase()
}

interface getConfigProps {
    isLead: boolean
    isQualResult: boolean
    isFinal: boolean
}
export function getTableConfig({ isFinal, isQualResult, isLead }: getConfigProps) { 
    if (isLead) {
        if (isFinal) {
            return leadFinalsConfig;
        }
        return isQualResult ? leadQualResultsConfig : leadQualConfig;
    }
    return leadQualConfig;
}

interface getRowClassesProps {
    result: LeadResultsItem
    isLead: boolean
    isQualResult: boolean
    isFinal: boolean
    selectedCity: string
}
export function getRowClasses({ result, isFinal, isQualResult, isLead, selectedCity }: getRowClassesProps) { 
    const isCityRow = isCityMatch(result.command, selectedCity);
    const isFinalRow = isFinal && ['1','2','3'].includes(result['rank']);
    if (isCityRow) {
        return ' bg-blue-400/50';
    }
    if (isFinalRow && !isCityRow) {
        return ' bg-green-300/30';
    }
    return '';
}