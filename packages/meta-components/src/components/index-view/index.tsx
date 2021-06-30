import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  useImperativeHandle,
} from 'react'
import classNames from 'classnames'
import { PaginationProps } from 'antd'
import { MetaValueType } from '@toy-box/meta-schema'
import update from 'immutability-helper'
import { PaginationBar, IButtonClusterProps } from '@toy-box/toybox-ui'
import { omit } from '@toy-box/toybox-shared'
import { MetaTable } from '../meta-table'
import { FilterPanel, ColumnsSetValueType, TableStatusBar } from './components'
import { useTable, useQuery } from './hooks'
import { LoadDataType, IndexModeType } from './types'
import {
  IColumnVisible,
  RowData,
  IMetaTableProps,
} from '../meta-table/interface'
import { IndexViewContext } from './context'

export * from './hooks'
export * from './components'

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
   * @description 是否与url联动
   * @default false
   */
  urlQuery?: boolean
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

export declare type IndexViewRefType = {
  reload: () => void
  reset: () => void
  dataSource?: RowData[]
  selectedRowKey?: string[]
  selectedRows?: RowData[]
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
      pagination,
      tableOperate,
      urlQuery,
      children,
    }: IIndexViewProps & { children: React.ReactNode },
    ref: React.MutableRefObject<IndexViewRefType>
  ) => {
    const [query, setQuery] = useQuery()
    const preParamsRef = useRef<Toybox.MetaSchema.Types.ICompareOperation[]>()
    const paramsRef = useRef<Toybox.MetaSchema.Types.ICompareOperation[]>()
    const [preParams, setPreParams] = useState<
      Toybox.MetaSchema.Types.ICompareOperation[] | undefined
    >()
    const [params, setParams] = useState<
      Toybox.MetaSchema.Types.ICompareOperation[] | undefined
    >()
    const [pageable, setPageable] =
      useState<{ current?: number; pageSize?: number }>()

    useEffect(() => setPreParams(params), [params])
    useEffect(() => {
      preParamsRef.current = preParams
      return () => undefined
    }, [preParams])
    useEffect(() => {
      paramsRef.current = params
      return () => undefined
    }, [params])
    useEffect(() => {
      if (urlQuery) {
        setPageable(
          query.pageable
            ? {
                current: query.pageable.current
                  ? Number.parseInt(query.pageable.current)
                  : undefined,
                pageSize: query.pageable.pageSize
                  ? Number.parseInt(query.pageable.pageSize)
                  : undefined,
              }
            : undefined
        )
        setParams(query.params)
      }
    }, [query])

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [selectedRows, setSelectedRows] = useState<RowData[]>([])
    const [selectionType, setSelectionType] = useState(defaultSelectionType)
    const [currentMode, setCurrentMode] = useState<IndexModeType>(mode)

    const setQuerySearch = useCallback(
      (pageable) => {
        setTimeout(() => {
          if (urlQuery) {
            if (pageable) {
              setQuery(
                update(query, {
                  params: { $set: preParamsRef.current },
                  pageable: { $set: pageable },
                })
              )
            } else {
              setQuery(
                update(query, { params: { $set: preParamsRef.current } })
              )
            }
          } else {
            setParams(preParamsRef.current)
            pageable && setPageable(pageable)
          }
        })
      },
      [urlQuery, preParamsRef]
    )

    const paramsActions = useMemo(
      () => ({
        getParams: () => paramsRef,
        getPreParams: () => preParamsRef,
        setPreParams,
        setParams,
      }),
      [preParamsRef, setPreParams]
    )

    const {
      pagination: innerPagination,
      tableProps,
      searchActions,
    } = useTable(
      loadData,
      {
        logicFilter,
        paramsActions,
      },
      pageable,
      params
    )

    const paginationProps = useMemo(
      () => ({
        ...pagination,
        ...omit(innerPagination, ['onChange', 'current', 'pageSize']),
        onChange: (current, pageSize) => {
          setQuerySearch({
            current,
            pageSize,
          })
        },
        current: pageable?.current || innerPagination.current,
        pageSize: pageable?.pageSize || innerPagination.pageSize,
      }),
      [pagination, innerPagination, pageable]
    )

    useImperativeHandle(
      ref,
      () => ({
        reload: searchActions.submit,
        reset: searchActions.reset,
        dataSource: tableProps.dataSource,
        selectedRowKeys,
        selectedRows,
      }),
      [selectedRowKeys, selectedRows, tableProps, searchActions]
    )

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
          .map((key) => {
            const column = visibleColumns.find(
              (c) => c.key === key
            ) as IColumnVisible
            return {
              label: properties[key].name,
              value: key,
              ...column,
            }
          })
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

    const filterFields = useMemo(() => {
      const { properties } = objectMeta
      if (properties) {
        return Object.keys(properties)
          .filter((key) => {
            return filterFieldKeys
              ? filterFieldKeys.includes(key)
              : key != objectMeta.primaryKey
          })
          .map((key) => properties[key])
      }
      return []
    }, [objectMeta, filterFieldKeys])

    const indexViewContext = useMemo(
      () => ({
        objectMeta,
        setQueryParams: setQuerySearch,
        params,
        setParams,
        preParams,
        setPreParams,
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
        setQuerySearch,
        params,
        setParams,
        preParams,
        setPreParams,
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
              rowKey={objectMeta.primaryKey}
              columnMetas={columnMetas}
              rowSelection={rowSelection}
              columnComponents={components}
              operate={tableOperate}
              {...tableProps}
              pagination={false}
            />
          )
        case 'table':
        default:
          return (
            <>
              <MetaTable
                rowKey={objectMeta.primaryKey}
                columnMetas={columnMetas}
                rowSelection={rowSelection}
                columnComponents={components}
                operate={tableOperate}
                {...tableProps}
                pagination={false}
              />
              <PaginationBar {...paginationProps} />
            </>
          )
      }
    }, [
      currentMode,
      objectMeta.primaryKey,
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

IndexView.displayName = 'IndexView'
