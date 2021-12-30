import React, { createContext } from 'react'
import { ISortableSelectProps } from '@toy-box/toybox-ui'
import { IndexModeType } from './types'
import { RowSelectionType } from 'antd/es/table/interface'

export interface IIndexViewContextProps {
  setQuerySearch?: (params: any, type: 'turnPage' | 'filterSearch') => void
  pageable?: { current: number; pageSize: number }
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
  selectionType?: RowSelectionType
  setSelectionType?: (type?: RowSelectionType) => void
  logicFilter?: boolean
}

export const IndexViewContext = createContext<IIndexViewContextProps>(
  {} as IIndexViewContextProps
)
