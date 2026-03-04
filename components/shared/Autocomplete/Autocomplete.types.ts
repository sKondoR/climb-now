export interface DataItem<T = any> {
  [key: string]: T
}

export type Item = DataItem | string

