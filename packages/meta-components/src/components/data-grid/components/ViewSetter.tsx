import React, { FC, useMemo } from 'react'
import { LayoutColumnLine } from '@airclass/icons'
import {
  Button,
  SortableSelect,
  ISortableSelectProps,
} from '@toy-box/toybox-ui'
import { Menu, Dropdown } from 'antd'
import { ListUnordered, TableLine, ArrowDownSLine } from '@airclass/icons'
import { DataGridModeType } from '../types'
import { useDataGrid } from '../hooks'

export declare type ColumnsSetValueType = ISortableSelectProps['dataSource']

export interface ColumnSet {
  columns: ColumnsSetValueType
  setColumns: (columnSets: ColumnsSetValueType) => void
  visibleKeys?: string[]
}

export interface IViewSetterProps {
  viewModes?: DataGridModeType[]
}

export const ViewSetter: FC<IViewSetterProps> = () => {
  const dataGrid = useDataGrid()
  // 显示模式切换菜单
  const modeMenu = useMemo(() => {
    const currentIcon =
      dataGrid.currentMode === 'list' ? <ListUnordered /> : <TableLine />
    const menuItems = (dataGrid.viewModes || []).map((itemMode, idx) => {
      return (
        <Menu.Item
          key={idx}
          onClick={() => dataGrid.setCurrentMode(itemMode)}
          icon={itemMode === 'list' ? <ListUnordered /> : <TableLine />}
        >
          {itemMode === 'list' ? '列表' : '表格'}
        </Menu.Item>
      )
    })
    const menu = <Menu>{menuItems}</Menu>
    return (
      <Dropdown overlay={menu}>
        <Button type="text" icon={currentIcon}>
          <ArrowDownSLine />
        </Button>
      </Dropdown>
    )
  }, [dataGrid.currentMode, dataGrid.viewModes])

  return (
    <SortableSelect
      title={<h4 style={{ margin: '6px 0' }}>配置表格字段</h4>}
      dataSource={dataGrid.columns || []}
      value={dataGrid.visibleKeys}
      onChange={(keys) => {
        dataGrid.setVisibleKeys && dataGrid.setVisibleKeys(keys as string[])
      }}
      onSortEnd={(options) =>
        dataGrid.setColumns && dataGrid.setColumns(options)
      }
      multiple
    >
      <Button.Icon size="small" icon={<LayoutColumnLine />} />
    </SortableSelect>
  )
}
