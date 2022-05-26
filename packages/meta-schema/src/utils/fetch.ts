import { IFieldMeta, IFieldItems } from '../types'

export function fetchMeta(
  source: IFieldMeta | IFieldItems,
  segments: Array<string | number>
) {
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
