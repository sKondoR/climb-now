export interface ApiResponse {
  groups: Group[]
  url: string
  city: string
}

export interface Group {
  id: string
  title: string
  isOnline: boolean
  qualification1: Qualification
  qualification2: Qualification
  qualificationResult: Qualification
}

export interface Qualification {
  id: string
  title: string
  link: string
  results: Result[]
}

export interface Result {
  rank: number
  name: string
  command: string
  score: number
}

export interface GroupUpdate {
  id: string
  title: string
  qualification1: Qualification
  qualification2: Qualification
  qualificationResult: Qualification
}