export enum MetaValueType {
  INTEGER = 'integer',
  NUMBER = 'number',
  STRING = 'string',
  TEXT = 'text',
  DATE = 'date',
  DATETIME = 'datetime',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT_ID = 'refId',
  SINGLE_OPTION = 'singleOption',
  MULTI_OPTION = 'multiOption',
  PERCENT = 'percent',
  OBJECT = 'object',
  RATE = 'rate',
  TIMESTAMP = 'timestamp',
  BIG_INT = 'bigInt',
  BIG_NUMBER = 'bigNumber',
  ADDRESS = 'address',
}

export declare type DefaultRowData = Record<string, any>

export interface IObjectMeta extends IFieldMeta {
  primaryKey: string
  properties: Record<string, IFieldMeta>
}

export interface IFieldOption {
  label: string
  value: string
  disabled?: boolean
  options?: IFieldOption[]
}

export interface IMetaBase {
  type?: MetaValueType | string
  options?: IFieldOption[]
  refRegisterId?: string
  unique?: boolean
  required?: boolean
  maximum?: number
  minimum?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  precision?: number
  multipleOf?: number
  minProperties?: number
  maxProperties?: number
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  pattern?: string
  format?: string
  titleKey?: string
  defaultValue?: any
  properties?: Record<string, IFieldMeta>
}

export declare type MetaSchemaType = IFieldMeta | IFieldItems

export interface IFieldItems extends IFieldMeta {
  items?: IFieldItems
}

export interface IFieldMeta extends IMetaBase {
  key: string
  name: string
  description?: string
  primary?: boolean
  unique?: boolean
  primaryKey?: string
  parentKey?: string
  items?: IFieldItems
  index?: number
}

export type FieldItem = IFieldItems | IFieldMeta

export type tupleItem = Array<IFieldItems>

export interface IMetaListResult<RowData = DefaultRowData> {
  businessObjectMeta: IObjectMeta
  content: RowData[]
}

export interface IMetaPageableResult<RowData = DefaultRowData>
  extends IMetaListResult<RowData> {
  number: number // 从0开始计数
  size: number
  totalElements: number
  totalPage: number
}

export type IMetaObjectResult = DefaultRowData

export interface IFieldGroupMeta {
  label: string
  value: string
  children: IFieldMeta[]
}
