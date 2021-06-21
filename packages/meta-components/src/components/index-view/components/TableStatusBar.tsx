import React, { FC, useCallback } from 'react'
import { ToolBar } from '@toy-box/toybox-ui'
import { ViewSetter } from './ViewSetter'
import { useIndexView } from '../hooks'

import '../styles/tableStatusBar.less'

export const TableStatusBar: FC = () => {
  const indexView = useIndexView()
  const SelectStatus = useCallback(
    () => (
      <>
        <div>
          {indexView.selectionType && (
            <span>
              已经选择 {(indexView.selectedRowKeys || []).length} 条记录
            </span>
          )}
        </div>
      </>
    ),
    [indexView.selectionType, indexView.selectedRowKeys]
  )

  return (
    <ToolBar className="tbox-table-status-bar">
      <SelectStatus />
      <ViewSetter />
    </ToolBar>
  )
}
