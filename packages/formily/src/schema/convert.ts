import { ISchema } from '@formily/react'
import { IFieldOption } from '@toy-box/meta-schema'
import { pick } from '@toy-box/toybox-shared'

export const convertFormilyField2IFieldMeta = (
  schema: ISchema,
  type?: string
): Toybox.MetaSchema.Types.IFieldMeta => {
  const pickProps = pick(schema, [
    'multipleOf',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'maxProperties',
    'minProperties',
    'required',
    'format',
    'description',
  ]) as Pick<
    Toybox.MetaSchema.Types.IFieldMeta,
    | 'multipleOf'
    | 'maximum'
    | 'exclusiveMaximum'
    | 'minimum'
    | 'exclusiveMinimum'
    | 'maxLength'
    | 'minLength'
    | 'pattern'
    | 'maxItems'
    | 'minItems'
    | 'uniqueItems'
    | 'maxProperties'
    | 'minProperties'
    | 'required'
    | 'format'
    | 'description'
  >

  return {
    key: schema.name as string,
    type: type || (schema.type as string),
    name: schema.title,
    ...pickProps,
    options: schema.enum as IFieldOption[],
  }
}
