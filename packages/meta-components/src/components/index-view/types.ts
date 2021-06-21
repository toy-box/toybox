import { RowData } from '../meta-table/interface'

export interface IPageResult {
  list: RowData[]
  total: number
  pageSize?: number
  current?: number
}

export interface IPageable {
  pageSize: number
  current: number
}

export type IndexModeType = 'table' | 'list' | 'card'

export type LoadDataType = (
  pageable: IPageable,
  filterParams: any
) => Promise<IPageResult>

export interface ISearchActions {
  submit: () => void
  reset: () => void
}
