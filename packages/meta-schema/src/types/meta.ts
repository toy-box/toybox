export enum MetaValueType {
  INTEGER = 'integer',
  NUMBER = 'number',
  STRING = 'string',
  TEXT = 'text',
  DATE = 'date',
  DATETIME = 'datetime',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT_ID = 'objectId',
  SINGLE_OPTION = 'singleOption',
  MULTI_OPTION = 'multiOption',
  PERCENT = 'percent',
  OBJECT = 'object',
  RATE = 'rate',
}

export declare type DefaultRowData = Record<string, any>

export interface IObjectMeta extends IFieldMeta {
  idKey?: string
  titleKey: string
}

export interface IFieldOption {
  label: string
  value: string
  disabled?: boolean
  children?: IFieldOption[]
}

export interface IFieldItems {
  type: MetaValueType | string
  properties: { [key: string]: IFieldMeta }
}

export interface IFieldMeta {
  key: string
  name: string
  type: MetaValueType | string
  description?: string
  primary?: boolean
  options?: IFieldOption[]
  refObjectId?: string
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
  pattern?: string
  format?: string
  idKey?: string
  titleKey?: string
  properties?: { [key: string]: IFieldMeta }
  items?: IFieldItems
  index?: number
  defaultValue?: any
  parentKey?: string
}

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
