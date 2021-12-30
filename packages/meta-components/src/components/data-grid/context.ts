import React, { createContext } from 'react'
import { ISortableSelectProps } from '@toy-box/toybox-ui'
import { DataGridModeType } from './types'
import { RowSelectionType } from 'antd/es/table/interface'

export interface IDataGridContextProps {
  setQuerySearch?: (params: any, type: 'turnPage' | 'filterSearch') => void
  pageable?: { current?: number; pageSize?: number }
  params?: any
  setParams?: (params: any) => void
  preParams?: any
  setPreParams?: (params: any) => void
  filterFields?: Toybox.MetaSchema.Types.IFieldMeta[]
  objectMeta: Toybox.MetaSchema.Types.IObjectMeta
  currentMode: DataGridModeType
  setCurrentMode: (mode: DataGridModeType) => void
  viewModes?: DataGridModeType[]
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

export const DataGridContext = createContext<IDataGridContextProps>(
  {} as IDataGridContextProps
)
