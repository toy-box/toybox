import React, { FC, useCallback } from 'react'
import update from 'immutability-helper'
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
  const removeTag = useCallback(
    (index: number) =>
      index > -1 &&
      indexView.setParams &&
      indexView.setParams(update(indexView.params, { $splice: [[index, 1]] })),
    [indexView.params, indexView.setParams]
  )

  return (
    <FilterTagGroup
      style={{ margin: '8px 0' }}
      fieldMetas={fieldMetas || indexView.filterFields}
      dataSource={indexView.params}
      fieldService={filterFieldService}
      remove={removeTag}
    />
  )
}
