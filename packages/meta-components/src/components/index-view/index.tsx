import React, {
  useMemo,
  Ref,
  useState,
  useCallback,
  CSSProperties,
} from 'react'
import classNames from 'classnames'
import { Dropdown, Menu } from 'antd'
import { ListUnordered, TableLine, ArrowDownSLine } from '@airclass/icons'
import { MetaValueType } from '@toy-box/meta-schema'
import { Button } from '@toy-box/toybox-ui'
import { MetaTable } from '../meta-table'
import { LoadDataType, IndexModeType } from './types'
import {
  IColumnVisible,
  RowData,
  IMetaTableProps,
} from '../meta-table/interface'
import { IndexViewContext } from './context'
import { ColumnsSetValueType } from './components/TableToolbar'
export * from './hooks'

import { useMetaTable } from './hooks/useMetaTable'

const LIST_RENDER = 'listRender'

declare type RawValue = string | number

export interface IIndexViewProps {
  /**
   * @description 数据元数据
   */
  objectMeta: Toybox.MetaSchema.Types.IMetaObject
  visibleColumns: IColumnVisible[]
  visibleColumnSet?: boolean
  style?: CSSProperties
  /**
   * @description 当前查看模式
   * @default 'table'
   */
  mode?: IndexModeType
  /**
   * @description 可切换的模式
   * @default null
   */
  viewModes?: IndexModeType[]
  className?: string
  columnComponents?: IMetaTableProps['columnComponents']
  /**
   * @description 是否更具请求参数修改url
   * @default false
   */
  urlQuery?: boolean
  /**
   * @description 是否启动多选模式
   * @default false
   */
  selectionToggle?: boolean
  defaultSelectionType?: 'checkbox'
  /**
   * @description 数据获取方法
   */
  loadData: LoadDataType
}

export const IndexView = React.forwardRef(
  (
    {
      objectMeta,
      visibleColumns,
      visibleColumnSet,
      mode = 'table',
      viewModes = [],
      className,
      style,
      columnComponents = {},
      selectionToggle,
      defaultSelectionType,
      loadData,
      urlQuery,
      children,
    }: IIndexViewProps & { children: React.ReactNode },
    ref: Ref<any>
  ) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<RawValue[]>([])
    // const [query, setQuery] = useQuery()

    const [selectedRows, setSelectedRows] = useState<RowData[]>([])
    const [selectionType, setSelectionType] = useState(defaultSelectionType)
    const [currentMode, setCurrentMode] = useState<IndexModeType>(mode)

    const selected = useMemo(() => selectedRows.length > 0, [selectedRows])
    // 可配置的字段key
    const metaColumnKeys = useMemo(
      () => visibleColumns.map((col) => col.key),
      [visibleColumns]
    )

    const defaultColumnKeys = useMemo(
      () => visibleColumns.filter((col) => col.visiable).map((col) => col.key),
      [visibleColumns]
    )

    const defaultColumns = useMemo(() => {
      const { properties } = objectMeta
      if (properties) {
        return Object.keys(properties)
          .filter((key) => metaColumnKeys.includes(key))
          .map((key) => ({
            label: properties[key].name,
            value: key,
          }))
      }
      return []
    }, [metaColumnKeys, objectMeta])

    const [columns, setColumns] = useState<ColumnsSetValueType>(defaultColumns)
    const [visibleKeys, setVisibleKeys] = useState(defaultColumnKeys)

    const toggleSelection = useCallback(() => {
      if (selectionType == null) {
        setSelectionType('checkbox')
      } else {
        setSelectedRows([])
        setSelectedRowKeys([])
        setSelectionType(undefined)
      }
    }, [selectionType])

    const rowSelection = useMemo(
      () =>
        selectionType != null
          ? {
              selectedRowKeys,
              selectionType,
              onChange: (keys: (string | number)[], rows: RowData[]) => {
                setSelectedRowKeys(keys), setSelectedRows(rows)
              },
            }
          : undefined,
      [selectedRowKeys, selectionType, setSelectedRowKeys]
    )

    const columnMetas = useMemo(() => {
      if (currentMode === 'list') {
        return [
          {
            key: objectMeta.key,
            component: LIST_RENDER,
            name: objectMeta.name,
            type: MetaValueType.OBJECT,
          },
        ]
      }
      const { properties } = objectMeta
      if (properties == null) {
        return []
      }
      return columns
        .filter((col) => visibleKeys.some((k) => k === col.value))
        .map((col) => {
          const fieldMeta = properties[col.value]
          const column = visibleColumns.find(
            (c) => c.key === col.value
          ) as IColumnVisible
          return {
            ...column,
            ...fieldMeta,
          }
        })
        .filter((c) => c != null)
    }, [currentMode, columns, visibleKeys, objectMeta, visibleColumns])

    const components = useMemo(() => {
      return columnComponents
    }, [columnComponents, currentMode])

    // 显示模式切换菜单
    const modeMenu = useMemo(() => {
      const currentIcon =
        currentMode === 'list' ? <ListUnordered /> : <TableLine />
      const menuItems = viewModes.map((itemMode, idx) => {
        return (
          <Menu.Item
            key={idx}
            onClick={() => setCurrentMode(itemMode)}
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
    }, [currentMode, viewModes])

    const content = useMemo(
      () => ({
        visibleColumnSet,
        columns,
        setColumns,
        visibleKeys,
        setVisibleKeys,
      }),
      [columns, setColumns, visibleColumnSet, visibleKeys, setVisibleKeys]
    )

    const { tableProps, paginationProps } = useMetaTable(loadData)

    const IndexContent = useCallback(() => {
      switch (currentMode) {
        case 'list':
          return (
            <MetaTable
              rowKey={objectMeta.idKey}
              columnMetas={columnMetas}
              rowSelection={rowSelection}
              columnComponents={components}
              pagination={paginationProps}
              {...tableProps}
            />
          )
        case 'table':
        default:
          return (
            <MetaTable
              rowKey={objectMeta.idKey}
              columnMetas={columnMetas}
              rowSelection={rowSelection}
              columnComponents={components}
              {...tableProps}
            />
          )
      }
    }, [
      currentMode,
      objectMeta.idKey,
      columnMetas,
      rowSelection,
      components,
      tableProps,
    ])

    return (
      <IndexViewContext.Provider value={content}>
        <div className={classNames('tbox-index-view', className)} style={style}>
          {children}
          <IndexContent />
        </div>
      </IndexViewContext.Provider>
    )
  }
)

// export default React.forwardRef(IndexView)
