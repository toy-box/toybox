import React, { FC } from 'react'
import { ToolBar } from '@toy-box/toybox-ui'
import { ViewSetter } from './ViewSetter'

import '../styles/tableStatusBar.less'

export const TableStatusBar: FC = () => {
  return <ToolBar className="tbox-table-status-bar" right={<ViewSetter />} />
}
