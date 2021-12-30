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
import { CompareOP, MetaValueType } from '@toy-box/meta-schema'
import update from 'immutability-helper'
import { PaginationBar, IButtonClusterProps } from '@toy-box/toybox-ui'
import { omit } from '@toy-box/toybox-shared'
import { RowSelectionType } from 'antd/es/table/interface'
import { MetaTable } from '../meta-table'
import { useTable, useQuery } from './hooks'
import { LoadDataType, DataGridModeType } from './types'
import {
  IColumnVisible,
  RowData,
  IMetaTableProps,
} from '../meta-table/interface'
import { DataGridContext } from './context'
import {
  ViewSetter,
  TableStatusBar,
  FilterPanel,
  OperatePanel,
  FilterDisplay,
  ColumnsSetValueType,
} from './components'

// export * from './hooks'

const LIST_RENDER = 'listRender'

const simpleParams = (
  compares?: Toybox.MetaSchema.Types.ICompareOperation[]
) => {
  const sParams: Record<string, any> = {}
  if (compares) {
    compares.forEach((compare) => {
      if (
        compare.source &&
        compare.op === CompareOP.EQ &&
        compare.target &&
        compare.target !== ''
      ) {
        sParams[compare.source] = compare.target
      }
    })
  }
  return sParams
}

type TableOption = Pick<
  IMetaTableProps,
  | 'bordered'
  | 'scroll'
  | 'showHeader'
  | 'title'
  | 'expandable'
  | 'rowClassName'
  | 'size'
>

export interface IDataGridProps<IParams = any> {
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
  mode?: DataGridModeType
  /**
   * @description 可切换的模式
   * @default null
   */
  viewModes?: DataGridModeType[]
  className?: string
  columnComponents?: IMetaTableProps['columnComponents']
  /**
   * @description 是否与url联动
   * @default false
   */
  urlQuery?: boolean
  defaultSelectionType?: RowSelectionType
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
  tableOption?: TableOption
  /**
   * @description 当数据重新加载时保留已选择的记录
   */
  keepSelected?: boolean
  selectedRows?: RowData[]
  selectedRowKeys?: string[]
  setSelectedRows?: (rows: RowData[]) => void
  setSelectedRowKeys?: (keys: string[]) => void
  children?: React.ReactNode
}

export declare type DataGridRefType = {
  reload: () => void
  reset: () => void
  dataSource?: RowData[]
}

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<
    IDataGridProps & React.RefAttributes<DataGridRefType>
  > {
  ViewSetter: typeof ViewSetter
  TableStatusBar: typeof TableStatusBar
  FilterPanel: typeof FilterPanel
  OperatePanel: typeof OperatePanel
  FilterDisplay: typeof FilterDisplay
}

