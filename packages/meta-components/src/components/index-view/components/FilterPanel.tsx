import React, { FC, useMemo } from 'react'
import { FilterSearch, IFilterSearchProps } from '../../filter-search'
import { useIndexView } from '../hooks'

export declare type IFilterPanelProps = Omit<
  IFilterSearchProps,
  'value' | 'onChange' | 'filterFieldMetas' | 'logicFilter'
>

export const FilterPanel: FC<IFilterPanelProps> = (props) => {
  const indexView = useIndexView()

  const filterFieldMetas = useMemo(() => {
    const { properties } = indexView.objectMeta
    if (properties) {
      return Object.keys(properties)
        .filter((key) => {
          return indexView.filterFieldKeys
            ? indexView.filterFieldKeys.includes(key)
            : key != indexView.objectMeta.idKey
        })
        .map((key) => properties[key])
    }
    return []
  }, [indexView.objectMeta, indexView.filterFieldKeys])

  return (
    <FilterSearch
      value={indexView.params}
      onChange={indexView.setParams}
      filterFieldMetas={filterFieldMetas}
      logicFilter={indexView.logicFilter}
      onSubmit={indexView.searchActions.submit}
      {...props}
    />
  )
}
