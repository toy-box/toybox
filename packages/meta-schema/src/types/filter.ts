export enum LogicOP {
  AND = '$and',
  OR = '$or',
  NOT = '$not',
  NOR = '$nor',
}

export type LogicOpType = '$and' | '$or' | '$not' | '$nor'

export interface ICompareOperation<DataType = any> {
  source: string
  op: CompareOP
  type?: string
  target: DataType
}

export interface ILogicFilter {
  logic: LogicOP
  compares: Partial<ICompareOperation>[]
  subLogic?: ILogicFilter[]
}

export enum CompareOP {
  EQ = '$eq',
  GT = '$gt',
  GTE = '$gte',
  IN = '$in',
  LT = '$lt',
  LTE = '$lte',
  NE = '$ne',
  NIN = '$nin',
  IS_NULL = '$isNull',
  LIKE = '$like',
  UNIT_DATE_RANGE = '$unitDateRange',
  BETWEEN = '$between',
  op = 'op',
}

export type DateFilterUnitType = 'DAY' | 'WEEK' | 'MONTH' | 'SEASON' | 'YEAR'

export type DateUnit = 'DAY' | 'MONTH' | 'YEAR'

export type DateFilterValueType =
  | 'DAY:0:0'
  | 'DAY:-1:-1'
  | 'DAY:1:1'
  | 'DAY:-6:0'
  | 'DAY:-29:0'
  | 'DAY:-59:0'
  | 'DAY:-89:0'
  | 'DAY:-119:0'
  | 'DAY:0:6'
  | 'DAY:0:29'
  | 'DAY:0:59'
  | 'DAY:0:89'
  | 'DAY:0:119'
  | 'MONTH:0:0'
  | 'MONTH:-1:-1'
  | 'MONTH:1:1'
  | 'MONTH:0:1'
  | 'MONTH:-1:0'
  | 'YEAR:0:0'
  | 'YEAR:-1:-1'
  | 'YEAR:1:1'

export interface IDateFilterOption {
  labelValue: DateFilterValueType
  value: { unit: DateFilterUnitType; begin: number; end: number }
}

export interface IDateFilterUnitTypeGroup {
  group: string
  options: IDateFilterOption[]
}

export interface IDateFilterLocale {
  lang: {
    [key: string]: string
  }
}

export enum CompareType {
  REFERENCE = 'REFERENCE',
  INPUT = 'INPUT',
}

export type SortType = 'asc' | 'desc'

export interface IMetaSort {
  key: string
  sortType: SortType
}

export interface IMetaFindQuery {
  extend?: boolean
  fields?: string[]
  filter?: ILogicFilter
  sort?: IMetaSort[]
}