export const DataGrid = React.forwardRef<DataGridRefType, IDataGridProps>(
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
      tableOption,
      keepSelected,
      selectedRows = [],
      selectedRowKeys = [],
      setSelectedRows = (rows: RowData[]) => undefined,
      setSelectedRowKeys = (keys: string[]) => undefined,
      children,
    },
    ref: React.MutableRefObject<DataGridRefType>
  ) => {
    const [query, setQuery] = useQuery()
    const preParamsRef = useRef<Toybox.MetaSchema.Types.ICompareOperation[]>()
    const paramsRef = useRef<Toybox.MetaSchema.Types.ICompareOperation[]>()
    console.log('in selectedRowKeys', selectedRowKeys)
    const [preParams, setPreParams] = useState<
      Toybox.MetaSchema.Types.ICompareOperation[] | undefined
    >()
    const [params, setParams] = useState<
      Toybox.MetaSchema.Types.ICompareOperation[] | undefined
    >()
    const [pageable, setPageable] = useState<{
      current?: number
      pageSize?: number
    }>({ current: pagination?.current, pageSize: pagination?.pageSize })

    const queryOption = () => {
      if (query.pageable) {
        return Number.parseInt(query.pageable.pageSize) === pageable.pageSize &&
          Number.parseInt(query.pageable.current) === pageable.current
          ? pageable
          : {
              current: query.pageable.current
                ? Number.parseInt(query.pageable.current)
                : undefined,
              pageSize: query.pageable.pageSize
                ? Number.parseInt(query.pageable.pageSize)
                : undefined,
            }
      }
      return pageable
    }

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
        setPageable(queryOption())
        setParams(query.params ? JSON.parse(query.params) : undefined)
      }
    }, [query])

    const [selectionType, setSelectionType] = useState(defaultSelectionType)
    const [currentMode, setCurrentMode] = useState<DataGridModeType>(mode)

    const setQuerySearch = useCallback(
      (pageable: any, type: 'turnPage' | 'filterSearch') => {
        setTimeout(() => {
          if (urlQuery) {
            if (type === 'turnPage') {
              setQuery(
                update(query, {
                  params: { $set: JSON.stringify(preParamsRef.current) },
                  pageable: { $set: pageable },
                })
              )
            } else {
              setQuery(
                update(query, {
                  params: {
                    $set: preParamsRef.current
                      ? JSON.stringify(preParamsRef.current)
                      : undefined,
                  },
                  pageable: {
                    $set: { current: '1', pageSize: pageable.pageSize },
                  },
                })
              )
            }
          } else {
            setParams(preParamsRef.current)
            type === 'turnPage'
              ? setPageable(pageable)
              : setPageable({ current: 1, pageSize: pageable.pageSize })
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

    const onloadData = (pageable, params) => {
      return loadData(
        pageable,
        logicFilter ? params : simpleParams(params)
      ).then((data) => {
        if (!keepSelected) {
          setSelectedRowKeys([])
          setSelectedRows([])
        }
        return data
      })
    }

    const {
      pagination: innerPagination,
      tableProps,
      reload,
    } = useTable(
      onloadData,
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
          setQuerySearch(
            {
              current,
              pageSize,
            },
            'turnPage'
          )
        },
        current: pageable?.current || innerPagination.current,
        pageSize: pageable?.pageSize || innerPagination.pageSize,
      }),
      [pagination, innerPagination, pageable]
    )

    const reset = useCallback(() => {
      if (urlQuery) {
        setQuery({})
      } else {
        setParams([])
        setPageable({})
      }
    }, [urlQuery])

    useImperativeHandle(
      ref,
      () => ({
        reload,
        reset,
        dataSource: tableProps.dataSource,
      }),
      [tableProps, reload, reset]
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
              type: selectionType,
              selectedRowKeys,
              onChange: (keys: string[], rows: RowData[]) => {
                if (keepSelected) {
                  setSelectedRowKeys(
                    selectedRowKeys
                      .filter(
                        (key) =>
                          !tableProps.dataSource.some(
                            (row) => row[objectMeta.primaryKey || 'id'] === key
                          )
                      )
                      .concat(...keys)
                  )
                  setSelectedRows(
                    selectedRows
                      .filter(
                        (selectedRow) =>
                          !tableProps.dataSource.some(
                            (row) =>
                              row[objectMeta.primaryKey || 'id'] ===
                              selectedRow[objectMeta.primaryKey || 'id']
                          )
                      )
                      .concat(...rows)
                  )
                } else {
                  setSelectedRowKeys(keys)
                  setSelectedRows(rows)
                }
              },
            }
          : undefined,
      [
        selectedRowKeys,
        selectionType,
        setSelectedRowKeys,
        tableProps.dataSource,
      ]
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
      return visibleKeys
        .filter((key) => columns.some((col) => col.value === key))
        .map((key) => {
          const fieldMeta = properties[key]
          const column = visibleColumns.find(
            (c) => c.key === key
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
        setQuerySearch,
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
        filterFields,
        logicFilter,
        pageable,
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
        filterFields,
        logicFilter,
        pageable,
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
              {...tableOption}
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
                {...tableOption}
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
      <DataGridContext.Provider value={indexViewContext}>
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
      </DataGridContext.Provider>
    )
  }
) as CompoundedComponent

DataGrid.displayName = 'DataGrid'

DataGrid.ViewSetter = ViewSetter
DataGrid.TableStatusBar = TableStatusBar
DataGrid.FilterPanel = FilterPanel
DataGrid.OperatePanel = OperatePanel
DataGrid.FilterDisplay = FilterDisplay
