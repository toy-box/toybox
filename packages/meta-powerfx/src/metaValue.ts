import {
  StringValue,
  NumberValue,
  BlankValue,
  BooleanValue,
  DateValue,
  DateTimeValue,
  NamedValue,
  InMemoryRecordValue,
  IRContext,
  FormulaTypeStatic,
  NamedFormulaType,
  RecordType,
  DateTime,
  RecordValue,
  FormulaValueStatic,
  TableType,
  InMemoryTableValue,
  DValue,
} from '@toy-box/power-fx'
import {
  IFieldItems,
  IFieldMeta,
  MetaValueType,
  IMetaBase,
} from '@toy-box/meta-schema'
import { Path, Pattern } from '@formily/path'
import { isStr, isNum } from '@toy-box/toybox-shared'

export function MakeFormulaValue(fieldMeta: IMetaBase, value: any) {
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
    case MetaValueType.MULTI_OPTION: {
      const records: RecordValue[] = []

      for (let i = 0; i < Array.from(value).length; ++i) {
        const item = value[i]
        const val = FormulaValueStatic.GuaranteeRecord(
          FormulaValueStatic.New(item)
        )
        records.push(val)
      }

      // Constructor will handle both single-column table
      let type: TableType
      if (records.length == 0) {
        type = new TableType(undefined)
      } else {
        type = TableType.FromRecord(
          <RecordType>(
            FormulaValueStatic.GuaranteeRecord(records[0]).irContext.resultType
          )
        )
      }
      return new InMemoryTableValue(
        IRContext.NotInSource(type),
        records.map((r) => new DValue<RecordValue>(r, null, null))
      )
    }
    case MetaValueType.ARRAY: {
      const records: RecordValue[] = []

      for (let i = 0; i < Array.from(value).length; ++i) {
        const item = value[i]
        const val = FormulaValueStatic.GuaranteeRecord(
          MakeFormulaValue((fieldMeta as IFieldMeta).items, item)
        )
        records.push(val)
      }

      // Constructor will handle both single-column table
      let type: TableType
      if (records.length == 0) {
        type = new TableType(undefined)
      } else {
        type = TableType.FromRecord(
          <RecordType>(
            FormulaValueStatic.GuaranteeRecord(records[0]).irContext.resultType
          )
        )
      }
      return new InMemoryTableValue(
        IRContext.NotInSource(type),
        records.map((r) => new DValue<RecordValue>(r, null, null))
      )
    }
    default:
      return new BlankValue(IRContext.NotInSource(FormulaTypeStatic.Blank))
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
