import React, { FC, useMemo } from 'react'
import { LayoutColumnLine } from '@airclass/icons'
import {
  Button,
  SortableSelect,
  ISortableSelectProps,
} from '@toy-box/toybox-ui'
import { Menu, Dropdown } from 'antd'
import { ListUnordered, TableLine, ArrowDownSLine } from '@airclass/icons'
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

export const ViewSetter: FC<IViewSetterProps> = () => {
  const indexView = useIndexView()
  // 显示模式切换菜单
  const modeMenu = useMemo(() => {
    const currentIcon =
      indexView.currentMode === 'list' ? <ListUnordered /> : <TableLine />
    const menuItems = (indexView.viewModes || []).map((itemMode, idx) => {
      return (
        <Menu.Item
          key={idx}
          onClick={() => indexView.setCurrentMode(itemMode)}
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
  }, [indexView.currentMode, indexView.viewModes])

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
