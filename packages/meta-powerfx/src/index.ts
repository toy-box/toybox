import {
  StringValue,
  NumberValue,
  BlankValue,
  BooleanValue,
  DateValue,
  DateTimeValue,
  NamedValue,
  InMemoryRecordValue,
} from '@toy-box/power-fx'
import { IFieldMeta, MetaValueType } from '@toy-box/meta-schema'
import { IRContext } from '@toy-box/power-fx/dist/ir/IRContext'
import {
  FormulaTypeStatic,
  NamedFormulaType,
  RecordType,
} from '@toy-box/power-fx/dist/public/types'
import DateTime from '@toy-box/power-fx/dist/utils/typescriptNet/Time/DateTime'

export function MakeFormulaValue(fieldMeta: IFieldMeta, value: any) {
  if (value == null) {
    return new BlankValue(IRContext.NotInSource(FormulaTypeStatic.Blank))
  }
  switch (fieldMeta.type) {
    case MetaValueType.STRING:
    case MetaValueType.TEXT:
    case MetaValueType.OBJECT_ID:
    case MetaValueType.SINGLE_OPTION:
      return new StringValue(
        IRContext.NotInSource(FormulaTypeStatic.String),
        value.toString()
      )
    case MetaValueType.RATE:
    case MetaValueType.NUMBER:
    case MetaValueType.PERCENT:
      return typeof value === 'number'
        ? new NumberValue(
            IRContext.NotInSource(FormulaTypeStatic.Number),
            value
          )
        : new BlankValue(IRContext.NotInSource(FormulaTypeStatic.Blank))
    case MetaValueType.INTEGER:
      return typeof value === 'number'
        ? new NumberValue(
            IRContext.NotInSource(FormulaTypeStatic.Number),
            Number.parseInt(value.toString())
          )
        : new BlankValue(IRContext.NotInSource(FormulaTypeStatic.Blank))
    case MetaValueType.BOOLEAN:
      return typeof value === 'boolean'
        ? new BooleanValue(
            IRContext.NotInSource(FormulaTypeStatic.Boolean),
            value
          )
        : new BlankValue(IRContext.NotInSource(FormulaTypeStatic.Blank))
    case MetaValueType.DATE:
      return new DateValue(
        IRContext.NotInSource(FormulaTypeStatic.Date),
        new DateTime(value)
      )
    case MetaValueType.DATETIME:
    case MetaValueType.TIMESTAMP:
      return new DateTimeValue(
        IRContext.NotInSource(FormulaTypeStatic.DateTime),
        new DateTime(value)
      )
    case MetaValueType.OBJECT: {
      const fields: NamedValue[] = []
      let type = new RecordType()
      for (let key in fieldMeta.properties) {
        const name = key
        const fieldValue = value[key]
        const paValue = MakeFormulaValue(fieldMeta.properties[key], fieldValue)
        fields.push(new NamedValue(name, paValue))
        type = type.add(
          new NamedFormulaType(name, paValue.irContext.resultType)
        )
      }
      return new InMemoryRecordValue(IRContext.NotInSource(type), fields)
    }
    default:
      return new BlankValue(IRContext.NotInSource(FormulaTypeStatic.Blank))
  }
}
