import { useDataGrid } from './useDataGrid'

export interface IFilterSearchOption {
  filterSearchValue?:
    | Toybox.MetaSchema.Types.ILogicFilter
    | Toybox.MetaSchema.Types.ICompareOperation[]
  simple?: boolean
}

export const useFilterSearchPlugin = () => {
  const context = useDataGrid()
  return {
    props: (props) => props,
  }
}
