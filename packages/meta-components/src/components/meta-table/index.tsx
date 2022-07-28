import React, { FC, useCallback, useMemo, useState } from 'react'
import { Table } from 'antd'
import update from 'immutability-helper'
import { ColumnsType, ColumnType } from 'antd/lib/table'
import { RenderExpandIconProps } from 'rc-table/lib/interface'
import { ArrowRightSLine } from '@airclass/icons'
import {
  IColumnProps,
  ColumnMetaType,
  RowData,
  IMetaTableProps,
  IBaseOperateColumnProps,
} from './interface'
import { metaRender } from './utils'
import {
  DefaultColumnRenderMap,
  ResizableTitle,
  ResizeCallbackData,
  OperateColumn,
} from './components'
import { usePivot, sortColumns } from './hooks'
import './styles'
export * from './context'
export * from './utils'

export const columnFactory = (
  columnMeta: ColumnMetaType,
  render: FC<IColumnProps>
) => {
  return (text: any, record: { [key: string]: any }, index: number) => {
    return render({ text, record, index, columnMeta })
  }
}

function operateFactory<T>(operate: T, render: FC<IBaseOperateColumnProps<T>>) {
  return (text: any, record: RowData, index: number) => {
    return render({ text, record, index, operate })
  }
}

export const MetaTable: FC<IMetaTableProps> = ({
  rowKey = 'id',
  size,
  columnMetas,
  dataSource,
  columnComponents = {},
  pagination,
  operate,
  operateHeader,
  operateColumn,
  resizableTitle,
  showHeader,
  expandable,
  bordered,
  rowSelection,
  pivotOption,
  scroll,
  width,
  sorter,
  summary,
  title,
  onChange,
  rowClassName,
}) => {
  // TODO: 宽度调整功能需要完善，初始化值问题、及显示字段变动问题
  const avgColWidth = useMemo(
    () =>
      width
        ? width / columnMetas.length > 100
          ? width / columnMetas.length
          : 100
        : 100,
    []
  )
  const [columnWidths, setColumnWidths] = useState<number[]>(
    Array(columnMetas.length).fill(resizableTitle ? avgColWidth : undefined)
  )

  const mergeRenders = useMemo(() => {
    return Object.assign(DefaultColumnRenderMap, columnComponents)
  }, [columnComponents])

  const leftMetas = useMemo(() => {
    if (pivotOption) {
      return columnMetas.filter((meta) =>
        pivotOption.dimensions.includes(meta.key)
      )
    }
    return columnMetas
  }, [columnMetas, pivotOption])

  const rightMetas = useMemo(() => {
    if (pivotOption) {
      return columnMetas.filter(
        (meta) => !pivotOption.dimensions.includes(meta.key)
      )
    }
    return []
  }, [columnMetas, pivotOption])

  const innerColumnMetas = useMemo(() => {
    if (pivotOption) {
      return [...leftMetas, ...rightMetas]
    } else if (sorter) {
      return sortColumns(
        [...leftMetas, ...rightMetas],
        sorter,
        onChange != null
      )
    }
    return [...leftMetas, ...rightMetas]
  }, [pivotOption, sorter, leftMetas, rightMetas, onChange])

  const [rows, posIndexes] = usePivot(
    (dataSource || []).map((item) => item),
    innerColumnMetas,
    pivotOption?.dimensions
  )

  const rowSpanIndexes = useMemo(
    () =>
      posIndexes.map((posIndex) => {
        const arr: number[] = []
        posIndex.forEach((pos) => {
          const empty: number[] = new Array(pos - 1).fill(0)
          arr.push(...[pos, ...empty])
        })
        return arr
      }),
    [posIndexes]
  )

  const getRowSpan = useCallback(
    (columnMeta: ColumnMetaType, index: number) => {
      if (pivotOption) {
        const posIndex =
          rowSpanIndexes[
            pivotOption.dimensions.findIndex((d) => d === columnMeta.key)
          ]
        return posIndex ? posIndex[index] : undefined
      }
      return undefined
    },
    [pivotOption, rowSpanIndexes]
  )

  const handleResize = useCallback(
    (index: number) => {
      return (
        e: React.SyntheticEvent<Element, Event>,
        data: ResizeCallbackData
      ) => {
        setColumnWidths(
          update(columnWidths, { [index]: { $set: data.size.width } })
        )
      }
    },
    [columnWidths]
  )

  const makeColumns = useCallback(
    (columnMetas: ColumnMetaType[]) => {
      const columns: ColumnsType<Record<string, any>> = columnMetas.map(
        (columnMeta, index) => {
          return {
            key: columnMeta.key,
            title: columnMeta.name,
            dataIndex: columnMeta.key,
            align: columnMeta.align,
            width: columnMeta.width || columnWidths[index],
            fixed: columnMeta.fixed,
            sorter: columnMeta.sorter,
            render: (text, record, index) => {
              const MetaRender = metaRender(
                columnMeta,
                mergeRenders,
                DefaultColumnRenderMap[columnMeta.type] ||
                  DefaultColumnRenderMap['string']
              )
              const obj = {
                children: (
                  <MetaRender text={text} record={record} index={index} />
                ),
                props: {
                  rowSpan: getRowSpan(columnMeta, index),
                },
              }
              return obj
            },
            onHeaderCell: resizableTitle
              ? (column: ColumnType<Record<string, any>>) =>
                  ({
                    width: column.width,
                    onResize: handleResize(index),
                  } as React.HTMLAttributes<HTMLElement>)
              : undefined,
          }
        }
      )
      return columns
    },
    [columnWidths, resizableTitle, mergeRenders, getRowSpan, handleResize]
  )

  const columns = useMemo(() => {
    const columns = makeColumns(innerColumnMetas)
    if (operate) {
      columns.push({
        key: 'meta-table-operate',
        title: operateHeader,
        dataIndex: 'meta-table-operate',
        align: 'right',
        render: operateFactory(operate, operateColumn || OperateColumn),
        width: 100,
      })
    }
    return columns
  }, [makeColumns, innerColumnMetas, operate, operateHeader, operateColumn])

  const mixExpandable = useMemo(() => {
    return expandable
      ? {
          expandIcon: ({
            expanded,
            onExpand,
            record,
          }: RenderExpandIconProps<RowData>) =>
            expanded ? (
              <ArrowRightSLine
                style={{
                  transform: 'rotate(90deg)',
                  transition: 'transform .2s ease-in-out',
                }}
                onClick={(e) => onExpand(record, e)}
              />
            ) : (
              <ArrowRightSLine
                style={{
                  transform: 'rotate(0deg)',
                  transition: 'transform .2s ease-in-out',
                }}
                onClick={(e) => onExpand(record, e)}
              />
            ),
          ...expandable,
        }
      : undefined
  }, [expandable])

  const components = useMemo(
    () =>
      resizableTitle
        ? {
            header: {
              cell: ResizableTitle,
            },
          }
        : undefined,
    [resizableTitle]
  )

  return (
    <Table
      components={components}
      rowKey={rowKey}
      rowClassName={rowClassName}
      size={size}
      columns={columns}
      onChange={onChange}
      dataSource={rows}
      pagination={pagination}
      summary={summary}
      title={title}
      showHeader={showHeader}
      expandable={mixExpandable}
      bordered={bordered}
      rowSelection={rowSelection}
      scroll={scroll}
    />
  )
}
