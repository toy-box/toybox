import { ISortableSelectProps } from '@toy-box/toybox-ui'
import React, { createContext } from 'react'

export interface IIndexViewContextProps {
  objectMeta: Toybox.MetaSchema.Types.IMetaObject
  selectionToggle?: boolean
  visibleColumnSet?: boolean
  columns: ISortableSelectProps['dataSource']
  setColumns: (columns: ISortableSelectProps['dataSource']) => void
  visibleKeys: string[]
  setVisibleKeys: (keys: string[]) => void
}

export const IndexViewContext = createContext<IIndexViewContextProps>(null)
