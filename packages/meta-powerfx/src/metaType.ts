import {
  IFieldItems,
  IFieldMeta,
  IMetaBase,
  MetaValueType,
} from '@toy-box/meta-schema'
import { DKind, DName, DType, TypedName } from '@toy-box/power-fx'
import { Path, Pattern } from '@formily/path'
import { isStr, isNum } from '@toy-box/toybox-shared'

export function MakeDType(fieldMeta: IMetaBase) {
  switch (fieldMeta.type) {
    case MetaValueType.STRING:
    case MetaValueType.TEXT:
      return DType.String
    case MetaValueType.INTEGER:
    case MetaValueType.NUMBER:
    case MetaValueType.PERCENT:
    case MetaValueType.RATE:
      return DType.Number
    case MetaValueType.BOOLEAN:
      return DType.Boolean
    case MetaValueType.DATE:
      return DType.Date
    case MetaValueType.DATETIME:
    case MetaValueType.TIMESTAMP:
      return DType.DateTime
    case MetaValueType.SINGLE_OPTION:
      return DType.OptionSetValue
    case MetaValueType.OBJECT_ID:
      return DType.Guid
    case MetaValueType.MULTI_OPTION: {
      const type = DType.EmptyTable
      type.add(new DName('Value'), DType.OptionSetValue)
      return type
    }
    case MetaValueType.OBJECT: {
      const type = new DType(DKind.Record)
      for (const key in fieldMeta.properties) {
        const fMeta = fieldMeta.properties[key]
        type.add(new TypedName(MakeDType(fMeta), new DName(key)))
      }
      return type
    }
    case MetaValueType.ARRAY: {
      const type = new DType(DKind.Table)
      return type.add(MakeDType((fieldMeta as IFieldMeta).items))
    }
    default:
      return DType.Invalid
  }
}

export function getMetasIn(pattern: Pattern, source: IMetaBase): IMetaBase {
  const segments = Path.parse(pattern).segments
  let meta = source
  for (let i = 0; i < segments.length; i++) {
    const index = segments[i]
    if (isStr(index)) {
      meta = source.properties[index]
    }
    if (isNum(index) && meta.type === MetaValueType.ARRAY) {
      meta = (meta as IFieldMeta).items
    }
    if (i !== segments.length - 1 || meta == null) {
      return meta
    }
  }
  return meta
}
