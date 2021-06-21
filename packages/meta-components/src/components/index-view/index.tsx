import React, {
  CSSProperties,
  Ref,
  useCallback,
  useMemo,
  useState,
  useImperativeHandle,
} from 'react'
import classNames from 'classnames'
import { MetaValueType } from '@toy-box/meta-schema'
import { PaginationBar } from '@toy-box/toybox-ui'
import { MetaTable } from '../meta-table'
import { FilterPanel } from './components'
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
  defaultSelectionType?: 'checkbox'
  /**
   * @description 数据获取方法
   */
  loadData: LoadDataType
  filterFieldKeys?: string[]
  /**
   * @description 条件查询简单模式
   */
  logicFilter?: boolean
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
      defaultSelectionType,
      loadData,
      filterFieldKeys,
      logicFilter,
      urlQuery,
      children,
    }: IIndexViewProps & { children: React.ReactNode },
    ref: Ref<any>
  ) => {
    const [params, setParams] = useState<any>()
    const [selectedRowKeys, setSelectedRowKeys] = useState<RawValue[]>([])
    const [selectedRows, setSelectedRows] = useState<RowData[]>([])
    const [selectionType, setSelectionType] = useState(defaultSelectionType)
    const [currentMode, setCurrentMode] = useState<IndexModeType>(mode)

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

    const paramsActions = useMemo(() => {
      return {
        getParams: () => params,
        resetParams: () => setParams(undefined),
      }
    }, [params, setParams])

    const service = useCallback(
      (params, filterParams) => {
        return loadData(params, filterParams)
      },
      [loadData]
    )

    const { pagination, tableProps, searchActions } = useTable(service, {
      logicFilter,
      paramsActions,
    })

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
      ]
    )

    // const { tableProps, paginationProps } = useMetaTable(loadData, {
    //   pagination: { defaultCurrent: 1, defaultPageSize: 4 },
    // })

    // useEffect(() => {
    //   console.log('params', params)
    //   searchActions.submit()
    // }, [params])

    useImperativeHandle(
      ref,
      () => ({
        selectedRowKeys,
        selectedRows,
      }),
      [selectedRowKeys, selectedRows]
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
)
