import React, {
  CSSProperties,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
} from 'react'
import classNames from 'classnames'
import { MetaValueType } from '@toy-box/meta-schema'
import { PaginationBar } from '@toy-box/toybox-ui'
import { MetaTable } from '../meta-table'
import { FilterSearch } from '../filter-search'
import { LoadDataType, IndexModeType } from './types'
import {
  IColumnVisible,
  RowData,
  IMetaTableProps,
} from '../meta-table/interface'
import { IndexViewContext } from './context'
import { ColumnsSetValueType, TableStatusBar } from './components'
export * from './hooks'
export * from './components'

import { useTable } from './hooks'

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
  filterFieldKeys?: string[]
  /**
   * @description 条件查询简单模式
   */
  simple?: boolean
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
      filterFieldKeys,
      simple,
      urlQuery,
      children,
    }: IIndexViewProps & { children: React.ReactNode },
    ref: Ref<any>
  ) => {
    const [params, setParams] = useState<any>()
    const [selectedRowKeys, setSelectedRowKeys] = useState<RawValue[]>([])
    // const [query, setQuery] = useQuery()

    const [selectedRows, setSelectedRows] = useState<RowData[]>([])
    const [selectionType, setSelectionType] = useState(defaultSelectionType)
    const [currentMode, setCurrentMode] = useState<IndexModeType>(mode)

    useImperativeHandle(
      ref,
      () => ({
        selectedRowKeys,
        selectedRows,
      }),
      [selectedRowKeys, selectedRows]
    )

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

    const indexViewContent = useMemo(
      () => ({
        objectMeta,
        visibleColumnSet,
        columns,
        setColumns,
        visibleKeys,
        setVisibleKeys,
        currentMode,
        setCurrentMode,
        viewModes,
      }),
      [
        objectMeta,
        columns,
        setColumns,
        visibleColumnSet,
        visibleKeys,
        setVisibleKeys,
        currentMode,
        setCurrentMode,
        viewModes,
      ]
    )

    // const { tableProps, paginationProps } = useMetaTable(loadData, {
    //   pagination: { defaultCurrent: 1, defaultPageSize: 4 },
    // })

    const paramsActions = useMemo(() => {
      return {
        getParams: () => params,
        resetParams: () => setParams(undefined),
      }
    }, [])

    const { tableProps, search } = useTable(loadData, {
      simple,
      paramsActions,
    })

    useEffect(() => {
      search.submit()
    }, [search.submit])

    const IndexContent = useCallback(() => {
      const { pagination, ...otherProps } = tableProps
      switch (currentMode) {
        case 'list':
          return (
            <MetaTable
              rowKey={objectMeta.idKey}
              columnMetas={columnMetas}
              rowSelection={rowSelection}
              columnComponents={components}
              pagination={false}
              {...otherProps}
            />
          )
        case 'table':
        default:
          return (
            <>
              <MetaTable
                rowKey={objectMeta.idKey}
                columnMetas={columnMetas}
                rowSelection={rowSelection}
                columnComponents={components}
                pagination={false}
                {...otherProps}
              />
              <PaginationBar {...pagination} />
            </>
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

    const filterFieldMetas = useMemo(() => {
      const { properties } = objectMeta
      if (properties) {
        return Object.keys(properties)
          .filter((key) => {
            return filterFieldKeys
              ? filterFieldKeys.includes(key)
              : key != objectMeta.idKey
          })
          .map((key) => properties[key])
      }
      return []
    }, [objectMeta, filterFieldKeys])

    return (
      <IndexViewContext.Provider value={indexViewContent}>
        <div className={classNames('tbox-index-view', className)} style={style}>
          {children ? (
            children
          ) : (
            <>
              <FilterSearch
                value={params}
                onChange={setParams}
                filterFieldMetas={filterFieldMetas}
              />
              <TableStatusBar />
            </>
          )}
          <IndexContent />
        </div>
      </IndexViewContext.Provider>
    )
  }
)
