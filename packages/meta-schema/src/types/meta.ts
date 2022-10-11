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
  type: MetaValueType | string
  properties?: { [key: string]: IMetaBase }
}

export interface IFieldItems extends IMetaBase {
  type: MetaValueType | string
  properties?: { [key: string]: IFieldMeta }
}

export interface IFieldMeta extends IMetaBase {
  key: string
  name: string
  description?: string
  primary?: boolean
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
  primaryKey?: string
  parentKey?: string
  properties?: Record<string, IFieldMeta>
  items?: IFieldItems
  index?: number
  defaultValue?: any
}

export type FieldItem = IFieldItems | IFieldMeta

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
