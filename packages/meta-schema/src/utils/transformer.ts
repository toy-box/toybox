import Ajv, { SchemaObject } from 'ajv'
import {
  MetaSchemaType,
  IFieldItems,
  IFieldMeta,
  IFieldOption,
  MetaValueType,
} from '../types'

export const DOMAIN = 'flowmeta.com'
export const DRAFT_2020 = 'https://json-schema.org/draft/2020-12/schema'

export function transformToJsonSchema(
  metaSchema: MetaSchemaType,
  isProperties?: boolean
): SchemaObject {
  const {
    type,
    options,
    name,
    key,
    properties,
    items,
    refRegisterId,
    defaultValue,
    ...shareSchema
  } = metaSchema
  delete shareSchema.required
  const baseSchema = isProperties
    ? {}
    : {
        $id: key ? `https://${DOMAIN}/${metaSchema.key}` : undefined,
        $schema: DRAFT_2020,
      }
  const schemaType = TypeMap[type]
  if (type === MetaValueType.MULTI_OPTION) {
    schemaType.items.enum = transformEnum(options)
  }
  return {
    ...baseSchema,
    $ref: transformRef(refRegisterId),
    title: name,
    enum:
      type === MetaValueType.MULTI_OPTION ? undefined : transformEnum(options),
    ...shareSchema,
    default: defaultValue,
    properties: transformProperties(properties),
    items: transformItems(items),
    required: transformRequried(properties),
    ...TypeMap[type],
  }
}

export type TypeMapItem = {
  type: MetaValueType | string
  [x: string]: any
}

function transformRef(refRegisterId?: string): string {
  return refRegisterId
    ? `https://${DOMAIN}/businessObject/schema/${refRegisterId}`
    : undefined
}

function transformProperties(
  properties: Record<string, IFieldMeta>
): Record<string, any> {
  if (properties) {
    const schemaProperties: Record<string, any> = {}
    Object.keys(properties).forEach((key) => {
      schemaProperties[key] = transformToJsonSchema(properties[key], true)
    })
    return schemaProperties
  }
  return undefined
}

function transformRequried(properties: Record<string, IFieldMeta>) {
  const required = Object.keys(properties).filter(
    (key) => properties[key].required
  )
  return required.length > 0 ? required : undefined
}

function transformItems(items: IFieldItems) {
  return items ? transformToJsonSchema(items) : undefined
}

// TODO: 需要支持多级选择？
function transformEnum(options: IFieldOption[]): string[] {
  return options ? options.map((opt) => opt.value) : undefined
}

const TypeMap: Record<string, TypeMapItem> = {
  [MetaValueType.STRING]: {
    type: 'string',
  },
  [MetaValueType.TEXT]: {
    type: 'string',
  },
  [MetaValueType.NUMBER]: {
    type: 'number',
  },
  [MetaValueType.INTEGER]: {
    type: 'integer',
  },
  [MetaValueType.PERCENT]: {
    type: 'number',
  },
  [MetaValueType.BOOLEAN]: {
    type: 'boolean',
  },
  [MetaValueType.DATE]: {
    type: 'string',
    format: 'date',
  },
  [MetaValueType.DATETIME]: {
    type: 'string',
    format: 'date-time',
  },
  [MetaValueType.RATE]: {
    type: 'number',
  },
  [MetaValueType.SINGLE_OPTION]: {
    type: 'string',
  },
  [MetaValueType.MULTI_OPTION]: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  [MetaValueType.ADDRESS]: {
    type: 'string',
    pattern: '^0x[0-9a-fA-F]{40}$',
  },
  [MetaValueType.BIG_INT]: {
    type: 'string',
  },
  [MetaValueType.BIG_NUMBER]: {
    type: 'string',
  },
  [MetaValueType.OBJECT]: {
    type: 'object',
  },
  [MetaValueType.ARRAY]: {
    type: 'array',
  },
  [MetaValueType.OBJECT_ID]: {
    type: 'string',
  },
  [MetaValueType.TIMESTAMP]: {
    type: 'number',
  },
}

export function validate(schema: MetaSchemaType, data: any) {
  const ajv = new Ajv()
  return ajv.validate(transformToJsonSchema(schema), data)
}
