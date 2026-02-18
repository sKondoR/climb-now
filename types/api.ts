export interface ApiResponse {
  groups: Group[]
  url: string
  city: string
}

export interface Group {
  id: string
  title: string
  link: string
  isOnline: boolean
  qualification1: Qualification
  qualification2: Qualification
  final: Qualification
}

export interface Qualification {
  id: string
  title: string
  results: Result[]
}

export interface Result {
  rank: number
  name: string
  city: string
  points: number
  attempts: string
}

export interface GroupUpdate {
  id: string
  title: string
  qualification1: Qualification
  qualification2: Qualification
  final: Qualification
}