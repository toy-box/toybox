import { MetaValueType } from '../types'

const fitPairs = [
  [
    MetaValueType.NUMBER,
    MetaValueType.INTEGER,
    MetaValueType.RATE,
    MetaValueType.PERCENT,
  ],
  [
    MetaValueType.STRING,
    MetaValueType.TEXT,
    MetaValueType.SINGLE_OPTION,
    MetaValueType.OBJECT_ID,
  ],
  [MetaValueType.BOOLEAN],
  [MetaValueType.DATE, MetaValueType.DATETIME, MetaValueType.TIMESTAMP],
]

export function fitType(leftType: MetaValueType, rightType: MetaValueType) {
  if (leftType === rightType) {
    return true
  }
  return fitPairs.some(
    (pair) =>
      pair.some((type) => type === rightType) &&
      pair.some((type) => type === leftType)
  )
}
