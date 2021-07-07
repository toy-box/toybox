import { createContext } from 'react'
import { IspecialOption } from './interface'

export interface IFilterBuilderContextProps {
  value: Partial<Toybox.MetaSchema.Types.ICompareOperation>[]
  onChange: (
    value: Partial<Toybox.MetaSchema.Types.ICompareOperation>[]
  ) => void
  specialMode?: boolean
  specialOptions?: IspecialOption[]
  simple?: boolean
}

export const FilterBuilderContext = createContext<IFilterBuilderContextProps>({
  value: [],
  onChange: () => undefined,
})
