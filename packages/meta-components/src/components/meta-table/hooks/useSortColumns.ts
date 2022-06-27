import dayjs from 'dayjs'
import { MetaValueType } from '@toy-box/meta-schema'
import 'antd/lib/table/interface'

import { ColumnMetaType } from '../interface'

export const useSortColumns = (
  columnMetas: ColumnMetaType[],
  sorter: boolean | string[] | undefined,
  remote?: boolean
) => {
  return columnMetas.map((columnMeta) => {
    const columnSort = Array.isArray(sorter)
      ? sorter.includes(columnMeta.key)
      : sorter
    return {
      ...columnMeta,
      sorter: columnSort ? remote : sorterProvider(columnMeta),
    }
  })
}

const sorterProvider = (columnMeta: ColumnMetaType) => {
  switch (columnMeta.type) {
    case MetaValueType.DATE:
    case MetaValueType.DATETIME:
      return (prev: Record<string, any>, current: Record<string, any>) => {
        return dayjs(prev[columnMeta.key]).diff(dayjs(current[columnMeta.key]))
      }
    case MetaValueType.OBJECT:
      if (columnMeta.titleKey != null) {
        return (prev: Record<string, any>, current: Record<string, any>) => {
          const prevData = prev[columnMeta.key]
          const currentData = current[columnMeta.key]
          if (prevData != null && currentData == null) {
            return 1
          }
          if (prevData == null && currentData != null) {
            return -1
          }
          if (prevData == null && currentData == null) {
            return 0
          }
          if (
            prevData[columnMeta.titleKey as string] >
            currentData[columnMeta.titleKey as string]
          ) {
            return 1
          }
          if (
            prevData[columnMeta.titleKey as string] <
            currentData[columnMeta.titleKey as string]
          ) {
            return -1
          }
          return 0
        }
      }
      return undefined
    case MetaValueType.ARRAY:
      return undefined
    default:
      return (prev: Record<string, any>, current: Record<string, any>) => {
        if (prev[columnMeta.key] > current[columnMeta.key]) {
          return 1
        }
        if (prev[columnMeta.key] < current[columnMeta.key]) {
          return -1
        }
        return 0
      }
  }
}
