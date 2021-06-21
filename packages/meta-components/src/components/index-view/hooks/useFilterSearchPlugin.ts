import { useIndexView } from './useIndexView'

export interface IFilterSearchOption {
  filterSearchValue?:
    | Toybox.MetaSchema.Types.ILogicFilter
    | Toybox.MetaSchema.Types.ICompareOperation[]
  simple?: boolean
}

export const useFilterSearchPlugin = () => {
  const context = useIndexView()
  return {
    props: (props) => props,
  }
}
