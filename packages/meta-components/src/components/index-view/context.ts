import React, { createContext } from 'react'
import { ISortableSelectProps } from '@toy-box/toybox-ui'
import { IndexModeType } from './types'

export interface IIndexViewContextProps {
  setQuerySearch?: (params: any) => void
  params?: any
  setParams?: (params: any) => void
  preParams?: any
  setPreParams?: (params: any) => void
  filterFields?: Toybox.MetaSchema.Types.IFieldMeta[]
  objectMeta: Toybox.MetaSchema.Types.IObjectMeta
  currentMode: IndexModeType
  setCurrentMode: (mode: IndexModeType) => void
  viewModes?: IndexModeType[]
  visibleColumnSet?: boolean
  columns: ISortableSelectProps['dataSource']
  setColumns: (columns: ISortableSelectProps['dataSource']) => void
  visibleKeys: string[]
  setVisibleKeys: (keys: string[]) => void
  selectedRowKeys?: string[]
  selectionType?: string
  setSelectionType?: (type?: string) => void
  logicFilter?: boolean
}

export const IndexViewContext = createContext<IIndexViewContextProps>(
  {} as IIndexViewContextProps
)
