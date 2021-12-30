import React, { FC } from 'react'
import { FilterSearch, IFilterSearchProps } from '../../filter-search'
import { useDataGrid } from '../hooks'

export declare type IFilterPanelProps = Omit<
  IFilterSearchProps,
  'value' | 'onChange' | 'logicFilter'
> & {
  simpleFilterKeys?: string[]
}

export const FilterPanel: FC<IFilterPanelProps> = ({
  fieldMetas,
  ...props
}) => {
  const dataGrid = useDataGrid()
  return (
    <FilterSearch
      value={dataGrid.preParams}
      onChange={dataGrid.setPreParams}
      fieldMetas={fieldMetas || dataGrid.filterFields}
      simple={!dataGrid.logicFilter}
      onSubmit={() =>
        dataGrid.setQuerySearch(dataGrid.pageable, 'filterSearch')
      }
      {...props}
    />
  )
}
