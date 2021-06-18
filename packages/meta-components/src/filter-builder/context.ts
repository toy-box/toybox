import { createContext } from 'react'

export interface IFilterBuilderContextProps {
  value: Toybox.MetaSchema.Types.ICompareOperation[]
  onChange: (value: Toybox.MetaSchema.Types.ICompareOperation[]) => void
}

export const FilterBuilderContext = createContext<IFilterBuilderContextProps>({
  value: [],
  onChange: () => undefined,
})
