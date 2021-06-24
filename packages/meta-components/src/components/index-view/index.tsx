import React, {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react'
import classNames from 'classnames'
import { PaginationProps } from 'antd'
import { MetaValueType } from '@toy-box/meta-schema'
import { PaginationBar, IButtonClusterProps } from '@toy-box/toybox-ui'
import { MetaTable } from '../meta-table'
import { FilterPanel, ColumnsSetValueType, TableStatusBar } from './components'
import { LoadDataType, IndexModeType } from './types'
import {
  IColumnVisible,
  RowData,
  IMetaTableProps,
} from '../meta-table/interface'
import { IndexViewContext } from './context'
export * from './hooks'
export * from './components'

import { useTable } from './hooks'

const LIST_RENDER = 'listRender'

export interface IIndexViewProps<IParams = any> {
  /**
   * @description 数据元数据
   */
  objectMeta: Toybox.MetaSchema.Types.IObjectMeta
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
   * @description 外部的Params
   * @default false
   */
  qsParams?: IParams
  /**
   * @description 设置外部Params
   * @default false
   */
  setQsParams?: (params?: IParams) => void
  defaultSelectionType?: string
  tableOperate?: IButtonClusterProps
  /**
   * @description 数据获取方法
   */
  loadData: LoadDataType
  filterFieldKeys?: string[]
  /**
   * @description 条件查询简单模式
   */
  logicFilter?: boolean
  pagination?: Omit<PaginationProps, 'onChange'>
}

export const IndexView: FC<IIndexViewProps & { children: React.ReactNode }> = ({
  objectMeta,
  visibleColumns,
  visibleColumnSet,
  mode = 'table',
  viewModes = [],
  className,
  style,
  columnComponents = {},
  defaultSelectionType,
  loadData,
  filterFieldKeys,
  logicFilter,
  pagination,
  qsParams,
  setQsParams,
  children,
}) => {
  const paramsRef = useRef(null)
  const [params, setParams] = useState<any>()
  useEffect(() => {
    setQsParams && setQsParams(params)
    paramsRef.current = params
    return () => undefined
  }, [params])
  useEffect(() => setParams(qsParams), [qsParams])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<RowData[]>([])
  const [selectionType, setSelectionType] = useState(defaultSelectionType)
  const [currentMode, setCurrentMode] = useState<IndexModeType>(mode)

  const paramsActions = useMemo(
    () => ({
      getParams: () => paramsRef,
      resetParams: () => setParams(undefined),
    }),
    [paramsRef, setParams]
  )

  // const [query, setQuery] = useQuery()

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

  const rowSelection = useMemo(
    () =>
      selectionType != null
        ? {
            selectedRowKeys,
            selectionType,
            onChange: (keys: string[], rows: RowData[]) => {
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

  const {
    pagination: innerPagination,
    tableProps,
    searchActions,
  } = useTable(loadData, {
    logicFilter,
    paramsActions,
  })

  const paginationProps = useMemo(
    () => ({
      ...pagination,
      ...innerPagination,
    }),
    [pagination, innerPagination]
  )

  const filterFields = useMemo(() => {
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

  const indexViewContext = useMemo(
    () => ({
      objectMeta,
      params,
      setParams,
      visibleColumnSet,
      columns,
      setColumns,
      visibleKeys,
      setVisibleKeys,
      currentMode,
      setCurrentMode,
      viewModes,
      filterFieldKeys,
      selectedRowKeys,
      selectionType,
      setSelectionType,
      searchActions,
      filterFields,
      logicFilter,
    }),
    [
      objectMeta,
      params,
      setParams,
      columns,
      setColumns,
      visibleColumnSet,
      visibleKeys,
      setVisibleKeys,
      currentMode,
      setCurrentMode,
      viewModes,
      filterFieldKeys,
      selectedRowKeys,
      selectionType,
      setSelectionType,
      searchActions,
      filterFields,
      logicFilter,
    ]
  )

  const IndexContent = useCallback(() => {
    switch (currentMode) {
      case 'list':
        return (
          <MetaTable
            rowKey={objectMeta.idKey}
            columnMetas={columnMetas}
            rowSelection={rowSelection}
            columnComponents={components}
            {...tableProps}
            pagination={false}
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
              {...tableProps}
              pagination={false}
            />
            <PaginationBar {...paginationProps} />
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

  return (
    <IndexViewContext.Provider value={indexViewContext}>
      <div className={classNames('tbox-index-view', className)} style={style}>
        {children ? (
          children
        ) : (
          <>
            <FilterPanel />
            <TableStatusBar />
          </>
        )}
        <IndexContent />
      </div>
    </IndexViewContext.Provider>
  )
}
