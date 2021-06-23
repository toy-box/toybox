import React, { FC, useCallback, useMemo } from 'react'
import { DefaultRecordType } from 'rc-table/lib/interface'
import { VerticalTable, VerticalTableProps } from '@toy-box/toybox-ui'
import { DefaultColumnRenderMap } from '../meta-table/components'
import { metaRender } from '../meta-table/utils'
import { ColumnMetaType, IColumnProps } from '../meta-table/interface'

export interface MetaVerticalTableProps<RecordType>
  extends Omit<VerticalTableProps<RecordType>, 'columns'> {
  columnMetas: ColumnMetaType[]
  columnComponents?: Record<string, FC<IColumnProps>>
}

export const MetaVerticalTable: FC<MetaVerticalTableProps<DefaultRecordType>> =
  ({
    columnMetas,
    dataSource,
    columnWidth,
    columnComponents = {},
    headerWidth,
  }) => {
    const mergeRenders = useMemo(() => {
      return Object.assign(DefaultColumnRenderMap, columnComponents)
    }, [columnComponents])

    const makeColumns = useCallback(
      (columnMetas: ColumnMetaType[]) => {
        const columns = columnMetas.map((columnMeta) => {
          return {
            key: columnMeta.key,
            title: columnMeta.name,
            dataIndex: columnMeta.key,
            render: metaRender(
              columnMeta,
              mergeRenders,
              DefaultColumnRenderMap['string'],
              true
            ),
          }
        })
        return columns
      },
      [mergeRenders]
    )

    const columns = useMemo(
      () => makeColumns(columnMetas),
      [columnMetas, makeColumns]
    )

    return (
      <VerticalTable
        columns={columns}
        columnWidth={columnWidth}
        headerWidth={headerWidth}
        dataSource={dataSource}
      />
    )
  }
