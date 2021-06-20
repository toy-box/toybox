import React, { FC, useMemo } from 'react'
import { LayoutColumnLine } from '@airclass/icons'
import {
  Button,
  SortableSelect,
  ISortableSelectProps,
} from '@toy-box/toybox-ui'
import { IndexModeType } from '../types'
import { useIndexView } from '../hooks'

export declare type ColumnsSetValueType = ISortableSelectProps['dataSource']

export interface ColumnSet {
  columns: ColumnsSetValueType
  setColumns: (columnSets: ColumnsSetValueType) => void
  visibleKeys?: string[]
}

export interface IViewSetterProps {
  viewModes?: IndexModeType[]
}

export const ViewSetter: FC<IViewSetterProps> = ({ viewModes }) => {
  const indexView = useIndexView()
  return (
    <SortableSelect
      title={<h4 style={{ margin: '6px 0' }}>配置表格字段</h4>}
      dataSource={indexView.columns || []}
      value={indexView.visibleKeys}
      onChange={(keys) => {
        indexView.setVisibleKeys && indexView.setVisibleKeys(keys as string[])
      }}
      onSortEnd={(options) =>
        indexView.setColumns && indexView.setColumns(options)
      }
      multiple
    >
      <Button.Icon size="small" icon={<LayoutColumnLine />} />
    </SortableSelect>
  )
}
