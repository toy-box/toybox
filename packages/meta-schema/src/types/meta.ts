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

export interface IMetaObject extends IFieldMeta {
  idKey?: string
  titleKey: string
}

export interface IFieldOption {
  label: string
  value: string
  disabled?: boolean
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