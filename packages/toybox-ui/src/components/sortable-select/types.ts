import { ReactNode } from 'react'

export interface ISelectItem {
  label: ReactNode
  value: string
  disabled?: boolean
  fixed?: boolean | 'left' | 'right'
  [key: string]: any
}

export type ValueType = string | string[] | undefined
