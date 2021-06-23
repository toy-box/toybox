import React, { FC, useMemo } from 'react'
import { useIndexView } from '../hooks'
import { FilterTags } from '../../filter-tags'
import { IFilterSearchProps } from '../../filter-search'

export type IFilterDisplayProps = Pick<
  IFilterSearchProps,
  'filterFieldService' | 'fieldMetas'
>

export const FilterDisplay: FC<IFilterDisplayProps> = ({
  fieldMetas,
  filterFieldService,
}) => {
  const indexView = useIndexView()

  return (
    <FilterTags
      style={{ margin: '8px 0' }}
      fieldMetas={fieldMetas || indexView.filterFields}
      dataSource={indexView.params}
    />
  )
}
