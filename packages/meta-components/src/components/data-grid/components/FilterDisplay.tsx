import React, { FC, useCallback } from 'react'
import update from 'immutability-helper'
import { useDataGrid } from '../hooks'
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
  const dataGrid = useDataGrid()
  const removeTag = useCallback(
    (index: number) =>
      index > -1 &&
      dataGrid.setParams &&
      dataGrid.setParams(update(dataGrid.params, { $splice: [[index, 1]] })),
    [dataGrid.params, dataGrid.setParams]
  )

  return (
    <FilterTagGroup
      style={{ margin: '8px 0' }}
      fieldMetas={fieldMetas || dataGrid.filterFields}
      dataSource={dataGrid.params}
      fieldService={filterFieldService}
      remove={removeTag}
    />
  )
}
