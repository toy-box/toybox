import { IFieldItems, IFieldMeta, MetaValueType } from '@toy-box/meta-schema'
import { DKind, DName, DType, TypedName } from '@toy-box/power-fx'

export function MakeDType(fieldMeta: IFieldMeta | IFieldItems) {
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
