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
      value={indexView.params}
      onChange={indexView.setParams}
      fieldMetas={fieldMetas || indexView.filterFields}
      logicFilter={indexView.logicFilter}
      onSubmit={indexView.searchActions.submit}
      {...props}
    />
  )
}
