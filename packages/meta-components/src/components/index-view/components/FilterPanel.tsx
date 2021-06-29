import React, { FC } from 'react'
import { FilterSearch, IFilterSearchProps } from '../../filter-search'
import { useIndexView } from '../hooks'

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
  const indexView = useIndexView()
  return (
    <FilterSearch
      value={indexView.preParams}
      onChange={indexView.setPreParams}
      fieldMetas={fieldMetas || indexView.filterFields}
      logicFilter={indexView.logicFilter}
      onSubmit={
        indexView.urlQuery ? indexView.setQueryParams : indexView.setParams
      }
      {...props}
    />
  )
}
