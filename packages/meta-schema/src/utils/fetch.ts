import { FieldItem, IFieldMeta } from '../types'

export function fetchMeta(source: FieldItem, segments: Array<string | number>) {
  let meta = source
  for (let i = 0; i < segments.length; i++) {
    const index = segments[i]
    if (typeof index === 'number') {
      meta = (meta as IFieldMeta)?.items
    } else {
      meta = meta?.properties?.[index]
    }
  }
  return meta
}
