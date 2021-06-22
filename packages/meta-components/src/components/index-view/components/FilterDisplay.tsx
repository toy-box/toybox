import React, { FC, useMemo } from 'react'
import { MetaValueType } from '@toy-box/meta-schema'
import { useIndexView } from '../hooks'
import { FilterTags } from '../../filter-tags'
import { IFilterSearchProps } from '../../filter-search'

export type IFilterDisplayProps = Pick<
  IFilterSearchProps,
  'filterFieldService' | 'fieldMetas'
>

const isRemoteTag = (fieldMeta: Toybox.MetaSchema.Types.IFieldMeta) => {
  return (
    fieldMeta.type === MetaValueType.OBJECT_ID ||
    (fieldMeta.type === MetaValueType.OBJECT && fieldMeta.refObjectId)
  )
}

export const FilterDisplay: FC<IFilterDisplayProps> = ({
  fieldMetas,
  filterFieldService,
}) => {
  const indexView = useIndexView()

  const filterFieldTags = useMemo(() => {
    return (fieldMetas || indexView.filterFields || []).map((fieldMeta) => {
      return {
        fieldMeta,
        remote: isRemoteTag(fieldMeta)
          ? async (key: string, value: (string | number)[]) => {
              if (filterFieldService?.findOfValues) {
                const data = await filterFieldService.findOfValues(key, value)
                return data.map((record) => record.label || record.value)
              }
              return []
            }
          : undefined,
      }
    })
  }, [fieldMetas, filterFieldService])
  return (
    <FilterTags
      style={{ margin: '8px 0' }}
      value={indexView.params}
      filterFieldTags={filterFieldTags}
    />
  )
}
