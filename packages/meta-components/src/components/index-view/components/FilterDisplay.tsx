import React, { FC } from 'react'
import { useIndexView } from '../hooks'
import { FilterTagGroup } from '../../filter-tag-group'
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
    <FilterTagGroup
      style={{ margin: '8px 0' }}
      fieldMetas={fieldMetas || indexView.filterFields}
      dataSource={indexView.params}
      fieldService={filterFieldService}
    />
  )
}