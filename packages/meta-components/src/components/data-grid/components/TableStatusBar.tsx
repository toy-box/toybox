import React, { FC, useCallback } from 'react'
import { ToolBar } from '@toy-box/toybox-ui'
import { ViewSetter } from './ViewSetter'
import { useDataGrid } from '../hooks'

import '../styles/tableStatusBar.less'

export const TableStatusBar = () => {
  const dataGrid = useDataGrid()
  const SelectStatus = useCallback(
    () => (
      <>
        <div>
          {dataGrid.selectionType && (
            <span>
              已经选择 {(dataGrid.selectedRowKeys || []).length} 条记录
            </span>
          )}
        </div>
      </>
    ),
    [dataGrid.selectionType, dataGrid.selectedRowKeys]
  )

  return (
    <ToolBar className="tbox-table-status-bar">
      <SelectStatus />
      <ViewSetter />
    </ToolBar>
  )
}
