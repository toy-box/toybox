import React from 'react'
import { ValueType } from './types'

export interface ISortableSelectContext {
  value?: ValueType
  checkValue?: (val: string) => void
}

export const SortableSelectContext =
  React.createContext<ISortableSelectContext>({})
