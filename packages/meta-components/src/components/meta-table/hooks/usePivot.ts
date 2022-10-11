import { useMemo } from 'react'
import { MetaValueType } from '@toy-box/meta-schema'
import { ColumnMetaType, RowData } from '../interface'

declare type PosIndex = number[]

const compare = (columnMeta: ColumnMetaType, prev: any, current: any) => {
  if (columnMeta.type === MetaValueType.OBJECT) {
    const prevObj = prev != null ? prev[columnMeta.key] : null
    const currentObj = current != null ? current[columnMeta.key] : null
    const prevValue = prevObj ? prevObj[columnMeta.primaryKey || 'id'] : null
    const currentValue = currentObj
      ? currentObj[columnMeta.primaryKey || 'id']
      : null
    if (prevValue < currentValue) {
      return -1
    }
    if (prevValue > currentValue) {
      return 1
    }
    if (prevValue == null && currentValue != null) {
      return -1
    }
    if (prevValue != null && currentValue == null) {
      return 1
    }
    return 0
  }
  if (
    (prev != null ? prev[columnMeta.key] : null) <
    (current != null ? current[columnMeta.key] : null)
  ) {
    return -1
  }
  if (
    (prev != null ? prev[columnMeta.key] : null) >
    (current != null ? current[columnMeta.key] : null)
  ) {
    return 1
  }
  return 0
}

const sortMetaData = (columnMeta: ColumnMetaType, rows: RowData[]) => {
  return rows.sort((prev, current) => compare(columnMeta, prev, current))
}

const mulSortMetaData = (
  columnMeta: ColumnMetaType,
  rows: RowData[],
  posIndex: number[]
) => {
  const newRows: RowData[] = []
  let start = -1
  posIndex.forEach((pos) => {
    const sorted = sortMetaData(
      columnMeta,
      rows.filter((row, idx) => idx > start && idx <= start + pos)
    )
    newRows.push(...sorted)
    start += pos
  })
  return newRows
}

const sortPosIndex = (columnMeta: ColumnMetaType, rows: RowData[]) => {
  const newRowIndex: number[] = []
  let pos = 0
  rows.forEach((row, index) => {
    if (pos === 0) {
      pos++
    } else {
      if (compare(columnMeta, rows[index - 1], row) !== 0) {
        if (pos > 0) {
          newRowIndex.push(pos)
          pos = 1
        }
      } else {
        pos++
      }
    }
    if (index === rows.length - 1) {
      newRowIndex.push(pos)
    }
  })
  return newRowIndex
}

const mulSortPosIndex = (
  columnMeta: ColumnMetaType,
  rows: RowData[],
  posIndex: number[]
) => {
  const newPosIndex: number[] = []

  let start = -1
  posIndex.forEach((pos) => {
    const rowsInPos = rows.filter(
      (row, idx) => idx > start && idx <= start + pos
    )
    newPosIndex.push(...sortPosIndex(columnMeta, rowsInPos))
    start += pos
  })

  return newPosIndex
}

export const usePivot = (
  dataSource: RowData[],
  columnMetas: ColumnMetaType[],
  dimensions: string[] = []
) => {
  let rows = dataSource.map((item) => item)
  let posIndexes: Array<number[]> = []
  dimensions.forEach((key, keyIdx) => {
    const columnMeta = columnMetas.find((c) => c.key === key)
    if (columnMeta == null) return
    if (keyIdx === 0) {
      rows = sortMetaData(columnMeta, rows)
      posIndexes.push(sortPosIndex(columnMeta, rows))
    } else {
      rows = mulSortMetaData(columnMeta, rows, posIndexes[keyIdx - 1])
      posIndexes.push(mulSortPosIndex(columnMeta, rows, posIndexes[keyIdx - 1]))
    }
  })
  const pivotData = {
    rows,
    posIndexes,
  }
  return [pivotData.rows, pivotData.posIndexes] as [RowData[], PosIndex[]]
}
