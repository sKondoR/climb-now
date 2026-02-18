export interface ApiResponse {
  groups: Group[]
  url: string
  city: string
}

export interface Group {
  id: string
  title: string
  isOnline: boolean
  subgroups: Subgroup[]
}

export interface Subgroup {
  id: string
  title: string
  link: string
  results: Results
}

export type Results = (QualItem | QualResultItem)[]

export interface QualItem {
  rank: string
  stRank: string
  name: string
  command: string
  score: string
}
export interface QualResultItem {
  rank: string
  stRank?: string // toDo: removes
  name: string
  command: string
  score1: string
  mark1: string
  score2: string
  mark2: string
  mark: string
}

export interface SubgroupResults {
  [key: string]: {
    results: Results
    isLoading: boolean
    error: string | null
  }
}

export interface SubGroupData {
  isLead: boolean
  isQualResult: boolean
  data: Results
}

