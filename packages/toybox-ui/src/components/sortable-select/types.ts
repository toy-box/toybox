import { ReactNode } from 'react'

export interface ISelectItem {
  label: ReactNode
  value: string
  disabled?: boolean
  fixed?: boolean
}

export type ValueType = string | string[] | undefined
