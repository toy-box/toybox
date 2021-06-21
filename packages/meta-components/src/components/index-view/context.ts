import { ISortableSelectProps } from '@toy-box/toybox-ui'
import React, { createContext } from 'react'
import { IndexModeType } from './types'

export interface IIndexViewContextProps {
  objectMeta: Toybox.MetaSchema.Types.IMetaObject
  currentMode: IndexModeType
  setCurrentMode: (mode: IndexModeType) => void
  viewModes?: IndexModeType[]
  selectionToggle?: boolean
  visibleColumnSet?: boolean
  columns: ISortableSelectProps['dataSource']
  setColumns: (columns: ISortableSelectProps['dataSource']) => void
  visibleKeys: string[]
  setVisibleKeys: (keys: string[]) => void
}

export const IndexViewContext = createContext<IIndexViewContextProps>(null)
